
import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
}

const SplashScreen: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-rose-500/5 opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full"></div>

      <div className="relative flex flex-col items-center animate-in zoom-in fade-in duration-1000">
        <Logo className="w-48 h-48 sm:w-72 sm:h-72 animate-float drop-shadow-[0_0_50px_rgba(234,179,8,0.2)]" />
        
        <div className="mt-8 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl font-black butter-text mb-2 tracking-tighter uppercase italic drop-shadow-2xl">
            ButterCover
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-[0.8em] animate-pulse">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-16 w-64 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
            {lang === 'fr' ? 'Initialisation des serveurs...' : 'Server initialization...'}
          </span>
          <span className="text-[8px] font-mono text-yellow-500/40 uppercase">
            {progress < 30 && (lang === 'fr' ? ">> AUTHENTIFICATION..." : ">> AUTHENTICATING...")}
            {progress >= 30 && progress < 60 && (lang === 'fr' ? ">> DECRYPTAGE DES CODES..." : ">> DECRYPTING CODES...")}
            {progress >= 60 && progress < 90 && (lang === 'fr' ? ">> CHARGEMENT DES DOSSIERS..." : ">> LOADING FILES...")}
            {progress >= 90 && (lang === 'fr' ? ">> PRET POUR L'EXTRACTION." : ">> READY FOR EXTRACTION.")}
          </span>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 text-center animate-in slide-in-from-bottom duration-1000 delay-500">
        <p className="text-slate-600 font-black text-[9px] uppercase tracking-[0.5em]">
          Powered by ButterTech Global Systems
        </p>
      </div>

      <style>{`
        .butter-text {
            color: #facc15;
            text-shadow: 0 0 20px rgba(250, 204, 21, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
