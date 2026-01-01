import { 
  IAgentContext, 
  FeedbackSeverity, 
  DetailedFeedbackDimension, 
  CompleteInteractionFeedback,
  ISystemSettings,
  IUserCulturalProfile,
  IActiveScenarioInstance,
  IScenarioTemplate,
  ICulture
} from '../types';

// Simple Logger Mock
const systemLogger = {
  audit: (userId: string, action: string, details?: any) => console.log(`[AUDIT] ${userId} - ${action}`, details),
  info: (userId: string | null, action: string, details?: any) => console.log(`[INFO] ${userId} - ${action}`, details),
  error: (userId: string | null, action: string, details?: any) => console.error(`[ERROR] ${userId} - ${action}`, details)
};

const generateUniqueId = (prefix: string = 'id'): string => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

export const tokenRewardService = {
  async issueTokens(userId: string, amount: number, reason: string): Promise<{ type: 'token', amount: number, id: string }> {
    systemLogger.audit(userId, 'TOKEN_ISSUE_REQUEST', { amount, reason });
    return Promise.resolve({ type: 'token', amount, id: generateUniqueId('txn_token') });
  },
  async grantCertificate(userId: string, certificateType: string): Promise<{ type: 'certificate', id: string }> {
    systemLogger.audit(userId, 'CERTIFICATE_GRANT_REQUEST', { certificateType });
    return Promise.resolve({ type: 'certificate', id: generateUniqueId('cert') });
  }
};

export class CulturalIntelligenceAgent {
  private observe(context: IAgentContext): { userIntent: string; identifiedAspects: string[] } {
    const { userAction, culturalData, scenarioTemplate } = context;
    const lowerCaseUserAction = userAction.toLowerCase();
    const identifiedAspects: string[] = [];
    let userIntent = 'general_interaction';

    const allCulturalItems = [
      ...culturalData.etiquetteRules,
      ...culturalData.negotiationPractices,
      ...culturalData.socialNorms,
      ...culturalData.commonMisunderstandings,
      ...culturalData.nonVerbalCues,
    ];

    for (const item of allCulturalItems) {
      if (item.keywords?.some(keyword => lowerCaseUserAction.includes(keyword.toLowerCase()))) {
        identifiedAspects.push(item.id);
        
        if ('category' in item) {
          if (item.category === 'Greeting' || item.category === 'Conversation') userIntent = 'social_greeting';
          if (item.category === 'Dining') userIntent = 'dining_etiquette';
          if (item.category === 'Business Meeting') userIntent = 'business_negotiation';
        }
        
        if ('aspect' in item) {
           // INegotiationPractice items have 'aspect'. If matched, we assume business negotiation context.
           userIntent = 'business_negotiation';
        }
      }
    }

    if (scenarioTemplate.possibleUserActions.some(action => lowerCaseUserAction.includes(action.toLowerCase()))) {
      userIntent = 'positive_action';
    }
    if (scenarioTemplate.possiblePitfalls.some(pitfall => lowerCaseUserAction.includes(pitfall.toLowerCase()))) {
      userIntent = 'potential_pitfall';
    }

    return { userIntent, identifiedAspects };
  }

  private decide(context: IAgentContext, observation: { userIntent: string; identifiedAspects: string[] }): { aiResponse: string; feedbackSummary: { text: string; severity: FeedbackSeverity }; detailedFeedback: DetailedFeedbackDimension[]; competenceImpact: number; suggestedResources: string[] } {
    const { userAction, currentScenario, culturalData, systemSettings, scenarioTemplate } = context;
    const lowerCaseUserAction = userAction.toLowerCase();

    let aiResponse = currentScenario.currentSituation;
    let feedbackSummary: { text: string; severity: FeedbackSeverity } = { text: "Neutral interaction.", severity: 'Neutral' };
    let detailedFeedback: DetailedFeedbackDimension[] = [];
    let competenceImpact = 0;
    const suggestedResources: string[] = [];

    const criticalRuleViolations = culturalData.etiquetteRules.filter(
      rule => rule.consequences === 'Critical' && rule.keywords?.some(k => lowerCaseUserAction.includes(k.toLowerCase()))
    );
    const negativeRuleViolations = culturalData.etiquetteRules.filter(
      rule => rule.consequences === 'Negative' && rule.keywords?.some(k => lowerCaseUserAction.includes(k.toLowerCase()))
    );
    const positiveAlignments = culturalData.etiquetteRules.filter(
      rule => rule.consequences === 'Positive' && rule.keywords?.some(k => lowerCaseUserAction.includes(k.toLowerCase()))
    );

    const getResponsePrefix = (persona: ISystemSettings['aiPersona']) => {
      switch (persona) {
        case 'supportive': return 'That\'s an interesting approach. Let\'s see... ';
        case 'challenging': return 'Consider your strategy carefully. ';
        case 'formal_advisor': return 'Analyzing your input, the cultural implications are as follows: ';
        default: return 'Processing your action. ';
      }
    };

    if (criticalRuleViolations.length > 0) {
      const rule = criticalRuleViolations[0];
      aiResponse = `${getResponsePrefix(systemSettings.aiPersona)}The atmosphere shifts dramatically. ${rule.description}`;
      feedbackSummary = { text: `Critical: ${rule.rule} violation.`, severity: 'Critical' };
      detailedFeedback.push({
        dimension: `${rule.category} Etiquette`, score: -5, explanation: `${rule.description} This action is a severe cultural taboo in ${culturalData.name}.`, severity: 'Critical', recommendations: [`Avoid this action in ${culturalData.name}.`]
      });
      competenceImpact -= 25;
      scenarioTemplate.relatedLearningModules?.forEach(m => suggestedResources.push(m));
    } else if (negativeRuleViolations.length > 0) {
      const rule = negativeRuleViolations[0];
      aiResponse = `${getResponsePrefix(systemSettings.aiPersona)}There's a noticeable, subtle shift in the interaction. ${rule.description}`;
      feedbackSummary = { text: `Negative: ${rule.rule} might be perceived poorly.`, severity: 'Negative' };
      detailedFeedback.push({
        dimension: `${rule.category} Etiquette`, score: -3, explanation: `${rule.description} This can lead to misunderstandings.`, severity: 'Negative', recommendations: [`Be mindful of ${rule.category} in ${culturalData.name}.`]
      });
      competenceImpact -= 10;
    } else if (positiveAlignments.length > 0) {
      const rule = positiveAlignments[0];
      aiResponse = `${getResponsePrefix(systemSettings.aiPersona)}Your counterparts react positively. ${rule.description}`;
      feedbackSummary = { text: `Positive: Well-aligned with ${rule.category} etiquette.`, severity: 'Positive' };
      detailedFeedback.push({
        dimension: `${rule.category} Etiquette`, score: 4, explanation: `${rule.description} Your action was culturally appropriate.`, severity: 'Positive', recommendations: [`Continue to apply this principle in ${culturalData.name}.`]
      });
      competenceImpact += 15;
    } else if (observation.userIntent === 'positive_action') {
      aiResponse = `${getResponsePrefix(systemSettings.aiPersona)}Your action is well-received. The interaction proceeds smoothly.`;
      feedbackSummary = { text: "Positive: Aligned with scenario objectives.", severity: 'Positive' };
      detailedFeedback.push({ dimension: 'Scenario Objective', score: 3, explanation: 'You made a good choice, progressing the scenario positively.', severity: 'Positive', recommendations: [] });
      competenceImpact += 10;
    } else if (observation.userIntent === 'potential_pitfall') {
      aiResponse = `${getResponsePrefix(systemSettings.aiPersona)}A moment of awkwardness. Your action might have unintended consequences.`;
      feedbackSummary = { text: "Advisory: A potential cultural pitfall was approached.", severity: 'Advisory' };
      detailedFeedback.push({ dimension: 'Scenario Pitfall', score: -2, explanation: 'Your action touched upon a known cultural pitfall.', severity: 'Advisory', recommendations: [] });
      competenceImpact -= 5;
    } else {
       aiResponse = `${getResponsePrefix(systemSettings.aiPersona)}I understand your input. Let's see how the interaction evolves.`;
       feedbackSummary = { text: "Neutral: No strong cultural implications detected.", severity: 'Neutral' };
       detailedFeedback.push({
          dimension: 'General Interaction', score: 0, explanation: 'Your action was generally acceptable.', severity: 'Neutral', recommendations: []
       });
    }

    return { aiResponse, feedbackSummary, detailedFeedback, competenceImpact, suggestedResources };
  }

  public async processUserInteraction(
    userId: string,
    activeScenario: IActiveScenarioInstance,
    userAction: string,
    userProfile: IUserCulturalProfile,
    culturalData: ICulture,
    systemSettings: ISystemSettings,
    scenarioTemplate: IScenarioTemplate,
  ): Promise<CompleteInteractionFeedback> {
    const context: IAgentContext = {
      userAction,
      currentScenario: activeScenario,
      userProfile,
      systemSettings,
      culturalData,
      scenarioTemplate,
    };

    const observation = this.observe(context);
    const decision = this.decide(context, observation);

    let completeFeedback: CompleteInteractionFeedback = {
      userAction,
      aiResponse: decision.aiResponse,
      feedbackSummary: decision.feedbackSummary,
      timestamp: new Date().toISOString(),
      scenarioId: activeScenario.instanceId,
      targetCultureId: activeScenario.targetCulture.id,
      userProfileSnapshot: { ...userProfile },
      detailedFeedback: decision.detailedFeedback,
      overallCulturalCompetenceImpact: decision.competenceImpact,
      suggestedResources: decision.suggestedResources.length > 0 ? decision.suggestedResources : undefined,
    };

    // Simulate rewards
    if (completeFeedback.overallCulturalCompetenceImpact > 10) {
      try {
        const reward = await tokenRewardService.issueTokens(userId, Math.floor(completeFeedback.overallCulturalCompetenceImpact / 5), 'Positive cultural interaction');
        completeFeedback.potentialRewardsEarned = [...(completeFeedback.potentialRewardsEarned || []), reward];
      } catch (e: any) {
        systemLogger.error(userId, 'REWARD_ISSUE_FAILED', { error: e.message });
      }
    }

    return completeFeedback;
  }
}

export const culturalIntelligenceAgent = new CulturalIntelligenceAgent();