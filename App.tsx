import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { fetchPokemonList, fetchPokemonTypes, fetchPokemonByType, fetchPokemonDetail } from './services/api';
import { PokemonListEntry, PokemonTypeEntry } from './types';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import IntroGame from './components/IntroGame';
import { Search, ChevronLeft, ChevronRight, Filter, Disc, X } from 'lucide-react';

// --- Home Component (List View with Filtering) ---
const Home: React.FC = () => {
  // Data States
  const [displayList, setDisplayList] = useState<PokemonListEntry[]>([]);
  const [types, setTypes] = useState<PokemonTypeEntry[]>([]);
  
  // UI/Control States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  // Logic States for Type Filtering
  const [allTypePokemon, setAllTypePokemon] = useState<PokemonListEntry[]>([]);
  
  const navigate = useNavigate();
  const LIMIT = 24;

  // 1. Load available types on mount
  useEffect(() => {
    fetchPokemonTypes().then(data => setTypes(data.results)).catch(console.error);
  }, []);

  // 2. Main Data Loading Logic
  const loadPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedType) {
        // --- MODE A: Filtered by Type (+ Optional Client-side Search) ---
        let currentList = allTypePokemon;
        
        // If we haven't fetched this type's list yet, fetch it entirely
        if (currentList.length === 0) {
            const list = await fetchPokemonByType(selectedType);
            setAllTypePokemon(list);
            currentList = list;
        }

        // Apply Search Filter on Client Side if exists
        if (searchTerm) {
            currentList = currentList.filter(p => p.name.includes(searchTerm.toLowerCase()));
        }
        
        // Client-side pagination
        const sliced = currentList.slice(offset, offset + LIMIT);
        setDisplayList(sliced);

      } else {
        // --- MODE B: Global List (Server-side Pagination) ---
        // Note: API doesn't support global partial search. 
        // If search term is present in Global mode, we don't show the paginated list,
        // we show a specific UI Prompt in the render section.
        if (!searchTerm) {
            const data = await fetchPokemonList(LIMIT, offset);
            setDisplayList(data.results);
        }
      }
    } catch (err) {
      setError('Failed to load Pokémon. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [offset, selectedType, allTypePokemon, searchTerm]); 

  // Trigger load when parameters change
  useEffect(() => {
    // Debounce search slightly to avoid flickering on type filter
    const timer = setTimeout(() => {
        loadPokemon();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadPokemon]);

  // Handle Type Change
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setOffset(0); // Reset to page 1
    setAllTypePokemon([]); // Clear cache for new type fetch
    // Note: We keep searchTerm to allow "Fire" + "Char" combination
  };

  // Handle Global Search Submission (Direct Jump)
  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // In global mode, we try to fetch directly
    setLoading(true);
    try {
        await fetchPokemonDetail(searchTerm.toLowerCase());
        navigate(`/pokemon/${searchTerm.toLowerCase()}`);
    } catch (e) {
        setError(`Pokémon "${searchTerm}" not found.`);
        setLoading(false);
    }
  };

  // Pagination Logic
  const handleNextPage = () => setOffset(prev => prev + LIMIT);
  const handlePrevPage = () => setOffset(prev => Math.max(0, prev - LIMIT));

  // Determine if next page is available
  const hasNextPage = selectedType 
    ? offset + LIMIT < (searchTerm ? allTypePokemon.filter(p => p.name.includes(searchTerm.toLowerCase())).length : allTypePokemon.length)
    : true; 

  return (
    <div className="container mx-auto px-4 pb-12 max-w-7xl">
      {/* Header / Hero */}
      <div className="pt-8 pb-8">
        <div className="bg-[#EF5350] rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
           {/* Decorative Pokeball */}
           <div className="absolute -right-10 -bottom-20 opacity-20 pointer-events-none">
             <Disc size={300} />
           </div>

           <div className="relative z-10 w-full md:w-1/2">
             <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
               Pokédex
             </h1>
             <p className="text-white/90 text-lg">
               Search for a Pokémon by name or filter by type.
             </p>
           </div>

           {/* Controls */}
           <div className="relative z-10 w-full md:w-1/2 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              {/* Type Filter */}
              <div className="mb-3">
                <label className="text-xs font-bold uppercase text-white/80 ml-1 mb-1 block">Filter by Type</label>
                <div className="relative">
                    <select
                        value={selectedType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-white text-gray-800 font-bold appearance-none focus:outline-none focus:ring-4 focus:ring-red-900/30 cursor-pointer capitalize"
                    >
                        <option value="">All Types</option>
                        {types.map((t) => (
                        <option key={t.name} value={t.name} className="capitalize">{t.name}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Search Bar */}
              <div>
                 <label className="text-xs font-bold uppercase text-white/80 ml-1 mb-1 block">Search Name</label>
                 <form onSubmit={handleGlobalSearch} className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (selectedType) setOffset(0); // Reset pagination on filter search
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-900/30 font-medium"
                        placeholder={selectedType ? `Search in ${selectedType}...` : "Name (e.g. Pikachu)..."}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    {searchTerm && (
                        <button 
                            type="button"
                            onClick={() => { setSearchTerm(''); setOffset(0); loadPokemon(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EF5350]"
                        >
                            <X size={18} />
                        </button>
                    )}
                 </form>
              </div>
           </div>
        </div>
      </div>

      {/* Results Area */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => { setSearchTerm(''); setError(null); loadPokemon(); }} />
      ) : (
        <>
           {/* Global Search State Prompt */}
           {!selectedType && searchTerm && displayList.length === 0 && (
               <div className="text-center py-12">
                   <p className="text-gray-500 text-lg mb-4">Search globally for <strong>"{searchTerm}"</strong>?</p>
                   <button 
                    onClick={handleGlobalSearch}
                    className="bg-[#EF5350] text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg"
                   >
                       Search Global Database
                   </button>
               </div>
           )}

          {/* List Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayList.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                onClick={(name) => navigate(`/pokemon/${name}`)}
              />
            ))}
          </div>
            
          {/* Empty State for Filter */}
          {selectedType && displayList.length === 0 && (
             <div className="text-center py-20 text-gray-400">
                 <p className="text-xl font-medium">No {selectedType} Pokémon found matching "{searchTerm}".</p>
             </div>
          )}

          {/* Pagination */}
          {displayList.length > 0 && (
            <div className="mt-12 flex justify-center items-center gap-6">
                <button
                onClick={handlePrevPage}
                disabled={offset === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                    offset === 0
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-[#EF5350] shadow-md border border-gray-200'
                }`}
                >
                <ChevronLeft size={20} /> Prev
                </button>
                
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Page {Math.floor(offset / LIMIT) + 1}
                </span>

                <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                    !hasNextPage
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-[#EF5350] shadow-md border border-gray-200'
                }`}
                >
                Next <ChevronRight size={20} />
                </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// --- Detail Route Wrapper ---
const DetailRoute: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  if (!name) return <Navigate to="/" />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <PokemonDetail pokemonName={name} onBack={() => navigate('/')} />
    </div>
  );
};

// --- Main App Entry ---
const App: React.FC = () => {
  const [introCompleted, setIntroCompleted] = useState(false);

  if (!introCompleted) {
    return <IntroGame onComplete={() => setIntroCompleted(true)} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:name" element={<DetailRoute />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;