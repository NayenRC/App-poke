import React, { useState, useEffect } from 'react';
import { fetchRandomPokemonForGame } from '../services/api';
import { PokemonDetail } from '../types';
import { Loader2, Trophy, ArrowRight, RefreshCw, LogIn } from 'lucide-react';

interface IntroGameProps {
  onComplete: () => void;
}

const IntroGame: React.FC<IntroGameProps> = ({ onComplete }) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'revealed'>('playing');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const loadNewRound = async () => {
    setLoading(true);
    setGameState('playing');
    try {
      const data = await fetchRandomPokemonForGame();
      setPokemon(data.pokemon);
      setOptions(data.options);
    } catch (error) {
      onComplete(); // Skip if error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewRound();
  }, []);

  const handleGuess = (guess: string) => {
    if (gameState !== 'playing' || !pokemon) return;
    
    const correct = guess === pokemon.name;
    setIsCorrect(correct);
    setGameState('revealed');
    
    if (correct) {
      setScore(s => s + 10);
    } else {
      setScore(0); // Reset score on failure, or could keep it.
    }
  };

  const handleNextRound = () => {
    setRound(r => r + 1);
    loadNewRound();
  };

  if (loading && round === 1) {
    return (
      <div className="min-h-screen bg-[#EF5350] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-2xl font-bold tracking-wider">LOADING GAME...</h2>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="min-h-screen bg-[#EF5350] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold uppercase tracking-wider text-yellow-400">
            Who's That Pokémon?
          </h1>
          <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
            <Trophy size={16} className="text-yellow-400" />
            <span className="font-mono font-bold">{score} pts</span>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-400 via-gray-100 to-gray-100"></div>
            
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt="Mystery"
              className={`w-48 h-48 object-contain transition-all duration-700 z-10 ${
                gameState === 'playing' 
                  ? 'brightness-0 blur-sm scale-90 contrast-200' 
                  : 'brightness-100 blur-0 scale-110 drop-shadow-xl'
              }`}
            />
        </div>

        {/* Feedback Section */}
        {gameState === 'revealed' && (
          <div className={`p-3 text-center text-white font-bold animate-fade-in ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
            {isCorrect ? "It's correct!" : `Oh no! It's ${pokemon.name}!`}
          </div>
        )}

        {/* Options / Controls */}
        <div className="p-6 bg-white">
          {gameState === 'playing' ? (
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGuess(option)}
                  className="py-3 px-2 bg-gray-50 hover:bg-[#EF5350] hover:text-white border border-gray-200 rounded-xl font-semibold text-gray-700 capitalize transition-all active:scale-95 shadow-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold capitalize text-gray-800 mb-1">{pokemon.name}</h2>
                <div className="flex justify-center gap-2">
                   {pokemon.types.map(t => (
                       <span key={t.type.name} className="px-2 py-0.5 bg-gray-200 rounded text-xs uppercase font-bold text-gray-600">{t.type.name}</span>
                   ))}
                </div>
              </div>

              <button
                onClick={handleNextRound}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Play Next Round
              </button>
              
              <button
                onClick={onComplete}
                className="w-full py-3 bg-[#EF5350] hover:bg-red-600 text-white rounded-xl font-bold shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Enter Pokédex
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroGame;