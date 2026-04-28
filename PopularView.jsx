import React from 'react';
import { Flame, Star, ArrowLeft, Crown } from 'lucide-react';

export function PopularView({ mangas, onNavigate, dataSaver }) {
    // FILTRO ADICIONADO: Exige nota >= 4.0 para não exibir obras ruins
    const topPopulares = [...(mangas || [])]
        .filter(m => (m.rating || 0) >= 4.0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 15);

    return (
        <div className="pb-24 animate-in fade-in duration-500 px-4 md:px-8 max-w-7xl mx-auto relative z-10 pt-6">
            
            {/* CABEÇALHO KAGE */}
            <div className="flex items-center gap-4 py-6 border-b border-red-900/30 mb-8">
                <button onClick={() => onNavigate('home')} className="p-3 bg-[#0a0a0c] rounded-xl border border-white/5 text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-all shadow-sm group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter drop-shadow-md">
                        <Flame className="w-6 h-6 text-red-600 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" /> Panteão Kage
                    </h2>
                    <p className="text-[10px] sm:text-xs text-red-500/80 font-bold uppercase tracking-widest mt-1">
                        As 15 obras soberanas das sombras.
                    </p>
                </div>
            </div>

            {/* GRADE DE OBRAS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {topPopulares.map((manga, index) => (
                    <div key={manga.id} onClick={() => onNavigate('details', manga)} className="cursor-pointer group flex flex-col gap-2 relative">
                        
                        <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0a0c] border border-white/5 shadow-md group-hover:border-red-600/50 group-hover:shadow-[0_8px_25px_rgba(220,38,38,0.2)] transition-all duration-300 ${dataSaver ? 'blur-[2px]' : ''}`}>
                            <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={(e) => e.target.src = `https://placehold.co/300x450/0A0A0C/dc2626?text=Oculto`} />
                            
                            {/* BADGE DE RANKING (Destaque para o Top 3) */}
                            <div className={`absolute top-2 left-2 w-9 h-9 rounded-xl bg-black/90 backdrop-blur-md border flex items-center justify-center shadow-lg z-10 
                                ${index === 0 ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 
                                  index === 1 ? 'border-gray-400/50' : 
                                  index === 2 ? 'border-amber-700/50' : 'border-red-900/50'}`}>
                                
                                {index === 0 && <Crown className="absolute -top-3 w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-md" />}
                                
                                <span className={`text-[11px] font-black 
                                    ${index === 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 
                                      index === 1 ? 'text-gray-300' : 
                                      index === 2 ? 'text-amber-600' : 'text-red-500'}`}>
                                    #{index + 1}
                                </span>
                            </div>

                            {/* BADGE DE NOTA */}
                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 shadow-lg z-10">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black text-white">{manga.rating ? Number(manga.rating).toFixed(1) : "0.0"}</span>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="px-1">
                            <h3 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-red-500 transition-colors">{manga.title}</h3>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest line-clamp-1 mt-0.5">{manga.genres?.join(', ') || 'Desconhecido'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MENSAGEM SE NÃO TIVER OBRAS SUFICIENTES */}
            {topPopulares.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0c]/50 rounded-3xl border border-white/5 border-dashed mt-8">
                    <Flame className="w-12 h-12 text-red-900/50 mb-4 animate-pulse" />
                    <p className="text-gray-500 font-black text-xs uppercase tracking-widest text-center px-4">
                        O Panteão está vazio.<br/> Nenhuma obra atingiu a glória necessária ainda.
                    </p>
                </div>
            )}
        </div>
    );
}
