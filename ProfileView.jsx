import React, { useState, useEffect, useRef } from 'react';
import { Compass, History, Library, Smartphone, Camera, Edit3, LogOut, Loader2, BookOpen, AlertTriangle, Trophy, Zap, Trash2, RefreshCw, LayoutTemplate } from 'lucide-react';
import { updateProfile } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import { APP_ID } from './constants';
import { compressImage, getLevelRequirement, getLevelTitle, cleanCosmeticUrl } from './helpers';

export function ProfileView({ user, userProfileData, historyData, libraryData, dataLoaded, userSettings, updateSettings, onLogout, onUpdateData, showToast, mangas, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Estatisticas"); 
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

  const activeAvatarSrc = (eq.avatar?.preview ? cleanCosmeticUrl(eq.avatar.preview) : null) || avatarBase64 || `https://placehold.co/150x150/0b0c14/22d3ee?text=U`;

  return (
    <div className={`animate-in fade-in duration-700 w-full pb-24 font-sans min-h-screen text-gray-200 ${eq.tema_perfil ? eq.tema_perfil.cssClass : 'bg-[#020408]'}`}>
      
      {confirmAction && (
          <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-[#0b0c14] border border-cyan-500/20 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{confirmAction === 'history' ? 'Limpar Histórico?' : 'Reiniciar App?'}</h3>
                  <p className="text-xs text-gray-400 font-medium mb-8 px-2">{confirmAction === 'history' ? 'Esta ação não pode ser desfeita.' : 'A interface será recarregada.'}</p>
                  <div className="flex gap-3">
                      <button onClick={() => setConfirmAction(null)} className="flex-1 bg-white/5 border border-white/10 text-gray-300 font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors text-xs">Cancelar</button>
                      <button onClick={executeConfirmAction} className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3.5 rounded-xl transition-colors hover:bg-red-500 hover:text-white text-xs">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      {/* CAPA - Altura exata e corte limpo */}
      <div className="h-[200px] md:h-[250px] w-full bg-[#050508] relative group overflow-hidden border-b border-white/5">
        {cleanCosmeticUrl(eq.capa_fundo?.preview) ? ( 
            <img src={cleanCosmeticUrl(eq.capa_fundo.preview)} className={`w-full h-full object-cover object-center opacity-80 ${eq.capa_fundo.cssClass || ''}`} /> 
        ) : coverBase64 ? ( 
            <img src={coverBase64} className="w-full h-full object-cover object-center opacity-60" /> 
        ) : ( 
            <div className={`w-full h-full bg-gradient-to-br from-cyan-900/40 to-emerald-900/20 ${eq.capa_fundo?.cssClass || ''}`} /> 
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
        
        {isEditing && (
            <button onClick={() => coverInputRef.current.click()} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white border border-white/10 px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-bold z-10 hover:bg-white/20 transition-all shadow-lg">
                <Camera className="w-4 h-4" /> Alterar Fundo
            </button>
        )}
        <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
      </div>

      {/* CARD PRINCIPAL (Não tão redondo, não tão quadrado = rounded-2xl) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10 bg-[#0b0c14]/90 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl">
          
          {/* AVATAR + MOLDURA (Alinhamento Seguro Absoluto) */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 group">
            
            <div className="w-full h-full rounded-full bg-[#0b0e14] border-[4px] border-[#0b0c14] relative z-10 overflow-hidden shadow-lg">
               <img src={activeAvatarSrc} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            
            {/* A Moldura encaixa exatamente pelo centro para abraçar a borda de fora */}
            {cleanCosmeticUrl(eq.moldura?.preview) && ( 
                <img src={cleanCosmeticUrl(eq.moldura.preview)} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] max-w-none object-contain object-center z-30 pointer-events-none ${eq.moldura.cssClass || ''}`} /> 
            )}

            {isEditing && <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-0 right-0 bg-cyan-500 text-black p-2.5 rounded-full z-50 border-4 border-[#0b0c14] hover:bg-cyan-400 transition-colors shadow-lg"><Camera className="w-4 h-4" /></button>}
            <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
          </div>

          <div className="flex-1 text-center md:text-left mt-2 md:mt-0 w-full">
            <h1 className={`text-2xl md:text-4xl font-black tracking-tight drop-shadow-md ${eq.nickname ? eq.nickname.cssClass : 'text-white'}`}>{name || 'Usuário'}</h1>
            <p className="text-cyan-500/60 font-bold mb-1 text-[10px] mt-1 drop-shadow-sm uppercase tracking-widest">{user.email}</p>
            {bio && !isEditing && <p className="text-gray-300 text-xs mb-3 font-medium mt-3 bg-white/5 inline-block px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">{bio}</p>}
            
            <div className="w-full bg-black/40 p-5 rounded-xl border border-white/5 mt-4 relative overflow-hidden shadow-inner">
              <div className="flex justify-between items-end mb-3 relative z-10">
                <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nível Atual</span>
                    <span className="text-sm font-black text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-cyan-400"/> LVL {level} - {getLevelTitle(level)}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-1"><Zap className="w-3 h-3 text-amber-400"/> EXP</span>
                    <span className="text-xs font-black text-white">{currentXp} <span className="text-gray-600">/ {xpNeeded}</span></span>
                </div>
              </div>
              <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                 <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-center">
            <button onClick={() => setIsEditing(!isEditing)} className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all flex-1 md:flex-none backdrop-blur-md"><Edit3 className="w-4 h-4" /> {isEditing ? 'Cancelar' : 'Editar'}</button>
            <button onClick={onLogout} className="bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-500/20 backdrop-blur-md"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
        
        {isEditing && (
          <form onSubmit={handleSave} className="bg-[#0b0c14]/95 backdrop-blur-xl border border-white/5 rounded-2xl p-8 animate-in fade-in shadow-xl mb-8">
            <div className="space-y-6">
              <div>
                 <label className="block text-xs font-bold text-cyan-500/80 mb-2 uppercase tracking-widest">Nome de Exibição</label>
                 <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-4 text-white text-sm font-medium outline-none focus:border-cyan-500 transition-colors shadow-inner"/>
              </div>
              <div>
                 <label className="block text-xs font-bold text-cyan-500/80 mb-2 uppercase tracking-widest">Sua Biografia</label>
                 <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-4 text-white text-sm font-medium resize-none outline-none focus:border-cyan-500 transition-colors shadow-inner"></textarea>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-8 bg-cyan-500 text-black text-xs font-black px-8 py-4 rounded-xl w-full flex justify-center hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-lg">{loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Salvar Alterações'}</button>
          </form>
        )}
      </div>

      {/* ÁREA DE ABAS E CONTEÚDO */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 relative z-10">
        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2 snap-x">
          {['Estatisticas', 'Historico', 'Configuracoes'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`snap-start px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-2 ${activeTab === tab ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.02] text-gray-400 border border-white/5 hover:text-white hover:bg-white/10'}`}>
              {tab === 'Estatisticas' && <Compass className="w-4 h-4"/>} {tab === 'Historico' && <History className="w-4 h-4"/>} {tab === 'Configuracoes' && <Smartphone className="w-4 h-4"/>}
              {tab}
            </button>
          ))}
        </div>
        
        {activeTab === "Estatisticas" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
            <div className="bg-[#0b0c14]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-white mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : Object.keys(libraryData).length}</span><span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Salvos</span></div>
            <div className="bg-cyan-900/10 backdrop-blur-md border border-cyan-500/20 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-cyan-400 mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : historyData.length}</span><span className="text-[10px] text-cyan-500/60 uppercase font-bold tracking-widest">Lidos</span></div>
            <div className="bg-emerald-900/10 backdrop-blur-md border border-emerald-500/20 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-emerald-400 mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : obrasLidasIds.length}</span><span className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-widest">Iniciadas</span></div>
            <div className="bg-[#0b0c14]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-amber-400 mb-1">{currentXp}</span><span className="text-[10px] text-amber-500/60 uppercase font-bold tracking-widest">Total XP</span></div>
          </div>
        )}

        {activeTab === "Historico" && (
            <div className="bg-[#0b0c14]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-lg animate-in fade-in">
                {historyData.length === 0 ? (
                    <div className="text-center py-12"><History className="w-10 h-10 mx-auto text-gray-600 mb-4"/><p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Nenhum registro encontrado.</p></div>
                ) : (
                   <div className="flex flex-col gap-3">
                      {historyData.slice(0, 15).map(hist => {
                          const mg = mangas.find(m => m.id === hist.mangaId);
                          return (
                              <div key={hist.id} onClick={() => { if(mg) onNavigate('details', mg); }} className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors group">
                                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">{mg ? <img src={mg.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <BookOpen className="w-5 h-5 m-auto mt-5 text-gray-700"/>}</div>
                                  <div className="flex-1"><h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-cyan-400">{hist.mangaTitle}</h4><p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">Capítulo {hist.chapterNumber}</p></div>
                                  <p className="text-[10px] text-gray-600 font-bold">{new Date(hist.timestamp).toLocaleDateString()}</p>
                              </div>
                          )
                      })}
                      <button onClick={() => setConfirmAction('history')} className="mt-6 w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-2"><Trash2 className="w-4 h-4"/> Limpar Histórico</button>
                   </div>
                )}
            </div>
        )}

        {activeTab === "Configuracoes" && (
            <div className="animate-in fade-in space-y-4">
                <div className="bg-[#0b0c14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 shadow-lg">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-8 border-b border-white/5 pb-4 uppercase tracking-widest"><Settings className="w-5 h-5 text-cyan-400" /> Preferências</h3>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm font-bold text-white">Modo de Leitura</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Orientação das páginas.</p>
                    </div>
                    <select value={userSettings?.readMode || 'Cascata'} onChange={(e) => { updateSettings({ readMode: e.target.value }); showToast("Atualizado.", "success"); }} className="bg-black/30 border border-white/10 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-cyan-500 shadow-inner">
                      <option value="Cascata">Cascata</option>
                      <option value="Paginação">Páginas</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm font-bold text-white">Economia de Dados</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Reduz qualidade de capas.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={userSettings?.dataSaver || false} onChange={(e) => { updateSettings({ dataSaver: e.target.checked }); showToast("Atualizado.", "success"); }} />
                      <div className="w-12 h-6 bg-black/50 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:border-cyan-400"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Tema Visual</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Cores do aplicativo.</p>
                    </div>
                    <select value={userSettings?.theme || 'Escuro'} onChange={(e) => { updateSettings({ theme: e.target.value }); showToast("Tema aplicado.", "success"); }} className="bg-black/30 border border-white/10 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-cyan-500 shadow-inner">
                      <option value="Escuro">Escuro</option>
                      <option value="Amoled">AMOLED</option>
                    </select>
                  </div>
                </div>

                <button onClick={() => setConfirmAction('cache')} className="flex items-center justify-between w-full bg-[#0b0c14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 hover:bg-white/5 transition-colors shadow-lg group">
                    <div className="text-left">
                        <p className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-cyan-400 transition-colors"><RefreshCw className="w-5 h-5 text-gray-400 group-hover:rotate-180 transition-transform duration-500" /> Limpar Cache</p>
                        <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">Pode resolver problemas de lentidão.</p>
                    </div>
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
