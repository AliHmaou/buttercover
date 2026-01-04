
import React, { useState } from 'react';
import { Player } from '../types';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
  player: Player;
  onGuess: (val: string) => void;
}

const MrWhiteGuess: React.FC<Props> = ({ lang, player, onGuess }) => {
  const t = translations[lang];
  const [guess, setGuess] = useState('');

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 animate-in fade-in zoom-in duration-500">
      <div className={`w-32 h-32 rounded-[32px] mb-6 flex items-center justify-center text-white text-6xl font-black shadow-2xl ${player.color}`}>
        {player.name.charAt(0)}
      </div>
      <h2 className="text-2xl font-bold text-slate-400 mb-2 tracking-tight">{player.name}</h2>
      <h1 className="text-4xl font-black text-rose-500 mb-8 uppercase text-center tracking-tighter leading-none">{t.cremiereUnmasked}</h1>
      
      <div className="glass-card p-10 rounded-[40px] w-full max-w-sm flex flex-col items-center border-white/10 shadow-rose-500/10 shadow-2xl">
        <p className="text-slate-400 mb-8 text-center italic text-sm font-medium leading-relaxed">
          {t.lastChance}
        </p>
        
        <div className="w-full relative mb-10">
          <input 
            autoFocus
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t.guessPlaceholder}
            className="w-full bg-transparent text-center text-4xl font-black border-b-4 border-indigo-500/30 py-4 text-white outline-none focus:border-indigo-500 transition-colors uppercase tracking-tighter"
          />
        </div>

        <button 
          onClick={() => onGuess(guess)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-3xl text-xl font-black transition-all shadow-xl active:scale-95 shadow-indigo-600/20"
        >
          {t.guessBtn}
        </button>
      </div>
    </div>
  );
};

export default MrWhiteGuess;
