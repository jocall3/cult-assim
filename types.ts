export type FeedbackSeverity = 'Positive' | 'Neutral' | 'Negative' | 'Critical' | 'Advisory';

export interface InteractionFeedback {
  userAction: string;
  aiResponse: string;
  feedbackSummary: { text: string; severity: FeedbackSeverity };
}

export interface DetailedFeedbackDimension {
  dimension: string;
  score: number;
  explanation: string;
  severity: FeedbackSeverity;
  recommendations: string[];
}

export interface CompleteInteractionFeedback extends InteractionFeedback {
  timestamp: string;
  scenarioId: string;
  targetCultureId: string;
  userProfileSnapshot: IUserCulturalProfile;
  detailedFeedback: DetailedFeedbackDimension[];
  overallCulturalCompetenceImpact: number;
  suggestedResources?: string[];
  potentialRewardsEarned?: { type: 'token' | 'certificate'; amount?: number; id?: string }[];
}

export interface ICulturalDimension {
  id: string;
  name: string;
  description: string;
  typicalScores: { min: number; max: number };
}

export interface ICulturalTrait {
  id: string;
  name: string;
  description: string;
  impactAreas: string[];
  recommendations: string[];
}

export interface ICulture {
  id: string;
  name: string;
  continent: string;
  language: string;
  helloPhrase: string;
  goodbyePhrase: string;
  culturalDimensions: {
    [dimensionId: string]: number;
  };
  communicationStyle: {
    directness: number;
    contextSensitivity: number;
    formalityLevel: number;
    emotionalExpression: number;
  };
  etiquetteRules: IEtiquetteRule[];
  negotiationPractices: INegotiationPractice[];
  socialNorms: ISocialNorm[];
  commonMisunderstandings: ICommonMisunderstanding[];
  nonVerbalCues: INonVerbalCue[];
  values: string[];
}

export interface IEtiquetteRule {
  id: string;
  category: 'Greeting' | 'Dining' | 'Business Meeting' | 'Gift Giving' | 'Social' | 'Dress Code' | 'General' | 'Conversation';
  rule: string;
  description: string;
  consequences: FeedbackSeverity;
  example?: string;
  keywords?: string[];
}

export interface INegotiationPractice {
  id: string;
  aspect: 'Preparation' | 'Process' | 'Decision Making' | 'Relationship Building' | 'Strategy' | 'Communication';
  practice: string;
  description: string;
  culturalBasis: string;
  keywords?: string[];
}

export interface ISocialNorm {
  id: string;
  category: 'Conversation' | 'Personal Space' | 'Hospitality' | 'Public Behavior' | 'Family' | 'Respect';
  norm: string;
  description: string;
  avoid?: string;
  keywords?: string[];
}

export interface ICommonMisunderstanding {
  id: string;
  topic: string;
  description: string;
  culturalDifference: string;
  advice: string;
  keywords?: string[];
}

export interface INonVerbalCue {
  id: string;
  type: 'Eye Contact' | 'Gestures' | 'Personal Space' | 'Touch' | 'Facial Expression' | 'Posture' | 'Vocalics' | 'Silence';
  cue: string;
  meaning: string;
  interpretation: 'Positive' | 'Neutral' | 'Negative';
  caution?: string;
  keywords?: string[];
}

export interface IScenarioTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Business' | 'Social' | 'Academic' | 'Personal' | 'Diplomacy';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  initialSituation: string;
  keyCulturalAspects: string[];
  interactionFlowExample?: { user: string; ai: string; feedback: string }[];
  possibleUserActions: string[];
  possiblePitfalls: string[];
  relatedLearningModules?: string[];
}

export interface IActiveScenarioInstance {
  scenarioTemplateId: string;
  instanceId: string;
  currentSituation: string;
  objectiveStatus: { [objective: string]: boolean };
  targetCulture: ICulture;
  participants: { name: string; role: string; culturalBackground: string }[];
  currentTurn: number;
  maxTurns: number;
  isCompleted: boolean;
  successMetric: number;
}

export interface ILearningModule {
  id: string;
  title: string;
  category: 'Communication' | 'Etiquette' | 'Negotiation' | 'Values' | 'History' | 'General' | 'Non-Verbal';
  culturesCovered: string[];
  content: string;
  quizQuestions: IQuizQuestion[];
  estimatedCompletionTimeMinutes: number;
  prerequisites?: string[];
}

export interface IQuizQuestion {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface IUserCulturalProfile {
  userId: string;
  username: string;
  originCultureId: string;
  targetCultureInterests: string[];
  culturalCompetenceScore: { [cultureId: string]: number };
  overallCompetence: number;
  learningPathProgress: { [moduleId: string]: { completed: boolean; score?: number } };
  scenarioHistory: IScenarioHistoryEntry[];
}

export interface IScenarioHistoryEntry {
  scenarioInstanceId: string;
  scenarioTemplateId: string;
  targetCultureId: string;
  completionDate: string;
  finalSuccessMetric: number;
  totalInteractions: number;
  keyLearnings: string[];
  rewardTriggered?: { type: 'token' | 'certificate'; amount?: number; id?: string };
}

export interface IResource {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Infographic' | 'Case Study' | 'Podcast';
  url: string;
  tags: string[];
  relatedCultures: string[];
}

export interface ISystemSettings {
  darkMode: boolean;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
    scenarioRecommendations: boolean;
  };
  llmModelPreference: 'default' | 'fast' | 'detailed' | 'pedagogical_mode' | 'risk_averse';
  feedbackVerbosity: 'concise' | 'detailed' | 'pedagogical';
  aiPersona: 'supportive' | 'challenging' | 'neutral' | 'formal_advisor';
}

export interface IAuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: { [key: string]: any };
  severity: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'AUDIT';
}

export interface IAgentContext {
  userAction: string;
  currentScenario: IActiveScenarioInstance;
  userProfile: IUserCulturalProfile;
  systemSettings: ISystemSettings;
  culturalData: ICulture;
  scenarioTemplate: IScenarioTemplate;
}