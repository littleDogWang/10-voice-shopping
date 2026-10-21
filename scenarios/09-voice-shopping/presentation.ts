import type { ScenarioPresentation } from '../presentation';

export const presentation: ScenarioPresentation = {
  "id": "09-voice-shopping",
  "name": "Voice Shopping Assistant",
  "purpose": "Product comparison, basket and saved orders",
  "headline": [
    "Find your next setup."
  ],
  "summary": "Compare microphones and cameras, review your basket and save an unpaid example order.",
  "featuresHeading": "Beyond starter",
  "features": [
    {
      "emoji": "🎙️",
      "title": "Compare products"
    },
    {
      "emoji": "🛒",
      "title": "Review your basket"
    },
    {
      "emoji": "📦",
      "title": "Saved unpaid orders"
    }
  ],
  "builtWith": [
    "Agora Conversational AI",
    "Agents SDK",
    "Next.js"
  ],
  "startLabel": "Start voice shopping",
  "boundaryShort": "Fictional products and simulated stock. No payment or delivery.",
  "outcomes": [
    {
      "id": "found",
      "label": "I found a suitable product"
    },
    {
      "id": "needs-help",
      "label": "I need more guidance"
    }
  ],
  "developer": {
    "sourceUrl": "https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs",
    "runCommand": "pnpm install\nagora login\nagora project use <your-project>\nagora project env write .env.local\npnpm dev",
    "skillsCommand": "npx skills add github:AgoraIO/skills",
    "assistantPrompt": "Use Agora Skills to work in the existing 09-voice-shopping scenario checkout. Preserve the working Agora session lifecycle and business contracts. Help me adapt its business data and assistant instructions for my workflow.",
    "docsUrl": "https://docs.agora.io/en/ai/build/build-server-client",
    "sdkUrl": "https://www.npmjs.com/package/agora-agents",
    "consoleUrl": "https://console.agora.io/",
    "cliUrl": "https://github.com/AgoraIO/cli",
    "skillsUrl": "https://github.com/AgoraIO/skills",
    "extensionPoints": [
      {
        "title": "Change assistant instructions",
        "path": "scenarios/09-voice-shopping/config.ts"
      },
      {
        "title": "Adapt shopping.ts",
        "path": "scenarios/09-voice-shopping/shopping.ts"
      },
      {
        "title": "Adapt shopping-types.ts",
        "path": "scenarios/09-voice-shopping/shopping-types.ts"
      },
      {
        "title": "Choose models and voice",
        "path": "app/api/invite-agent/route.ts"
      },
      {
        "title": "Adapt scenario UI content",
        "path": "scenarios/09-voice-shopping/presentation.ts"
      }
    ]
  }
};
