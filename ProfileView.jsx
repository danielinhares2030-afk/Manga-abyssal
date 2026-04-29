import React, { useState, useEffect, useRef } from 'react';
import { Compass, History, Library, Camera, Edit3, LogOut, Loader2, BookOpen, AlertTriangle, Trophy, Zap, Trash2, RefreshCw, Settings, Flame, Eye, Bookmark, Hexagon, Crown, Ghost, Lock, Sparkles, Box, ChevronRight, Swords, Moon } from 'lucide-react';
import { updateProfile } from "firebase/auth";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import { APP_ID } from './constants';
import { compressImage, getLevelRequirement, getLevelTitle, cleanCosmeticUrl, timeAgo, getRarityColor } from './helpers';

// CARTÃO SOMBRIO KAGE
const ShadowCard = ({ children, className = "" }) => (
  <div className={`bg-[#0a0a0c]/90 border border-red-600/30 rounded-xl p-5 md:p-7 shadow-[0_0_40px_rgba(220,38,38,0.1)] relative overflow-hidden backdrop-blur-xl ${className}`}>
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent"></div>
     <div className="relative z-10">{children}</div>
  </div>
);

// COMPONENTE DE EMBLEMA EQUIPÁVEL
const AchievementBadge = ({ badge, isEquipped, onEquip }) => (
  <div className={`flex flex-col items-center p-3 sm:p-4 border transition-all duration-300 relative group rounded-lg overflow-hidden ${
    badge.condition 
      ? isEquipped
        ? 'bg-gradient-to-br from-red-950/50 to-[#030305] border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]'
        : 'bg-[#0a0a0c]/80 border-white/5 hover:border-red-600/50 hover:bg-[#0f0f13] shadow-md'
      : 'bg-[#030305]/50 border-white/5 opacity-50 grayscale'
  }`}>
    <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest z-10 border shadow-sm ${ badge.condition ? (isEquipped ? 'bg-red-950/80 border-red-500/50 text-red-400' : 'bg-black/80 border-white/10 text-gray-400') : 'bg-black/40 border-white/5 text-gray-600' }`}>
       NVL {badge.level}
    </div>
    <div className={`w-12 h-12 mt-2 mb-3 rounded-lg flex items-center justify-center relative transition-transform duration-300 group-hover:scale-110 ${ badge.condition ? (isEquipped ? 'bg-red-900/40 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-black/50 border border-white/10') : 'bg-transparent' }`}>
        <badge.icon className={`w-6 h-6 ${badge.condition ? badge.colorClass : 'text-gray-600'} drop-shadow-lg z-10`} />
    </div>
    <span className={`font-black text-[10px] uppercase tracking-widest text-center line-clamp-1 mb-1 z-10 ${ badge.condition ? (isEquipped ? 'text-red-400' : 'text-white') : 'text-gray-500' }`}>
        {badge.title}
    </span>
    <span className="text-[8px] text-gray-400 font-bold text-center line-clamp-2 mb-4 px-1 leading-tight z-10 h-6">
        {badge.description}
    </span>
    {badge.condition ? (
        <button onClick={() => onEquip(badge)} className={`w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 z-10 ${ isEquipped ? 'bg-red-600 text-white' : 'bg-transparent border border-red-600/30 text-red-500 hover:bg-red-900/40' }`}>
            {isEquipped ? 'Equipado' : 'Equipar'}
        </button>
    ) : (
        <div className="w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-black/40 border border-white/5 text-gray-600 flex justify-center items-center gap-1.5 z-10">
            <Lock className="w-3 h-3" /> Oculto
        </div>
    )}
  </div>
);

export function ProfileView({ user, userProfileData, historyData, libraryData, dataLoaded, userSettings, updateSettings, onLogout, onUpdateData, showToast, mangas, onNavigate, shopItems = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Estatísticas"); 
  const [inventoryCategory, setInventoryCategory] = useState("avatar");
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
    try { await updateProfile(auth.currentUser, { displayName: name }); const docData = { coverUrl: coverBase64, avatarUrl: avatarBase64, bio: bio }; await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), docData, { merge: true }); onUpdateData(docData); showToast('Perfil forjado!', 'success'); setIsEditing(false); } catch (error) { showToast(`Erro ao salvar.`, 'error'); } finally { setLoading(false); }
  };

  const handleEquipCosmetic = async (item) => {
    try {
        const profileRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main');
        const currentEquipped = userProfileData.equipped_items || {};
        let cat = (item.categoria || item.type || '').toLowerCase();
        if (cat === 'capa') cat = 'capa_fundo';
        const isEquipped = currentEquipped[cat]?.id === item.id;
        const newEquipped = { ...currentEquipped };
        if (isEquipped) delete newEquipped[cat];
        else newEquipped[cat] = item;
        await updateDoc(profileRef, { equipped_items: newEquipped });
        onUpdateData({ equipped_items: newEquipped });
        showToast(isEquipped ? "Desequipado." : `${item.nome} equipado.`, "success");
    } catch (e) { showToast("Erro ao equipar.", "error"); }
  };

  const executeConfirmAction = async () => {
      if (confirmAction === 'history') { try { historyData.forEach(async (h) => { await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'history', h.id)); }); showToast("Memórias apagadas.", "success"); } catch(e) { showToast("Erro ao limpar.", "error"); } } 
      else if (confirmAction === 'cache') { localStorage.clear(); sessionStorage.clear(); window.location.reload(true); }
      setConfirmAction(null);
  };

  const level = userProfileData.level || 1; const currentXp = userProfileData.xp || 0; const xpNeeded = getLevelRequirement(level); const progressPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const obrasLidasIds = Array.from(new Set(historyData.map(h => h.mangaId)));
  const eq = userProfileData.equipped_items || {};
  const activeAvatarSrc = (eq.avatar?.preview ? cleanCosmeticUrl(eq.avatar.preview) : null) || avatarBase64 || `https://placehold.co/150x150/0A0E17/22d3ee?text=K`;

  const badgesList = [
    { id: 'iniciado', level: 1, icon: Eye, title: "Olho do Corvo", description: "Lê 10 capítulos no sistema.", condition: historyData.length >= 10, colorClass: "text-red-500" },
    { id: 'guardiao', level: 2, icon: Bookmark, title: "Pacto Sombrio", description: "5 obras favoritadas.", condition: Object.keys(libraryData).length >= 5, colorClass: "text-purple-500" },
    { id: 'mestre', level: 5, icon: Ghost, title: "Espectro Kage", description: "Alcance o Nível 10.", condition: level >= 10, colorClass: "text-rose-500" }
  ];

  return (
    <div className={`animate-in fade-in duration-300 w-full pb-24 font-sans min-h-screen text-gray-200 bg-[#030305] overflow-x-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/15 via-[#030305] to-[#000000] pointer-events-none z-0"></div>

      {confirmAction && (
          <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-[#0a0a0c] border border-red-600/50 p-8 rounded-xl max-w-sm w-full text-center shadow-[0_0_40px_rgba(220,38,38,0.2)]">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase">Confirmar Ação?</h3>
                  <p className="text-sm text-gray-400 mb-8">{confirmAction === 'history' ? 'O registro do tempo será apagado permanentemente.' : 'A matriz será recarregada.'}</p>
                  <div className="flex gap-4">
                      <button onClick={() => setConfirmAction(null)} className="flex-1 bg-[#050505] border border-white/10 text-gray-300 font-black py-3 rounded-lg text-xs uppercase">Recuar</button>
                      <button onClick={executeConfirmAction} className="flex-1 bg-red-600 text-white font-black py-3 rounded-lg text-xs uppercase shadow-lg">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      <div className="w-full h-[240px] md:h-[320px] bg-[#050505] relative group overflow-hidden border-b border-red-900/40 z-0">
        {cleanCosmeticUrl(eq.capa_fundo?.preview) ? ( <img src={cleanCosmeticUrl(eq.capa_fundo.preview)} className="w-full h-full object-cover opacity-70" /> ) : coverBase64 ? ( <img src={coverBase64} className="w-full h-full object-cover opacity-60" /> ) : ( <div className="w-full h-full bg-gradient-to-br from-red-950 to-black" /> )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent" />
        {isEditing && ( <button onClick={() => coverInputRef.current.click()} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-red-500 border border-red-600/50 px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-black uppercase z-10 hover:bg-red-600 hover:text-white transition-all"><Camera className="w-4 h-4" /> Capa</button> )}
        <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10 relative -mt-24 md:-mt-28">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center flex-shrink-0 group">
            <div className="absolute -inset-4 rounded-full border border-red-600/20 border-dashed animate-[spin_20s_linear_infinite]"></div>
            <div className={`w-full h-full rounded-full bg-[#050505] flex items-center justify-center relative z-10 overflow-hidden shadow-2xl border-[4px] border-[#030305] ${eq.avatar?.cssClass || ''}`}>
               {(eq.avatar?.css) && ( <style dangerouslySetInnerHTML={{__html: `.${eq.avatar.cssClass} { ${eq.avatar.css} } ${eq.avatar.animacao || ''}`}} /> )}
               <img src={activeAvatarSrc} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            {eq.moldura?.preview && ( <img src={cleanCosmeticUrl(eq.moldura.preview)} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none object-contain z-30 pointer-events-none ${eq.moldura.cssClass || ''}`} /> )}
            {isEditing && <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-2 right-2 bg-red-600 text-white p-3.5 rounded-full z-50 border-4 border-[#030305] hover:bg-red-500 shadow-xl"><Camera className="w-5 h-5" /></button>}
            <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
          </div>

          <div className="flex-1 bg-[#0a0a0c]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl shadow-xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
              <div>
                  <h1 className={`text-4xl md:text-5xl font-black tracking-tighter drop-shadow-xl mb-1 ${eq.nickname ? eq.nickname.cssClass : 'text-white'}`}>
                      {eq.nickname?.css && ( <style dangerouslySetInnerHTML={{__html: `.${eq.nickname.cssClass} { ${eq.nickname.css} }`}} /> )}
                      {name || 'Oculto'}
                  </h1>
                  <p className="text-gray-500 font-bold text-xs">{user.email}</p>
                  <div className="mt-4 flex gap-3 flex-wrap justify-center md:justify-start">
                      <div className="bg-[#030305] border border-red-600/40 px-4 py-2 rounded-lg text-xs font-black text-amber-500 uppercase tracking-widest">Nível {level} • {getLevelTitle(level)}</div>
                  </div>
              </div>
              <div className="flex gap-3">
                  <button onClick={() => setIsEditing(!isEditing)} className="bg-[#050505] border border-red-600/50 text-red-500 px-6 py-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"><Edit3 className="w-4 h-4 inline mr-2" /> {isEditing ? 'Selar' : 'Forjar'}</button>
                  <button onClick={onLogout} className="bg-red-500/10 text-red-400 p-3.5 rounded-lg border border-red-500/20"><LogOut className="w-4 h-4" /></button>
              </div>
          </div>
        </div>
        
        {bio && !isEditing && <p className="text-gray-400 text-sm mb-10 font-bold bg-[#0a0a0c] p-6 rounded-xl border-l-4 border-red-600 italic">"{bio}"</p>}

        {isEditing && (
          <ShadowCard className="mb-10 animate-in fade-in duration-300">
            <div className="space-y-6">
              <div><label className="block text-[10px] font-black text-red-500 mb-2 uppercase">Nome nas Sombras</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-5 py-4 text-white text-sm outline-none focus:border-red-600"/></div>
              <div><label className="block text-[10px] font-black text-red-500 mb-2 uppercase">Bio</label><textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-[#050505] border border-white/10 rounded-lg px-5 py-4 text-white text-sm outline-none focus:border-red-600 resize-none"></textarea></div>
            </div>
            <button onClick={handleSave} disabled={loading} className="mt-8 bg-red-600 text-white text-xs font-black px-8 py-4 rounded-lg w-full uppercase tracking-widest">{loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Selar Identidade'}</button>
          </ShadowCard>
        )}

        <div className="mb-12 bg-[#0a0a0c]/80 border border-white/5 rounded-xl p-6 md:p-8 shadow-xl">
            <div className="flex justify-between mb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest"><span>Progresso: {currentXp} XP</span><span>Nível {level + 1} em {xpNeeded} XP</span></div>
            <div className="w-full h-2 bg-[#030305] rounded-full relative border border-white/5">
                 <div className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>

        <div className="mb-8 border-b border-white/5">
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar snap-x">
            {['Estatísticas', 'Emblemas', 'Inventário', 'Histórico', 'Configurações'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`snap-start px-4 pb-4 font-black transition-all text-[11px] uppercase tracking-widest relative ${activeTab === tab ? 'text-white border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-300'}`}>{tab}</button>
            ))}
          </div>
        </div>
        
        {/* ABA: ESTATÍSTICAS */}
        {activeTab === "Estatísticas" && (
          <div className="animate-in fade-in duration-300 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-xl flex flex-col items-center shadow-lg"><Library className="w-6 h-6 text-amber-500 mb-3"/><span className="text-3xl font-black text-white">{Object.keys(libraryData).length}</span><span className="text-[9px] text-gray-500 uppercase font-black">Salvos</span></div>
              <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-xl flex flex-col items-center shadow-lg"><BookOpen className="w-6 h-6 text-red-500 mb-3"/><span className="text-3xl font-black text-white">{historyData.length}</span><span className="text-[9px] text-gray-500 uppercase font-black">Caps</span></div>
              <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-xl flex flex-col items-center shadow-lg"><Compass className="w-6 h-6 text-blue-500 mb-3"/><span className="text-3xl font-black text-white">{obrasLidasIds.length}</span><span className="text-[9px] text-gray-500 uppercase font-black">Iniciadas</span></div>
              <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-xl flex flex-col items-center shadow-lg"><Zap className="w-6 h-6 text-rose-500 mb-3"/><span className="text-3xl font-black text-white">{currentXp}</span><span className="text-[9px] text-gray-500 uppercase font-black">Poder</span></div>
          </div>
        )}

        {/* ABA: EMBLEMAS */}
        {activeTab === "Emblemas" && (
            <div className="animate-in fade-in duration-300"><ShadowCard><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {badgesList.map(badge => ( <AchievementBadge key={badge.id} badge={badge} isEquipped={eq.emblema?.id === badge.id} onEquip={() => {}} /> ))}
            </div></ShadowCard></div>
        )}

        {/* ABA: INVENTÁRIO (Sincronizada com shopItems) */}
        {activeTab === "Inventário" && (
            <div className="animate-in fade-in duration-300">
                <ShadowCard>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 pb-2 snap-x">
                      {[ {id:'avatar', label:'Avatar'}, {id:'capa_fundo', label:'Capa'}, {id:'moldura', label:'Moldura'}, {id:'nickname', label:'Nick'} ].map(cat => (
                          <button key={cat.id} onClick={() => setInventoryCategory(cat.id)} className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase transition-all border ${ inventoryCategory === cat.id ? 'bg-red-600 border-transparent text-white shadow-lg' : 'bg-black border-white/5 text-gray-500' }`}>{cat.label}</button>
                      ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {shopItems.filter(item => {
                          const hasItem = userProfileData.inventory?.includes(item.id);
                          if (!hasItem) return false;
                          const cat = (item.categoria || item.type || '').toLowerCase();
                          if (inventoryCategory === 'capa_fundo') return cat === 'capa_fundo' || cat === 'capa';
                          return cat === inventoryCategory;
                      }).map(item => {
                          let cat = (item.categoria || item.type || '').toLowerCase();
                          if (cat === 'capa') cat = 'capa_fundo';
                          const isEquipped = userProfileData.equipped_items?.[cat]?.id === item.id;
                          return (
                              <div key={item.id} className={`bg-[#050505] border rounded-xl p-4 flex flex-col items-center transition-all duration-300 relative overflow-hidden ${isEquipped ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-white/5'}`}>
                                  {(item.css || item.animacao) && ( <style dangerouslySetInnerHTML={{__html: `.${item.cssClass} { ${item.css} } ${item.animacao || ''}`}} /> )}
                                  <div className={`w-16 h-16 rounded-lg mb-3 bg-black flex items-center justify-center overflow-hidden border border-white/5 relative ${cat === 'avatar' ? item.cssClass : ''}`}>
                                      {['capa_fundo', 'capa'].includes(cat) && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className="w-full h-full object-cover opacity-70" /> )}
                                      {cat === 'moldura' && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none scale-[1.15]" style={{ mixBlendMode: 'screen' }} /> )}
                                      {cat === 'avatar' && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className="w-full h-full object-cover relative z-10" /> )}
                                      {cat === 'nickname' && ( <div className={`font-black text-xs z-20 ${item.cssClass}`}>Kage</div> )}
                                  </div>
                                  <h4 className="text-gray-300 font-black mb-3 text-[10px] line-clamp-1 w-full text-center uppercase tracking-tighter">{item.nome}</h4>
                                  <button onClick={() => handleEquipCosmetic(item)} className={`w-full py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${isEquipped ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>{isEquipped ? 'Equipado' : 'Equipar'}</button>
                              </div>
                          )
                      })}
                  </div>
                </ShadowCard>
            </div>
        )}

        {/* ABA: HISTÓRICO */}
        {activeTab === "Histórico" && (
            <ShadowCard className="animate-in fade-in duration-300">
                {historyData.length === 0 ? ( <div className="text-center py-10 text-gray-600 uppercase font-black text-xs">Vazio.</div> ) : (
                   <div className="flex flex-col gap-3">
                      {historyData.slice(0, 15).map(hist => (
                          <div key={hist.id} onClick={() => {}} className="bg-[#050505] border border-white/5 p-3 rounded-lg flex items-center gap-4 cursor-pointer hover:border-red-600/50 transition-all group">
                              <div className="w-10 h-14 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/5"><BookOpen className="w-4 h-4 m-auto mt-5 text-gray-800"/></div>
                              <div className="flex-1"><h4 className="font-bold text-xs text-white uppercase truncate">{hist.mangaTitle}</h4><p className="text-red-600 font-black text-[9px] uppercase tracking-widest mt-1">Capítulo {hist.chapterNumber}</p></div>
                              <ChevronRight className="w-4 h-4 text-gray-800" />
                          </div>
                      ))}
                      <button onClick={() => setConfirmAction('history')} className="mt-6 w-full py-3 bg-red-950/20 border border-red-900/50 text-red-500 font-black text-[9px] uppercase rounded-lg hover:bg-red-600 hover:text-white transition-all">Limpar Registros</button>
                   </div>
                )}
            </ShadowCard>
        )}

        {/* ABA: CONFIGURAÇÕES */}
        {activeTab === "Configurações" && (
            <div className="animate-in fade-in duration-300 space-y-4">
                <ShadowCard><div className="flex items-center justify-between"><p className="text-xs font-black uppercase text-white">Limpar Cache</p><button onClick={() => setConfirmAction('cache')} className="bg-red-600 p-2.5 rounded-lg text-white"><RefreshCw className="w-4 h-4"/></button></div></ShadowCard>
            </div>
        )}
      </div>
    </div>
  );
}
