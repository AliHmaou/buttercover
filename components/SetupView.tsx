
import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types';
import Logo from './Logo';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
  onStart: (names: string[], settings: GameSettings) => void;
  scores: Record<string, number>;
  onResetScores: () => void;
  remainingWords?: number;
  totalWords?: number;
}

const SetupView: React.FC<Props> = ({ lang, onStart, scores, onResetScores, remainingWords = 0, totalWords = 0 }) => {
  const t = translations[lang];
  const [playerNames, setPlayerNames] = useState<string[]>(() => {
    const sortedKeys = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    return sortedKeys.length >= 3 ? sortedKeys : ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  });
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRoleDetail, setShowRoleDetail] = useState<string | null>(null);
  const [settings, setSettings] = useState<GameSettings>({
    civilsCount: 3,
    undercoversCount: 1,
    mrWhitesCount: 1
  });

  useEffect(() => {
    const total = playerNames.length;
    let und = Math.max(1, Math.floor(total * 0.25));
    let mrw = total >= 5 ? 1 : 0;
    let civ = Math.max(2, total - und - mrw);
    if (civ + und + mrw !== total) {
      und = total - civ - mrw;
    }
    setSettings({ civilsCount: civ, undercoversCount: und, mrWhitesCount: mrw });
  }, [playerNames.length]);

  const addPlayer = () => {
    if (playerNames.length < 16) {
      setPlayerNames([...playerNames, `Agent ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 3) {
      const newNames = [...playerNames];
      newNames.splice(index, 1);
      setPlayerNames(newNames);
    }
  };

  const updateName = (index: number, val: string) => {
    const newNames = [...playerNames];
    newNames[index] = val;
    setPlayerNames(newNames);
  };

  const handleConfirmReset = () => {
    onResetScores();
    setShowResetConfirm(false);
  };

  const sortedScores = Object.entries(scores).sort((a, b) => (b[1] as number) - (a[1] as number));
  const hasScores = sortedScores.length > 0;
  const totalAssigned = settings.civilsCount + settings.undercoversCount + settings.mrWhitesCount;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-10 z-10 overflow-y-auto cork-texture h-full custom-scroll w-full relative">
      
      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-card p-8 rounded-[40px] w-full max-w-sm border-rose-500/20 shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">{t.confirmResetTitle}</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">{t.confirmResetSub}</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirmReset} className="w-full bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-rose-600/20">{t.confirmBtn}</button>
              <button onClick={() => setShowResetConfirm(false)} className="w-full bg-white/5 hover:bg-white/10 text-slate-400 py-3 rounded-2xl font-black uppercase tracking-widest transition-all text-[10px]">{t.cancelBtn}</button>
            </div>
          </div>
        </div>
      )}

      {showRoleDetail && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-card p-8 rounded-[40px] w-full max-w-sm border-yellow-500/20 shadow-2xl text-center">
            <h3 className="text-xl font-black text-yellow-500 mb-4 uppercase tracking-tighter">{showRoleDetail}</h3>
            <p className="text-white text-sm mb-8 font-medium leading-relaxed">
              {showRoleDetail === t.petitsBeurres && t.rulesCivils}
              {showRoleDetail === t.buttercovers && t.rulesUndercovers}
              {showRoleDetail === t.cremiere && t.rulesMrWhite}
            </p>
            <button onClick={() => setShowRoleDetail(null)} className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl font-black uppercase tracking-widest transition-all text-xs">{t.next}</button>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col flex-1">
        <div className="relative mb-6 sm:mb-12 text-center pt-2 sm:pt-4 animate-in slide-in-from-top duration-700 flex flex-col items-center flex-shrink-0">
          <div className="absolute top-0 left-0 bg-slate-900/40 border border-yellow-500/20 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 animate-pulse group hover:border-yellow-500/50 transition-all cursor-help">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,1)]"></div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{t.archiveCodes}</span>
              <span className="text-[10px] font-black text-white tracking-tighter">{remainingWords} / {totalWords} {t.operationStatus}</span>
            </div>
          </div>

          <Logo className="w-16 h-16 sm:w-24 sm:h-24 mb-3 sm:mb-4 animate-float" />
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black butter-text mb-1 tracking-tighter uppercase italic drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">ButterCover</h1>
          <p className="text-slate-500 font-black text-[9px] sm:text-xs uppercase tracking-[0.6em]">{t.subtitle}</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16 flex-1 w-full">
          <div className="flex flex-col min-h-0 mb-8 lg:mb-0">
            <div className="flex justify-between items-end mb-4 flex-shrink-0">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-yellow-500/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                {t.squad} ({playerNames.length}/16)
              </h2>
              <button onClick={addPlayer} className="bg-yellow-500 text-slate-950 px-5 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-yellow-600/20 hover:bg-yellow-400">
                {t.recruiter}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scroll max-h-[400px] lg:max-h-[60vh]">
              {playerNames.map((name, i) => (
                <div key={i} className="flex gap-2 group animate-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="relative flex-1">
                    <input value={name} onChange={(e) => updateName(i, e.target.value)} className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all font-bold text-sm" />
                  </div>
                  <button onClick={() => removePlayer(i)} className="bg-rose-500/10 text-rose-500 px-3 rounded-xl hover:bg-rose-500/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            <div className="glass-card p-6 sm:p-10 rounded-[40px] animate-in fade-in duration-1000 delay-300 border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-yellow-500 rounded-full"></div>
                <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest text-slate-200">{t.roleAttribution}</h3>
              </div>
              <div className="space-y-5">
                <RoleRow label={t.petitsBeurres} sub={t.petitsBeurresSub} count={settings.civilsCount} 
                         onDec={() => setSettings(s => ({...s, civilsCount: Math.max(1, s.civilsCount - 1)}))}
                         onInc={() => setSettings(s => ({...s, civilsCount: s.civilsCount + 1}))}
                         onInfo={() => setShowRoleDetail(t.petitsBeurres)} />
                <RoleRow label={t.buttercovers} sub={t.buttercoversSub} count={settings.undercoversCount} 
                         onDec={() => setSettings(s => ({...s, undercoversCount: Math.max(0, s.undercoversCount - 1)}))}
                         onInc={() => setSettings(s => ({...s, undercoversCount: s.undercoversCount + 1}))}
                         onInfo={() => setShowRoleDetail(t.buttercovers)} />
                <RoleRow label={t.cremiere} sub={playerNames.length < 5 ? t.minPlayers : t.cremiereSub} count={settings.mrWhitesCount} 
                         onDec={() => setSettings(s => ({...s, mrWhitesCount: 0}))}
                         onInc={() => playerNames.length >= 5 && setSettings(s => ({...s, mrWhitesCount: 1}))} 
                         max={playerNames.length >= 5 ? 1 : 0} disabled={playerNames.length < 5}
                         onInfo={() => setShowRoleDetail(t.cremiere)} />
              </div>
              {totalAssigned !== playerNames.length && (
                <div className="mt-8 bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl flex items-center justify-center gap-2">
                   <span className="animate-bounce">⚠️</span>
                   <p className="text-rose-400 text-[10px] sm:text-xs font-black uppercase tracking-tighter">
                    {t.errorDistribution.replace('{count}', totalAssigned.toString()).replace('{total}', playerNames.length.toString())}
                   </p>
                </div>
              )}
            </div>

            {hasScores && (
              <div className="animate-in fade-in duration-1000 delay-500">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-yellow-500 flex items-center gap-2">
                    <span className="text-lg">🏆</span> {t.leaderboard}
                  </h2>
                  <button onClick={() => setShowResetConfirm(true)} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors">{t.reset}</button>
                </div>
                <div className="glass-card rounded-[32px] p-5 space-y-3 max-h-48 overflow-y-auto custom-scroll border-white/5">
                  {sortedScores.map(([name, score], idx) => (
                    <div key={name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 w-4">{idx + 1}.</span>
                        <span className="font-bold text-sm text-white">{name}</span>
                        {idx === 0 && <span>🥇</span>}
                      </div>
                      <span className="font-black text-yellow-500 text-sm">{score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex-shrink-0 flex justify-center w-full mb-10">
          <button disabled={totalAssigned !== playerNames.length} onClick={() => onStart(playerNames, settings)} className={`w-full max-w-4xl py-5 sm:py-6 rounded-3xl text-xl sm:text-3xl font-black shadow-2xl transition-all active:scale-95 uppercase tracking-widest ${totalAssigned === playerNames.length ? 'bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-yellow-600/30 butter-shimmer scale-100' : 'bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed scale-95'}`}>
            {t.launchMission}
          </button>
        </div>
      </div>
    </div>
  );
};

const RoleRow = ({ label, sub, count, onDec, onInc, onInfo, max = 99, disabled = false }: any) => (
  <div className={`flex items-center justify-between transition-opacity ${disabled ? 'opacity-40' : 'opacity-100'}`}>
    <div className="min-w-0 flex-1 flex flex-col items-start pr-2">
      <div className="flex items-center gap-2">
        <p className="font-black text-sm sm:text-lg text-slate-100 uppercase tracking-tight truncate">{label}</p>
        <button onClick={onInfo} className="w-4 h-4 rounded-full bg-white/10 text-yellow-500 text-[8px] font-black border border-white/5 flex items-center justify-center hover:bg-white/20">?</button>
      </div>
      <p className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider leading-none truncate ${disabled ? 'text-rose-400' : 'text-slate-500'}`}>{sub}</p>
    </div>
    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-2 px-3 border border-white/5 flex-shrink-0">
      <button onClick={onDec} disabled={count <= 0 || disabled} className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white transition-colors ${count <= 0 || disabled ? 'opacity-20 bg-white/5' : 'bg-white/10 hover:bg-white/20'}`}>-</button>
      <span className={`w-6 text-center font-black text-lg sm:text-xl ${count > 0 ? 'text-yellow-400' : 'text-slate-600'}`}>{count}</span>
      <button onClick={onInc} disabled={count >= max || disabled} className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white transition-colors ${count >= max || disabled ? 'opacity-20 bg-white/5' : 'bg-white/10 hover:bg-white/20'}`}>+</button>
    </div>
  </div>
);

export default SetupView;
