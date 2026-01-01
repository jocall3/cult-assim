import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { 
  IUserCulturalProfile, ISystemSettings, ICulture, IScenarioTemplate, ILearningModule, IActiveScenarioInstance, CompleteInteractionFeedback 
} from '../types';
import { api } from '../services/api';
import { USER_PROFILES_DATA, SYSTEM_SETTINGS_DATA } from '../constants'; // For defaults

interface CulturalAdvisorContextType {
  currentUser: IUserCulturalProfile | null;
  systemSettings: ISystemSettings;
  cultures: ICulture[];
  scenarioTemplates: IScenarioTemplate[];
  learningModules: ILearningModule[];
  activeScenarios: IActiveScenarioInstance[];
  isLoading: boolean;
  error: string | null;
  login: (userId: string) => Promise<void>;
  startNewScenario: (scenarioTemplateId: string, targetCultureId: string) => Promise<IActiveScenarioInstance>;
  submitInteraction: (instanceId: string, userAction: string) => Promise<CompleteInteractionFeedback>;
}

export const CulturalAdvisorContext = createContext<CulturalAdvisorContextType | undefined>(undefined);

export const useCulturalAdvisor = () => {
  const context = useContext(CulturalAdvisorContext);
  if (context === undefined) {
    throw new Error('useCulturalAdvisor must be used within a CulturalAdvisorProvider');
  }
  return context;
};

export const CulturalAdvisorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUserCulturalProfile | null>(null);
  const [systemSettings, setSystemSettings] = useState<ISystemSettings>(SYSTEM_SETTINGS_DATA);
  const [cultures, setCultures] = useState<ICulture[]>([]);
  const [scenarioTemplates, setScenarioTemplates] = useState<IScenarioTemplate[]>([]);
  const [learningModules, setLearningModules] = useState<ILearningModule[]>([]);
  const [activeScenarios, setActiveScenarios] = useState<IActiveScenarioInstance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [loadedCultures, loadedScenarios, loadedModules, loadedSettings] = await Promise.all([
          api.getCultures(),
          api.getScenarioTemplates(),
          api.getLearningModules(),
          api.getSystemSettings(),
        ]);
        setCultures(loadedCultures);
        setScenarioTemplates(loadedScenarios);
        setLearningModules(loadedModules);
        setSystemSettings(loadedSettings);
        
        // Auto-login for demo
        const defaultUser = await api.getUserProfile('user_alice');
        if (defaultUser) {
           setCurrentUser(defaultUser);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const login = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const user = await api.getUserProfile(userId);
      if (user) setCurrentUser(user);
      else throw new Error("User not found");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewScenario = useCallback(async (scenarioTemplateId: string, targetCultureId: string) => {
    if (!currentUser) throw new Error("No user");
    setIsLoading(true);
    try {
      const newScenario = await api.startScenario(currentUser.userId, scenarioTemplateId, targetCultureId);
      setActiveScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const submitInteraction = useCallback(async (instanceId: string, userAction: string) => {
      if (!currentUser) throw new Error("No user");
      // Don't set full page loading for chat interactions, handled locally
      const feedback = await api.processInteraction(currentUser.userId, instanceId, userAction);
      const updatedScenario = await api.getActiveScenario(instanceId);
      if (updatedScenario) {
        setActiveScenarios(prev => prev.map(s => (s.instanceId === instanceId ? updatedScenario : s)));
      }
      return feedback;
  }, [currentUser]);

  const value = useMemo(() => ({
    currentUser,
    systemSettings,
    cultures,
    scenarioTemplates,
    learningModules,
    activeScenarios,
    isLoading,
    error,
    login,
    startNewScenario,
    submitInteraction
  }), [currentUser, systemSettings, cultures, scenarioTemplates, learningModules, activeScenarios, isLoading, error, login, startNewScenario, submitInteraction]);

  return <CulturalAdvisorContext.Provider value={value}>{children}</CulturalAdvisorContext.Provider>;
};