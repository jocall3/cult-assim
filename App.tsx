import React, { useState } from 'react';
import { CulturalAdvisorProvider, useCulturalAdvisor } from './context/CulturalAdvisorContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SimulationSession } from './components/SimulationSession';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Globe, Users, MessageSquare, BookOpen, Settings } from 'lucide-react';

// Simple router component for the SPA
const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useCulturalAdvisor();
  const [currentView, setCurrentView] = useState<'dashboard' | 'simulation' | 'knowledge'>('dashboard');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const navigateToSimulation = (scenarioId?: string) => {
    if (scenarioId) {
      setActiveScenarioId(scenarioId);
    }
    setCurrentView('simulation');
  };

  if (isLoading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Initializing Agentic AI System...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center space-y-4 max-w-md px-6">
          <Globe className="w-16 h-16 text-indigo-500 mx-auto" />
          <h1 className="text-3xl font-bold">Cultural Assimilation Advisor</h1>
          <p className="text-slate-400">Please wait while we log you in securely...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'dashboard' && <Dashboard onStartScenario={navigateToSimulation} />}
      {currentView === 'simulation' && <SimulationSession scenarioId={activeScenarioId} onExit={() => setCurrentView('dashboard')} />}
      {currentView === 'knowledge' && <KnowledgeBase />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <CulturalAdvisorProvider>
      <AppContent />
    </CulturalAdvisorProvider>
  );
};

export default App;