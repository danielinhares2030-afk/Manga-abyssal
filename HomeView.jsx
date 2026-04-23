import React, { useState, useEffect } from 'react';
import { Star, Clock, ListFilter, BookmarkPlus, ChevronRight, Flame, Play, ChevronLeft, Sparkles, Zap, LayoutGrid } from 'lucide-react';
import { timeAgo } from './helpers';

export function HomeView({ mangas, onNavigate, dataSaver }) {
    const [filter, setFilter] = useState('Manhwa');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const populares = [...(mangas || [])]
        .filter(m => (Number(m.rating) || 0) >= 4.0)
        .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
        .slice(0, 10);

    const destaques = [...(mangas || [])]
        .filter(m => m.coverUrl && (Number(m.rating) || 0) >= 4.5)
        .slice(0, 5);

    const filterOptions = ['Manhwa', 'Mangá', 'Manhua', 'Shoujo'];
    
    const filteredByPage = [...(mangas || [])]
        .filter(m => {
            if (!m.type) return false;
            const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const mType = normalize(m.type);
            const fType = normalize(filter);
            if (fType === 'manga' && mType === 'manga') return true;
            return mType === fType;
        })
        .sort((a, b) => b.createdAt - a.createdAt);

    const totalPages = Math.ceil(filteredByPage.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredByPage.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        if (destaques.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % destaques.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [destaques.length]);

    const handleFilterChange = (opt) => {
        setFilter(opt);
        setCurrentPage(1);
    };

    return (
        <div className="pb-24 animate-in fade-in duration-700 bg-[#020408] relative overflow-hidden min-h-screen font-sans">
            
            {/* AURAS AMBIENTES (Ciano e Esmeralda) */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[40%] right-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

            {/* DESTAQUES (HERO SLIDER CINEMATOGRÁFICO) */}
            {destaques.length > 0 && (
                <div className="relative w-full h-[60vh] md:h-[75vh] max-h-[800px] overflow-hidden mb-12 group bg-[#020408]">
                    {destaques.map((manga, index) => (
                        <div key={manga.id} className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                            <div className="absolute inset-0 bg-[#020408]">
                                <img src={manga.coverUrl} className={`w-full h-full object-cover opacity-50 mix-blend-luminosity ${dataSaver ? 'blur-md' : ''}`} alt="Background" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/60 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#020408] via-[#020408]/40 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex items-end gap-8 md:gap-14">
                                
                                {/* Mini Capa com Efeito Glass e Aura */}
                                <div className="hidden md:block w-48 md:w-64 relative group-hover:-translate-y-3 transition-transform duration-1000 ease-out">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
                                    <img src={manga.coverUrl} className={`relative rounded-2xl shadow-2xl border-2 border-[#0a0f16] z-10 ${dataSaver ? 'blur-[1px]' : ''}`} alt="Capa" />
                                    <div className="absolute top-3 right-3 z-20 bg-[#020408]/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                                        <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                                        <span className="text-xs font-black text-white">{manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1 pb-4 md:pb-8 relative z-20">
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">Obra Prisma</span>
                                        <span className="md:hidden flex items-center gap-1 text-emerald-400 text-xs font-black bg-[#020408]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5"><Star className="w-3 h-3 fill-emerald-400"/> {manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                    </div>
                                    
                                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-4 line-clamp-1 md:line-clamp-2 tracking-tighter drop-shadow-lg">{manga.title}</h2>
                                    
                                    <p className="text-gray-400 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-10 max-w-2xl font-medium leading-relaxed drop-shadow-md">{manga.synopsis || "Uma jornada que desafia a realidade. Adentre o desconhecido e descubra os segredos da matriz."}</p>
                                    
                                    <button onClick={() => onNavigate('details', manga)} className="relative overflow-hidden bg-white text-black font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-500 text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] group/btn">
                                        <Play className="w-4 h-4 fill-current group-hover/btn:translate-x-1 transition-transform" /> Acessar Matriz
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Indicadores do Slider Modernizados */}
                    <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex gap-2.5">
                        {destaques.map((_, i) => (
                            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'w-3 bg-white/20 hover:bg-white/50'}`} />
                        ))}
                    </div>
                </div>
            )}

            {/* SESSÃO: EM ALTA (Grade de Poder) */}
            <div className="mt-8 md:mt-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" /> Em Alta
                    </h2>
                    <button onClick={() => onNavigate('popular')} className="text-[10px] md:text-xs font-black text-emerald-400 hover:text-black uppercase tracking-widest flex items-center transition-all bg-emerald-500/10 px-5 py-2.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                        Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
                
                <div className="flex overflow-x-auto gap-4 sm:gap-5 pb-8 snap-x snap-mandatory no-scrollbar items-stretch" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {populares.map(manga => (
                        <div key={manga.id} onClick={() => onNavigate('details', manga)} className="flex-none w-[130px] sm:w-[150px] md:w-[180px] snap-start cursor-pointer group">
                            <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0f16] border border-white/5 group-hover:border-emerald-400/50 shadow-lg group-hover:shadow-[0_0_25px_rgba(52,211,153,0.2)] transition-all duration-500 ${dataSaver ? 'blur-[2px]' : ''}`}>
                                <img src={manga.coverUrl} alt={manga.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                                <div className="absolute top-2 right-2 bg-[#020408]/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-md">
                                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[10px] font-black text-white">{manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                            </div>
                            <h3 className="text-sm font-bold text-gray-300 mt-3 line-clamp-1 group-hover:text-emerald-400 transition-colors px-1">{manga.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* SESSÃO: NOVIDADES E FILTROS */}
            <div className="mt-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" /> Novidades
                    </h2>
                    
                    {/* FILTROS GLASSMORPHISM */}
                    <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 pb-2 px-1 w-max">
                            <ListFilter className="w-5 h-5 text-gray-600 flex-shrink-0 mr-2" />
                            {filterOptions.map(opt => (
                                <button key={opt} onClick={() => handleFilterChange(opt)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${filter === opt ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-[#0a0f16] border-white/5 text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/10'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {currentItems.length > 0 ? currentItems.map(manga => (
                        <div key={manga.id} onClick={() => onNavigate('details', manga)} className="cursor-pointer group flex flex-col gap-2">
                            <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0f16] border border-white/5 group-hover:border-cyan-400/50 shadow-md group-hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-500 ${dataSaver ? 'blur-[1px]' : ''}`}>
                                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                                
                                {manga.chapters && manga.chapters.length > 0 && (
                                    <div className="absolute top-2 left-2 bg-[#020408]/90 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                                        Cap {manga.chapters[0].number}
                                    </div>
                                )}
                                
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#020408] via-[#020408]/80 to-transparent p-3 pt-12 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[9px] text-cyan-400 font-black uppercase tracking-widest drop-shadow-md flex items-center gap-1.5"><Clock className="w-3 h-3"/> {timeAgo(manga.createdAt)}</p>
                                </div>
                            </div>
                            <h3 className="font-bold text-sm text-gray-300 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors duration-300 px-1 mt-1">{manga.title}</h3>
                        </div>
                    )) : (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center bg-[#0a0f16]/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                            <LayoutGrid className="w-12 h-12 text-cyan-900 mx-auto mb-4" />
                            <p className="text-gray-500 font-black text-xs uppercase tracking-[0.2em]">O Vazio está silencioso nesta matriz.</p>
                        </div>
                    )}
                </div>

                {/* PAGINAÇÃO DE PODER */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-3">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-3.5 rounded-xl bg-[#0a0f16] border border-white/5 text-gray-400 disabled:opacity-20 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-md">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-1.5 bg-[#0a0f16] p-1.5 rounded-xl border border-white/5 backdrop-blur-md shadow-md overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                            {[...Array(totalPages)].map((_, i) => {
                                // Lógica simples para não mostrar 50 botões se houver muitas páginas
                                if (totalPages > 5 && (i + 1 !== 1 && i + 1 !== totalPages && Math.abs(currentPage - (i + 1)) > 1)) {
                                    if (i + 1 === 2 || i + 1 === totalPages - 1) return <span key={i} className="text-gray-600 px-1">...</span>;
                                    return null;
                                }
                                return (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg font-black text-xs transition-all duration-300 flex-shrink-0 ${currentPage === i + 1 ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/10'}`}>
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-3.5 rounded-xl bg-[#0a0f16] border border-white/5 text-gray-400 disabled:opacity-20 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-md">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
