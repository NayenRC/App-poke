import { PokemonListResponse, PokemonDetail, PokemonTypesResponse, TypeDetailResponse, PokemonListEntry } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches a paginated list of Pokemon.
 */
export const fetchPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error(`Error fetching list: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Fetches details for a specific Pokemon by name or ID.
 */
export const fetchPokemonDetail = async (nameOrId: string | number): Promise<PokemonDetail> => {
  try {
    const query = String(nameOrId).toLowerCase();
    const response = await fetch(`${BASE_URL}/pokemon/${query}`);
    if (!response.ok) throw new Error('Pokemon not found');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Fetches all available Pokemon types (fire, water, etc.)
 */
export const fetchPokemonTypes = async (): Promise<PokemonTypesResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/type`);
    if (!response.ok) throw new Error('Failed to fetch types');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Fetches all pokemon belonging to a specific type.
 * Note: This returns a large list, we will handle pagination on the client side for types.
 */
export const fetchPokemonByType = async (type: string): Promise<PokemonListEntry[]> => {
  try {
    const response = await fetch(`${BASE_URL}/type/${type}`);
    if (!response.ok) throw new Error(`Failed to fetch type: ${type}`);
    const data: TypeDetailResponse = await response.json();
    // Normalize the data structure to match PokemonListEntry
    return data.pokemon.map(p => p.pokemon);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Helper to fetch a random Pokemon for the intro game (Restricted to Gen 1 for simpler recognition)
 */
export const fetchRandomPokemonForGame = async (): Promise<{ pokemon: PokemonDetail, options: string[] }> => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const correctPokemon = await fetchPokemonDetail(randomId);
  
  // Generate 3 random distractor names
  const options = new Set<string>();
  options.add(correctPokemon.name);
  
  while (options.size < 4) {
    const randomDistractorId = Math.floor(Math.random() * 151) + 1;
    if (randomDistractorId !== randomId) {
      try {
        // We just need a name here, doing a lightweight fetch or using a known list is better, 
        // but for simplicity we fetch the detail.
        const distractor = await fetchPokemonDetail(randomDistractorId);
        options.add(distractor.name);
      } catch (e) {
        // ignore error and try again
      }
    }
  }

  return {
    pokemon: correctPokemon,
    options: Array.from(options).sort(() => Math.random() - 0.5) // Shuffle
  };
};