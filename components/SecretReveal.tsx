
import React, { useState, useEffect } from 'react';
import { Player, Role } from '../types';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
  players: Player[];
  onFinished: () => void;
  onReroll: () => void;
}

const SecretReveal: React.FC<Props> = ({ lang, players, onFinished, onReroll }) => {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayPlayer, setDisplayPlayer] = useState<Player>(players[0]);

  const player = players[currentIndex];

  useEffect(() => {
    if (!isTransitioning && !isRevealed) {
      setDisplayPlayer(players[currentIndex]);
    }
  }, [currentIndex, isTransitioning, isRevealed, players]);

  const handleAction = () => {
    if (isTransitioning) return;

    if (!isRevealed) {
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
      setIsTransitioning(true);
      setTimeout(() => {
        if (currentIndex < players.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setIsTransitioning(false);
        } else {
          onFinished();
        }
      }, 600);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 cork-texture">
      <div className={`text-center mb-10 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100'}`}>
        <div className="inline-block px-3 py-1 bg-yellow-500 text-slate-950 font-black text-[9px] uppercase tracking-[0.3em] rounded mb-4 shadow-lg">
          {t.confidential} {currentIndex + 1} / {players.length}
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">
          {isTransitioning ? displayPlayer.name : player.name}
        </h1>
      </div>

      <div 
        onClick={handleAction}
        className={`relative w-full aspect-[4/5] max-w-xs perspective-1000 cursor-pointer group transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-50' : 'opacity-100'}`}
      >
        <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
          
          <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[32px] flex flex-col items-center justify-center border-4 border-yellow-500/30 p-8 shadow-2xl">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-float">
               <svg className="w-10 h-10 text-slate-950" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            <p className="text-yellow-500 text-xl font-black text-center mb-2 uppercase tracking-tighter">{t.accessBriefing.split(' ')[0]}<br/>{t.accessBriefing.split(' ').slice(1).join(' ')}</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic text-center">{t.forbidden}</p>
          </div>

          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fefce8] rounded-[32px] flex flex-col items-center justify-center p-8 text-slate-950 border-[12px] border-yellow-400/20 shadow-2xl">
            <div className={`relative w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-white text-3xl font-black ${displayPlayer.color} shadow-lg`}>
              {displayPlayer.name.charAt(0)}
            </div>
            
            <div className="w-full h-px bg-slate-200 mb-6"></div>

            <>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">{lang === 'fr' ? 'Code Secret' : 'Secret Code'}</p>
              {displayPlayer.role === Role.MR_WHITE ? (
                <div className="text-center animate-in zoom-in duration-300">
                  <div className="stamp text-rose-600 text-4xl mb-2">{t.unknown}</div>
                  <p className="text-slate-500 font-black text-[10px] uppercase mt-2">{t.cremiere}</p>
                </div>
              ) : (
                <div className="text-center animate-in zoom-in duration-300">
                  <p className="text-5xl font-black text-slate-900 uppercase tracking-tighter break-words px-2 leading-none mb-1">
                    {displayPlayer.word}
                  </p>
                  <div className="w-full h-1 bg-yellow-400/50 mt-2"></div>
                </div>
              )}
            </>

            <div className="mt-12 text-slate-400 animate-pulse font-black text-[10px] uppercase tracking-widest">
              {t.finished}
            </div>
          </div>
        </div>
      </div>

      {currentIndex === 0 && !isRevealed && !isTransitioning && (
        <button onClick={(e) => { e.stopPropagation(); onReroll(); }} className="mt-8 flex items-center gap-2 px-5 py-3 rounded-2xl glass-card border-yellow-500/30 text-yellow-500 hover:text-white hover:bg-yellow-500/20 transition-all font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 shadow-lg animate-in slide-in-from-bottom duration-700 delay-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {t.changeCodes}
        </button>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default SecretReveal;
