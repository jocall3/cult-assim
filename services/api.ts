import { 
  ICulture, IScenarioTemplate, ILearningModule, IUserCulturalProfile, ISystemSettings, IActiveScenarioInstance, CompleteInteractionFeedback 
} from '../types';
import { 
  CULTURAL_PROFILES_DATA, SCENARIO_TEMPLATES_DATA, LEARNING_MODULES_DATA, SYSTEM_SETTINGS_DATA, USER_PROFILES_DATA, ACTIVE_SCENARIOS_DATA 
} from '../constants';
import { culturalIntelligenceAgent } from './agent';

const generateUniqueId = (prefix: string = 'id'): string => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

export const api = {
  async getCultures(): Promise<ICulture[]> {
    return Promise.resolve(CULTURAL_PROFILES_DATA);
  },

  async getScenarioTemplates(): Promise<IScenarioTemplate[]> {
    return Promise.resolve(SCENARIO_TEMPLATES_DATA);
  },

  async getLearningModules(): Promise<ILearningModule[]> {
    return Promise.resolve(LEARNING_MODULES_DATA);
  },

  async getUserProfile(userId: string): Promise<IUserCulturalProfile | undefined> {
    return Promise.resolve(USER_PROFILES_DATA.find(p => p.userId === userId));
  },

  async getSystemSettings(): Promise<ISystemSettings> {
    return Promise.resolve(SYSTEM_SETTINGS_DATA);
  },

  async startScenario(userId: string, scenarioTemplateId: string, targetCultureId: string): Promise<IActiveScenarioInstance> {
    const template = SCENARIO_TEMPLATES_DATA.find(s => s.id === scenarioTemplateId);
    const targetCulture = CULTURAL_PROFILES_DATA.find(c => c.id === targetCultureId);
    const userProfile = USER_PROFILES_DATA.find(u => u.userId === userId);

    if (!template || !targetCulture || !userProfile) {
      throw new Error('Invalid scenario template, target culture, or user profile.');
    }

    const newInstance: IActiveScenarioInstance = {
      scenarioTemplateId: template.id,
      instanceId: generateUniqueId('scenario_instance'),
      currentSituation: template.initialSituation,
      objectiveStatus: Object.fromEntries(template.objectives.map(obj => [obj, false])),
      targetCulture: targetCulture,
      participants: [{ name: userProfile.username, role: 'User', culturalBackground: userProfile.originCultureId }],
      currentTurn: 0,
      maxTurns: 10,
      isCompleted: false,
      successMetric: 50,
    };
    ACTIVE_SCENARIOS_DATA.push(newInstance);
    return Promise.resolve(newInstance);
  },

  async processInteraction(userId: string, instanceId: string, userAction: string): Promise<CompleteInteractionFeedback> {
    const activeScenarioIndex = ACTIVE_SCENARIOS_DATA.findIndex(s => s.instanceId === instanceId);
    if (activeScenarioIndex === -1) {
      throw new Error('Scenario instance not found.');
    }

    const scenario = ACTIVE_SCENARIOS_DATA[activeScenarioIndex];
    const userProfile = USER_PROFILES_DATA.find(u => u.userId === userId);
    const systemSettings = SYSTEM_SETTINGS_DATA; 
    const culturalData = scenario.targetCulture;
    const scenarioTemplate = SCENARIO_TEMPLATES_DATA.find(t => t.id === scenario.scenarioTemplateId);

    if (!userProfile || !culturalData || !scenarioTemplate) {
      throw new Error('Missing prerequisite data for interaction processing.');
    }

    const completeFeedback = await culturalIntelligenceAgent.processUserInteraction(
      userId,
      scenario,
      userAction,
      userProfile,
      culturalData,
      systemSettings,
      scenarioTemplate
    );

    scenario.currentTurn++;
    scenario.currentSituation = completeFeedback.aiResponse;
    scenario.successMetric = Math.max(0, Math.min(100, scenario.successMetric + completeFeedback.overallCulturalCompetenceImpact));

    if (completeFeedback.overallCulturalCompetenceImpact > 0) {
      const firstObj = scenarioTemplate.objectives[0];
      if(firstObj) scenario.objectiveStatus[firstObj] = true;
    }

    if (scenario.currentTurn >= scenario.maxTurns) {
        scenario.isCompleted = true;
    }

    return Promise.resolve(completeFeedback);
  },

  async getActiveScenario(instanceId: string): Promise<IActiveScenarioInstance | undefined> {
    return Promise.resolve(ACTIVE_SCENARIOS_DATA.find(s => s.instanceId === instanceId));
  },
};