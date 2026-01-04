
import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
  players: Player[];
  onVoteComplete: (id: string) => void;
  onVoteFinished?: (votes: Record<string, number>) => void;
  isCountdown: boolean;
  onCountdownFinished: () => void;
  selectablePlayerIds?: string[] | null;
  feedback?: string | null;
}

const VotingView: React.FC<Props> = ({ 
  lang,
  players, 
  onVoteComplete, 
  onVoteFinished,
  isCountdown, 
  onCountdownFinished, 
  selectablePlayerIds = null,
  feedback = null
}) => {
  const t = translations[lang];
  const [countdown, setCountdown] = useState(3);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const activePlayers = players.filter(p => !p.isEliminated);
  const totalVotesAllowed = activePlayers.length;
  const currentTotalVotes = (Object.values(votes) as number[]).reduce((a, b) => a + b, 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isCountdown) {
      setCountdown(3);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            onCountdownFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isCountdown]);

  const handleVote = (playerId: string) => {
    if (selectablePlayerIds && !selectablePlayerIds.includes(playerId)) return;
    if (currentTotalVotes < totalVotesAllowed) {
      setVotes(prev => ({
        ...prev,
        [playerId]: (prev[playerId] || 0) + 1
      }));
    }
  };

  const resetVotes = () => setVotes({});

  const getMaxVoted = () => {
    let max = -1;
    let selectedId = '';
    (Object.entries(votes) as [string, number][]).forEach(([id, count]) => {
      if (count > max) {
        max = count;
        selectedId = id;
      }
    });
    return { id: selectedId, count: max };
  };

  const handleSubmit = () => {
    if (onVoteFinished) {
      onVoteFinished(votes);
    } else {
      const { id } = getMaxVoted();
      onVoteComplete(id);
    }
  };

  if (isCountdown) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a1120] z-50 animate-in fade-in duration-300 p-6">
        <h2 className="text-lg sm:text-xl font-black mb-8 sm:mb-12 uppercase tracking-[0.4em] butter-text text-center">
          {selectablePlayerIds ? t.countdownStrategic : t.countdownInterrogation}
        </h2>
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-[8px] border-yellow-500/10 flex items-center justify-center shadow-[0_0_100px_rgba(234,179,8,0.1)]">
          <span className="text-8xl sm:text-[120px] font-black text-yellow-500 relative z-10">{countdown}</span>
        </div>
        <p className="mt-12 sm:mt-16 text-slate-500 font-black text-center px-4 sm:px-10 leading-tight uppercase tracking-[0.2em] text-[9px] sm:text-[10px]">
          {selectablePlayerIds 
            ? t.countdownSubSuspects 
            : t.countdownSub}
        </p>
      </div>
    );
  }

  if (feedback) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a1120] z-50 animate-in zoom-in duration-500 p-6">
        <div className="glass-card p-6 sm:p-8 rounded-[32px] text-center w-full max-w-xs border-yellow-500/20 shadow-2xl">
          <p className="text-lg sm:text-xl font-black text-yellow-500 uppercase tracking-tighter italic">{feedback}</p>
        </div>
      </div>
    );
  }

  const { id: maxId, count: maxCount } = getMaxVoted();

  return (
    <div className="flex-1 flex flex-col z-10 cork-texture h-full relative">
      <div className="text-center py-3 sm:py-4 px-4 flex-shrink-0">
        <div className="inline-flex items-center gap-3 px-3 py-1.5 sm:px-4 rounded-full glass-card border-yellow-500/20 mb-1">
          <span className="text-[9px] sm:text-[10px] font-black text-yellow-500 tracking-widest uppercase">{t.ballot} : {currentTotalVotes} / {totalVotesAllowed}</span>
        </div>
        {selectablePlayerIds && (
          <p className="text-rose-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">
            ⚠️ {t.suspectZone}
          </p>
        )}
      </div>

      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 p-4 overflow-y-auto pb-44 custom-scroll">
        {players.filter(p => !p.isEliminated).map((player) => {
          const isSelectable = !selectablePlayerIds || selectablePlayerIds.includes(player.id);
          return (
            <div 
              key={player.id}
              className={`relative p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] active:scale-95 group ${
                maxId === player.id && maxCount > 0 ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-white/5 bg-slate-900/50'
              } ${!isSelectable ? 'opacity-10 cursor-not-allowed grayscale' : ''}`}
              onClick={() => isSelectable && handleVote(player.id)}
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black text-white mb-2 shadow-xl ${player.color} transition-transform group-hover:rotate-3 flex-shrink-0`}>
                {player.name.charAt(0)}
              </div>
              <p className="text-white font-black text-[10px] sm:text-xs text-center truncate w-full uppercase tracking-tighter mb-1">{player.name}</p>
              
              <div className="flex flex-wrap justify-center gap-1 h-4">
                {Array.from({ length: votes[player.id] || 0 }).map((_, i) => (
                  <div key={i} className="w-1 h-3.5 sm:w-1.5 sm:h-4 bg-yellow-500 rounded-full animate-in zoom-in"></div>
                ))}
              </div>

              {votes[player.id] > 0 && (
                <span className="absolute top-2 right-3 text-lg sm:text-xl font-black text-yellow-500">{votes[player.id]}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-[#0a1120]/95 backdrop-blur-md border-t border-yellow-500/10 flex flex-col items-center gap-3 z-20">
        <button 
          onClick={resetVotes}
          className="text-slate-500 font-black text-[8px] sm:text-[9px] uppercase tracking-[0.3em] transition-colors hover:text-slate-300 active:scale-90"
        >
          {t.cancelBallot}
        </button>
        <button 
          disabled={currentTotalVotes < totalVotesAllowed}
          onClick={handleSubmit}
          className={`w-full max-w-md py-3.5 sm:py-4 rounded-2xl sm:rounded-[20px] text-base sm:text-lg font-black shadow-2xl transition-all active:scale-95 uppercase tracking-widest ${
            currentTotalVotes >= totalVotesAllowed ? 'bg-rose-600 text-white shadow-rose-600/30' : 'bg-slate-900 text-slate-700'
          }`}
        >
          {t.confirmExile}
        </button>
      </div>
    </div>
  );
};

export default VotingView;
