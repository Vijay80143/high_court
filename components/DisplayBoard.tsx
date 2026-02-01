
import React, { useState, useEffect } from 'react';
import { getLiveCourtBoard } from '../services/geminiService';

export const DisplayBoard: React.FC = () => {
  const [activeCourt, setActiveCourt] = useState<'TG' | 'AP'>('TG');
  const [data, setData] = useState<{ text: string, sources: any[] }>({ text: '', sources: [] });
  const [loading, setLoading] = useState(true);

  const fetchBoard = async () => {
    setLoading(true);
    const result = await getLiveCourtBoard(activeCourt);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchBoard();
    const interval = setInterval(fetchBoard, 60000); 
    return () => clearInterval(interval);
  }, [activeCourt]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Enhanced Header Section */}
      <div className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Court Board</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping shadow-[0_0_10px_rgba(244,63,94,0.6)]"></div>
            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Live Serial Tracking</p>
          </div>
        </div>
        
        <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] w-full md:w-auto shadow-inner">
          <button 
            onClick={() => setActiveCourt('TG')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-3 rounded-2xl font-black text-[10px] md:text-xs transition-all uppercase tracking-widest leading-none ${activeCourt === 'TG' ? 'bg-white shadow-xl text-indigo-700 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Telangana
          </button>
          <button 
            onClick={() => setActiveCourt('AP')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-3 rounded-2xl font-black text-[10px] md:text-xs transition-all uppercase tracking-widest leading-none ${activeCourt === 'AP' ? 'bg-white shadow-xl text-indigo-700 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Andhra Pradesh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Main Board View */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800 group">
            <div className="p-5 md:p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-2xl">
              <div className="flex gap-3 md:gap-5">
                <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Hall Status</p>
                  <p className="text-white font-black text-sm uppercase">Global View</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Timestamp</p>
                  <p className="text-indigo-400 font-black text-sm uppercase">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <button 
                onClick={fetchBoard}
                className="p-3 text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90 bg-white/5 border border-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            
            <div className="p-6 md:p-12 relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-8">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Opening Live Feed Stream</p>
                    <p className="text-slate-600 text-[10px] mt-2 font-bold italic">Synchronizing with Official High Court Server...</p>
                  </div>
                </div>
              ) : (
                <div className="text-indigo-50 font-mono text-sm md:text-base leading-relaxed whitespace-pre-line bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-inner backdrop-blur-sm max-h-[600px] overflow-y-auto custom-scrollbar">
                  {data.text}
                </div>
              )}
              {/* Decorative gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-[3rem]"></div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 h-fit">
            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
               <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
              Assigned Items
            </h3>
            
            <div className="space-y-5">
              {[
                { judge: 'Justice S. Rao', hall: 'Hall 5', item: '14', status: 'S-11 Running', color: 'bg-indigo-600', trend: 'down' },
                { judge: 'Justice P. Kumar', hall: 'Hall 12', item: '42', status: 'S-38 Running', color: 'bg-amber-600', trend: 'up' },
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-slate-50/50 rounded-3xl flex items-center justify-between border border-slate-100 hover:border-slate-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
                      <span className="text-[8px] font-black uppercase leading-none mb-1 opacity-70">Item</span>
                      <span className="text-base font-black leading-none">{item.item}</span>
                    </div>
                    <div>
                       <p className="text-xs font-black text-slate-800 leading-none mb-1">{item.judge}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.hall}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-indigo-600">{item.status}</p>
                     <div className="h-1 w-8 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-indigo-500 w-1/2"></div>
                     </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Court Hall Portals</h4>
              <div className="space-y-3">
                {data.sources.slice(0, 4).map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" className="flex items-center justify-between p-3.5 text-[10px] text-slate-600 hover:text-indigo-700 font-black bg-slate-50/50 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100 uppercase tracking-wider group">
                    <span className="truncate flex-1 pr-4">{s.title}</span>
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
