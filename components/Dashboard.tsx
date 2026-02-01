
import React, { useState, useEffect } from 'react';
import { FirmProfile, FirmCase } from '../types';
import { fetchFirmCaseList } from '../services/geminiService';

interface DashboardProps {
  firmProfile: FirmProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ firmProfile }) => {
  const [cases, setCases] = useState<FirmCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchFirmCaseList(firmProfile.names);
      setCases(result.cases);
      setLoading(false);
    };
    loadData();
  }, [firmProfile]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">{firmProfile.firmName}</h2>
          <p className="text-sm font-medium text-slate-400">Daily Firm-Wide Intelligence Sync</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase border border-emerald-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          Connected to e-Courts & High Courts
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[2rem] p-20 border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-bold text-slate-800">Searching Portals...</h3>
          <p className="text-slate-500 text-sm max-w-xs mt-2">Checking K. Ankineedu Prasad & team's portfolios in Guntur, AP and TS courts.</p>
        </div>
      ) : cases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">{c.courtLocation}</span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">{c.caseNumber}</h3>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase ${c.status.toLowerCase().includes('disposed') ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {c.status}
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-6">{c.parties}</p>
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Status Update</p>
                  <p className="text-sm font-medium text-slate-700 italic">"{c.todayUpdate}"</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Advocate</p>
                  <p className="text-xs font-black text-slate-800">{c.advocate}</p>
                </div>
                <div className="flex gap-3">
                  <a href={c.portalLink} target="_blank" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">View e-File</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-100 rounded-[2rem] p-20 border-2 border-dashed border-slate-300 text-center">
          <p className="text-slate-500 font-bold">No active cases found for the firm today. Perform a manual search in the 'Tracker' tab if needed.</p>
        </div>
      )}
    </div>
  );
};
