
import React from 'react';
import { Player, Role } from '../types';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
  players: Player[];
  startingPlayerId: string | null;
  onStartVoting: () => void;
}

const GameBoard: React.FC<Props> = ({ lang, players, startingPlayerId, onStartVoting }) => {
  const t = translations[lang];
  const threatsLeft = players.filter(p => !p.isEliminated && (p.role !== Role.CIVIL)).length;

  return (
    <div className="flex-1 flex flex-col z-10 cork-texture h-full relative">
      <div className="p-4 sm:p-6 pb-2 flex justify-between items-center animate-in slide-in-from-top duration-500 flex-shrink-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black butter-text tracking-tighter uppercase italic leading-tight">{t.mission}</h2>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.phaseInfo}</p>
        </div>
        <div className="glass-card px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-yellow-500/20 text-center">
          <p className="text-[7px] sm:text-[8px] font-black text-rose-500 uppercase tracking-widest">{t.infiltrated}</p>
          <p className="text-lg sm:text-xl font-black text-white leading-none">{threatsLeft}</p>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-5 overflow-y-auto pb-32 custom-scroll">
        {players.map((player, idx) => (
          <div 
            key={player.id} 
            className={`flex flex-col items-center transition-all duration-700 ${player.isEliminated ? 'opacity-20 scale-90 grayscale' : 'animate-in zoom-in duration-500'}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-[18px] sm:rounded-[20px] flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-xl relative transition-transform hover:rotate-2 ${player.color} ${player.id === startingPlayerId && !player.isEliminated ? 'ring-2 ring-yellow-500 ring-offset-4 ring-offset-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : ''}`}>
              {player.name.charAt(0)}
              
              {!player.isEliminated && player.turnPosition && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full ${player.id === startingPlayerId ? 'bg-white text-slate-950 scale-110' : 'bg-yellow-500 text-slate-950'} flex items-center justify-center text-[10px] sm:text-xs font-black shadow-lg border-2 border-slate-950 transition-all`}>
                  {player.turnPosition}
                </div>
              )}

              {player.isEliminated && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-[18px] sm:rounded-[20px]">
                  <div className="stamp border-rose-600 text-rose-600 text-[6px] sm:text-[8px] px-1 py-0.5 border-2">{t.outOfService}</div>
                </div>
              )}
            </div>
            <p className={`mt-2 text-[9px] sm:text-[10px] lg:text-xs font-black truncate w-full text-center uppercase tracking-tighter ${player.id === startingPlayerId && !player.isEliminated ? 'text-yellow-500' : 'text-slate-300'}`}>
              {player.name}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-[#0a1120] via-[#0a1120]/95 to-transparent z-20">
        <button 
          onClick={onStartVoting}
          className="w-full max-w-md mx-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 py-3.5 sm:py-4 rounded-2xl sm:rounded-[20px] text-lg sm:text-xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group uppercase tracking-widest"
        >
          <span>⚖️</span> 
          <span>{t.openVoting}</span>
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
