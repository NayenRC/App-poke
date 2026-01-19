// Define the basic structure for a Pokemon in the list view
export interface PokemonListEntry {
  name: string;
  url: string;
}

// API Response for the list endpoint
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListEntry[];
}

// Interface for a specific Type (e.g., "fire")
export interface PokemonTypeEntry {
  name: string;
  url: string;
}

export interface PokemonTypesResponse {
  results: PokemonTypeEntry[];
}

// Interface for the response when fetching pokemon by type
export interface TypeDetailResponse {
  pokemon: {
    pokemon: PokemonListEntry;
  }[];
}

// Detailed structure for a single Pokemon
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
}

// Color mapping for Pokemon types
export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-800',
  dragon: 'bg-indigo-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};