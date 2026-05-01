import React, { useState, useMemo } from 'react';
import { Search, Clock, Star, ChevronDown, LayoutGrid, List, SlidersHorizontal, Moon, Database, Zap } from 'lucide-react';
import { timeAgo } from './helpers';
import { NexoLogo } from './UIComponents';

const StyledDropdown = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex flex-col gap-1.5 flex-1 relative">
            <label className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">{label}</label>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-[#0a0a16] border border-white/5 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-cyan-500 flex items-center justify-between hover:border-cyan-500/50 transition-colors z-10 relative">
                <span className='line-clamp-1'>{value}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>
            
            {isOpen && <div className="fixed inset-0 z-[40]" onClick={() => setIsOpen(false)}></div>}
            
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[140px] bg-[#05050a] border border-cyan-500/40 rounded-xl py-2 shadow-[0_10px_40px_rgba(6,182,212,0.15)] z-[50] animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto">
                    {options.map(opt => (
                        <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${value === opt ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export function CatalogView({ mangas, onNavigate, dataSaver, catalogState, setCatalogState }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); 

    const [selectedType, setSelectedType] = useState('Todos');
    const [selectedGenre, setSelectedGenre] = useState('Todos');
    const [selectedStatus, setSelectedStatus] = useState('Todos');
    const [sortBy, setSortBy] = useState('Recentes');

    const visibleCount = catalogState?.visibleCount || 24;

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
        <div className="pb-24 animate-in fade-in duration-500 bg-[#020205] min-h-screen relative font-sans text-white overflow-x-hidden">
            
            {/* Fundo Escuro Nexo */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020205] to-[#000000] pointer-events-none z-0 overflow-hidden"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
                
                {/* CABEÇALHO NEXO SCAN */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-[#05050a] p-2.5 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] flex-shrink-0">
                        <NexoLogo className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center drop-shadow-md">
                        Catálogo Nexo
                    </h1>
                    <div className="ml-auto flex items-center gap-1.5 bg-[#05050a] border-l-2 border-r-2 border-cyan-500 px-3 py-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)] relative overflow-hidden flex-shrink-0">
                        <Database className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.2em] relative z-10">
                            {filteredMangas.length} Obras
                        </span>
                    </div>
                </div>

                {/* BARRA DE BUSCA NEXO */}
                <div className="relative mb-4 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-11 pr-4 py-4 rounded-xl border border-white/5 bg-[#05050a]/90 backdrop-blur-md text-white outline-none focus:border-cyan-500/50 transition-all font-bold text-sm placeholder:text-gray-600 shadow-inner group-hover:border-white/10" 
                        placeholder="Buscar no acervo..." 
                    />
                </div>

                {/* CONTROLES PRIMÁRIOS */}
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setShowFilters(!showFilters)} className={`backdrop-blur-md border px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${showFilters ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-[#05050a]/80 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <SlidersHorizontal className="w-4 h-4" /> {showFilters ? 'Ocultar' : 'Filtros'}
                    </button>
                    
                    {/* VIEW MODE TOGGLE */}
                    <div className="flex items-center bg-[#05050a]/80 backdrop-blur-md border border-white/5 rounded-xl p-1 shadow-sm h-full ml-auto">
                        <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* PAINEL DE FILTROS */}
                {showFilters && (
                    <div className="bg-[#05050a]/95 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-5 mb-6 shadow-2xl animate-in slide-in-from-top-2 relative z-20">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StyledDropdown label="Tipo" value={selectedType} options={typeOptions} onChange={setSelectedType} />
                            <StyledDropdown label="Gênero" value={selectedGenre} options={genreOptions} onChange={setSelectedGenre} />
                            <StyledDropdown label="Status" value={selectedStatus} options={statusOptions} onChange={setSelectedStatus} />
                            <StyledDropdown label="Ordenar Por" value={sortBy} options={sortOptions} onChange={setSortBy} />
                        </div>
                    </div>
                )}

                {/* PÍLULAS DE ACESSO RÁPIDO */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-2">
                    {typeOptions.map(opt => (
                        <button 
                            key={opt} 
                            onClick={() => setSelectedType(opt)} 
                            className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${selectedType === opt ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-[#05050a]/80 text-gray-500 hover:text-white border-white/5 hover:border-cyan-500/30'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {/* GRADE OU LISTA DE OBRAS */}
                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 relative z-0" : "flex flex-col gap-4 relative z-0"}>
                    {currentItems.length > 0 ? currentItems.map(manga => (
                        <div key={manga.id} onClick={() => onNavigate('details', manga)} className={`cursor-pointer group ${viewMode === 'grid' ? 'flex flex-col gap-2' : 'flex flex-row items-center gap-4 bg-[#05050a]/80 p-3 rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-colors'}`}>
                            
                            <div className={`relative overflow-hidden bg-[#0a0a16] border border-white/5 group-hover:border-cyan-500/50 shadow-md group-hover:shadow-[0_8px_25px_rgba(6,182,212,0.15)] transition-all duration-300 ${viewMode === 'grid' ? 'aspect-[2/3] rounded-2xl group-hover:-translate-y-1' : 'w-20 h-28 sm:w-24 sm:h-32 rounded-xl flex-shrink-0'} ${dataSaver ? 'blur-[1px]' : ''}`}>
                                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" onError={(e) => e.target.src = `https://placehold.co/300x450/0A0A16/0ea5e9?text=Oculto`} />
                                
                                {manga.chapters && manga.chapters.length > 0 && viewMode === 'grid' && (
                                    <div className="absolute top-2 left-2 bg-black/90 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                                        Cap {manga.chapters[0].number}
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 bg-[#020205]/80 backdrop-blur-md px-1.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                    <span className="text-[9px] font-black text-white">{manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                </div>
                                
                                {viewMode === 'grid' && (
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-8">
                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 drop-shadow-md"><Clock className="w-2.5 h-2.5 text-cyan-500"/> {timeAgo(manga.createdAt)}</p>
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
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">{manga.synopsis}</p>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                            {manga.chapters && manga.chapters.length > 0 && <span className="text-gray-300 bg-white/5 px-2 py-1 rounded-md border border-white/5">Capítulo {manga.chapters[0].number}</span>}
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-500"/> {timeAgo(manga.createdAt)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-[#05050a]/50 rounded-3xl border border-white/5 border-dashed">
                            <Moon className="w-12 h-12 text-gray-700 mx-auto mb-4 animate-pulse" />
                            <p className="text-gray-500 font-black text-xs uppercase tracking-widest text-center px-4 leading-relaxed">O sistema não encontrou o que você procura.<br />Tente alterar os filtros.</p>
                        </div>
                    )}
                </div>

                {/* BOTÃO CARREGAR MAIS */}
                {filteredMangas.length > visibleCount && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={handleLoadMore} 
                            className="bg-[#05050a] border border-white/10 text-white hover:bg-cyan-600 hover:border-cyan-600 font-black px-10 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 text-xs uppercase tracking-widest shadow-lg group"
                        >
                            <Zap className="w-4 h-4 text-cyan-400 group-hover:text-white" /> Carregar Mais
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
