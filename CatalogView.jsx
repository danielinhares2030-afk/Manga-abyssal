import React, { useState } from 'react';
import { Search, Filter, BookOpen, ChevronRight, Hash, Database } from 'lucide-react';
import { timeAgo } from './helpers';

export function CatalogView({ mangas, onNavigate, dataSaver, catalogState, setCatalogState }) {
  const [search, setSearch] = useState('');
  
  // Lógica básica de filtro (mantenha a sua se for diferente)
  const filteredMangas = mangas.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
      
      {/* NOVO SISTEMA DE INFORMAÇÕES (Header do Catálogo) */}
      <div className="bg-[#05030a] border border-cyan-900/40 rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* Efeito Holográfico no fundo do card */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-600/10 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-wide">
            <Database className="w-8 h-8 text-cyan-400" />
            Catálogo Infinito
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">Explore a vastidão do acervo. Todos os mundos em um só lugar.</p>
        </div>

        {/* PAINEL DE DADOS PREMIUM: AQUI MOSTRA QUANTAS OBRAS TEM */}
        <div className="flex items-center gap-4 bg-[#0a0515] border border-cyan-500/30 p-4 rounded-2xl shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] z-10 w-full md:w-auto justify-center">
          <div className="flex flex-col items-center px-4 border-r border-white/10">
            <span className="text-cyan-500 font-black text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{mangas.length}</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">Total de Obras</span>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-fuchsia-400 font-black text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">{filteredMangas.length}</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">Resultados</span>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar no banco de dados..." 
          className="w-full bg-[#0a0515] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500 transition-all shadow-inner"
        />
      </div>

      {/* Grid de Mangas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {filteredMangas.map(manga => (
          <div key={manga.id} onClick={() => onNavigate('details', manga)} className="cursor-pointer group flex flex-col gap-2">
            <div className={`relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0d0d12] border border-white/5 shadow-lg group-hover:border-cyan-500/50 transition-all duration-300 ${dataSaver ? 'blur-[1px]' : ''}`}>
                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020105]/90 via-[#020105]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-2 left-2 right-2">
                    <span className="bg-cyan-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider shadow-md">
                        {manga.type || 'Mangá'}
                    </span>
                </div>
            </div>
            <h3 className="font-bold text-xs md:text-sm text-gray-200 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors duration-300 px-1">{manga.title}</h3>
          </div>
        ))}
      </div>
      
    </div>
  );
}
