import React, { useState } from 'react';
import { Search, Database, BookOpen } from 'lucide-react';

export function CatalogView({ mangas, onNavigate, dataSaver, catalogState, setCatalogState }) {
  const [search, setSearch] = useState('');
  
  // Lógica básica de filtro (mantida 100% igual ao seu original)
  const filteredMangas = mangas.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-700 bg-[#030305]">
      
      {/* NOVO HEADER DO CATÁLOGO: Minimalista, Reconfortante e Sem Lag */}
      <div className="mb-10 flex flex-col items-center text-center">
        
        {/* Título Elegante */}
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide mb-3">
          Acervo <span className="font-medium text-indigo-400">Infinito</span>
        </h1>
        <p className="text-sm text-gray-500 font-light max-w-lg mb-8">
          Navegue com tranquilidade por todas as obras disponíveis na plataforma.
        </p>

        {/* PAINEL DE DADOS SOFISTICADO (Seu contador atualizado) */}
        <div className="flex items-center justify-center gap-6 md:gap-10 p-5 rounded-[2rem] border border-white/5 bg-white/[0.01] w-full max-w-md mx-auto">
          
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-light text-white">{mangas.length}</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-medium mt-1">Total de Obras</span>
          </div>
          
          <div className="w-[1px] h-12 bg-white/10"></div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-light text-indigo-400">{filteredMangas.length}</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-medium mt-1">Resultados</span>
          </div>

        </div>
      </div>

      {/* BARRA DE PESQUISA SUAVE */}
      <div className="relative mb-12 max-w-xl mx-auto">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar pelo título..." 
          className="w-full bg-white/[0.02] border border-white/5 rounded-full py-4 pl-12 pr-6 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-colors"
        />
      </div>

      {/* GRID DE MANGAS REFINADO */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {filteredMangas.map(manga => (
          <div key={manga.id} onClick={() => onNavigate('details', manga)} className="cursor-pointer group flex flex-col gap-2">
            <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0a12] border border-white/5 group-hover:border-white/10 transition-colors duration-500 ${dataSaver ? 'blur-[1px]' : ''}`}>
                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 right-3">
                    <span className="bg-white/10 text-gray-200 text-[9px] font-medium px-2 py-1 rounded-lg backdrop-blur-md uppercase tracking-widest">
                        {manga.type || 'Mangá'}
                    </span>
                </div>
            </div>
            <h3 className="font-medium text-xs md:text-sm text-gray-300 line-clamp-2 leading-snug group-hover:text-white transition-colors duration-300 px-1">{manga.title}</h3>
          </div>
        ))}
      </div>
      
    </div>
  );
}
