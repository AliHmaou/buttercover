
import React from 'react';
import { Language, translations } from '../i18n';

interface Props {
  lang: Language;
  onClose: () => void;
}

const RuleBook: React.FC<Props> = ({ lang, onClose }) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-lg glass-card rounded-[40px] p-8 border-yellow-500/20 shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scroll">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black butter-text uppercase italic tracking-tighter mb-6">{t.rulesTitle}</h2>
        
        <p className="text-slate-300 font-medium mb-8 leading-relaxed">
          {t.rulesIntro}
        </p>

        <div className="space-y-6 mb-10">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex-shrink-0 flex items-center justify-center text-2xl shadow-lg">🍪</div>
            <div>
              <h3 className="text-white font-black uppercase text-sm mb-1 tracking-tight">{t.petitsBeurres}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{t.rulesCivils}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 flex-shrink-0 flex items-center justify-center text-2xl shadow-lg">🕵️</div>
            <div>
              <h3 className="text-white font-black uppercase text-sm mb-1 tracking-tight">{t.buttercovers}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{t.rulesUndercovers}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 flex-shrink-0 flex items-center justify-center text-2xl shadow-lg">🍦</div>
            <div>
              <h3 className="text-white font-black uppercase text-sm mb-1 tracking-tight">{t.cremiere}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{t.rulesMrWhite}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-3xl">
          <p className="text-yellow-500 font-black uppercase text-xs text-center tracking-[0.2em]">
            {t.rulesGoal}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RuleBook;
