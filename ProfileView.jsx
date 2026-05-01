import React, { useState, useEffect, useRef } from 'react';
import { Compass, History, Library, Camera, Edit3, LogOut, Loader2, BookOpen, AlertTriangle, Trophy, Zap, Trash2, RefreshCw, Settings, Flame, Eye, EyeOff, Bookmark, Hexagon, Crown, Ghost, Lock, Sparkles, Box, ChevronRight, Swords } from 'lucide-react';
import { updateProfile } from "firebase/auth";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import { APP_ID } from './constants';
import { compressImage, getLevelRequirement, getLevelTitle, cleanCosmeticUrl, timeAgo, getRarityColor } from './helpers';

const ShadowCard = ({ children, className = "" }) => (
  <div className={`bg-[#0a0a0c]/90 border border-red-600/30 rounded-xl p-5 md:p-7 shadow-[0_0_40px_rgba(220,38,38,0.1)] relative overflow-hidden backdrop-blur-xl ${className}`}>
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent"></div>
     <div className="relative z-10">{children}</div>
  </div>
);

const AchievementBadge = ({ badge, isEquipped, onEquip }) => (
  <div className={`flex items-center p-3 sm:p-4 border transition-all duration-300 relative group rounded-xl overflow-hidden ${
    badge.condition 
      ? isEquipped
        ? 'bg-[#0a0a0c] border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
        : 'bg-[#050505] border-white/5 hover:border-red-600/50'
      : 'bg-[#030305] border-white/5 opacity-40 grayscale'
  }`}>
    <div className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-full flex items-center justify-center mr-4 transition-transform duration-500 group-hover:scale-105`}>
        {badge.image ? (
            <img src={badge.image} alt={badge.title} className="w-full h-full object-contain" />
        ) : (
            <badge.icon className={`w-6 h-6 ${badge.condition ? badge.colorClass : 'text-gray-600'}`} />
        )}
    </div>
    <div className="flex-1 min-w-0">
        <h4 className={`font-black text-[11px] sm:text-xs uppercase tracking-widest line-clamp-1 mb-1 ${ badge.condition ? (isEquipped ? 'text-red-400' : 'text-white') : 'text-gray-500' }`}>
            {badge.title}
        </h4>
        <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold line-clamp-2 leading-snug">
            {badge.description}
        </p>
        {badge.condition && (
            <button onClick={() => onEquip(badge)} className={`mt-2 text-[9px] font-black uppercase tracking-widest transition-colors ${ isEquipped ? 'text-red-500' : 'text-gray-500 hover:text-white' }`}>
                {isEquipped ? '✓ Equipado' : 'Equipar'}
            </button>
        )}
    </div>
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
    try { 
        await updateProfile(auth.currentUser, { displayName: name }); 
        const docData = { coverUrl: coverBase64, avatarUrl: avatarBase64, bio: bio, name: name }; 
        await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), docData, { merge: true }); 
        onUpdateData(docData); 
        showToast('Perfil forjado nas sombras!', 'success'); 
        setIsEditing(false); 
    } catch (error) { showToast(`Erro ao salvar.`, 'error'); } finally { setLoading(false); }
  };

  const handleEquipCosmetic = async (item) => {
    try {
        const profileRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main');
        const currentEquipped = userProfileData.equipped_items || {};
        let cat = (item.categoria || item.type || '').toLowerCase();
        if (cat === 'capa') cat = 'capa_fundo';

        const isEquipped = currentEquipped[cat]?.id === item.id;
        const newEquipped = { ...currentEquipped };
        
        if (isEquipped) {
            delete newEquipped[cat];
            showToast("Selo desequipado.", "info");
        } else {
            newEquipped[cat] = item; 
            showToast(`${item.nome || item.name} equipado.`, "success");
        }
        
        await setDoc(profileRef, { equipped_items: newEquipped }, { merge: true });
        onUpdateData({ equipped_items: newEquipped }); 
    } catch (e) {
        showToast("Erro nas sombras ao equipar.", "error");
    }
  };

  const executeConfirmAction = async () => {
      if (confirmAction === 'history') { 
          try { 
              historyData.forEach(async (h) => { 
                  await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'history', h.id), { cleared: true }); 
              }); 
              showToast("Memórias apagadas.", "success"); 
          } catch(e) { 
              showToast("Erro ao limpar.", "error"); 
          } 
      } 
      else if (confirmAction === 'cache') { localStorage.clear(); sessionStorage.clear(); window.location.reload(true); }
      setConfirmAction(null);
  };

  const level = userProfileData.level || 1; const currentXp = userProfileData.xp || 0; const xpNeeded = getLevelRequirement(level); const progressPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const lidosSet = new Set(historyData.map(h => h.mangaId)); const obrasLidasIds = Array.from(lidosSet); const libraryMangaIds = Object.keys(libraryData);
  const eq = userProfileData.equipped_items || {};

  const activeAvatarSrc = (eq.avatar?.preview ? cleanCosmeticUrl(eq.avatar.preview) : null) || avatarBase64 || `https://placehold.co/150x150/0A0E17/22d3ee?text=${name?.[0] || 'K'}`;

  const readCount = historyData.length;
  const favCount = Object.keys(libraryData).length;
  const crystalsCount = userProfileData.crystals || 0;
  const coinsCount = userProfileData.coins || 0;

  const badgesList = [
    { id: 'iniciado', level: 1, image: 'https://i.ibb.co/VcF093w9/file-000000000a60720ea0dc89a96aeb27e0-removebg-preview.png', title: "Olho do Corvo", description: "Desvenda 10 capítulos no sistema.", condition: readCount >= 10, colorClass: "text-red-500" },
    { id: 'guardiao', level: 2, image: 'https://i.ibb.co/7NZVyW5f/file-00000000f4e871f580ac8750e4721f56-removebg-preview.png', title: "Pacto Sombrio", description: "Sela 5 obras em sua guarda.", condition: favCount >= 5, colorClass: "text-purple-500" },
    { id: 'diamante', level: 3, image: 'https://i.ibb.co/B2PkBMDX/file-00000000482871f5a7d7653e8ca359e3-removebg-preview.png', title: "Diamante Sombrio", description: "Consome 50 cristais nexo.", condition: crystalsCount >= 50, colorClass: "text-blue-500" },
    { id: 'espectro', level: 4, image: 'https://i.ibb.co/cK3rLmhY/file-00000000a89471f5b61f4284cf8c9779-removebg-preview.png', title: "Espectro Kage", description: "Transcreve a alma ao Nível 10.", condition: level >= 10, colorClass: "text-rose-500" },
    { id: 'ouro', level: 5, icon: Crown, title: "Avareza Escarlate", description: "Acumula 1000 moedas astrais.", condition: coinsCount >= 1000, colorClass: "text-amber-500" }
  ];

  const handleEquipBadge = async (badge) => {
    if (!badge.condition) return;
    try {
        const profileRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main');
        const currentEquipped = userProfileData.equipped_items || {};
        const isEquipped = currentEquipped.emblema?.id === badge.id;
        const newEquipped = { ...currentEquipped };
        if (isEquipped) { delete newEquipped.emblema; showToast("Selo desequipado.", "info"); } 
        else { newEquipped.emblema = { id: badge.id }; showToast(`${badge.title} equipado.`, "success"); }
        await setDoc(profileRef, { equipped_items: newEquipped }, { merge: true });
        onUpdateData({ equipped_items: newEquipped }); 
    } catch (e) { showToast("Erro nas sombras ao equipar.", "error"); }
  };

  const equippedBadgeId = eq.emblema?.id;
  const equippedBadgeData = badgesList.find(b => b.id === equippedBadgeId);

  const userInventory = userProfileData.inventory || [];
  const inventoryItems = shopItems.filter(item => {
      if (!userInventory.includes(item.id)) return false;
      const cat = (item.categoria || item.type || '').toLowerCase();
      if (inventoryCategory === 'capa_fundo') return cat === 'capa_fundo' || cat === 'capa';
      return cat === inventoryCategory;
  });

  const visibleHistory = historyData.filter(h => !h.cleared);

  return (
    <div className={`animate-in fade-in duration-300 w-full pb-24 font-sans min-h-screen text-gray-200 bg-[#050505] overflow-x-hidden`}>
      
      {/* MODAL DE CONFIRMAÇÃO OTIMIZADO ("Sem Silicone") */}
      {confirmAction && (
          <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#050505] border border-red-600/60 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.2)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.1),transparent_70%)] pointer-events-none"></div>
                  <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-5 relative z-10 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-widest relative z-10">Confirmar Ação?</h3>
                  <p className="text-sm text-gray-400 mb-8 font-bold relative z-10 leading-relaxed">{confirmAction === 'history' ? 'O registro do tempo será desintegrado permanentemente.' : 'A matriz será recarregada para limpar o fluxo.'}</p>
                  <div className="flex gap-4 relative z-10">
                      <button onClick={() => setConfirmAction(null)} className="flex-1 bg-[#0a0a0c] border border-white/10 text-gray-300 font-black py-3.5 rounded-xl hover:bg-white/5 transition-colors text-[10px] uppercase tracking-widest">Recuar</button>
                      <button onClick={executeConfirmAction} className="flex-1 bg-red-600/20 text-red-500 border border-red-500/40 font-black py-3.5 rounded-xl transition-all hover:bg-red-600 hover:text-white hover:border-red-500 text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)]">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      <div className="w-full h-[250px] relative group overflow-hidden bg-black z-0">
        {cleanCosmeticUrl(eq.capa_fundo?.preview) ? ( 
            <img src={cleanCosmeticUrl(eq.capa_fundo.preview)} className={`w-full h-full object-cover object-center opacity-70 mix-blend-screen ${eq.capa_fundo.cssClass || ''}`} /> 
        ) : coverBase64 ? ( 
            <img src={coverBase64} className="w-full h-full object-cover object-center opacity-80" /> 
        ) : ( 
            <div className={`w-full h-full bg-gradient-to-br from-red-950 to-black ${eq.capa_fundo?.cssClass || ''}`} /> 
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        
        {isEditing && (
            <button onClick={() => coverInputRef.current.click()} className="absolute top-4 right-4 bg-black/50 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors z-10">
                <Camera className="w-4 h-4" /> Alterar capa
            </button>
        )}
        <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="px-6 relative z-10 -mt-20 flex gap-5">
            <div className="relative flex-shrink-0">
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-red-600 bg-black p-1 shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center overflow-hidden relative ${(!eq.moldura?.preview && eq.moldura) ? eq.moldura.cssClass : ''}`}>
                    {(eq.avatar?.css) && ( <style dangerouslySetInnerHTML={{__html: `.${eq.avatar.cssClass} { ${eq.avatar.css} } ${eq.avatar.animacao || ''}`}} /> )}
                    <img src={activeAvatarSrc} className={`w-full h-full object-cover rounded-full ${eq.avatar?.cssClass || ''}`} alt="Avatar" onError={(e) => e.target.src = `https://placehold.co/150x150/050505/22d3ee?text=${name?.[0] || 'K'}`} />
                    
                    {cleanCosmeticUrl(eq.particulas?.preview) && ( <img src={cleanCosmeticUrl(eq.particulas.preview)} className={`absolute inset-[-50%] m-auto w-[200%] h-[200%] object-contain z-0 ${eq.particulas.cssClass || ''}`} style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
                    {cleanCosmeticUrl(eq.efeito?.preview) && ( <img src={cleanCosmeticUrl(eq.efeito.preview)} className={`absolute inset-0 m-auto w-full h-full object-contain z-20 ${eq.efeito.cssClass || ''}`} style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
                    {cleanCosmeticUrl(eq.moldura?.preview) && ( <img src={cleanCosmeticUrl(eq.moldura.preview)} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none object-contain object-center z-30 pointer-events-none ${eq.moldura.cssClass || ''}`} /> )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black border border-red-600 text-red-500 text-[9px] font-black px-3 py-0.5 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] whitespace-nowrap z-40">
                    NÍVEL {level}
                </div>
                {isEditing && <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full z-50 border-2 border-black hover:bg-red-500"><Camera className="w-3 h-3" /></button>}
                <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
            </div>
            
            <div className="flex-1 pt-2 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">
                    <Swords className="w-3 h-3 text-red-500" /> NINJA SUPREMO
                </div>
                <h1 className={`text-2xl sm:text-3xl font-black text-white ${eq.nickname ? eq.nickname.cssClass : ''}`}>
                    {eq.nickname?.css && ( <style dangerouslySetInnerHTML={{__html: `.${eq.nickname.cssClass} { ${eq.nickname.css} } ${eq.nickname.animacao || ''}`}} /> )}
                    {name || 'Kage'}
                </h1>
                <p className="text-gray-500 text-xs font-medium mt-0.5">{user.email}</p>
            </div>
        </div>

        <div className="px-6 mt-4 relative z-10">
            <div className="inline-flex items-center gap-2 border border-amber-600/50 bg-amber-950/20 px-3 py-1.5 rounded-lg mb-4">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest">NÍVEL {level} • {getLevelTitle(level)}</span>
            </div>
            
            <div className="flex gap-3">
                <button onClick={() => setIsEditing(!isEditing)} className="flex-1 bg-transparent border border-red-600/50 text-red-500 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-950/30 transition-colors">
                    <Edit3 className="w-4 h-4" /> {isEditing ? 'Selar Perfil' : 'Editar perfil'}
                </button>
                <button onClick={onLogout} className="bg-transparent border border-white/10 text-gray-400 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <LogOut className="w-5 h-5 rotate-180" />
                </button>
            </div>
        </div>

        {isEditing && (
            <div className="px-6 mt-6 animate-in fade-in duration-300">
                <div className="bg-[#0a0a0c] border border-red-600/30 rounded-xl p-5 shadow-lg">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-red-500 mb-2 uppercase tracking-widest">Nome nas Sombras</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-red-600 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-red-500 mb-2 uppercase tracking-widest">Aura Pessoal (Bio)</label>
                            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white text-sm resize-none outline-none focus:border-red-600 transition-colors"></textarea>
                        </div>
                    </div>
                    <button onClick={handleSave} disabled={loading} className="mt-6 bg-red-600 text-white text-xs font-black px-8 py-3 rounded-lg w-full flex justify-center hover:bg-red-500 transition-all uppercase tracking-widest">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        )}

        <div className="px-6 mt-6">
            <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 shadow-lg">
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-3">PROGRESSO SOMBRIO</p>
                <div className="flex justify-between items-end mb-3">
                    <span className="text-white font-black text-lg">{currentXp} XP</span>
                    <span className="text-gray-500 text-[10px] font-bold"><span className="text-red-500 font-black">{xpNeeded} XP</span> para nível {level + 1}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full relative">
                        <div className="absolute top-0 left-0 h-full bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" style={{ width: `${progressPercent}%` }}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" style={{ left: `calc(${progressPercent}% - 6px)` }}></div>
                    </div>
                    <span className="text-red-500 font-black text-xs">{progressPercent.toFixed(0)}%</span>
                </div>
            </div>
        </div>

        {!isEditing && (
            <div className="px-6 mt-4">
                <div className="bg-gradient-to-r from-red-950/30 to-[#0a0a0c] border border-white/5 border-l-[3px] border-l-red-600 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-red-600 text-3xl font-serif leading-none mt-1">“</span>
                        <p className="text-gray-300 text-sm italic font-medium pt-1">"{bio || `Leitor Nível ${level}.`}"</p>
                    </div>
                    <svg className="w-8 h-8 text-white/5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                    </svg>
                </div>
            </div>
        )}

        <div className="px-6 mt-8 border-b border-white/10 flex gap-6 overflow-x-auto no-scrollbar">
          {['ESTATÍSTICAS', 'EMBLEMAS', 'INVENTÁRIO', 'HISTÓRICO', 'CONFIGURAÇÕES'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 font-black transition-all duration-300 whitespace-nowrap text-[10px] uppercase tracking-widest relative ${activeTab.toUpperCase() === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {tab}
              {activeTab.toUpperCase() === tab && (
                  <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
              )}
            </button>
          ))}
        </div>
        
        {activeTab.toUpperCase() === "ESTATÍSTICAS" && (
          <div className="px-6 mt-6 grid grid-cols-2 gap-4 pb-20 animate-in fade-in duration-300">
              <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                  <div className="absolute inset-0 bg-[url('https://i.ibb.co/B2PkBMDX/file-00000000482871f5a7d7653e8ca359e3-removebg-preview.png')] bg-cover opacity-10 mix-blend-overlay"></div>
                  <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center mb-4 relative z-10 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <Library className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white relative z-10">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : Object.keys(libraryData).length}</h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 relative z-10">Obras Salvas</p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
              </div>
              
              <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-[#0a0a0c] to-[#0a0a0c] opacity-50 mix-blend-overlay"></div>
                  <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center mb-4 relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <BookOpen className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white relative z-10">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : historyData.length}</h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 relative z-10">Caps Lidos</p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
              </div>
              
              <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                  <div className="absolute inset-0 bg-[url('https://i.ibb.co/cK3rLmhY/file-00000000a89471f5b61f4284cf8c9779-removebg-preview.png')] bg-cover opacity-10 mix-blend-overlay"></div>
                  <div className="w-10 h-10 rounded-full border border-blue-500/30 flex items-center justify-center mb-4 relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <Compass className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white relative z-10">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : obrasLidasIds.length}</h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 relative z-10">Iniciadas</p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              </div>
              
              <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                  <div className="absolute inset-0 bg-[url('https://i.ibb.co/VcF093w9/file-000000000a60720ea0dc89a96aeb27e0-removebg-preview.png')] bg-cover opacity-10 mix-blend-overlay"></div>
                  <div className="w-10 h-10 rounded-full border border-rose-500/30 flex items-center justify-center mb-4 relative z-10 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                      <Zap className="w-5 h-5 text-rose-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white relative z-10">{currentXp}</h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 relative z-10">Poder Vital</p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
              </div>
          </div>
        )}

        {activeTab.toUpperCase() === "EMBLEMAS" && (
            <div className="px-6 mt-6 pb-20 animate-in fade-in duration-300">
                <ShadowCard>
                  <div className="flex items-center gap-3 mb-8 border-b border-red-900/30 pb-5">
                    <Flame className="w-6 h-6 text-red-600 animate-pulse" />
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Marcas de Sangue</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Conquistas gravadas na sua alma. Equipe para exibir no perfil.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badgesList.map(badge => (
                        <AchievementBadge key={badge.id} badge={badge} isEquipped={equippedBadgeId === badge.id} onEquip={handleEquipBadge} />
                    ))}
                  </div>
                </ShadowCard>
            </div>
        )}

        {activeTab.toUpperCase() === "INVENTÁRIO" && (
            <div className="px-6 mt-6 pb-20 animate-in fade-in duration-300">
                <ShadowCard>
                  <div className="flex items-center gap-3 mb-8 border-b border-red-900/30 pb-5">
                    <Box className="w-6 h-6 text-red-600" />
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Seu Inventário</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Cosméticos adquiridos no Mercado Negro.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2 snap-x border-b border-white/5">
                      {[ { id: 'avatar', label: 'Avatar' }, { id: 'capa_fundo', label: 'Capa' }, { id: 'moldura', label: 'Moldura' }, { id: 'nickname', label: 'Nick' } ].map(cat => (
                          <button key={cat.id} onClick={() => setInventoryCategory(cat.id)} className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border ${ inventoryCategory === cat.id ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-[#050505] text-gray-500 border-white/5 hover:text-white hover:border-white/20' }`}>
                              {cat.label}
                          </button>
                      ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {inventoryItems.length === 0 ? (
                          <div className="col-span-full py-12 text-center text-gray-600 text-xs font-black uppercase tracking-widest">
                              Nenhum item desta categoria.
                          </div>
                      ) : (
                          inventoryItems.map(item => {
                              let itemCat = (item.categoria || item.type || '').toLowerCase();
                              if (itemCat === 'capa') itemCat = 'capa_fundo';
                              const isEquipped = userProfileData.equipped_items?.[itemCat]?.id === item.id;

                              return (
                                  <div key={item.id} className={`bg-[#0a0a0c] border rounded-[2rem] p-5 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden shadow-lg ${isEquipped ? 'border-red-600 bg-red-950/20' : 'border-white/5 hover:border-red-500/40 hover:-translate-y-1'}`}>
                                      
                                      {(item.css || item.animacao || item.keyframes) && ( <style dangerouslySetInnerHTML={{__html: `.${item.cssClass || 'custom-ia-class'} { ${item.css || ''} } ${item.animacao || item.keyframes || ''}`}} /> )}
                                      
                                      <div className={`absolute top-2 right-2 text-[7px] uppercase tracking-[0.2em] font-black px-1.5 py-0.5 rounded border z-30 bg-black/80 border-white/10 ${getRarityColor(item.raridade)}`}>
                                          {item.raridade || 'Comum'}
                                      </div>

                                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl mt-3 mb-4 bg-[#030305] flex items-center justify-center overflow-hidden border border-white/5 relative flex-shrink-0 ${itemCat === 'avatar' ? (item.cssClass || 'custom-ia-class') : ''}`}>
                                          {['capa_fundo', 'tema_perfil'].includes(itemCat) && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className={`w-full h-full object-cover opacity-80 ${item.cssClass || 'custom-ia-class'}`} /> )}
                                          {itemCat === 'moldura' && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className={`absolute inset-0 w-full h-full object-cover z-20 pointer-events-none rounded-full scale-[1.15] ${item.cssClass || 'custom-ia-class'}`} style={{ mixBlendMode: 'screen' }} /> )}
                                          {itemCat === 'avatar' && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className={`w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500`} /> )}
                                          {itemCat === 'nickname' && ( <div className={`font-black text-lg z-20 ${item.cssClass || 'custom-ia-class'}`}>Kage</div> )}
                                      </div>

                                      <h4 className="text-white font-black mb-4 text-xs line-clamp-1 relative z-10 px-1 w-full">{item.nome || item.name}</h4>
                                      
                                      <button onClick={() => handleEquipCosmetic(item)} className={`w-full rounded-lg font-black py-2.5 transition-all text-[9px] uppercase tracking-widest relative z-10 ${isEquipped ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'bg-[#030305] text-gray-400 hover:text-white border border-white/10'}`}>
                                          {isEquipped ? 'Equipado' : 'Equipar'}
                                      </button>
                                  </div>
                              )
                          })
                      )}
                  </div>
                </ShadowCard>
            </div>
        )}

        {activeTab.toUpperCase() === "HISTÓRICO" && (
            <div className="px-6 mt-6 pb-20 animate-in fade-in duration-300">
                <ShadowCard>
                    {visibleHistory.length === 0 ? (
                        <div className="text-center py-16"><History className="w-12 h-12 mx-auto text-red-900/30 mb-4"/><p className="text-gray-500 text-xs font-black uppercase tracking-widest">As sombras não possuem registros.</p></div>
                    ) : (
                       <div className="flex flex-col gap-4">
                          {visibleHistory.slice(0, 15).map(hist => {
                              const mg = mangas.find(m => m.id === hist.mangaId);
                              return (
                                  <div key={hist.id} onClick={() => { if(mg) onNavigate('details', mg); }} className="bg-[#050505] border border-white/5 p-4 rounded-xl flex items-center gap-5 cursor-pointer hover:border-red-600/50 transition-all duration-300 group shadow-sm">
                                      <div className="w-14 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-red-900/30 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]">{mg ? <img src={mg.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : <BookOpen className="w-5 h-5 m-auto mt-7 text-red-900/50"/>}</div>
                                      <div className="flex-1"><h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors duration-300">{hist.mangaTitle}</h4><p className="text-red-600 font-black text-[10px] uppercase tracking-widest mt-1.5 bg-red-950/30 inline-block px-2 py-1 rounded-md border border-red-900/50">Capítulo {hist.chapterNumber}</p></div>
                                      <p className="text-[9px] text-gray-500 font-bold uppercase hidden sm:block">{timeAgo(hist.timestamp)}</p>
                                      <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors duration-300" />
                                  </div>
                              )
                          })}
                          <button onClick={() => setConfirmAction('history')} className="mt-8 w-full py-4 bg-[#050505] border border-red-900/50 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-red-950/40 hover:border-red-500 transition-colors duration-300 flex justify-center items-center gap-2"><Trash2 className="w-4 h-4"/> Limpar Registros Sombrios</button>
                       </div>
                    )}
                </ShadowCard>
            </div>
        )}

        {activeTab.toUpperCase() === "CONFIGURAÇÕES" && (
            <div className="px-6 mt-6 pb-20 animate-in fade-in duration-300 space-y-6">
                <ShadowCard>
                  <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3"><Settings className="w-5 h-5 text-red-500"/> Preferências Kage</h3>
                  
                  {/* NOVA CONFIGURAÇÃO DE PRIVACIDADE */}
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                    <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">Privacidade das Sombras</p>
                        <p className="text-xs text-gray-500 mt-1 font-bold">Ocultar seu perfil de outros ninjas.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={userSettings?.isPrivate || false} onChange={(e) => { updateSettings({ isPrivate: e.target.checked }); showToast("Nível de ocultação alterado.", "success"); }} />
                        <div className="w-14 h-7 bg-[#050505] border border-white/20 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[4px] after:bg-gray-400 peer-checked:after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-red-700 peer-checked:to-red-500 shadow-inner"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                    <div><p className="text-sm font-black text-white uppercase tracking-widest">Modo de Leitura</p><p className="text-xs text-gray-500 mt-1 font-bold">Como você consome as memórias.</p></div>
                    <select value={userSettings?.readMode || 'Cascata'} onChange={(e) => { updateSettings({ readMode: e.target.value }); showToast("Preferência atualizada.", "success"); }} className="bg-[#050505] border border-red-600/30 text-white text-xs font-bold rounded-lg px-5 py-3.5 outline-none focus:border-red-600 shadow-sm cursor-pointer transition-colors duration-300">
                      <option value="Cascata">Cascata</option><option value="Paginação">Páginas</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                    <div><p className="text-sm font-black text-white uppercase tracking-widest">Magia de Economia (Dados)</p><p className="text-xs text-gray-500 mt-1 font-bold">Reduz o peso visual nas sombras.</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={userSettings?.dataSaver || false} onChange={(e) => { updateSettings({ dataSaver: e.target.checked }); showToast("Preferência atualizada.", "success"); }} />
                      <div className="w-14 h-7 bg-[#050505] border border-white/20 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[4px] after:bg-gray-400 peer-checked:after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-red-700 peer-checked:to-red-500 shadow-inner"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-black text-white uppercase tracking-widest">Aura do Sistema (Tema)</p><p className="text-xs text-gray-500 mt-1 font-bold">Padrão de cores da interface.</p></div>
                    <select value={userSettings?.theme || 'Escuro'} onChange={(e) => { updateSettings({ theme: e.target.value }); showToast("Aura aplicada.", "success"); }} className="bg-[#050505] border border-red-600/30 text-white text-xs font-bold rounded-lg px-5 py-3.5 outline-none focus:border-red-600 shadow-sm cursor-pointer transition-colors duration-300">
                      <option value="Escuro">Escuro</option><option value="Amoled">Vazio Absoluto</option>
                    </select>
                  </div>
                </ShadowCard>

                <ShadowCard>
                    <button onClick={() => setConfirmAction('cache')} className="flex items-center justify-between w-full text-left group">
                        <div><p className="text-sm font-black text-white uppercase tracking-widest group-hover:text-red-500 transition-colors duration-300">Limpar Fluxo (Cache)</p><p className="text-xs text-gray-500 mt-1 font-bold">Resolve distorções na interface.</p></div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10 group-hover:border-red-500/50 group-hover:bg-red-950/20 transition-all duration-300"><RefreshCw className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:rotate-180 transition-all duration-300" /></div>
                    </button>
                </ShadowCard>
            </div>
        )}
      </div>
    </div>
  );
}
