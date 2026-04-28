import React, { useState, useEffect, useRef } from 'react';
import { Compass, History, Library, Smartphone, Camera, Edit3, LogOut, Loader2, BookOpen, AlertTriangle, Trophy, Zap, Trash2, RefreshCw, LayoutTemplate, Settings, Crown, Flame, Scroll, Users, Shield } from 'lucide-react';
import { updateProfile } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import { APP_ID } from './constants';
import { compressImage, getLevelRequirement, getLevelTitle, cleanCosmeticUrl } from './helpers';

// CARTÃO ALQUÍMICO / MÁGICO PARA PERFIL
const AlchemyCard = ({ children, className = "" }) => (
  <div className={`bg-[#0a0f1c]/90 border border-[#b59410]/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(181,148,16,0.1)] relative overflow-hidden backdrop-blur-xl ${className}`}>
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#b59410]/60 to-transparent"></div>
     <div className="relative z-10">{children}</div>
  </div>
);

// EMBLEMA DE CONQUISTA
const AchievementBadge = ({ icon: Icon, title, description, isUnlocked, colorClass }) => (
  <div className={`flex flex-col items-center p-3 border rounded-xl transition-all duration-500 ${isUnlocked ? `bg-[#050505]/80 border-[#b59410]/50 shadow-[0_0_15px_rgba(181,148,16,0.2)] ${colorClass}` : 'bg-black/40 border-white/5 opacity-50 grayscale'}`}>
    <Icon className={`w-8 h-8 mb-2 ${isUnlocked ? '' : 'text-gray-500'}`} />
    <span className={`font-black text-[10px] uppercase tracking-wider text-center line-clamp-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{title}</span>
    <span className="text-[8px] text-gray-400 font-medium text-center line-clamp-2 mt-1">{description}</span>
  </div>
);

const HexStat = ({ icon: Icon, value, label, color }) => (
  <div className="relative flex flex-col items-center justify-center w-24 h-24 flex-shrink-0 group">
    <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full opacity-10 group-hover:opacity-30 transition-opacity duration-500 z-0 ${color}`}>
      <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" fill="currentColor" />
    </svg>
    <div className="relative z-10 flex flex-col items-center justify-center px-1 text-center w-full">
      <Icon className={`w-5 h-5 mb-1 ${color} drop-shadow-md`} />
      <span className="text-base font-black text-white tracking-tighter truncate w-full px-2">{value}</span>
      <span className="text-[8px] text-[#b59410] uppercase font-black tracking-widest mt-0.5 truncate w-full px-1">{label}</span>
    </div>
  </div>
);

export function ProfileView({ user, userProfileData, historyData, libraryData, dataLoaded, userSettings, updateSettings, onLogout, onUpdateData, showToast, mangas, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Estatísticas"); 
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [coverBase64, setCoverBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); 

  useEffect(() => {
    setName(user.displayName || ''); setBio(userProfileData.bio || ''); setAvatarBase64(userProfileData.avatarUrl || user.photoURL || ''); setCoverBase64(userProfileData.coverUrl || '');
  }, [user, userProfileData]);
  
  const avatarInputRef = useRef(null); const coverInputRef = useRef(null);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0]; if (!file) return;
    try { const compressedBase64 = await compressImage(file, type === 'cover' ? 400 : 150, 0.4); if (type === 'avatar') setAvatarBase64(compressedBase64); else setCoverBase64(compressedBase64); } catch (err) { showToast("Erro na imagem.", "error"); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await updateProfile(auth.currentUser, { displayName: name }); const docData = { coverUrl: coverBase64, avatarUrl: avatarBase64, bio: bio }; await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), docData, { merge: true }); onUpdateData(docData); showToast('Perfil atualizado!', 'success'); setIsEditing(false); } catch (error) { showToast(`Erro ao salvar.`, 'error'); } finally { setLoading(false); }
  };

  const executeConfirmAction = async () => {
      if (confirmAction === 'history') { try { historyData.forEach(async (h) => { await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'history', h.id)); }); showToast("Memórias apagadas.", "success"); } catch(e) { showToast("Erro ao limpar.", "error"); } } 
      else if (confirmAction === 'cache') { localStorage.clear(); sessionStorage.clear(); window.location.reload(true); }
      setConfirmAction(null);
  };

  const level = userProfileData.level || 1; const currentXp = userProfileData.xp || 0; const xpNeeded = getLevelRequirement(level); const progressPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const lidosSet = new Set(historyData.map(h => h.mangaId)); const obrasLidasIds = Array.from(lidosSet); const libraryMangaIds = Object.keys(libraryData); const libraryMangas = mangas.filter(m => libraryMangaIds.includes(m.id));
  const eq = userProfileData.equipped_items || {};

  const activeAvatarSrc = (eq.avatar?.preview ? cleanCosmeticUrl(eq.avatar.preview) : null) || avatarBase64 || `https://placehold.co/150x150/0A0E17/22d3ee?text=U`;

  // Lógica de Conquistas Reais
  const readCount = historyData.length;
  const favCount = Object.keys(libraryData).length;
  const crystalsCount = userProfileData.crystals || 0;
  const coinsCount = userProfileData.coins || 0;

  return (
    <div className={`animate-in fade-in duration-500 w-full pb-24 font-sans min-h-screen text-gray-200 bg-[#030305] overflow-x-hidden`}>
      
      {/* Fundo Mágico / Cósmico */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-[#030305] to-[#030305] pointer-events-none z-0"></div>

      {/* Modal de Confirmação (Alquímico) */}
      {confirmAction && (
          <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-[#0a0f1c] border border-[#b59410]/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_40px_rgba(181,148,16,0.2)]">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Confirmar Ação?</h3>
                  <p className="text-sm text-gray-400 mb-8 font-medium">{confirmAction === 'history' ? 'O tomo do tempo será apagado permanentemente.' : 'O grimório será recarregado para limpar o fluxo mágico.'}</p>
                  <div className="flex gap-4">
                      <button onClick={() => setConfirmAction(null)} className="flex-1 bg-[#050505] border border-white/10 text-gray-300 font-black py-3 rounded-xl hover:bg-white/5 transition-colors text-xs uppercase tracking-widest">Recuar</button>
                      <button onClick={executeConfirmAction} className="flex-1 bg-red-600/20 text-red-500 border border-red-500/40 font-black py-3 rounded-xl transition-colors hover:bg-red-500 hover:text-white text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.3)]">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      {/* HEADER: IMAGEM DE CAPA COM FADE */}
      <div className="w-full h-[200px] md:h-[280px] bg-[#050505] relative group overflow-hidden border-b border-[#b59410]/30 z-0">
        {cleanCosmeticUrl(eq.capa_fundo?.preview) ? ( 
            <img src={cleanCosmeticUrl(eq.capa_fundo.preview)} className={`w-full h-full object-cover object-center opacity-70 mix-blend-screen ${eq.capa_fundo.cssClass || ''}`} /> 
        ) : coverBase64 ? ( 
            <img src={coverBase64} className="w-full h-full object-cover object-center opacity-70 mix-blend-screen" /> 
        ) : ( 
            <div className={`w-full h-full bg-gradient-to-br from-purple-900/30 to-amber-900/30 ${eq.capa_fundo?.cssClass || ''}`} /> 
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/40 to-transparent" />
        
        {isEditing && (
            <button onClick={() => coverInputRef.current.click()} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[#b59410] border border-[#b59410]/50 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold z-10 hover:bg-[#b59410] hover:text-black transition-all shadow-[0_0_15px_rgba(181,148,16,0.3)]">
                <Camera className="w-4 h-4" /> Alterar Capa
            </button>
        )}
        <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* BLOCO SUPERIOR: AVATAR + INFO */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 mb-10 relative -mt-20 md:-mt-24">
          
          <div className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center flex-shrink-0 group ${(!eq.moldura?.preview && eq.moldura) ? eq.moldura.cssClass : ''}`}>
            
            {/* Anéis de energia Mágica */}
            <div className="absolute -inset-3 rounded-full border border-[#b59410]/30 border-dashed animate-[spin_15s_linear_infinite]"></div>
            <div className="absolute -inset-1 rounded-full border-[2px] border-[#b59410]/50 shadow-[0_0_20px_rgba(181,148,16,0.4)]"></div>

            <div className={`w-full h-full rounded-full bg-[#050505] flex items-center justify-center relative z-10 overflow-hidden shadow-2xl ${!eq.moldura ? 'border-[3px] border-[#030305]' : ''}`}>
               <img src={activeAvatarSrc} className={`w-full h-full object-cover ${eq.avatar?.cssClass || ''}`} alt="Avatar" />
            </div>
            
            {cleanCosmeticUrl(eq.particulas?.preview) && ( <img src={cleanCosmeticUrl(eq.particulas.preview)} className={`absolute inset-[-50%] m-auto w-[200%] h-[200%] object-contain z-0 ${eq.particulas.cssClass || ''}`} style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
            {cleanCosmeticUrl(eq.efeito?.preview) && ( <img src={cleanCosmeticUrl(eq.efeito.preview)} className={`absolute inset-0 m-auto w-full h-full object-contain z-20 ${eq.efeito.cssClass || ''}`} style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
            {cleanCosmeticUrl(eq.moldura?.preview) && ( <img src={cleanCosmeticUrl(eq.moldura.preview)} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none object-contain object-center z-30 pointer-events-none ${eq.moldura.cssClass || ''}`} /> )}

            {isEditing && <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-1 right-1 bg-[#b59410] text-black p-3 rounded-full z-50 border-4 border-[#030305] hover:bg-yellow-500 transition-colors shadow-[0_0_15px_rgba(181,148,16,0.6)]"><Camera className="w-4 h-4" /></button>}
            <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
          </div>

          <div className="flex-1 text-center md:text-left pb-4">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Crown className="w-4 h-4 text-[#b59410] fill-[#b59410]" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Magister Elite /////</span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-black tracking-tighter drop-shadow-xl flex flex-col md:flex-row items-center gap-1 md:gap-3 ${eq.nickname ? eq.nickname.cssClass : 'text-white'}`}>
                {name || 'Explorador'}
            </h1>
            <p className="text-gray-400 font-medium text-xs mt-1.5 drop-shadow-sm">{user.email}</p>
            
            <div className="mt-4 bg-gradient-to-r from-[#1a1405] to-[#0f0c03] border border-[#b59410]/40 inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(181,148,16,0.15)]">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Arcânia {level} • {getLevelTitle(level)}</span>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto pb-4 justify-center md:justify-end">
            <button onClick={() => setIsEditing(!isEditing)} className="flex-1 md:flex-none bg-[#050505] border border-[#b59410]/50 text-[#b59410] px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#b59410] hover:text-black transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(181,148,16,0.1)]">
                <Edit3 className="w-4 h-4" /> {isEditing ? 'Selar' : 'Transmutar'}
            </button>
            <button onClick={onLogout} className="bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-500/20 shadow-md">
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {bio && !isEditing && <p className="text-gray-300 text-sm mb-10 font-medium bg-[#0a0f1c]/60 p-5 rounded-2xl border border-[#b59410]/20 whitespace-pre-wrap italic backdrop-blur-md text-center md:text-left">"{bio}"</p>}

        {/* MODO DE EDIÇÃO */}
        {isEditing && (
          <AlchemyCard className="mb-10">
            <div className="space-y-5">
              <div>
                 <label className="block text-[10px] font-black text-[#b59410] mb-2 uppercase tracking-widest">Nome do Magister</label>
                 <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-4 text-white text-sm font-medium outline-none focus:border-[#b59410] transition-colors shadow-inner"/>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-[#b59410] mb-2 uppercase tracking-widest">Grimório Pessoal (Bio)</label>
                 <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-4 text-white text-sm font-medium resize-none outline-none focus:border-[#b59410] transition-colors shadow-inner"></textarea>
              </div>
            </div>
            <button onClick={handleSave} disabled={loading} className="mt-6 bg-gradient-to-r from-[#b59410] to-[#fbd38d] text-black text-xs font-black px-8 py-4 rounded-xl w-full flex justify-center hover:opacity-90 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(181,148,16,0.4)]">
                {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Selar Novo Pacto'}
            </button>
          </AlchemyCard>
        )}

        {/* ESTATÍSTICAS E BARRA DE XP (MÁGICA) */}
        <AlchemyCard className="mb-10">
            <div className="flex gap-2 overflow-x-auto flex-nowrap no-scrollbar pb-2 snap-x justify-start sm:justify-around items-center w-full">
                <HexStat icon={Library} value={!dataLoaded ? '--' : Object.keys(libraryData).length} label="Favoritos" color="text-amber-400" />
                <HexStat icon={BookOpen} value={!dataLoaded ? '--' : historyData.length} label="Lidos" color="text-purple-400" />
                <HexStat icon={Zap} value={`${progressPercent.toFixed(0)}%`} label="Poder Arcânio" color="text-blue-400" />
                <HexStat icon={LayoutTemplate} value={getLevelTitle(level).split(' ')[0]} label="Patente" color="text-emerald-400" />
            </div>
            
            {/* Lâmina de Energia XP */}
            <div className="mt-8 relative">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Essência Atual: {currentXp} XP</span>
                    <span className="text-[10px] font-black text-[#b59410] uppercase tracking-widest">{xpNeeded} XP Necessário</span>
                </div>
                <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-visible border border-white/5 relative">
                     <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}>
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
                     </div>
                </div>
            </div>
        </AlchemyCard>

        {/* SISTEMA DE CONQUISTAS REAIS (EMBLEMAS) */}
        <AlchemyCard className="mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-[#b59410]/30 pb-5">
            <Trophy className="w-6 h-6 text-[#b59410]" />
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Livro das Conquistas</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <AchievementBadge icon={Scroll} title="Iniciado" description="Lê 10 tomos." isUnlocked={readCount >= 10} colorClass="text-emerald-400" />
            <AchievementBadge icon={Users} title="Guardião" description="5 favoritos no Nexo." isUnlocked={favCount >= 5} colorClass="text-yellow-400" />
            <AchievementBadge icon={Hexagon} title="Coletor Nexo" description="Acumula 50 cristais." isUnlocked={crystalsCount >= 50} colorClass="text-blue-400" />
            <AchievementBadge icon={Flame} title="Ouro Astral" description="Coleta 1000 moedas." isUnlocked={coinsCount >= 1000} colorClass="text-red-400" />
            <AchievementBadge icon={Shield} title="Mestre Elite" description="Alcança Arcânia 10." isUnlocked={level >= 10} colorClass="text-purple-400" />
          </div>
        </AlchemyCard>

        {/* SELETOR DE ABAS MÁGICAS */}
        <div className="mb-8 border-b border-white/10">
          <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x px-1">
            {['Estatísticas', 'Histórico', 'Configurações'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`snap-start px-5 pb-4 font-black transition-all whitespace-nowrap text-[11px] sm:text-xs uppercase tracking-[0.2em] flex items-center gap-2 relative group
              ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {tab}
                {activeTab === tab && (
                    <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[70%] h-[3px] bg-gradient-to-r from-[#b59410] to-[#fbd38d] rounded-t-full shadow-[0_0_10px_rgba(181,148,16,0.6)]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* CONTEÚDO DAS ABAS */}
        {activeTab === "Estatísticas" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
            <div className="bg-[#0a0f1c]/80 backdrop-blur-md border border-[#b59410]/20 p-6 rounded-2xl flex flex-col shadow-lg hover:border-[#b59410]/50 transition-colors">
                <div className="flex justify-between items-center mb-2"><span className="text-[9px] text-[#b59410] uppercase font-black tracking-widest">Tomos Salvos</span> <Library className="w-4 h-4 text-amber-500/50"/></div>
                <span className="text-3xl font-black text-white">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : Object.keys(libraryData).length}</span>
            </div>
            <div className="bg-[#0a0f1c]/80 backdrop-blur-md border border-[#b59410]/20 p-6 rounded-2xl flex flex-col shadow-lg hover:border-[#b59410]/50 transition-colors">
                <div className="flex justify-between items-center mb-2"><span className="text-[9px] text-[#b59410] uppercase font-black tracking-widest">Capítulos Lidos</span> <BookOpen className="w-4 h-4 text-purple-500/50"/></div>
                <span className="text-3xl font-black text-white">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : historyData.length}</span>
            </div>
            <div className="bg-[#0a0f1c]/80 backdrop-blur-md border border-[#b59410]/20 p-6 rounded-2xl flex flex-col shadow-lg hover:border-[#b59410]/50 transition-colors">
                <div className="flex justify-between items-center mb-2"><span className="text-[9px] text-[#b59410] uppercase font-black tracking-widest">Obras Iniciadas</span> <Compass className="w-4 h-4 text-blue-500/50"/></div>
                <span className="text-3xl font-black text-white">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : obrasLidasIds.length}</span>
            </div>
            <div className="bg-[#0a0f1c]/80 backdrop-blur-md border border-[#b59410]/20 p-6 rounded-2xl flex flex-col shadow-lg hover:border-[#b59410]/50 transition-colors">
                <div className="flex justify-between items-center mb-2"><span className="text-[9px] text-[#b59410] uppercase font-black tracking-widest">Total XP</span> <Zap className="w-4 h-4 text-emerald-500/50"/></div>
                <span className="text-3xl font-black text-white">{currentXp}</span>
            </div>
          </div>
        )}

        {activeTab === "Histórico" && (
            <AlchemyCard className="animate-in fade-in">
                {historyData.length === 0 ? (
                    <div className="text-center py-10"><History className="w-12 h-12 mx-auto text-[#b59410]/40 mb-4"/><p className="text-gray-400 text-xs font-black uppercase tracking-widest">O Grimório não possui registros de leitura.</p></div>
                ) : (
                   <div className="flex flex-col gap-4">
                      {historyData.slice(0, 15).map(hist => {
                          const mg = mangas.find(m => m.id === hist.mangaId);
                          return (
                              <div key={hist.id} onClick={() => { if(mg) onNavigate('details', mg); }} className="bg-[#050505] border border-white/5 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-[#b59410]/50 transition-colors group shadow-sm">
                                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-[#b59410]/30">{mg ? <img src={mg.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <BookOpen className="w-5 h-5 m-auto mt-5 text-[#b59410]/50"/>}</div>
                                  <div className="flex-1"><h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#b59410] transition-colors">{hist.mangaTitle}</h4><p className="text-[#b59410] font-black text-[10px] uppercase tracking-widest mt-1.5">Capítulo {hist.chapterNumber}</p></div>
                                  <p className="text-[9px] text-gray-500 font-bold uppercase">{new Date(hist.timestamp).toLocaleDateString()}</p>
                              </div>
                          )
                      })}
                      <button onClick={() => setConfirmAction('history')} className="mt-6 w-full py-4 bg-transparent border border-red-500/30 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-colors flex justify-center items-center gap-2"><Trash2 className="w-4 h-4"/> Limpar Tomo de Histórico</button>
                   </div>
                )}
            </AlchemyCard>
        )}

        {activeTab === "Configurações" && (
            <div className="animate-in fade-in space-y-6">
                <AlchemyCard>
                  <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3"><Settings className="w-5 h-5 text-[#b59410]"/> Preferências Arcanas</h3>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest">Modo de Leitura</p>
                      <p className="text-xs text-gray-400 mt-1">Como você consome as memórias.</p>
                    </div>
                    <select value={userSettings?.readMode || 'Cascata'} onChange={(e) => { updateSettings({ readMode: e.target.value }); showToast("Preferência atualizada.", "success"); }} className="bg-[#050505] border border-[#b59410]/30 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-[#b59410] shadow-sm">
                      <option value="Cascata">Cascata</option>
                      <option value="Paginação">Páginas</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest">Magia de Economia (Dados)</p>
                      <p className="text-xs text-gray-400 mt-1">Reduz o custo mágico das imagens.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={userSettings?.dataSaver || false} onChange={(e) => { updateSettings({ dataSaver: e.target.checked }); showToast("Preferência atualizada.", "success"); }} />
                      <div className="w-12 h-6 bg-[#050505] border border-white/20 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[4px] after:bg-gray-400 peer-checked:after:bg-[#050505] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#b59410] peer-checked:to-[#fbd38d]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest">Aura do Sistema (Tema)</p>
                      <p className="text-xs text-gray-400 mt-1">Padrão de cores da interface.</p>
                    </div>
                    <select value={userSettings?.theme || 'Escuro'} onChange={(e) => { updateSettings({ theme: e.target.value }); showToast("Aura aplicada.", "success"); }} className="bg-[#050505] border border-[#b59410]/30 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-[#b59410] shadow-sm">
                      <option value="Escuro">Escuro</option>
                      <option value="Amoled">Vazio Absoluto</option>
                    </select>
                  </div>
                </AlchemyCard>

                <AlchemyCard>
                    <button onClick={() => setConfirmAction('cache')} className="flex items-center justify-between w-full text-left group">
                        <div>
                            <p className="text-sm font-black text-white uppercase tracking-widest group-hover:text-[#b59410] transition-colors">Limpar Fluxo Mágico (Cache)</p>
                            <p className="text-xs text-gray-400 mt-1">Resolve distorções e atualiza o nexo.</p>
                        </div>
                        <RefreshCw className="w-5 h-5 text-gray-500 group-hover:text-[#b59410] group-hover:rotate-180 transition-all duration-500" />
                    </button>
                </AlchemyCard>
            </div>
        )}
      </div>
    </div>
  );
}
