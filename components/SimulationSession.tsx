import React, { useState, useEffect, useRef } from 'react';
import { useCulturalAdvisor } from '../context/CulturalAdvisorContext';
import { CompleteInteractionFeedback, FeedbackSeverity, IActiveScenarioInstance } from '../types';
import { Send, AlertCircle, CheckCircle, Info, ChevronRight, BrainCircuit } from 'lucide-react';

interface SimulationSessionProps {
  scenarioId: string | null;
  onExit: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  feedback?: CompleteInteractionFeedback;
}

export const SimulationSession: React.FC<SimulationSessionProps> = ({ scenarioId, onExit }) => {
  const { activeScenarios, submitInteraction, startNewScenario, currentUser } = useCulturalAdvisor();
  const [activeScenario, setActiveScenario] = useState<IActiveScenarioInstance | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or load scenario
  useEffect(() => {
    const loadScenario = async () => {
      if (scenarioId) {
        const scenario = activeScenarios.find(s => s.instanceId === scenarioId);
        if (scenario) {
            setActiveScenario(scenario);
            setMessages([{
                id: 'init',
                sender: 'ai',
                text: scenario.currentSituation
            }]);
        }
      } else {
        // Fallback start a demo scenario if none passed (simplified flow)
         const newScenario = await startNewScenario('SCEN001', 'GERMANY');
         setActiveScenario(newScenario);
         setMessages([{
            id: 'init',
            sender: 'ai',
            text: newScenario.currentSituation
        }]);
      }
    };
    loadScenario();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !activeScenario || isProcessing) return;

    const userText = inputValue;
    setInputValue('');
    setIsProcessing(true);

    // Add user message immediately
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    try {
      const feedback = await submitInteraction(activeScenario.instanceId, userText);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: feedback.aiResponse,
        feedback: feedback
      };
      
      setMessages(prev => [...prev, aiMsg]);

      // Update local scenario state if completed
      if (activeScenario.currentTurn >= activeScenario.maxTurns) {
          setTimeout(() => {
              setMessages(prev => [...prev, { id: 'sys_end', sender: 'system', text: "Scenario Completed. Review your performance on the dashboard."}]);
          }, 1000);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeScenario) return <div className="p-10 text-center">Loading Scenario...</div>;

  return (
    <div className="flex h-full bg-slate-100">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
           <div>
             <h2 className="font-bold text-slate-800">{activeScenario.targetCulture.name} Simulation</h2>
             <p className="text-xs text-slate-500">Objective: {Object.keys(activeScenario.objectiveStatus)[0]}</p>
           </div>
           <button onClick={onExit} className="text-sm font-medium text-slate-500 hover:text-slate-800">
             End Session
           </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl rounded-2xl p-4 shadow-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : msg.sender === 'system' ? 'bg-slate-200 text-slate-600 text-center w-full'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {/* Agent Overlay for AI messages */}
                {msg.feedback && (
                   <div className={`mt-3 pt-3 border-t border-slate-100`}>
                      <div className="flex items-start gap-3">
                         <div className="bg-slate-50 p-2 rounded-lg">
                           <BrainCircuit className="w-4 h-4 text-indigo-500" />
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                               msg.feedback.feedbackSummary.severity === 'Positive' ? 'bg-emerald-100 text-emerald-700' :
                               msg.feedback.feedbackSummary.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                               msg.feedback.feedbackSummary.severity === 'Negative' ? 'bg-orange-100 text-orange-700' :
                               'bg-slate-100 text-slate-700'
                             }`}>
                               {msg.feedback.feedbackSummary.severity} Impact
                             </span>
                           </div>
                           <p className="text-xs text-slate-600 italic">
                             "{msg.feedback.feedbackSummary.text}"
                           </p>
                           {/* Detailed Feedback Accordion-ish */}
                           {msg.feedback.detailedFeedback.length > 0 && (
                             <div className="mt-2 space-y-2">
                               {msg.feedback.detailedFeedback.map((detail, idx) => (
                                 <div key={idx} className="bg-slate-50 p-2 rounded text-xs border border-slate-100">
                                   <strong className="block text-slate-700 mb-0.5">{detail.dimension}</strong>
                                   <p className="text-slate-500">{detail.explanation}</p>
                                   {detail.recommendations.length > 0 && (
                                     <div className="mt-1 flex gap-1 items-center text-indigo-600 font-medium">
                                       <ChevronRight className="w-3 h-3" />
                                       <span>{detail.recommendations[0]}</span>
                                     </div>
                                   )}
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                      </div>
                   </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isProcessing ? "AI Agent is analyzing..." : "Type your response..."}
              disabled={isProcessing}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-4 pr-12 shadow-sm disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isProcessing}
              className="absolute right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-slate-400">AI Cultural Agent is active and monitoring real-time compliance.</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Live Analysis HUD */}
      <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto hidden xl:block">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Live Agent HUD</h3>
        
        {/* Metric */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Success Metric</span>
                <span className="text-sm font-bold text-indigo-600">{Math.round(activeScenario.successMetric)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${activeScenario.successMetric}%` }}></div>
            </div>
        </div>

        {/* Objectives */}
        <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Objectives</h4>
            <div className="space-y-2">
                {Object.entries(activeScenario.objectiveStatus).map(([obj, status], i) => (
                    <div key={i} className="flex items-start gap-2">
                        {status ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 mt-0.5" />}
                        <span className={`text-sm ${status ? 'text-slate-900 line-through opacity-50' : 'text-slate-600'}`}>{obj}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Culture Snapshot */}
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-2 text-indigo-800 font-semibold">
                <Info className="w-4 h-4" />
                <span>Culture Snapshot</span>
            </div>
            <p className="text-xs text-indigo-700 mb-2">
                <strong>Target:</strong> {activeScenario.targetCulture.name}
            </p>
            <div className="text-xs space-y-1 text-indigo-600">
                <p>• Power Distance: {activeScenario.targetCulture.culturalDimensions.power_distance}</p>
                <p>• Context: {activeScenario.targetCulture.culturalDimensions.high_low_context > 50 ? 'High' : 'Low'}</p>
                <p>• Time: {activeScenario.targetCulture.culturalDimensions.monochronic_polychronic > 50 ? 'Polychronic' : 'Monochronic'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};