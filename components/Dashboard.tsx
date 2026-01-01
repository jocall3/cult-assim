import React from 'react';
import { useCulturalAdvisor } from '../context/CulturalAdvisorContext';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { PlayCircle, TrendingUp, Award, Clock } from 'lucide-react';

interface DashboardProps {
  onStartScenario: (scenarioId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartScenario }) => {
  const { currentUser, scenarioTemplates, startNewScenario } = useCulturalAdvisor();

  if (!currentUser) return null;

  // Prepare Chart Data
  const competenceData = Object.keys(currentUser.culturalCompetenceScore).map(key => ({
    subject: key,
    A: currentUser.culturalCompetenceScore[key],
    fullMark: 100,
  }));

  const handleStartQuickScenario = async (templateId: string, cultureId: string) => {
    try {
      const newScenario = await startNewScenario(templateId, cultureId);
      onStartScenario(newScenario.instanceId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser.username.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-1">Your cultural intelligence metrics are improving.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400 uppercase font-semibold tracking-wider">Overall Competence</div>
          <div className="text-4xl font-black text-indigo-600">{Math.round(currentUser.overallCompetence)}<span className="text-xl text-slate-400 font-normal">/100</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competence Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Competence Profile
            </h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competenceData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Competence" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent History */}
        <div className="space-y-6">
           {/* Recent Scenarios */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {currentUser.scenarioHistory.length === 0 ? (
                <p className="text-slate-400 text-sm">No recent activity.</p>
              ) : (
                currentUser.scenarioHistory.slice(0, 3).map((hist) => (
                  <div key={hist.scenarioInstanceId} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{hist.targetCultureId}</div>
                      <div className="text-xs text-slate-500">{new Date(hist.completionDate).toLocaleDateString()}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${hist.finalSuccessMetric > 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {hist.finalSuccessMetric}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
           {/* Rewards */}
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-2">
               <Award className="w-6 h-6 text-yellow-300" />
               <h3 className="font-bold text-lg">Rewards Earned</h3>
            </div>
            <div className="text-3xl font-bold mb-1">1,250 <span className="text-sm font-normal opacity-80">tokens</span></div>
            <p className="text-xs opacity-70 mb-4">Redeemable for advanced modules.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg text-sm font-medium">View Wallet</button>
           </div>
        </div>
      </div>

      {/* Recommended Scenarios */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarioTemplates.map(template => (
             <div key={template.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PlayCircle className="w-24 h-24 text-indigo-600 -mr-8 -mt-8" />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${template.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : template.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {template.difficulty}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{template.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{template.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{template.description}</p>
                    <button 
                        onClick={() => handleStartQuickScenario(template.id, 'GERMANY')} // Simplified for demo
                        className="w-full py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                        <PlayCircle className="w-4 h-4" /> Start Simulation
                    </button>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};