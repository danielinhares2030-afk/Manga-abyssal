import React, { useState, useEffect } from 'react';
import { Star, Clock, ListFilter, BookmarkPlus, ChevronRight, Flame, Play, ChevronLeft, Sparkles, Zap, LayoutGrid, Compass } from 'lucide-react';
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
        <div className="pb-24 animate-in fade-in duration-700 bg-[#030712] relative overflow-hidden min-h-screen font-sans">
            <style>{`body, html { background-color: #030712 !important; }`}</style>
            
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '30px 30px' }}></div>
            
            <div className="absolute top-0 left-[-10%] w-[60vw] h-[60vw] bg-blue-900/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
            <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]"></div>

            {destaques.length > 0 && (
                <div className="relative w-full h-[60vh] md:h-[75vh] max-h-[800px] overflow-hidden mb-12 group bg-[#030712]">
                    {destaques.map((manga, index) => (
                        <div key={manga.id} className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                            <div className="absolute inset-0 bg-[#030712]">
                                <img src={manga.coverUrl} className={`w-full h-full object-cover opacity-40 mix-blend-luminosity ${dataSaver ? 'blur-md' : ''}`} alt="Background" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/40 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex items-end gap-8 md:gap-14">
                                
                                <div className="hidden md:block w-48 md:w-64 relative group-hover:-translate-y-3 transition-transform duration-1000 ease-out">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
                                    <img src={manga.coverUrl} className={`relative rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-blue-500/20 z-10 ${dataSaver ? 'blur-[1px]' : ''}`} alt="Capa" />
                                    <div className="absolute top-3 right-3 z-20 bg-[#030712]/80 backdrop-blur-md border border-blue-400/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                                        <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]" />
                                        <span className="text-xs font-black text-white">{manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1 pb-4 md:pb-8 relative z-20">
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="bg-blue-500/20 border border-blue-400/40 text-blue-200 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> Destaque Astral</span>
                                        <span className="md:hidden flex items-center gap-1 text-amber-300 text-xs font-black bg-[#030712]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-900/50"><Star className="w-3 h-3 fill-amber-300"/> {manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                    </div>
                                    
                                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200 mb-4 line-clamp-1 md:line-clamp-2 tracking-tighter drop-shadow-lg">{manga.title}</h2>
                                    
                                    <p className="text-blue-100/70 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-10 max-w-2xl font-medium leading-relaxed drop-shadow-md">{manga.synopsis || "Uma jornada que transcende as estrelas. Adentre o desconhecido e descubra os segredos do infinito."}</p>
                                    
                                    <button onClick={() => onNavigate('details', manga)} className="relative overflow-hidden bg-white text-blue-950 font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-500 text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] group/btn">
                                        <Play className="w-4 h-4 fill-current group-hover/btn:translate-x-1 transition-transform" /> Explorar Mundo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex gap-2.5">
                        {destaques.map((_, i) => (
                            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'w-3 bg-white/20 hover:bg-white/50'}`} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 md:mt-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tighter uppercase drop-shadow-md">
                        <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" /> Em Ascensão
                    </h2>
                    <button onClick={() => onNavigate('popular')} className="text-[10px] md:text-xs font-bold text-blue-400 hover:text-white uppercase tracking-widest flex items-center transition-all bg-blue-500/10 px-5 py-2.5 rounded-xl border border-blue-500/20 hover:bg-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        Ver Mais <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
                
                <div className="flex overflow-x-auto gap-4 sm:gap-5 pb-8 snap-x snap-mandatory no-scrollbar items-stretch" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {populares.map(manga => (
                        <div key={manga.id} onClick={() => onNavigate('details', manga)} className="flex-none w-[130px] sm:w-[150px] md:w-[180px] snap-start cursor-pointer group">
                            <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0f1c]/80 backdrop-blur-md border border-blue-900/30 group-hover:border-blue-500/50 shadow-lg group-hover:shadow-[0_15px_30px_rgba(59,130,246,0.2)] transition-all duration-500 ${dataSaver ? 'blur-[2px]' : ''}`}>
                                <img src={manga.coverUrl} alt={manga.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                                <div className="absolute top-2 right-2 bg-[#030712]/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-blue-900/50 flex items-center gap-1.5 shadow-md">
                                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                                    <span className="text-[10px] font-black text-white">{manga.rating ? Number(manga.rating).toFixed(1) : "5.0"}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <h3 className="text-sm font-bold text-blue-50 mt-3 line-clamp-1 group-hover:text-blue-300 transition-colors px-1">{manga.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tighter uppercase drop-shadow-md">
                        <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" /> Recentes
                    </h2>
                    
                    <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 pb-2 px-1 w-max">
                            <ListFilter className="w-5 h-5 text-blue-500/50 flex-shrink-0 mr-2" />
                            {filterOptions.map(opt => (
                                <button key={opt} onClick={() => handleFilterChange(opt)} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${filter === opt ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#0a0f1c] border-blue-900/30 text-blue-200/50 hover:text-blue-200 hover:bg-blue-900/20'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {currentItems.length > 0 ? currentItems.map(manga => (
                        <div key={manga.id} onClick={() => onNavigate('details', manga)} className="cursor-pointer group flex flex-col gap-2">
                            <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0f1c]/80 backdrop-blur-md border border-blue-900/30 group-hover:border-blue-500/50 shadow-lg group-hover:shadow-[0_15px_30px_rgba(59,130,246,0.2)] transition-all duration-500 ${dataSaver ? 'blur-[1px]' : ''}`}>
                                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                                
                                {manga.chapters && manga.chapters.length > 0 && (
                                    <div className="absolute top-2 left-2 bg-[#030712]/90 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[9px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                                        Cap {manga.chapters[0].number}
                                    </div>
                                )}
                                
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent p-3 pt-12 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[9px] text-blue-300 font-bold uppercase tracking-widest drop-shadow-md flex items-center gap-1.5"><Clock className="w-3 h-3"/> {timeAgo(manga.createdAt)}</p>
                                </div>
                            </div>
                            <h3 className="font-bold text-sm text-blue-50 line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors duration-300 px-1 mt-1">{manga.title}</h3>
                        </div>
                    )) : (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center bg-[#0a0f1c]/50 rounded-3xl border border-blue-900/30 backdrop-blur-sm">
                            <LayoutGrid className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                            <p className="text-blue-200/50 font-bold text-xs uppercase tracking-[0.2em]">O Universo está silencioso nesta dimensão.</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-3">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-3.5 rounded-xl bg-[#0a0f1c]/80 border border-blue-900/30 text-blue-200/50 disabled:opacity-20 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/50 transition-all shadow-md">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-1.5 bg-[#0a0f1c]/80 p-1.5 rounded-xl border border-blue-900/30 backdrop-blur-md shadow-md overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                            {[...Array(totalPages)].map((_, i) => {
                                if (totalPages > 5 && (i + 1 !== 1 && i + 1 !== totalPages && Math.abs(currentPage - (i + 1)) > 1)) {
                                    if (i + 1 === 2 || i + 1 === totalPages - 1) return <span key={i} className="text-blue-900 px-1">...</span>;
                                    return null;
                                }
                                return (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg font-bold text-xs transition-all duration-300 flex-shrink-0 ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500' : 'bg-transparent text-blue-200/50 hover:text-white hover:bg-white/10'}`}>
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-3.5 rounded-xl bg-[#0a0f1c]/80 border border-blue-900/30 text-blue-200/50 disabled:opacity-20 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/50 transition-all shadow-md">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
