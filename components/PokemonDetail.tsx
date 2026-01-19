import React, { useEffect, useState } from 'react';
import { PokemonDetail as PokemonDetailType, TYPE_COLORS } from '../types';
import { fetchPokemonDetail } from '../services/api';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { ArrowLeft, Ruler, Weight, Activity, Zap } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

interface PokemonDetailProps {
  pokemonName: string;
  onBack: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonName, onBack }) => {
  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonDetail(pokemonName);
        setPokemon(data);
      } catch (err) {
        setError('Failed to load Pokémon details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [pokemonName]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={onBack} />;
  if (!pokemon) return null;

  const statData = pokemon.stats.map(s => ({
    subject: s.stat.name.replace('-', ' ').toUpperCase(),
    A: s.base_stat,
    fullMark: 150,
  }));

  const mainType = pokemon.types[0]?.type.name || 'normal';
  // Fallback for header color if type not found, but we prefer a dynamic color based on type
  const typeColor = TYPE_COLORS[mainType] || 'bg-gray-500';

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-500 hover:text-[#EF5350] font-bold transition-colors group"
      >
        <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back to List
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Dynamic Header */}
        <div className={`${typeColor} p-8 md:p-12 text-white relative overflow-hidden`}>
           {/* Big Type Icon / Watermark could go here */}
           <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="relative group">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-75 group-hover:scale-100 transition-transform duration-700"></div>
                  <img
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl z-10"
                  />
              </div>

              <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 bg-black/20 rounded-full text-sm font-bold backdrop-blur-sm mb-2">
                      #{String(pokemon.id).padStart(3, '0')}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black capitalize mb-4 tracking-tight drop-shadow-sm">
                      {pokemon.name}
                  </h1>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                      {pokemon.types.map((t) => (
                        <span key={t.type.name} className="px-4 py-1.5 bg-white/25 backdrop-blur-md rounded-lg font-bold uppercase text-sm border border-white/20 shadow-sm">
                            {t.type.name}
                        </span>
                      ))}
                  </div>
              </div>
           </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1: Physical & Abilities */}
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center">
                            <Activity size={20} className="mr-2 text-[#EF5350]" /> Physical
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                <span className="text-gray-400 text-xs font-bold uppercase block mb-1">Height</span>
                                <div className="text-xl font-bold text-gray-800 flex justify-center items-center">
                                    <Ruler size={16} className="mr-1 text-gray-400" /> {pokemon.height / 10}m
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                <span className="text-gray-400 text-xs font-bold uppercase block mb-1">Weight</span>
                                <div className="text-xl font-bold text-gray-800 flex justify-center items-center">
                                    <Weight size={16} className="mr-1 text-gray-400" /> {pokemon.weight / 10}kg
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center">
                            <Zap size={20} className="mr-2 text-yellow-500" /> Abilities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                             {pokemon.abilities.map(a => (
                                 <span key={a.ability.name} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 capitalize shadow-sm">
                                     {a.ability.name.replace('-', ' ')}
                                 </span>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Stats Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-gray-900 font-bold text-lg mb-6">Base Statistics</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statData} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <XAxis type="number" hide domain={[0, 200]} />
                                <YAxis 
                                    dataKey="subject" 
                                    type="category" 
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} 
                                    width={100}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="A" radius={[0, 100, 100, 0]} barSize={12}>
                                    {statData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.A > 90 ? '#10B981' : entry.A > 60 ? '#3B82F6' : '#EF5350'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;