import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Agent } from 'agora-agents';
import { NextRequest } from 'next/server';
import { getScenarioTools } from '../lib/agent-tools';
import { SHOPIFY_CATALOG_ENDPOINT, SHOPIFY_EXAMPLE_PROFILE } from '../lib/shopify-config';
import { getScenarioConfig, getScenarioPrompt } from '../lib/agent-config';
import { getScenarioPresentation } from '../lib/presentation';
import { normalizeTranscript } from '../lib/conversation';

function routeFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? routeFiles(file) : entry.name === 'route.ts' ? [file] : [];
  });
}

async function main() {
  const context = '\n[Catalog context: gid://shopify/ProductVariant/12345]';
  const message = (uid: string, text: string) => ({ uid, text, turn_id: 1 }) as Parameters<typeof normalizeTranscript>[0][number];
  const visible = normalizeTranscript([
    message('0', 'Tell me about Example Mic. My budget is USD 150.' + context),
    message('voice-user', 'Please compare two microphones.'),
    message('agent', 'Agent text' + context),
    message('voice-user', 'The product ID is gid://shopify/ProductVariant/12345.'),
  ], 'voice-user');
  assert.equal(visible[0].text, 'Tell me about Example Mic. My budget is USD 150.');
  assert.equal(visible[0].uid, 'voice-user');
  assert.equal(visible[1].text, 'Please compare two microphones.');
  assert.equal(visible[2].text, 'Agent text' + context);
  assert.equal(visible[3].text, 'The product ID is gid://shopify/ProductVariant/12345.');
  const config = getScenarioConfig();
  assert.equal(getScenarioPresentation().id, config.id);
  const tools = getScenarioTools();
  assert.deepEqual(tools.map(tool => tool.function.name), ['SearchShopifyProducts', 'GetShopifyProduct']);
  assert.match(getScenarioPrompt(), /live, read-only Shopify/);
  assert.match(getScenarioPrompt(), /structuredContent/);
  for (const tool of tools) {
    assert.equal(tool.server.url, SHOPIFY_CATALOG_ENDPOINT);
    assert.equal(tool.server.method, 'POST');
    assert.equal(tool.server.headers?.Accept, 'application/json');
    const body = tool.server.body as { params: { arguments: { meta: { 'ucp-agent': { profile: string } }; catalog: { context: { currency: string } } } } };
    assert.equal(body.params.arguments.meta['ucp-agent'].profile, process.env.SHOPIFY_UCP_AGENT_PROFILE_URL || SHOPIFY_EXAMPLE_PROFILE);
    assert.equal(body.params.arguments.catalog.context.currency, 'USD');
  }
  for (const file of routeFiles(path.join(process.cwd(), 'app/api/scenarios'))) {
    const retired = await import(pathToFileURL(file).href);
    for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
      if (typeof retired[method] !== 'function') continue;
      const response = await retired[method](new NextRequest('http://localhost/api/scenarios/disabled', { method }));
      assert.equal(response.status, 410, file);
      assert.equal((await response.json()).error, 'business_data_not_available');
    }
  }
  const landing = fs.readFileSync('components/LandingPage.tsx', 'utf8');
  assert.doesNotMatch(landing, /api\/scenarios|shopping_session_id|event_session_id|followUpApi|useShopping|useFollowUps/);

  process.env.NEXT_PUBLIC_AGORA_APP_ID = '0123456789abcdef0123456789abcdef';
  process.env.NEXT_AGORA_APP_CERTIFICATE = 'fedcba9876543210fedcba9876543210';
  const { POST } = await import('../app/api/invite-agent/route');
  const originalCreate = Agent.prototype.createSession;
  const originalOrigin = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL;
  let captured: Agent | null = null;
  let sessionOptions: unknown;
  let starts = 0;
  Agent.prototype.createSession = (function (this: Agent, options: unknown) {
    captured = this;
    sessionOptions = options;
    return { start: async () => { starts += 1; return 'conversation-only-agent'; } };
  }) as unknown as typeof Agent.prototype.createSession;
  try {
    for (const origin of [undefined, 'https://legacy-tools.example.test']) {
      if (origin) process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL = origin;
      else delete process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL;
      const response = await POST(new NextRequest('http://localhost/api/invite-agent', {
        method: 'POST',
        body: JSON.stringify({ requester_id: 'voice-user', channel_name: 'voice-only-channel' }),
      }));
      const result = await response.json();
      assert.equal(response.status, 200, 'A voice conversation must start without a business session: ' + JSON.stringify(result));
      assert.equal(result.agent_id, 'conversation-only-agent');
      const actual = captured as unknown as Agent;
      assert.equal(actual.advancedFeatures?.enable_rtm, true);
      assert.equal(actual.advancedFeatures?.enable_tools, true);
      assert.deepEqual(actual.llm?.tools, getScenarioTools());
      assert.deepEqual(actual.llm?.mcp_servers ?? [], [], 'Structured-content-only Shopify replies must not use the incompatible native MCP result validator.');
      assert.deepEqual((sessionOptions as { remoteUids: string[] }).remoteUids, ['voice-user']);
      assert.equal(actual.instructions, getScenarioPrompt(config.id));
    }
    assert.equal(starts, 2);
  } finally {
    Agent.prototype.createSession = originalCreate;
    if (originalOrigin === undefined) delete process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL;
    else process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL = originalOrigin;
  }
  console.log('Read-only Shopify startup, disabled legacy writes and retired business routes passed: ' + config.id);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
