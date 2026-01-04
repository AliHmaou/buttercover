
import React from 'react';
import Logo from './Logo';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
}

const TransitionOverlay: React.FC<Props> = ({ lang }) => {
  const isFR = lang === 'fr';
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-slate-950/20 backdrop-blur-[2px]">
      <div className="animate-butter-swoosh flex flex-col items-center">
        <Logo className="w-48 h-48 sm:w-64 sm:h-64" />
        <div className="mt-4 flex flex-col items-center">
          <span className="text-yellow-500 font-black text-2xl uppercase tracking-[1em] italic drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">BUTTER</span>
          <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] mt-2">
            {isFR ? 'CALCUL DES COORDONNÉES...' : 'CALCULATING COORDINATES...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransitionOverlay;
