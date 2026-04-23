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
        <div className="pb-24 min-h-screen relative overflow-hidden bg-black text-white">

            {/* 🌌 FUNDO SURREAL ANIMADO */}
            <div className="absolute inset-0 z-0">
                <div className="absolute w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[200px] animate-pulse top-[-200px] left-[-200px]" />
                <div className="absolute w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[200px] animate-pulse bottom-[-200px] right-[-200px]" />
                <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] animate-[spin_40s_linear_infinite]" />
            </div>

            {/* HERO */}
            {destaques.length > 0 && (
                <div className="relative z-10 w-full h-[70vh] overflow-hidden group">

                    {destaques.map((manga, index) => (
                        <div key={manga.id}
                            className={`absolute inset-0 transition-all duration-[1500ms] ${
                                index === currentSlide
                                    ? 'opacity-100 scale-100'
                                    : 'opacity-0 scale-110'
                            }`}
                        >

                            {/* background */}
                            <img
                                src={manga.coverUrl}
                                className={`w-full h-full object-cover opacity-40 blur-sm ${dataSaver ? 'blur-md' : ''}`}
                            />

                            {/* overlay glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />

                            {/* content */}
                            <div className="absolute bottom-0 p-8 md:p-16 max-w-6xl">

                                <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-300 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                                    {manga.title}
                                </h2>

                                <p className="text-gray-400 max-w-xl mt-4">
                                    {manga.synopsis || "Entre na dimensão onde histórias ganham vida."}
                                </p>

                                <button
                                    onClick={() => onNavigate('details', manga)}
                                    className="mt-6 px-8 py-4 rounded-xl bg-white text-black font-bold flex items-center gap-3 hover:scale-105 transition"
                                >
                                    <Play className="w-4 h-4" /> Explorar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EM ALTA */}
            <div className="relative z-10 px-6 mt-10">
                <h2 className="text-3xl font-black flex items-center gap-2 mb-6">
                    <Zap className="text-emerald-400 animate-pulse" /> Em Alta
                </h2>

                <div className="flex gap-5 overflow-x-auto pb-6">
                    {populares.map(manga => (
                        <div key={manga.id}
                            onClick={() => onNavigate('details', manga)}
                            className="w-[150px] flex-shrink-0 group cursor-pointer"
                        >
                            <div className="relative rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 transition">
                                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            </div>

                            <p className="text-sm mt-2 group-hover:text-cyan-400">
                                {manga.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FILTROS */}
            <div className="relative z-10 px-6 mt-10">
                <h2 className="text-3xl font-black mb-4 flex gap-2">
                    <Sparkles className="text-cyan-400" /> Novidades
                </h2>

                <div className="flex gap-2 overflow-x-auto mb-6">
                    {filterOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleFilterChange(opt)}
                            className={`px-5 py-2 rounded-full text-xs font-bold ${
                                filter === opt
                                    ? 'bg-cyan-400 text-black'
                                    : 'bg-white/10'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentItems.map(manga => (
                        <div key={manga.id}
                            onClick={() => onNavigate('details', manga)}
                            className="group cursor-pointer"
                        >
                            <div className="rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 transition">
                                <img src={manga.coverUrl} className="group-hover:scale-105 transition duration-500" />
                            </div>

                            <p className="text-sm mt-2 group-hover:text-cyan-400">
                                {manga.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
