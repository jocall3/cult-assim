import React, { useState } from 'react';
import { useCulturalAdvisor } from '../context/CulturalAdvisorContext';
import { ChevronRight, Globe, Book } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { cultures } = useCulturalAdvisor();
  const [selectedCultureId, setSelectedCultureId] = useState<string | null>(null);

  const selectedCulture = cultures.find(c => c.id === selectedCultureId);

  return (
    <div className="flex h-full bg-slate-50">
      {/* List */}
      <div className="w-1/3 border-r border-slate-200 overflow-y-auto bg-white">
        <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Cultural Database</h2>
            <p className="text-sm text-slate-500">Access verified cultural intelligence.</p>
        </div>
        <div>
            {cultures.map(culture => (
                <button
                    key={culture.id}
                    onClick={() => setSelectedCultureId(culture.id)}
                    className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex justify-between items-center ${selectedCultureId === culture.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                            {culture.id.substring(0, 2)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">{culture.name}</h3>
                            <p className="text-xs text-slate-500">{culture.continent}</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
            ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto p-8">
        {selectedCulture ? (
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="flex items-start justify-between pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">{selectedCulture.name}</h1>
                        <div className="flex gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {selectedCulture.continent}</span>
                            <span className="flex items-center gap-1"><Book className="w-4 h-4" /> {selectedCulture.language}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase">Greeting</div>
                        <div className="text-lg font-medium text-indigo-600 italic">"{selectedCulture.helloPhrase}"</div>
                    </div>
                </header>

                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Core Dimensions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedCulture.culturalDimensions).map(([key, value]) => (
                            <div key={key} className="bg-white p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase">{key.replace('_', ' ')}</span>
                                    <span className="text-sm font-bold text-indigo-600">{value}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full" style={{ width: `${value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Etiquette Rules</h3>
                    <div className="space-y-3">
                        {selectedCulture.etiquetteRules.map(rule => (
                            <div key={rule.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                                        rule.consequences === 'Critical' ? 'bg-red-100 text-red-700' :
                                        rule.consequences === 'Negative' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>{rule.category}</span>
                                    <h4 className="font-semibold text-slate-900">{rule.rule}</h4>
                                </div>
                                <p className="text-sm text-slate-600">{rule.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Globe className="w-16 h-16 mb-4 text-slate-300" />
                <p>Select a culture to explore details.</p>
            </div>
        )}
      </div>
    </div>
  );
};