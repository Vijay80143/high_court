
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DisplayBoard } from './components/DisplayBoard';
import { CaseTracker } from './components/CaseTracker';
import { FirmProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'display' | 'tracker' | 'settings'>('dashboard');
  
  const [firmProfile, setFirmProfile] = useState<FirmProfile>({
    names: [
      'NARESH KUMAR JAJULA (NKJ)',
      'N DURGA PRASAD (NDP)',
      'ANKINEEDU PRASAD KOTHAPALLI (KAP)',
      'RAMESH BABU VISHWANATHULA'
    ],
    firmName: 'Jajula & Seniors Legal Office'
  });

  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden select-none">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main App Canvas */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-10 relative">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-slate-200 px-4 md:px-10 py-4 md:py-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
             <div className="md:hidden w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm">
                JS
             </div>
             <div>
                <h1 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight leading-none font-display">
                  {activeTab === 'dashboard' ? 'Practice Briefing' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Sync: {lastUpdated}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">e-Courts Hub</span>
            </div>
            <button 
              onClick={() => setLastUpdated(new Date().toLocaleString())}
              className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 text-slate-600 border border-slate-100 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard firmProfile={firmProfile} />}
          {activeTab === 'display' && <DisplayBoard />}
          {activeTab === 'tracker' && <CaseTracker firmProfile={firmProfile} />}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 className="text-2xl md:text-4xl font-display font-bold mb-3 text-slate-900">Advocate Network</h2>
              <p className="text-xs md:text-sm text-slate-500 mb-10 font-medium">Manage the list of Seniors and Advocates for automated e-Courts tracking across Guntur, TS, and AP High Courts.</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Firm / Chamber Title</label>
                  <input 
                    type="text" 
                    value={firmProfile.firmName}
                    onChange={(e) => setFirmProfile({...firmProfile, firmName: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tracked Names</label>
                  <div className="space-y-4">
                    {firmProfile.names.map((name, idx) => (
                      <div key={idx} className="flex gap-3 group">
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => {
                            const newNames = [...firmProfile.names];
                            newNames[idx] = e.target.value;
                            setFirmProfile({...firmProfile, names: newNames});
                          }}
                          className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 group-hover:border-slate-300 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold text-slate-800 bg-slate-50/50 shadow-sm"
                        />
                        <button 
                          onClick={() => {
                            const newNames = firmProfile.names.filter((_, i) => i !== idx);
                            setFirmProfile({...firmProfile, names: newNames});
                          }}
                          className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setFirmProfile({...firmProfile, names: [...firmProfile.names, '']})}
                      className="text-indigo-700 font-black text-[10px] flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 py-5 rounded-2xl w-full transition-all border border-indigo-200/50 tracking-widest uppercase"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                      ADD ADVOCATE
                    </button>
                  </div>
                </div>
                <div className="pt-6">
                  <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-400 text-[10px] uppercase active:scale-[0.98]">
                    UPDATE & SYNC NETWORK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile-First Floating Navigation Bar */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-xl border border-white/10 px-8 py-5 flex justify-between items-center z-50 rounded-[2.5rem] shadow-2xl shadow-slate-900/40">
        {[
          { id: 'dashboard', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: 'Brief' },
          { id: 'display', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, label: 'Live' },
          { id: 'tracker', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>, label: 'Search' },
          { id: 'settings', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>, label: 'Firm' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === item.id ? 'text-white scale-110' : 'text-slate-500'}`}
          >
            <div className={`p-1 ${activeTab === item.id ? 'text-indigo-400' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
