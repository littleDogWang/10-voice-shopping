import { getScenarioConfig, getScenarioPrompt } from '../lib/agent-config';
const config = getScenarioConfig();
if (config.id !== '09-voice-shopping') throw new Error(`Expected 09-voice-shopping, got ${config.id}`);
for (const field of ['role', 'workflow', 'guardrails']) { if (!config[field as keyof typeof config]) throw new Error(`Missing ${field}`); }
if (!getScenarioPrompt().includes('# Goal and conversation flow')) throw new Error('Scenario prompt was not formatted');
console.log(`Scenario config passed: ${config.id}`);
