import React, { useState, useMemo } from 'react';
import { Search, Infinity as InfinityIcon, Clock, Star, LayoutGrid, List, SlidersHorizontal, Hexagon } from 'lucide-react';
import { timeAgo } from './helpers';

export function CatalogView({ mangas, onNavigate, dataSaver, catalogState, setCatalogState }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); 

    // Estados dos Filtros
    const [selectedType, setSelectedType] = useState('Todos');
    const [selectedGenre, setSelectedGenre] = useState('Todos');
    const [selectedStatus, setSelectedStatus] = useState('Todos');
    const [sortBy, setSortBy] = useState('Recentes');

    const visibleCount = catalogState?.visibleCount || 24;

    // Listas de Opções
    const typeOptions = ['Todos', 'Mangá', 'Manhwa', 'Manhua'];
    const genreOptions = ['Todos', 'Ação', 'Artes Marciais', 'Aventura', 'Comédia', 'Drama', 'Esportes', 'Fantasia', 'Ficção Científica', 'Isekai', 'Magia', 'Mistério', 'Romance', 'Seinen', 'Shoujo', 'Shounen', 'Slice of Life', 'Terror'];
    const statusOptions = ['Todos', 'Em Lançamento', 'Completo', 'Hiato'];
    const sortOptions = ['Recentes', 'Melhor Avaliação', 'A - Z', 'Z - A'];

    const filteredMangas = useMemo(() => {
        let result = [...(mangas || [])];
        const normalize = str => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';

        if (searchTerm.trim() !== '') {
            const term = normalize(searchTerm);
            result = result.filter(m => normalize(m.title).includes(term) || normalize(m.author).includes(term));
        }

        if (selectedType !== 'Todos') {
            const fType = normalize(selectedType);
            result = result.filter(m => normalize(m.type) === fType);
        }

        if (selectedGenre !== 'Todos') {
            const fGenre = normalize(selectedGenre);
            result = result.filter(m => {
                const mGenres = (m.genres || []).map(g => normalize(g));
                return mGenres.includes(fGenre);
            });
        }

        if (selectedStatus !== 'Todos') {
            const fStatus = normalize(selectedStatus);
            result = result.filter(m => normalize(m.status) === fStatus);
        }

        result.sort((a, b) => {
            if (sortBy === 'Recentes') return b.createdAt - a.createdAt;
            if (sortBy === 'Melhor Avaliação') return (Number(b.rating) || 0) - (Number(a.rating) || 0);
            if (sortBy === 'A - Z') return (a.title || '').localeCompare(b.title || '');
            if (sortBy === 'Z - A') return (b.title || '').localeCompare(a.title || '');
            return 0;
        });

        return result;
    }, [mangas, searchTerm, selectedType, selectedGenre, selectedStatus, sortBy]);

    const currentItems = filteredMangas.slice(0, visibleCount);

    const handleLoadMore = () => {
        setCatalogState({ ...catalogState, visibleCount: visibleCount + 24 });
    };

    return (
        <div className="pb-24 animate-in fade-in duration-500 bg-[#050505] min-h-screen relative font-sans text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050505] to-[#050505] pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
                
                {/* CABEÇALHO COM NOVO CONTADOR ALQUÍMICO */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-[#0a0f1c] p-2.5 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <InfinityIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center drop-shadow-md">
                        Catálogo
                    </h1>
                    {/* Contador Estilo Alquimia (Dourado/Místico) */}
                    <div className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-[#1a1405] to-[#0f0c03] border-l-2 border-r-2 border-amber-500 px-3 py-1 shadow-[0_0_15px_rgba(245,158,11,0.15)] relative overflow-hidden">
                        <Hexagon className="w-3.5 h-3.5 text-amber-400 animate-[spin_10s_linear_infinite]" />
                        <span className="text-amber-400 text-[11px] font-black uppercase tracking-[0.2em] relative z-10">
                            {filteredMangas.length} Obras
                        </span>
                        <div className="absolute inset-0 bg-amber-500/10 blur-sm pointer-events-none"></div>
                    </div>
                </div>

                {/* BARRA DE BUSCA E CONTROLES PRIMÁRIOS */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pl-11 pr-4 py-4 rounded-xl border border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md text-white outline-none focus:border-cyan-500/50 transition-all font-bold text-sm placeholder:text-gray-500 shadow-inner" 
                            placeholder="Buscar títulos, autores..." 
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowFilters(!showFilters)} className={`flex-1 sm:flex-none backdrop-blur-md border px-5 py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${showFilters ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-[#0a0f1c]/80 border-white/5 text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                            <SlidersHorizontal className="w-4 h-4" /> Filtros
                        </button>
                        
                        <div className="flex items-center bg-[#0a0f1c]/80 backdrop-blur-md border border-white/5 rounded-xl p-1 shadow-sm h-full">
                            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-500 hover:text-white'}`}>
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-500 hover:text-white'}`}>
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* NOVO PAINEL DE FILTROS (Sem menu nativo feio do celular) */}
                {showFilters && (
                    <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-5 mb-6 shadow-xl animate-in slide-in-from-top-2 flex flex-col gap-6">
                        
                        {/* Seção Tipo */}
                        <div>
                            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Hexagon className="w-3 h-3"/> Selecione o Formato
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {typeOptions.map(opt => (
                                    <button key={`type-${opt}`} onClick={() => setSelectedType(opt)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${selectedType === opt ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-[#050505] text-gray-400 border-white/10 hover:border-cyan-500/50'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Seção Ordenação */}
                        <div>
                            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Hexagon className="w-3 h-3"/> Ordenar Matriz
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {sortOptions.map(opt => (
                                    <button key={`sort-${opt}`} onClick={() => setSortBy(opt)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${sortBy === opt ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-[#050505] text-gray-400 border-white/10 hover:border-indigo-500/50'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Seção Status */}
                        <div>
                            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Hexagon className="w-3 h-3"/> Status da Obra
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map(opt => (
                                    <button key={`status-${opt}`} onClick={() => setSelectedStatus(opt)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedStatus === opt ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-[#050505] text-gray-400 border-white/10 hover:border-emerald-500/50'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Seção Gêneros (Com rolagem horizontal para não entupir a tela) */}
                        <div>
                            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Hexagon className="w-3 h-3"/> Gêneros Ancestrais
                            </h3>
                            <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                                {genreOptions.map(opt => (
                                    <button key={`genre-${opt}`} onClick={() => setSelectedGenre(opt)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex-shrink-0 ${selectedGenre === opt ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-[#050505] text-gray-400 border-white/10 hover:border-amber-500/50'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                    </div>
                )}

                {/* GRADE OU LISTA DE OBRAS */}
                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5" : "flex flex-col gap-4"}>
                    {currentItems.length > 0 ? currentItems.map(manga => (
                        <div key={manga.id} onClick={() => onNavigate('details', manga)} className={`cursor-pointer group ${viewMode === 'grid' ? 'flex flex-col gap-2' : 'flex flex-row items-center gap-4 bg-[#0a0f1c]/60 p-3 rounded-xl border border-white/5 hover:border-cyan-500/40 transition-colors'}`}>
                            
                            <div className={`relative overflow-hidden bg-[#0a0f1c] border border-white/5 group-hover:border-cyan-500/50 shadow-md group-hover:shadow-[0_8px_25px_rgba(34,211,238,0.15)] transition-all duration-300 ${viewMode === 'grid' ? 'aspect-[2/3] rounded-xl group-hover:-translate-y-1' : 'w-20 h-28 sm:w-24 sm:h-32 rounded-lg flex-shrink-0'} ${dataSaver ? 'blur-[1px]' : ''}`}>
                                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                                
                                {manga.chapters && manga.chapters.length > 0 && viewMode === 'grid' && (
                                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                                        Cap {manga.chapters[0].number}
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 bg-[#050505]/80 backdrop-blur-md px-1.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                    <span className="text-[9px] font-black text-white">{manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                </div>
                                
                                {viewMode === 'grid' && (
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent p-2 pt-8">
                                        <p className="text-[8px] text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-1 drop-shadow-md"><Clock className="w-2.5 h-2.5"/> {timeAgo(manga.createdAt)}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`flex-1 flex flex-col ${viewMode === 'grid' ? 'px-1 mt-1' : 'justify-center py-1'}`}>
                                {viewMode === 'list' && manga.type && (
                                    <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest mb-1">{manga.type}</span>
                                )}
                                <h3 className={`font-bold text-gray-200 group-hover:text-cyan-400 transition-colors duration-200 ${viewMode === 'grid' ? 'text-sm line-clamp-2 leading-snug' : 'text-base line-clamp-1 mb-2'}`}>{manga.title}</h3>
                                
                                {viewMode === 'list' && (
                                    <>
                                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">{manga.synopsis}</p>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            {manga.chapters && manga.chapters.length > 0 && <span className="text-white bg-white/5 px-2 py-1 rounded-md border border-white/5">Capítulo {manga.chapters[0].number}</span>}
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {timeAgo(manga.createdAt)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-[#0a0f1c]/50 rounded-xl border border-white/5 border-dashed">
                            <InfinityIcon className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-pulse" />
                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest text-center px-4">A matriz não revelou nenhum resultado com estes filtros.</p>
                        </div>
                    )}
                </div>

                {/* BOTÃO CARREGAR MAIS */}
                {filteredMangas.length > visibleCount && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={handleLoadMore} 
                            className="bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 text-white hover:bg-cyan-500 hover:text-black hover:border-cyan-500 font-black px-10 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 text-xs uppercase tracking-widest shadow-lg group"
                        >
                            <Hexagon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Expandir Matriz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
