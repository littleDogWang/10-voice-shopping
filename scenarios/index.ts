import { config as selected } from './09-voice-shopping/config';
import { formatScenarioPrompt, type ScenarioConfig } from './types';

export function getScenarioConfig(): ScenarioConfig { return selected; }
export function getScenarioPrompt(_scenarioId?: string): string { return formatScenarioPrompt(selected); }
export function listScenarioConfigs(): ScenarioConfig[] { return [selected]; }
