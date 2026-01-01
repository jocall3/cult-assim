import { ICulture, ICulturalDimension, IScenarioTemplate, ILearningModule, IResource, IUserCulturalProfile, ISystemSettings, IActiveScenarioInstance } from './types';

// Utility for generating IDs (duplicated here for static data init if needed, though mostly used in runtime)
const generateUniqueId = (prefix: string = 'id'): string => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

export const CULTURAL_PROFILES_DATA: ICulture[] = [
  {
    id: 'GERMANY',
    name: 'Germany',
    continent: 'Europe',
    language: 'German',
    helloPhrase: 'Guten Tag',
    goodbyePhrase: 'Auf Wiedersehen',
    culturalDimensions: {
      power_distance: 35,
      individualism_collectivism: 67,
      masculinity_femininity: 66,
      uncertainty_avoidance: 65,
      long_term_orientation: 83,
      indulgence_restraint: 40,
      high_low_context: 20,
      monochronic_polychronic: 10,
    },
    communicationStyle: {
      directness: 85,
      contextSensitivity: 20,
      formalityLevel: 70,
      emotionalExpression: 30,
    },
    etiquetteRules: [
      { id: 'GE001', category: 'Greeting', rule: 'Shake hands firmly', description: 'A firm handshake is expected when greeting and leaving, with eye contact.', consequences: 'Negative', example: 'Upon meeting, extend your hand for a firm shake.', keywords: ['handshake', 'firm', 'eye contact', 'greeting'] },
      { id: 'GE002', category: 'Business Meeting', rule: 'Be punctual', description: 'Punctuality is extremely important; arriving late without a valid excuse is considered rude.', consequences: 'Critical', example: 'Arrive 5-10 minutes early for all meetings.', keywords: ['punctual', 'on time', 'late', 'meeting'] },
      { id: 'GE006', category: 'Conversation', rule: 'Direct communication', description: 'Germans prefer direct and factual communication. Avoid excessive small talk before getting to business.', consequences: 'Neutral', keywords: ['direct communication', 'small talk', 'factual'] },
      { id: 'GE007', category: 'Business Meeting', rule: 'Detailed preparation', description: 'Come prepared with facts, figures, and a clear agenda. Decisions are often based on logic and data.', consequences: 'Negative', keywords: ['preparation', 'facts', 'figures', 'agenda', 'logic'] },
      { id: 'GE010', category: 'Conversation', rule: 'Address by title and surname', description: 'Unless invited otherwise, address individuals by their professional title (if applicable) and surname.', consequences: 'Negative', keywords: ['title', 'surname', 'formal address'] },
    ],
    negotiationPractices: [
      { id: 'GN001', aspect: 'Preparation', practice: 'Thorough data analysis', description: 'German negotiators rely heavily on facts, figures, and detailed analysis.', culturalBasis: 'high uncertainty avoidance, low context', keywords: ['data analysis', 'facts', 'figures', 'preparation'] },
      { id: 'GN002', aspect: 'Process', practice: 'Direct and logical arguments', description: 'Expect direct, objective arguments focused on efficiency and quality. Emotional appeals are less effective.', culturalBasis: 'low context, high directness', keywords: ['direct arguments', 'logic', 'efficiency', 'quality'] },
      { id: 'GN004', aspect: 'Relationship Building', practice: 'Trust built through competence', description: 'Trust is built through demonstrated competence, reliability, and adherence to agreements, rather than extensive socializing.', culturalBasis: 'individualism, low context', keywords: ['trust', 'competence', 'reliability'] },
    ],
    socialNorms: [
      { id: 'GSN001', category: 'Conversation', norm: 'Maintain eye contact', description: 'Direct eye contact during conversations shows sincerity and attention.', avoid: 'Avoiding eye contact can be seen as evasive.', keywords: ['eye contact', 'sincerity'] },
      { id: 'GSN002', category: 'Personal Space', norm: 'Respect boundaries', description: 'A larger personal space bubble is common. Avoid standing too close or touching casually.', avoid: 'Excessive touching or close proximity can cause discomfort.', keywords: ['personal space', 'boundaries', 'touching'] },
    ],
    commonMisunderstandings: [
      { id: 'GCM001', topic: 'Directness', description: 'What might seem overly direct or blunt to some cultures is often perceived as honest and efficient in Germany.', culturalDifference: 'High directness vs. indirect communication styles.', advice: 'Do not soften your message excessively; focus on clarity and facts.', keywords: ['directness', 'blunt', 'honest', 'efficient'] },
    ],
    nonVerbalCues: [
      { id: 'GNV001', type: 'Eye Contact', cue: 'Direct, sustained eye contact', meaning: 'Sign of sincerity, attentiveness, and confidence.', interpretation: 'Positive', caution: 'Staring aggressively can be negative.', keywords: ['eye contact', 'direct', 'sustained'] },
    ],
    values: ['Order', 'Punctuality', 'Efficiency', 'Precision', 'Reliability', 'Diligence', 'Privacy'],
  },
  {
    id: 'JAPAN',
    name: 'Japan',
    continent: 'Asia',
    language: 'Japanese',
    helloPhrase: 'Konnichiwa',
    goodbyePhrase: 'Sayonara',
    culturalDimensions: {
      power_distance: 54,
      individualism_collectivism: 46,
      masculinity_femininity: 95,
      uncertainty_avoidance: 92,
      long_term_orientation: 88,
      indulgence_restraint: 42,
      high_low_context: 90,
      monochronic_polychronic: 30,
    },
    communicationStyle: {
      directness: 10,
      contextSensitivity: 90,
      formalityLevel: 95,
      emotionalExpression: 10,
    },
    etiquetteRules: [
      { id: 'JP_E001', category: 'Greeting', rule: 'Bow correctly', description: 'Bowing is a complex form of greeting, showing respect. The depth of the bow depends on the status difference.', consequences: 'Negative', example: 'A slight nod for equals, deeper bow for superiors.', keywords: ['bow', 'greeting', 'respect'] },
      { id: 'JP_E002', category: 'Business Meeting', rule: 'Exchange business cards (Meishi)', description: 'Always present and receive business cards with both hands, examine it, and place it carefully on the table.', consequences: 'Critical', keywords: ['business card', 'meishi', 'two hands'] },
      { id: 'JP_E003', category: 'Dining', rule: 'Do not stick chopsticks upright in rice', description: 'This resembles a funeral rite and is highly offensive.', consequences: 'Critical', keywords: ['chopsticks', 'rice', 'upright', 'funeral'] },
      { id: 'JP_E004', category: 'Social', rule: 'Remove shoes indoors', description: 'Always remove shoes when entering a Japanese home, traditional restaurant, or temple.', consequences: 'Critical', keywords: ['remove shoes', 'indoors'] },
      { id: 'JP_E006', category: 'Conversation', rule: 'Indirect communication (Honne/Tatemae)', description: 'Japanese communication often relies on context and unspoken cues (Tatemae - public facade, Honne - true feelings). Direct "no" is rare.', consequences: 'Neutral', keywords: ['indirect communication', 'honne', 'tatemae', 'no'] },
      { id: 'JP_E009', category: 'Dining', rule: 'Slurp noodles', description: 'Slurping noodles is acceptable and can indicate enjoyment.', consequences: 'Advisory', keywords: ['slurp noodles', 'dining'] },
    ],
    negotiationPractices: [
      { id: 'JP_N001', aspect: 'Relationship Building', practice: 'Long-term relationship focus', description: 'Building trust and a long-term relationship is paramount before and during negotiations.', culturalBasis: 'collectivism, long-term orientation', keywords: ['long-term relationship', 'trust'] },
      { id: 'JP_N003', aspect: 'Decision Making', practice: 'Consensus-based (Nemawashi)', description: 'Decisions are made collectively, often through informal, behind-the-scenes discussions (Nemawashi) before a formal meeting.', culturalBasis: 'collectivism, high uncertainty avoidance', keywords: ['consensus', 'nemawashi', 'collective decision'] },
    ],
    socialNorms: [
      { id: 'JP_SN001', category: 'Conversation', norm: 'Modesty and humility', description: 'Boasting about achievements or being overly self-promotional is frowned upon. Humility is valued.', avoid: 'Self-praise.', keywords: ['modesty', 'humility', 'self-praise'] },
      { id: 'JP_SN003', category: 'Hospitality', norm: 'Polite refusal of generosity', description: 'It is polite to initially refuse an offer of food or drink before accepting.', avoid: 'Immediate acceptance of offers.', keywords: ['polite refusal', 'generosity'] },
    ],
    commonMisunderstandings: [
      { id: 'JP_CM001', topic: 'Silence', description: 'Silence in a conversation may indicate thoughtfulness or a desire to avoid direct refusal, not necessarily disagreement or lack of understanding.', culturalDifference: 'High context vs. low context communication.', advice: 'Allow for pauses; do not rush to fill silence or assume a "no."', keywords: ['silence', 'disagreement', 'no'] },
    ],
    nonVerbalCues: [
      { id: 'JP_NV001', type: 'Eye Contact', cue: 'Moderate, often averted eye contact', meaning: 'Shows respect, humility, and deference, especially to elders or superiors.', interpretation: 'Positive', caution: 'Prolonged direct eye contact can be seen as rude.', keywords: ['eye contact', 'averted', 'respect'] },
    ],
    values: ['Harmony (Wa)', 'Group Loyalty', 'Respect (Keii)', 'Humility', 'Hard Work', 'Punctuality', 'Diligence'],
  },
    {
    id: 'USA',
    name: 'United States',
    continent: 'North America',
    language: 'English',
    helloPhrase: 'Hello',
    goodbyePhrase: 'Goodbye',
    culturalDimensions: {
      power_distance: 40,
      individualism_collectivism: 91,
      masculinity_femininity: 62,
      uncertainty_avoidance: 46,
      long_term_orientation: 26,
      indulgence_restraint: 68,
      high_low_context: 15, // Low-context
      monochronic_polychronic: 5, // Strongly monochronic
    },
    communicationStyle: {
      directness: 70,
      contextSensitivity: 15,
      formalityLevel: 40,
      emotionalExpression: 60,
    },
    etiquetteRules: [
      { id: 'US_E001', category: 'Greeting', rule: 'Firm handshake and direct eye contact', description: 'A firm handshake is common for both men and women in business. Direct eye contact is a sign of sincerity.', consequences: 'Negative', keywords: ['handshake', 'eye contact'] },
      { id: 'US_E002', category: 'Business Meeting', rule: 'Be on time', description: 'Punctuality is generally valued, but 5-10 minutes leeway might be acceptable. Inform if running late.', consequences: 'Negative', keywords: ['on time', 'punctuality', 'late'] },
      { id: 'US_E003', category: 'Conversation', rule: 'Small talk is common', description: 'Engage in a few minutes of small talk before getting to business. Topics like weather, sports, or travel are safe.', consequences: 'Neutral', keywords: ['small talk', 'conversation'] },
      { id: 'US_E004', category: 'Dining', rule: 'Tipping is customary', description: 'Tipping 15-20% for good service in restaurants is expected.', consequences: 'Critical', keywords: ['tipping', 'dining'] },
    ],
    negotiationPractices: [
      { id: 'US_N001', aspect: 'Process', practice: 'Direct and often adversarial', description: 'Negotiations can be direct, open, and sometimes competitive. Focus on facts and figures.', culturalBasis: 'individualism, low context', keywords: ['direct negotiation', 'adversarial', 'facts'] },
    ],
    socialNorms: [
      { id: 'US_SN001', category: 'Conversation', norm: 'Direct communication, expect opinions', description: 'Americans generally communicate directly and expect others to express their opinions clearly.', avoid: 'Excessive ambiguity.', keywords: ['direct communication', 'opinions'] },
    ],
    commonMisunderstandings: [
      { id: 'US_CM001', topic: 'Directness', description: 'Directness in the US can sometimes be perceived as blunt by cultures that value indirectness, but it is generally appreciated for clarity.', culturalDifference: 'Low context communication.', advice: 'Be clear and concise; don\'t expect others to read between the lines.', keywords: ['directness', 'blunt', 'clarity'] },
    ],
    nonVerbalCues: [
      { id: 'US_NV001', type: 'Eye Contact', cue: 'Direct eye contact', meaning: 'Signifies honesty, attention, and confidence.', interpretation: 'Positive', caution: 'Staring without blinking can be unsettling.', keywords: ['eye contact', 'direct'] },
    ],
    values: ['Individualism', 'Achievement', 'Freedom', 'Equality', 'Fairness', 'Directness', 'Innovation'],
  }
];

export const CULTURAL_DIMENSIONS_DATA: ICulturalDimension[] = [
  { id: 'power_distance', name: 'Power Distance', description: 'The extent to which less powerful members of organizations and institutions (like the family) accept and expect that power is distributed unequally.', typicalScores: { min: 0, max: 100 } },
  { id: 'individualism_collectivism', name: 'Individualism vs. Collectivism', description: 'Individualism is a preference for a loosely-knit social framework in which individuals are expected to take care of only themselves and their immediate families.', typicalScores: { min: 0, max: 100 } },
  { id: 'masculinity_femininity', name: 'Masculinity vs. Femininity', description: 'Masculinity represents a preference in society for achievement, heroism, assertiveness. Femininity stands for a preference for cooperation, modesty, caring for the weak.', typicalScores: { min: 0, max: 100 } },
  { id: 'uncertainty_avoidance', name: 'Uncertainty Avoidance', description: 'The extent to which the members of a culture feel threatened by ambiguous or unknown situations.', typicalScores: { min: 0, max: 100 } },
];

export const SCENARIO_TEMPLATES_DATA: IScenarioTemplate[] = [
  {
    id: 'SCEN001',
    title: 'First Business Meeting in Germany',
    description: 'You are meeting potential German business partners for the first time to discuss a new software integration project. Focus on making a good first impression.',
    category: 'Business',
    difficulty: 'Beginner',
    objectives: [
      'Establish professional rapport',
      'Clearly present your proposal (briefly)',
      'Demonstrate punctuality and preparation',
      'Avoid common etiquette mistakes',
    ],
    initialSituation: 'You arrive at the meeting room. Mr. Schmidt and Ms. Müller, your German counterparts, are already seated. What is your first action and greeting?',
    keyCulturalAspects: ['GE001', 'GE002', 'GE006', 'GE007', 'GN001', 'GN004', 'GNV001', 'power_distance', 'uncertainty_avoidance', 'monochronic_polychronic'],
    possibleUserActions: [
      'Offer a firm handshake and maintain eye contact while greeting.',
      'Introduce yourself clearly, stating your name and company.',
      'Arrive exactly on time or a few minutes early.',
      'Have your business agenda and materials organized.',
    ],
    possiblePitfalls: [
      'Arriving late without apology.',
      'Using overly casual language or humor immediately.',
      'Avoiding eye contact during greetings.',
      'Ignoring formal titles if used by German counterparts.',
    ],
    relatedLearningModules: ['LM001', 'LM002', 'LM004'],
  },
  {
    id: 'SCEN002',
    title: 'Dining with Japanese Colleagues',
    description: 'You\'ve been invited to a traditional Japanese dinner with your colleagues after securing a successful deal. This is an opportunity to strengthen relationships.',
    category: 'Social',
    difficulty: 'Intermediate',
    objectives: [
      'Show respect for Japanese dining etiquette',
      'Engage in appropriate social conversation',
      'Avoid offensive gestures or behaviors',
      'Build social rapport',
    ],
    initialSituation: 'You are seated at a low table in a traditional Japanese restaurant. Your host gestures towards the food and says, "Please, help yourself."',
    keyCulturalAspects: ['JP_E003', 'JP_E004', 'JP_E009', 'JP_E006', 'JP_SN003', 'JP_CM001', 'JP_NV001', 'high_low_context', 'power_distance'],
    possibleUserActions: [
      'Remove shoes before entering the restaurant (if applicable).',
      'Use both hands when receiving items (like a drink).',
      'Try small amounts of all offered dishes.',
      'Slurp noodles to indicate enjoyment.',
    ],
    possiblePitfalls: [
      'Sticking chopsticks upright in rice.',
      'Ignoring shoe removal rules.',
      'Declining all offers of food/drink too quickly.',
      'Excessive physical contact or loud behavior.',
    ],
    relatedLearningModules: ['LM003', 'LM005'],
  }
];

export const LEARNING_MODULES_DATA: ILearningModule[] = [
  {
    id: 'LM001',
    title: 'German Business Etiquette Essentials',
    category: 'Etiquette',
    culturesCovered: ['GERMANY'],
    content: 'Germany is known for its strong emphasis on punctuality, order, and direct communication. In business settings, this translates to structured meetings, factual presentations, and a clear distinction between personal and professional relationships.',
    quizQuestions: [],
    estimatedCompletionTimeMinutes: 30,
    prerequisites: [],
  },
  {
    id: 'LM003',
    title: 'Navigating Japanese Social & Dining Customs',
    category: 'Etiquette',
    culturesCovered: ['JAPAN'],
    content: 'Japanese social and dining etiquette is rich with traditions that emphasize respect, harmony, and group cohesion. From the intricate art of bowing to the careful handling of chopsticks, understanding these customs is vital.',
    quizQuestions: [],
    estimatedCompletionTimeMinutes: 40,
    prerequisites: [],
  }
];

export const SYSTEM_SETTINGS_DATA: ISystemSettings = {
  darkMode: false,
  notificationPreferences: { email: true, inApp: true, scenarioRecommendations: true },
  llmModelPreference: 'detailed',
  feedbackVerbosity: 'pedagogical',
  aiPersona: 'supportive',
};

export const USER_PROFILES_DATA: IUserCulturalProfile[] = [
  {
    userId: 'user_alice',
    username: 'Alice Smith',
    originCultureId: 'USA',
    targetCultureInterests: ['GERMANY', 'JAPAN'],
    culturalCompetenceScore: {
      'GERMANY': 65,
      'JAPAN': 40,
      'USA': 90,
    },
    overallCompetence: 65,
    learningPathProgress: {
      'LM001': { completed: true, score: 85 },
    },
    scenarioHistory: [
        {
            scenarioInstanceId: 'hist_1',
            scenarioTemplateId: 'SCEN001',
            targetCultureId: 'GERMANY',
            completionDate: new Date().toISOString(),
            finalSuccessMetric: 75,
            totalInteractions: 5,
            keyLearnings: ['Punctuality matters', 'Direct eye contact'],
        }
    ],
  }
];

export const ACTIVE_SCENARIOS_DATA: IActiveScenarioInstance[] = [
    {
    scenarioTemplateId: 'SCEN001',
    instanceId: 'active_SCEN001_user_alice_001',
    currentSituation: 'You are in the meeting room. Mr. Schmidt and Ms. Müller, your German counterparts, are already seated. What is your first action and greeting?',
    objectiveStatus: {
      'Establish professional rapport': false,
      'Clearly present your proposal (briefly)': false,
      'Demonstrate punctuality and preparation': true,
      'Avoid common etiquette mistakes': false,
    },
    targetCulture: CULTURAL_PROFILES_DATA.find(c => c.id === 'GERMANY')!,
    participants: [
      { name: 'Mr. Schmidt', role: 'Head of Department', culturalBackground: 'Germany' },
      { name: 'Ms. Müller', role: 'Project Lead', culturalBackground: 'Germany' },
    ],
    currentTurn: 1,
    maxTurns: 10,
    isCompleted: false,
    successMetric: 50,
  }
];