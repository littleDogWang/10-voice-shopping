# Agent UI Source Provenance

Source: https://github.com/shczhen/agent-ui, `systems/agora-glass/react`.
Archive revision retained from the locally inspected 01 scenario: `29d3aa3ed9e1a4d2cd5fcc1747689e3bc2915e2d`.

Reused source: Dialog, Button, Bubble, Message, Tooltip, Status, VoiceDock, ConversationPanel, control-light, tokens and Crystal/Obsidian theme. Copied from the existing vendored source in scenario 01 on 2026-10-16; no fresh upstream revision verification is claimed.

Adaptations: shopping copy and real voice state/callbacks; ConversationPanel uses a native scrolling transcript with real toolkit messages instead of a sample conversation or an additional scrolling package. VoiceDock uses a normal themed surface. Only the component recipes used here are retained, with Tailwind 4 directives removed for this repository's Tailwind 3 pipeline. Semantic colors use full CSS color values. No sample devices, generated replies or simulated voice sessions are included.

MiSans fonts and their existing attribution are retained in `public/fonts/`. The inspected local provenance did not establish an upstream component collection redistribution license; this record makes no additional license claim.
