import React, { useState } from 'react';
import { Search, Database, BookOpen, Fingerprint } from 'lucide-react';

export function CatalogView({ mangas, onNavigate, dataSaver, catalogState, setCatalogState }) {
  const [search, setSearch] = useState('');
  
  const filteredMangas = mangas.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-700 bg-[#08080a] relative overflow-hidden">
      
      {/* Background Neon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full"></div>

      {/* HEADER HUD FUTURISTA */}
      <div className="mb-12 flex flex-col items-center text-center relative z-10">
        
        <div className="w-16 h-1 bg-cyan-500 mb-6 shadow-[0_0_15px_#22d3ee]"></div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase drop-shadow-lg">
          Arquivo <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Geral</span>
        </h1>
        
        {/* CONTADOR PIQUE PAINEL DE NAVE CYBERPUNK */}
        <div className="mt-8 flex items-stretch justify-center bg-[#050508] border border-cyan-500/30 rounded-2xl p-1 shadow-[0_0_30px_rgba(34,211,238,0.1)] w-full max-w-sm">
          <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-xl py-4 border border-white/5">
            <Fingerprint className="w-4 h-4 text-gray-500 mb-2" />
            <span className="text-3xl font-black text-white drop-shadow-md">{mangas.length}</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-cyan-500/80 font-black mt-1">Registros</span>
          </div>
          
          <div className="w-[1px] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent mx-1"></div>
          
          <div className="flex-1 flex flex-col items-center justify-center bg-cyan-950/30 rounded-xl py-4 border border-cyan-500/20 shadow-inner">
            <Database className="w-4 h-4 text-cyan-500 mb-2 animate-pulse" />
            <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]">{filteredMangas.length}</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-cyan-300 font-black mt-1">Filtrados</span>
          </div>
        </div>
      </div>

      <div className="relative mb-12 max-w-xl mx-auto z-10">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rastrear obra por título..." 
          className="w-full bg-[#050508] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all uppercase tracking-wider placeholder:text-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 relative z-10">
        {filteredMangas.map(manga => (
          <div key={manga.id} onClick={() => onNavigate('details', manga)} className="cursor-pointer group flex flex-col gap-3">
            <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#050508] border border-white/5 group-hover:border-cyan-500/50 shadow-lg group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-500 ${dataSaver ? 'blur-[1px]' : ''}`}>
                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 left-3">
                    <span className="bg-cyan-500/90 border border-cyan-400 text-black text-[9px] font-black px-2 py-1 rounded shadow-[0_0_10px_#22d3ee] uppercase tracking-[0.2em]">
                        {manga.type || 'Mangá'}
                    </span>
                </div>
            </div>
            <h3 className="font-bold text-xs md:text-sm text-gray-300 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors duration-300 text-center px-1">{manga.title}</h3>
          </div>
        ))}
      </div>
      
    </div>
  );
}
