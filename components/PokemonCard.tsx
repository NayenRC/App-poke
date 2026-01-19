import React from 'react';
import { PokemonListEntry } from '../types';
import { ChevronRight } from 'lucide-react';

interface PokemonCardProps {
  pokemon: PokemonListEntry;
  onClick: (name: string) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div
      onClick={() => onClick(pokemon.name)}
      className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
    >
      <div className="bg-gray-50 rounded-2xl h-40 flex items-center justify-center relative mb-4 group-hover:bg-[#EF5350]/10 transition-colors duration-500">
        <span className="absolute top-3 right-3 text-xs font-black text-gray-300 group-hover:text-[#EF5350]/50 transition-colors">
            #{String(id).padStart(3, '0')}
        </span>
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-32 h-32 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300 z-10"
          loading="lazy"
        />
      </div>
      
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold text-gray-800 capitalize group-hover:text-[#EF5350] transition-colors">
          {pokemon.name}
        </h3>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#EF5350] group-hover:text-white transition-all">
            <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;