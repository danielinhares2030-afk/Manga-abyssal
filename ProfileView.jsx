import React, { useState, useEffect, useRef } from 'react';
import { Compass, History, Library, Smartphone, Camera, Edit3, LogOut, Loader2, BookOpen, AlertTriangle, Trophy, Coins, Zap, Trash2, RefreshCw, LayoutTemplate, Palette, Image as ImageIcon } from 'lucide-react';
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
    try { const compressedBase64 = await compressImage(file, type === 'cover' ? 400 : 150, 0.4); if (type === 'avatar') setAvatarBase64(compressedBase64); else setCoverBase64(compressedBase64); } catch (err) { showToast("Erro ao processar imagem.", "error"); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await updateProfile(auth.currentUser, { displayName: name }); const docData = { coverUrl: coverBase64, avatarUrl: avatarBase64, bio: bio }; await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), docData, { merge: true }); onUpdateData(docData); showToast('Perfil atualizado com sucesso.', 'success'); setIsEditing(false); } catch (error) { showToast(`Erro ao salvar.`, 'error'); } finally { setLoading(false); }
  };

  const executeConfirmAction = async () => {
      if (confirmAction === 'history') { try { historyData.forEach(async (h) => { await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'history', h.id)); }); showToast("Histórico limpo.", "success"); } catch(e) { showToast("Erro ao limpar.", "error"); } } 
      else if (confirmAction === 'cache') { localStorage.clear(); sessionStorage.clear(); window.location.reload(true); }
      setConfirmAction(null);
  };

  const level = userProfileData.level || 1; const currentXp = userProfileData.xp || 0; const xpNeeded = getLevelRequirement(level); const progressPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const lidosSet = new Set(historyData.map(h => h.mangaId)); const obrasLidasIds = Array.from(lidosSet); const libraryMangaIds = Object.keys(libraryData); const libraryMangas = mangas.filter(m => libraryMangaIds.includes(m.id));
  const eq = userProfileData.equipped_items || {};

  const getAvatarSrc = () => {
    if (!eq.avatar) return null;
    const itemImg = eq.avatar.preview || eq.avatar.url || eq.avatar.img || eq.avatar.imagem || eq.avatar.image || eq.avatar.src || eq.avatar.foto || eq.avatar.link;
    return itemImg ? cleanCosmeticUrl(itemImg) : null;
  };
  const activeAvatarSrc = getAvatarSrc() || avatarBase64 || `https://placehold.co/150x150/0a0a12/818cf8?text=U`;

  return (
    <div className={`animate-in fade-in duration-500 w-full pb-20 font-sans min-h-screen text-gray-200 ${eq.tema_perfil ? eq.tema_perfil.cssClass : 'bg-[#030305]'}`}>
      
      {/* Confirmação (Limpa) */}
      {confirmAction && (
          <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-[#0a0a12] border border-white/5 p-6 rounded-3xl max-w-sm w-full text-center">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-white mb-2">{confirmAction === 'history' ? 'Limpar Histórico?' : 'Limpar Cache?'}</h3>
                  <p className="text-sm text-gray-400 mb-6 px-2">{confirmAction === 'history' ? 'Esta ação não pode ser desfeita.' : 'O app será recarregado.'}</p>
                  <div className="flex gap-3">
                      <button onClick={() => setConfirmAction(null)} className="flex-1 bg-white/5 text-gray-300 font-medium py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">Cancelar</button>
                      <button onClick={executeConfirmAction} className="flex-1 bg-red-500/10 text-red-400 font-bold py-3 rounded-xl transition-colors hover:bg-red-500/20 text-sm">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      {/* Capa de Fundo */}
      <div className="h-40 md:h-64 w-full bg-[#0a0a12] relative group overflow-hidden border-b border-white/5">
        {cleanCosmeticUrl(eq.capa_fundo?.preview) ? ( <img src={cleanCosmeticUrl(eq.capa_fundo.preview)} onError={(e) => e.target.style.display = 'none'} className={`w-full h-full object-cover opacity-70 ${eq.capa_fundo.cssClass || ''}`} /> ) : coverBase64 ? ( <img src={coverBase64} className="w-full h-full object-cover opacity-50" /> ) : ( <div className={`w-full h-full bg-gradient-to-tr from-[#0a0a12] to-[#1e1b4b] ${eq.capa_fundo?.cssClass || ''}`} /> )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] to-transparent" />
        
        {/* O BOTÃO DE ALTERAR CAPA FICOU BEM VISÍVEL AQUI */}
        {isEditing && (
            <button onClick={() => coverInputRef.current.click()} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium z-10 hover:bg-black/80 transition-colors backdrop-blur-md border border-white/10">
                <ImageIcon className="w-4 h-4" /> Alterar Capa de Fundo
            </button>
        )}
        <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 md:-mt-20 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          
          {/* Avatar Redondo */}
          <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center flex-shrink-0 group ${(!eq.moldura?.preview && eq.moldura) ? eq.moldura.cssClass : ''}`}>
            <div className={`w-full h-full rounded-full bg-[#0a0a12] flex items-center justify-center relative z-10 overflow-hidden ${!eq.moldura ? 'border-4 border-[#030305]' : ''}`}>
               <img src={activeAvatarSrc} className={`w-full h-full object-cover ${eq.avatar?.cssClass || ''}`} alt="Avatar" onError={(e) => e.target.src = `https://placehold.co/150x150/0a0a12/818cf8?text=U`} />
            </div>
            
            {cleanCosmeticUrl(eq.particulas?.preview) && ( <img src={cleanCosmeticUrl(eq.particulas.preview)} onError={(e) => e.target.style.display = 'none'} className={`absolute inset-[-50%] m-auto w-[200%] h-[200%] object-contain z-0 ${eq.particulas.cssClass || ''}`} style={{ mixBlendMode: 'screen', WebkitMixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
            {cleanCosmeticUrl(eq.efeito?.preview) && ( <img src={cleanCosmeticUrl(eq.efeito.preview)} onError={(e) => e.target.style.display = 'none'} className={`absolute inset-0 m-auto w-full h-full object-contain z-20 ${eq.efeito.cssClass || ''}`} style={{ mixBlendMode: 'screen', WebkitMixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
            {cleanCosmeticUrl(eq.moldura?.preview) && ( <img src={cleanCosmeticUrl(eq.moldura.preview)} onError={(e) => e.target.style.display = 'none'} className={`absolute inset-[-15%] m-auto w-[130%] h-[130%] object-contain z-30 ${eq.moldura.cssClass || ''}`} style={{ mixBlendMode: 'screen', WebkitMixBlendMode: 'screen', pointerEvents: 'none' }} /> )}

            {isEditing && <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-0 right-0 bg-white text-black p-3 rounded-full z-50 border-[3px] border-[#030305] hover:bg-gray-200 transition-colors"><Camera className="w-4 h-4" /></button>}
            <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
          </div>

          <div className="flex-1 text-center md:text-left mt-2 md:mt-0 w-full">
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${eq.nickname ? eq.nickname.cssClass : 'text-white'}`}>{name || 'Usuário'}</h1>
            <p className="text-gray-400 font-medium mb-1 text-xs">{user.email}</p>
            {bio && !isEditing && <p className="text-gray-500 text-xs mb-3 font-light mt-2">{bio}</p>}
            
            {/* BARRA DE XP: Fina, Elegante e Minimalista */}
            <div className="w-full bg-white/[0.02] p-4 rounded-2xl border border-white/5 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-indigo-400"/> Nível {level} - {getLevelTitle(level)}</span>
                <span className="text-[10px] font-bold text-gray-500">{currentXp} / {xpNeeded} XP</span>
              </div>
              <div className="relative w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                 <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto justify-center">
            <button onClick={() => setIsEditing(!isEditing)} className="bg-white/5 text-white px-5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors flex-1 md:flex-none border border-white/5"><Edit3 className="w-4 h-4" /> {isEditing ? 'Cancelar' : 'Editar Perfil'}</button>
            <button onClick={onLogout} className="bg-red-500/10 text-red-400 p-2.5 rounded-xl hover:bg-red-500/20 transition-colors border border-transparent"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSave} className="bg-[#0a0a12] border border-white/5 rounded-3xl p-6 sm:p-8 animate-in fade-in">
            <div className="space-y-4">
              <div>
                 <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-1">Nome de Exibição</label>
                 <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#030305] border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors" placeholder="Como quer ser chamado?"/>
              </div>
              <div>
                 <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-1">Sobre Mim</label>
                 <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-[#030305] border border-white/5 rounded-xl px-4 py-3 text-white text-sm resize-none outline-none focus:border-indigo-500/50 transition-colors" placeholder="Escreva algo sobre você..."></textarea>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-6 bg-white text-black text-sm font-bold px-8 py-3.5 rounded-xl w-full flex justify-center hover:bg-gray-200 transition-colors">{loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Salvar Alterações'}</button>
          </form>
        ) : (
          <div>
            <div className="flex gap-2 border-b border-white/5 mb-6 overflow-x-auto no-scrollbar pb-3">
              <button onClick={() => setActiveTab("Estatisticas")} className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-xs flex items-center gap-2 ${activeTab === "Estatisticas" ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Compass className="w-3.5 h-3.5"/> Visão Geral</button>
              <button onClick={() => setActiveTab("Historico")} className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-xs flex items-center gap-2 ${activeTab === "Historico" ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><History className="w-3.5 h-3.5"/> Histórico</button>
              <button onClick={() => setActiveTab("Biblioteca")} className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-xs flex items-center gap-2 ${activeTab === "Biblioteca" ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Library className="w-3.5 h-3.5"/> Biblioteca</button>
              <button onClick={() => setActiveTab("Configuracoes")} className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-xs flex items-center gap-2 ${activeTab === "Configuracoes" ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Smartphone className="w-3.5 h-3.5"/> Ajustes</button>
            </div>
            
            {activeTab === "Estatisticas" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center"><span className="text-2xl font-bold text-white mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin text-gray-500"/> : Object.keys(libraryData).length}</span><span className="text-[10px] text-gray-500 font-medium">Obras Salvas</span></div>
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center"><span className="text-2xl font-bold text-white mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin text-gray-500"/> : historyData.length}</span><span className="text-[10px] text-gray-500 font-medium">Capítulos Lidos</span></div>
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center"><span className="text-2xl font-bold text-white mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin text-gray-500"/> : obrasLidasIds.length}</span><span className="text-[10px] text-gray-500 font-medium">Séries Iniciadas</span></div>
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center"><span className="text-2xl font-bold text-white mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin text-gray-500"/> : Object.values(libraryData).filter(s=>s==='Favoritos').length}</span><span className="text-[10px] text-gray-500 font-medium">Favoritos</span></div>
              </div>
            )}

            {activeTab === "Historico" && (
                <div>
                    {historyData.length === 0 ? (
                        <div className="text-center py-16 bg-white/[0.01] rounded-2xl border border-white/5"><History className="w-8 h-8 mx-auto text-gray-700 mb-3"/><p className="text-gray-500 text-xs font-medium">Nenhum histórico de leitura.</p></div>
                    ) : (
                       <div className="flex flex-col gap-2">
                          {historyData.slice(0, 15).map(hist => {
                              const mg = mangas.find(m => m.id === hist.mangaId);
                              return (
                                  <div key={hist.id} onClick={() => { if(mg) onNavigate('details', mg); }} className="bg-white/[0.02] border border-white/5 p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-white/[0.04] transition-colors">
                                      <div className="w-12 h-16 rounded-xl overflow-hidden bg-[#020105]">{mg ? <img src={mg.coverUrl} className="w-full h-full object-cover" /> : <BookOpen className="w-4 h-4 m-auto mt-6 text-gray-700"/>}</div>
                                      <div className="flex-1"><h4 className="font-medium text-gray-200 text-sm line-clamp-1">{hist.mangaTitle}</h4><p className="text-indigo-400 text-[11px] font-medium mt-0.5">Capítulo {hist.chapterNumber}</p></div>
                                      <p className="text-[10px] text-gray-600 px-2">{new Date(hist.timestamp).toLocaleDateString()}</p>
                                  </div>
                              )
                          })}
                          <button onClick={() => setConfirmAction('history')} className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 bg-red-500/5 text-red-400 font-medium text-xs rounded-xl hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4"/> Limpar Histórico</button>
                       </div>
                    )}
                </div>
            )}

            {activeTab === "Biblioteca" && (
                <div>
                    {libraryMangas.length === 0 ? (
                        <div className="text-center py-16 bg-white/[0.01] rounded-2xl border border-white/5"><Library className="w-8 h-8 mx-auto text-gray-700 mb-3"/><p className="text-gray-500 text-xs font-medium">Sua biblioteca está vazia.</p></div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {libraryMangas.map(mg => (
                                <div key={mg.id} onClick={() => onNavigate('details', mg)} className="cursor-pointer group">
                                    <div className="aspect-[2/3] w-full rounded-xl overflow-hidden relative border border-white/5">
                                        <img src={mg.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded">
                                            <span className="text-[9px] font-medium text-white">{libraryData[mg.id]}</span>
                                        </div>
                                    </div>
                                    <h4 className="font-medium text-[11px] text-gray-300 line-clamp-1 mt-1.5 px-1">{mg.title}</h4>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "Configuracoes" && (
                <div className="space-y-3">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-sm font-medium text-gray-200">Modo de Leitura</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Exibição das páginas.</p>
                        </div>
                        <select value={userSettings?.readMode || 'Cascata'} onChange={(e) => { updateSettings({ readMode: e.target.value }); showToast("Preferência salva.", "success"); }} className="bg-[#0a0a12] border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
                          <option value="Cascata">Scroll contínuo</option>
                          <option value="Paginação">Por página</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-sm font-medium text-gray-200">Economia de Dados</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Reduz a qualidade das capas.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={userSettings?.dataSaver || false} onChange={(e) => { updateSettings({ dataSaver: e.target.checked }); showToast("Ajuste salvo.", "success"); }} />
                          <div className="w-10 h-5 bg-[#0a0a12] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 peer-checked:border-indigo-400"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-200">Tema Global</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Fundo do aplicativo.</p>
                        </div>
                        <select value={userSettings?.theme || 'Escuro'} onChange={(e) => { updateSettings({ theme: e.target.value }); showToast("Tema aplicado.", "success"); }} className="bg-[#0a0a12] border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
                          <option value="Escuro">Escuro</option>
                          <option value="Amoled">Breu (AMOLED)</option>
                        </select>
                      </div>
                    </div>

                    <button onClick={() => setConfirmAction('cache')} className="flex items-center justify-between w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors">
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-200 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-gray-400" /> Limpar Cache</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Recarrega a interface.</p>
                        </div>
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
