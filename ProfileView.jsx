import React, { useState, useMemo } from 'react';
import { getAuth } from "firebase/auth";
import { app, auth, db } from './firebase'; 
import { Compass, Hexagon, Trophy, Clock, LogOut, ChevronRight, Dices, SlidersHorizontal as SettingsIcon, PenTool, Share2, MapPin, Calendar, Crown, BookOpen, Bookmark, Flame } from 'lucide-react';
import { timeAgo, cleanCosmeticUrl } from './helpers';
import { InfinityLogo } from './UIComponents';

// CARTÃO NEON DE ESTATÍSTICA (Inspirado na imagem)
const NeonStatCard = ({ icon: Icon, value, label, subLabel, colorClass, borderClass, shadowClass, bgClass }) => (
    <div className={`relative p-5 rounded-2xl border bg-[#050508]/80 overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${borderClass} ${shadowClass}`}>
        {/* Efeito de Fundo e Brilho */}
        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${bgClass} to-transparent pointer-events-none`}></div>
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Icon className="w-16 h-16" />
        </div>
        
        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2 mb-4">
                <div className={`p-1.5 rounded-lg border ${borderClass} bg-black/50`}>
                    <Icon className={`w-4 h-4 ${colorClass}`} />
                </div>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
            </div>
            <div>
                <span className={`text-3xl sm:text-4xl font-black ${colorClass} drop-shadow-md tracking-tighter`}>{value}</span>
                <p className="text-[10px] text-gray-500 font-medium mt-1">{subLabel}</p>
            </div>
        </div>
    </div>
);

export function ProfileView({ user, userProfileData, historyData, libraryData, dataLoaded, userSettings, updateSettings, onLogout, onUpdateData, showToast, mangas, onNavigate }) {
  const [activeTab, setActiveTab] = useState('Leituras Recentes');

  const totalFavorites = useMemo(() => Object.values(libraryData).filter(status => status === 'Favoritos').length, [libraryData]);
  
  // Matemática do XP Resolvida Localmente
  const currentLvl = userProfileData.level || 1;
  const currentXp = userProfileData.xp || 0;
  const xpTarget = currentLvl * 1000; 
  const xpNeededForNext = Math.max(0, xpTarget - currentXp);
  const xpProgress = Math.min(100, (currentXp / xpTarget) * 100);

  const eq = userProfileData.equipped_items || {};
  const activeAvatarSrc = cleanCosmeticUrl(eq.avatar?.preview) || cleanCosmeticUrl(userProfileData.avatarUrl) || user?.photoURL || `https://placehold.co/100x100/0A0E17/22d3ee?text=U`;
  const activeCoverSrc = cleanCosmeticUrl(eq.capa?.preview) || cleanCosmeticUrl(userProfileData.coverUrl) || `https://placehold.co/1200x600/1a0b2e/000000`;

  const tabsOptions = ['Leituras Recentes', 'Configurações Astral'];

  // Separa o nome para dar o efeito de duas cores (Ex: Daniel LINHARES)
  const nameParts = (user.displayName || "Leitor Elite").split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  // Formata a data de criação da conta se existir
  const creationTime = user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Desconhecido';

  return (
    <div className="pb-28 animate-in fade-in duration-500 bg-[#030305] min-h-screen relative font-sans text-white overflow-x-hidden">
      <style>{`body, html { background-color: #030305 !important; }`}</style>
      
      {/* HEADER: IMAGEM DE CAPA COM FADE INFERIOR PROFUNDO */}
      <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[60vh] z-0">
          <img src={activeCoverSrc} className="w-full h-full object-cover opacity-60 mix-blend-screen" alt="Capa" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/40 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 md:pt-32">
        
        {/* BLOCO SUPERIOR: AVATAR + NOME + LEVEL */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-8 relative">
            
            {/* AVATAR COM ANÉIS E VIP */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0">
                {/* Anéis de energia rodando */}
                <div className="absolute -inset-3 rounded-full border border-purple-500/30 border-dashed animate-[spin_15s_linear_infinite]"></div>
                <div className="absolute -inset-1 rounded-full border-[2px] border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0f1c] relative z-10 border-2 border-black">
                    <img src={activeAvatarSrc} className="w-full h-full object-cover" alt="Avatar" />
                </div>
                
                {/* Badge VIP+ */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-black text-[10px] px-4 py-1 rounded-full border-2 border-[#030305] shadow-[0_0_15px_rgba(245,158,11,0.6)] tracking-widest uppercase">
                    VIP+
                </div>

                {cleanCosmeticUrl(eq.moldura?.preview) && ( <img src={cleanCosmeticUrl(eq.moldura.preview)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none object-contain object-center z-30 pointer-events-none" /> )}
            </div>

            {/* INFO DO USUÁRIO */}
            <div className="flex-1 w-full text-center md:text-left flex flex-col md:block">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <Crown className="w-4 h-4 text-purple-500 fill-purple-500" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Leitor Elite /////</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter drop-shadow-xl mb-2 flex flex-col md:flex-row gap-0 md:gap-3 items-center md:items-baseline">
                    <span className="text-white">{firstName}</span>
                    {lastName && <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">{lastName}</span>}
                </h1>
                
                <p className="text-sm md:text-base text-gray-400 italic mb-6">"{userProfileData.bio || 'Lendo hoje, dominando amanhã.'}"</p>

                {/* BARRA DE PROGRESSO DE NÍVEL (Estilo lâmina de energia) */}
                <div className="w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-white uppercase tracking-widest"><span className="text-purple-500">NÍVEL</span> {currentLvl}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{currentXp} XP</span>
                    </div>
                    <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-visible">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-amber-300 shadow-[0_0_10px_rgba(236,72,153,0.8)] transition-all duration-1000" style={{ width: `${xpProgress}%` }}>
                            {/* Ponto de luz na ponta da barra */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
                        </div>
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold mt-2 uppercase tracking-widest">{xpTarget} XP para o Nível {currentLvl + 1}</p>
                </div>
            </div>
            
            {/* BOTÃO EDITAR PERFIL (Top Right no Desktop) */}
            <div className="hidden md:block absolute top-0 right-0">
                <button className="border border-white/20 text-white hover:bg-white/10 hover:border-white/50 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <PenTool className="w-3.5 h-3.5" /> Editar Perfil
                </button>
            </div>
        </div>

        {/* BOTÕES DE AÇÃO RÁPIDA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <button className="bg-transparent border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Trophy className="w-4 h-4" /> Resgatar Recompensas
            </button>
            <button className="bg-transparent border border-white/10 text-gray-300 hover:bg-white/5 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                <Trophy className="w-4 h-4" /> Ver Conquistas
            </button>
            <button className="bg-transparent border border-white/10 text-gray-300 hover:bg-white/5 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                <Share2 className="w-4 h-4" /> Compartilhar Perfil
            </button>
        </div>

        {/* OS 4 CARDS NEON DE STATUS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <NeonStatCard 
                icon={BookOpen} value={historyData.length} label="Capítulos Lidos" subLabel="Total de capítulos" 
                colorClass="text-purple-400" borderClass="border-purple-500/40" shadowClass="hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]" bgClass="from-purple-600" 
            />
            <NeonStatCard 
                icon={Bookmark} value={totalFavorites} label="Mangas Favoritos" subLabel="Mangas salvos" 
                colorClass="text-amber-400" borderClass="border-amber-500/40" shadowClass="hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]" bgClass="from-amber-600" 
            />
            <NeonStatCard 
                icon={Hexagon} value={userProfileData.crystals || 0} label="Cristais Nexo" subLabel="Moeda rara" 
                colorClass="text-blue-400" borderClass="border-blue-500/40" shadowClass="hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" bgClass="from-blue-600" 
            />
            <NeonStatCard 
                icon={Flame} value={userProfileData.coins || 0} label="Moedas Astrais" subLabel="Ganhos da jornada" 
                colorClass="text-rose-400" borderClass="border-rose-500/40" shadowClass="hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]" bgClass="from-rose-600" 
            />
        </div>

        {/* BLOCO INFERIOR: SOBRE MIM E EMBLEMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            {/* Card Sobre Mim */}
            <div className="bg-[#050508]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                    <Hexagon className="w-4 h-4 text-purple-500" />
                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sobre Mim</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    Apaixonado por mangás, histórias épicas e mundos que não têm limites. Explorando o infinito um capítulo de cada vez.
                </p>
                <div className="flex flex-wrap gap-3">
                    <div className="bg-black/50 border border-white/5 rounded-lg px-4 py-2 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" />
                        <span className="text-[10px] font-bold text-gray-300">Brasil</span>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-lg px-4 py-2 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[10px] font-bold text-gray-300">Membro desde {creationTime}</span>
                    </div>
                </div>
            </div>

            {/* Card Emblema Atual (Usando o InfinityLogo surreal) */}
            <div className="bg-[#050508]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col items-center justify-center text-center">
                <div className="absolute top-6 left-6 flex items-center gap-2">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Emblema Atual</h3>
                </div>
                
                {/* Ícone de Emblema */}
                <div className="w-32 h-32 mt-4 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full"></div>
                    <InfinityLogo className="w-full h-full relative z-10" />
                </div>
                
                <h4 className="text-base font-black text-white uppercase tracking-widest mt-2">Infinito</h4>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Leitor Supremo</p>
            </div>
        </div>

        {/* TABS E CONTEÚDOS INFERIORES (Histórico e Configurações) */}
        <div className="border-t border-white/10 pt-10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8">
                {tabsOptions.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeTab === tab ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-transparent hover:text-white hover:bg-white/5'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* CONTEÚDO DAS ABAS */}
            {activeTab === 'Leituras Recentes' && (
                <div className="bg-[#050508]/80 border border-white/5 rounded-2xl p-6">
                    {historyData.length === 0 ? <p className="text-center text-xs text-gray-500 py-6 uppercase tracking-widest font-black">O Vazio não registrou leituras.</p> : historyData.slice(0, 5).map(h => {
                        const m = mangas.find(m => m.id === h.mangaId);
                        if(!m) return null;
                        return (
                            <div key={h.id} onClick={() => onNavigate('details', m)} className="cursor-pointer flex items-center gap-4 bg-black/40 border border-white/5 rounded-xl p-3 mb-3 hover:border-purple-500/40 transition-colors group">
                                <img src={cleanCosmeticUrl(m.coverUrl)} className='w-10 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform' />
                                <div className='flex flex-col flex-1 gap-1'>
                                    <h4 className='font-bold text-sm text-gray-200 group-hover:text-purple-400 transition-colors'>{m.title}</h4>
                                    <span className='text-[10px] font-bold text-purple-400 w-max bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20'>Capítulo {h.chapterNumber}</span>
                                </div>
                                <ChevronRight className='w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors'/>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'Configurações Astral' && (
                <div className="bg-[#050508]/80 border border-white/5 rounded-2xl p-6">
                    <div className='bg-black/40 border border-white/5 rounded-xl p-4 mb-4 flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <span className='font-black text-sm text-white'>Modo de Leitura</span>
                            <span className='text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1'>Como você consome as memórias</span>
                        </div>
                        <select value={userSettings.readMode} onChange={(e) => updateSettings({ readMode: e.target.value })} className="bg-[#0a0f1c] border border-white/10 text-white text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-purple-500">
                            {['Cascata', 'Página'].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                    
                    <button onClick={onLogout} className="w-full mt-6 bg-transparent border border-rose-500/30 text-rose-400 rounded-xl font-black py-3.5 transition-all hover:bg-rose-500/10 tracking-widest text-[10px] uppercase flex justify-center items-center gap-2">
                        <LogOut className="w-4 h-4"/> Encerrar Conexão
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
