
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Role, Player, GameState, GameSettings } from './types';
import { PLAYER_COLORS } from './constants';
import SetupView from './components/SetupView';
import SecretReveal from './components/SecretReveal';
import GameBoard from './components/GameBoard';
import VotingView from './components/VotingView';
import MrWhiteGuess from './components/MrWhiteGuess';
import VictoryScreen from './components/VictoryScreen';
import TransitionOverlay from './components/TransitionOverlay';
import SplashScreen from './components/SplashScreen';
import RuleBook from './components/RuleBook';
import { Language, translations, WordPair } from './i18n';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bettercover_lang');
    return (saved as Language) || (navigator.language.startsWith('fr') ? 'fr' : 'en');
  });
  
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showRules, setShowRules] = useState(false);
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    civilsCount: 2,
    undercoversCount: 1,
    mrWhitesCount: 0
  });
  const [currentWordPair, setCurrentWordPair] = useState<WordPair | null>(null);
  const [usedWordIndexes, setUsedWordIndexes] = useState<number[]>(() => {
    const saved = localStorage.getItem('bettercover_used_words');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('bettercover_scores');
    return saved ? JSON.parse(saved) : {};
  });

  const [eliminatedPlayerId, setEliminatedPlayerId] = useState<string | null>(null);
  const [startingPlayerId, setStartingPlayerId] = useState<string | null>(null);
  const [winner, setWinner] = useState<{ role: Role | 'TIE', message: string, winnerNames: string[] } | null>(null);
  
  const [reducedPlayerIds, setReducedPlayerIds] = useState<string[] | null>(null);
  const [votingFeedback, setVotingFeedback] = useState<string | null>(null);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    localStorage.setItem('bettercover_lang', lang);
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('bettercover_used_words', JSON.stringify(usedWordIndexes));
  }, [usedWordIndexes]);

  useEffect(() => {
    localStorage.setItem('bettercover_scores', JSON.stringify(scores));
  }, [scores]);

  const transitionTo = useCallback((nextState: GameState, delay: number = 1500) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGameState(nextState);
    }, delay);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 3000);
  }, []);

  const updateScores = useCallback((winningRole: Role) => {
    setScores(prev => {
      const newScores = { ...prev };
      players.forEach(p => {
        if (!newScores[p.name]) newScores[p.name] = 0;
        
        if (winningRole === Role.UNDERCOVER && p.role === Role.UNDERCOVER) {
          newScores[p.name] += 10;
        } else if (winningRole === Role.MR_WHITE && p.role === Role.MR_WHITE) {
          newScores[p.name] += 10;
        } else if (winningRole === Role.CIVIL && p.role === Role.CIVIL) {
          newScores[p.name] += 2;
        }
      });
      return newScores;
    });
  }, [players]);

  const resetScores = () => {
    setScores({});
    localStorage.removeItem('bettercover_scores');
  };

  const pickRandomWordPair = useCallback(() => {
    const wordList = translations[lang].words;
    let availableIndexes = wordList.map((_, i) => i).filter(i => !usedWordIndexes.includes(i));
    if (availableIndexes.length === 0) {
      availableIndexes = wordList.map((_, i) => i);
      setUsedWordIndexes([]);
    }
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    setUsedWordIndexes(prev => [...prev, randomIndex]);
    return wordList[randomIndex];
  }, [usedWordIndexes, lang]);

  const handleRerollWords = useCallback(() => {
    const pair = pickRandomWordPair();
    setCurrentWordPair(pair);
    setPlayers(prev => prev.map(p => ({
      ...p,
      word: p.role === Role.CIVIL ? pair.civil : (p.role === Role.UNDERCOVER ? pair.undercover : '')
    })));
  }, [pickRandomWordPair]);

  const startGame = (playerNames: string[], setupSettings: GameSettings) => {
    const pair = pickRandomWordPair();
    setCurrentWordPair(pair);

    const roles: Role[] = [
      ...Array(setupSettings.civilsCount).fill(Role.CIVIL),
      ...Array(setupSettings.undercoversCount).fill(Role.UNDERCOVER),
      ...Array(setupSettings.mrWhitesCount).fill(Role.MR_WHITE),
    ];

    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    const initialPlayers: Player[] = playerNames.map((name, index) => ({
      id: `p-${index}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      role: roles[index],
      word: roles[index] === Role.CIVIL ? pair.civil : (roles[index] === Role.UNDERCOVER ? pair.undercover : ''),
      isEliminated: false,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length]
    }));

    const nonMrWhitePlayers = initialPlayers.filter(p => p.role !== Role.MR_WHITE);
    const starter = nonMrWhitePlayers[Math.floor(Math.random() * nonMrWhitePlayers.length)];
    
    const others = initialPlayers.filter(p => p.id !== starter.id);
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }
    
    const orderedSequence = [starter, ...others];
    const finalPlayersWithOrder = initialPlayers.map(p => {
      const pos = orderedSequence.findIndex(op => op.id === p.id);
      return { ...p, turnPosition: pos + 1 };
    });

    setStartingPlayerId(starter.id);
    setPlayers(finalPlayersWithOrder);
    setSettings(setupSettings);
    transitionTo('REVEAL');
  };

  const checkVictory = useCallback((currentPlayers: Player[]) => {
    const activePlayers = currentPlayers.filter(p => !p.isEliminated);
    const civils = activePlayers.filter(p => p.role === Role.CIVIL);
    const undercovers = activePlayers.filter(p => p.role === Role.UNDERCOVER);
    const mrWhites = activePlayers.filter(p => p.role === Role.MR_WHITE);

    if (undercovers.length > 0 && undercovers.length >= civils.length) {
      const winners = currentPlayers.filter(p => p.role === Role.UNDERCOVER).map(p => p.name);
      setWinner({ role: Role.UNDERCOVER, message: t.victoryUndercovers, winnerNames: winners });
      updateScores(Role.UNDERCOVER);
      transitionTo('GAME_OVER');
      return true;
    }

    if (undercovers.length === 0 && mrWhites.length === 0) {
      const winners = currentPlayers.filter(p => p.role === Role.CIVIL).map(p => p.name);
      setWinner({ role: Role.CIVIL, message: t.victoryCivils, winnerNames: winners });
      updateScores(Role.CIVIL);
      transitionTo('GAME_OVER');
      return true;
    }

    return false;
  }, [players, updateScores, transitionTo, t]);

  const handleEliminate = (id: string) => {
    const player = players.find(p => p.id === id);
    if (!player) return;

    const newPlayers = players.map(p => 
      p.id === id ? { ...p, isEliminated: true } : p
    );
    setPlayers(newPlayers);
    setEliminatedPlayerId(id);
    setReducedPlayerIds(null);

    const survivors = newPlayers.filter(p => !p.isEliminated);
    if (survivors.length > 0) {
      const randomSurvivor = survivors[Math.floor(Math.random() * survivors.length)];
      setStartingPlayerId(randomSurvivor.id);
    }

    if (player.role === Role.MR_WHITE) {
      transitionTo('MR_WHITE_GUESS');
    } else {
      transitionTo('ELIMINATION_RESULT');
    }
  };

  const handleVoteFinished = (votes: Record<string, number>) => {
    const voteValues = Object.values(votes);
    if (voteValues.length === 0) return;
    const maxVotes = Math.max(...voteValues);
    const winners = Object.keys(votes).filter(id => votes[id] === maxVotes);

    if (winners.length === 1) {
      handleEliminate(winners[0]);
    } else {
      const isPersistentTie = reducedPlayerIds && 
                             reducedPlayerIds.length === winners.length && 
                             winners.every(id => reducedPlayerIds.includes(id));

      if (isPersistentTie) {
        setVotingFeedback(lang === 'fr' ? "Égalité persistante !" : "Tie continues!");
        setTimeout(() => {
          setVotingFeedback(null);
          transitionTo('DISCUSSION');
          setReducedPlayerIds(null);
        }, 3000);
      } else {
        setReducedPlayerIds(winners);
        setVotingFeedback(lang === 'fr' ? "Égalité ! Nouveau vote." : "Tie! Vote again.");
        setTimeout(() => {
          setVotingFeedback(null);
          setGameState('VOTING');
        }, 3000);
      }
    }
  };

  const resetGame = () => {
    transitionTo('SETUP');
    setPlayers([]);
    setEliminatedPlayerId(null);
    setWinner(null);
    setStartingPlayerId(null);
    setReducedPlayerIds(null);
  };

  function handleMrWhiteGuess(guess: string) {
    if (currentWordPair && guess.toLowerCase().trim() === currentWordPair.civil.toLowerCase().trim()) {
      const winners = players.filter(p => p.role === Role.MR_WHITE).map(p => p.name);
      setWinner({ role: Role.MR_WHITE, message: t.victoryCremiere, winnerNames: winners });
      updateScores(Role.MR_WHITE);
      transitionTo('GAME_OVER');
    } else {
      if (!checkVictory(players)) transitionTo('ELIMINATION_RESULT');
    }
  }

  if (showSplash) {
    return <SplashScreen lang={lang} />;
  }

  const eliminatedPlayer = players.find(p => p.id === eliminatedPlayerId);

  return (
    <div className="flex flex-col h-[100dvh] w-screen relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-rose-500/10 pointer-events-none"></div>
      
      {isTransitioning && <TransitionOverlay lang={lang} />}
      {showRules && <RuleBook lang={lang} onClose={() => setShowRules(false)} />}

      {/* Global Utilities - Top Right */}
      <div className="absolute top-4 right-4 z-[80] flex gap-2">
        <button 
          onClick={() => setShowRules(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass-card border-white/10 text-yellow-500 text-lg active:scale-90 transition-all"
        >
          ℹ️
        </button>
        <button 
          onClick={() => {
             setLang(l => l === 'fr' ? 'en' : 'fr');
             setUsedWordIndexes([]); // Reset indexes on lang change to ensure fresh list usage
          }}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass-card border-white/10 text-white font-black text-xs uppercase active:scale-90 transition-all"
        >
          {lang}
        </button>
      </div>

      <div className="flex-1 flex flex-col w-full h-full relative z-10">
        {gameState === 'SETUP' && (
          <SetupView 
            lang={lang}
            onStart={startGame} 
            scores={scores} 
            onResetScores={resetScores}
            remainingWords={translations[lang].words.length - usedWordIndexes.length}
            totalWords={translations[lang].words.length}
          />
        )}
        {gameState === 'REVEAL' && (
          <SecretReveal 
            lang={lang}
            players={players} 
            onFinished={() => transitionTo('DISCUSSION')} 
            onReroll={handleRerollWords}
          />
        )}
        {gameState === 'DISCUSSION' && (
          <GameBoard 
            lang={lang}
            players={players} 
            startingPlayerId={startingPlayerId} 
            onStartVoting={() => setGameState('VOTING_COUNTDOWN')} 
          />
        )}
        {(gameState === 'VOTING_COUNTDOWN' || gameState === 'VOTING') && (
          <VotingView 
            lang={lang}
            players={players} 
            onVoteComplete={(id) => handleEliminate(id)} 
            onVoteFinished={handleVoteFinished}
            isCountdown={gameState === 'VOTING_COUNTDOWN'}
            onCountdownFinished={() => setGameState('VOTING')}
            selectablePlayerIds={reducedPlayerIds}
            feedback={votingFeedback}
          />
        )}
        {gameState === 'MR_WHITE_GUESS' && eliminatedPlayerId && (
          <MrWhiteGuess lang={lang} player={players.find(p => p.id === eliminatedPlayerId)!} onGuess={handleMrWhiteGuess} />
        )}
        {gameState === 'ELIMINATION_RESULT' && eliminatedPlayer && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 z-10 animate-in fade-in zoom-in duration-500 overflow-y-auto">
            <div className="glass-card p-6 sm:p-10 rounded-[40px] text-center w-full max-w-sm border-white/20 relative overflow-hidden bg-slate-900/40">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] rotate-[-25deg] scale-125">
                 <span className="text-8xl sm:text-9xl font-black text-white border-[10px] border-white p-6 uppercase tracking-widest">{t.eliminated}</span>
              </div>
              <div className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full mx-auto flex items-center justify-center text-4xl sm:text-6xl text-white mb-6 shadow-2xl relative z-10 ${eliminatedPlayer.color}`}>
                {eliminatedPlayer.name.charAt(0)}
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white relative z-10 tracking-tight">{eliminatedPlayer.name}</h2>
              <div className="relative z-10 border-2 border-dashed border-sky-400/40 rounded-xl p-4 mb-6">
                <div className="inline-block px-8 py-3 rounded-full bg-rose-900/60 text-rose-100 font-black text-xs sm:text-sm uppercase tracking-widest border border-rose-500/30">
                  {lang === 'fr' ? eliminatedPlayer.role : (eliminatedPlayer.role === Role.CIVIL ? 'Butter Cookie' : eliminatedPlayer.role)}
                </div>
              </div>
              <p className="text-white font-bold text-lg sm:text-xl mb-8 relative z-10 leading-snug">
                {eliminatedPlayer.name} {t.was} <br/>
                <span className="text-yellow-500">{lang === 'fr' ? eliminatedPlayer.role : (eliminatedPlayer.role === Role.CIVIL ? 'Butter Cookie' : eliminatedPlayer.role)} !</span>
              </p>
              <button 
                onClick={() => { if (!checkVictory(players)) transitionTo('DISCUSSION'); }}
                className="w-full bg-yellow-500 text-slate-950 px-8 py-4 sm:py-5 rounded-[24px] text-xl sm:text-2xl font-black transition-all shadow-lg active:scale-95 shadow-yellow-600/30 relative z-10"
              >
                {t.next}
              </button>
            </div>
          </div>
        )}
        {gameState === 'GAME_OVER' && winner && (
          <VictoryScreen 
            lang={lang}
            winner={winner} 
            civilWord={currentWordPair?.civil || ''} 
            onReset={resetGame} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
