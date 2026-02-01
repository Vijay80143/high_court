
import React, { useState } from 'react';
import { FirmProfile } from '../types';
import { fetchCaseUpdates } from '../services/geminiService';

interface CaseTrackerProps {
  firmProfile: FirmProfile;
}

interface ParsedSummary {
  caseNumber?: string;
  status?: string;
  nextDate?: string;
  judge?: string;
  court?: string;
  stage?: string;
}

export const CaseTracker: React.FC<CaseTrackerProps> = ({ firmProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [results, setResults] = useState<{ text: string, sources: any[], isError?: boolean } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const validateInput = (value: string) => {
    // Allows alphanumeric, spaces, forward slashes, and hyphens
    const regex = /^[a-zA-Z0-9\s/-]*$/;
    if (!regex.test(value)) {
      setValidationError("Invalid characters detected. Only letters, numbers, spaces, '/' and '-' are permitted.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    validateInput(value);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || validationError) return;
    
    // Final check before submission
    if (!validateInput(searchQuery)) return;

    setIsSearching(true);
    setResults(null); // Reset previous results
    const result = await fetchCaseUpdates(searchQuery);
    setResults(result);
    setIsSearching(false);
  };

  const parseSummary = (text: string): ParsedSummary => {
    const summaryRegex = /CASE_SUMMARY_START([\s\S]*?)CASE_SUMMARY_END/;
    const match = text.match(summaryRegex);
    if (!match) return {};

    const content = match[1];
    const extract = (label: string) => {
      const regex = new RegExp(`${label}:\\s*(.*)`, 'i');
      const found = content.match(regex)?.[1]?.trim();
      return found && found !== '[Number]' && found !== '[Status]' && found !== '[Date or "Not Fixed"]' ? found : undefined;
    };

    return {
      caseNumber: extract('Case Number'),
      status: extract('Current Status'),
      nextDate: extract('Next Hearing Date'),
      judge: extract('Judge'),
      court: extract('Court'),
      stage: extract('Stage'),
    };
  };

  const summary = results && !results.isError ? parseSummary(results.text) : null;
  const cleanBody = results && !results.isError ? results.text.replace(/CASE_SUMMARY_START[\s\S]*?CASE_SUMMARY_END/, '').trim() : '';

  const getStatusColor = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('disposed') || s.includes('closed') || s.includes('dismissed')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (s.includes('pending') || s.includes('adjourned') || s.includes('awaiting')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Premium Search Header */}
      <div className="bg-slate-900 p-8 md:p-14 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-3">Court Intelligence Sync</h2>
          <p className="text-slate-400 text-sm md:text-base mb-10 max-w-2xl font-medium">
            Search CNR, Case Number, or Party Name to track status across <span className="text-indigo-400">Guntur Trial Courts</span> and <span className="text-indigo-400">High Courts of TS & AP</span>.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-3xl">
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text"
              placeholder="Ex: WP 1234/2024 or OS 45/2023 Guntur..."
              className={`w-full bg-white/10 border ${validationError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-white/10'} text-white py-5 pl-14 pr-40 rounded-3xl backdrop-blur-md focus:outline-none focus:ring-4 ${validationError ? 'focus:ring-rose-500/30' : 'focus:ring-indigo-500/30'} focus:bg-white focus:text-slate-900 transition-all text-sm md:text-base font-semibold shadow-inner`}
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button 
              type="submit"
              disabled={isSearching || !!validationError}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/40 active:scale-95"
            >
              {isSearching ? 'Synchronizing...' : 'Fetch Status'}
            </button>
          </form>
          {validationError && (
            <div className="mt-3 flex items-center gap-2 text-rose-400 animate-in slide-in-from-top-2 duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">{validationError}</span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-10 -right-10 text-[180px] font-black text-white/[0.03] pointer-events-none uppercase italic">SEARCH</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {results ? (
            results.isError ? (
              /* User-Friendly Error UI */
              <div className="bg-white rounded-[3rem] border border-rose-100 shadow-2xl shadow-rose-200/20 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 md:p-16 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-8 border border-rose-100 text-rose-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Portal Connection Issue</h3>
                  <p className="text-slate-500 max-w-lg mb-10 font-medium leading-relaxed">
                    {results.text}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button 
                      onClick={handleSearch}
                      className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                    >
                      Retry Connection
                    </button>
                    <button 
                      onClick={() => setResults(null)}
                      className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
                <div className="bg-rose-50/50 p-6 border-t border-rose-100 flex items-center justify-center gap-4">
                   <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Troubleshooting: Check internet or official e-Courts status.</span>
                </div>
              </div>
            ) : (
              /* Normal Search Results UI */
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {/* Primary Detail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col justify-between h-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Next Hearing Date</p>
                    <div>
                      <h4 className="text-3xl font-black text-indigo-600 leading-none">{summary?.nextDate || 'Not Fixed'}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Scheduled Session</p>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col justify-between h-full">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Identity & Status</p>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">{summary?.caseNumber || 'Unknown Case'}</h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider transition-colors duration-300 ${getStatusColor(summary?.status)}`}>
                        {summary?.status || 'Pending Sync'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col justify-between h-full">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Bench Information</p>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{summary?.judge || 'Hon\'ble Judge'}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{summary?.court || 'e-Courts Network'}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg font-display">Technical Specifications</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Log</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {[
                      { label: 'Case Number', value: summary?.caseNumber },
                      { label: 'Current Stage', value: summary?.stage },
                      { label: 'Hon\'ble Bench', value: summary?.judge },
                      { label: 'Court Name', value: summary?.court },
                      { label: 'Status', value: summary?.status, isStatus: true },
                      { label: 'Next Listing', value: summary?.nextDate }
                    ].map((item, i) => (
                      <div key={i} className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                        {item.isStatus ? (
                           <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusColor(item.value)}`}>
                             {item.value || 'N/A'}
                           </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-900 text-right max-w-[200px] truncate">{item.value || 'N/A'}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chronological History Log */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg font-display flex items-center gap-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Procedural History & Intelligence
                    </h3>
                  </div>
                  <div className="p-10 md:p-14">
                    {cleanBody ? (
                      <div className="prose prose-slate prose-sm md:prose-lg max-w-none">
                        <div className="whitespace-pre-line text-slate-700 leading-relaxed font-medium">
                          {cleanBody}
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                         <p className="text-slate-400 font-bold italic">No secondary history records found for this specific entry.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center opacity-80">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 border border-slate-100">
                <svg className="w-10 h-10 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Intelligence Data Loaded</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-3 font-medium leading-relaxed">Search by CNR, Party Name, or Case Number to perform a real-time sync with Guntur and High Court portals.</p>
            </div>
          )}
        </div>

        {/* Tactical Right Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Verified Sources</h3>
            {results && !results.isError && results.sources.length > 0 ? (
              <div className="space-y-4">
                {results.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" className="block p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all group">
                    <p className="text-[11px] font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-700">{s.title}</p>
                    <div className="flex items-center gap-2">
                       <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                       <span className="text-[9px] text-slate-400 font-bold truncate tracking-tight">{s.uri}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                 <p className="text-[10px] text-slate-400 font-bold italic">Verified e-Courts & High Court links will appear here.</p>
              </div>
            )}
          </div>

          <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest">Evening Sync</h3>
                  <p className="text-[10px] text-indigo-300 font-bold">5:00 PM - 7:00 PM</p>
                </div>
              </div>
              <p className="text-[10px] text-indigo-100 leading-relaxed font-medium mb-8">
                Judges typically update orders and status at the end of the day. For the most accurate next dates, refresh this search after 7:00 PM IST.
              </p>
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Guntur Trial Priority</span>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></div>
              </div>
            </div>
            {/* Background branding */}
            <div className="absolute -bottom-10 -left-10 text-[100px] font-black text-white/[0.03] pointer-events-none uppercase italic">SYNC</div>
          </div>
        </div>
      </div>
    </div>
  );
};
