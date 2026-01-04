
import React from 'react';
import { Role } from '../types';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
  winner: { role: Role | 'TIE', message: string, winnerNames: string[] };
  civilWord: string;
  onReset: () => void;
}

const VictoryScreen: React.FC<Props> = ({ lang, winner, civilWord, onReset }) => {
  const t = translations[lang];
  const isCivil = winner.role === Role.CIVIL;
  const isUndercover = winner.role === Role.UNDERCOVER;
  const isMrWhite = winner.role === Role.MR_WHITE;
  
  const winnerTitle = isCivil 
    ? t.victoryCivils 
    : isUndercover 
      ? t.victoryUndercovers 
      : isMrWhite 
        ? t.victoryCremiere 
        : t.victoryTie;

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-8 text-white text-center bg-[#0a1120] z-50 cork-texture h-full w-full overflow-y-auto`}>
      <div className="mb-8 relative flex flex-col items-center">
        <div className={`stamp ${isCivil ? 'text-yellow-500' : 'text-rose-600'} text-5xl mb-6 shadow-2xl border-8 animate-in zoom-in duration-500`}>
          {isCivil ? t.missionSuccess : t.compromised}
        </div>
        <div className="text-[100px] animate-float relative z-10">
          {isCivil ? '👮' : isUndercover ? '🕵️' : '🍦'}
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-black mb-2 uppercase tracking-tighter italic butter-text">{winnerTitle}</h1>
      
      {winner.winnerNames.length > 0 && (
        <p className="text-sm font-bold text-yellow-500/80 uppercase tracking-widest mb-4">
          ({winner.winnerNames.join(', ')})
        </p>
      )}

      <h2 className="text-[10px] sm:text-xs font-bold mb-10 text-slate-400 uppercase tracking-[0.3em] max-w-xs">{winner.message}</h2>
      
      <div className="glass-card p-6 rounded-[32px] border-yellow-500/20 mb-10 w-full max-w-sm animate-in zoom-in duration-1000">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{t.operationalCode}</p>
        <p className="text-4xl font-black uppercase tracking-tighter text-white">{civilWord}</p>
      </div>

      <div className="space-y-4 w-full max-w-sm animate-in fade-in duration-1000 delay-500">
        <button 
          onClick={onReset}
          className="w-full bg-yellow-500 text-slate-950 py-4 rounded-[20px] text-xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest butter-shimmer"
        >
          {t.newMission}
        </button>
        <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.5em]">{t.subtitle}</p>
      </div>
    </div>
  );
};

export default VictoryScreen;
