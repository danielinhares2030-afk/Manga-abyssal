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
    try { const compressedBase64 = await compressImage(file, type === 'cover' ? 400 : 150, 0.4); if (type === 'avatar') setAvatarBase64(compressedBase64); else setCoverBase64(compressedBase64); } catch (err) { showToast("Erro na anomalia visual.", "error"); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await updateProfile(auth.currentUser, { displayName: name }); const docData = { coverUrl: coverBase64, avatarUrl: avatarBase64, bio: bio }; await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), docData, { merge: true }); onUpdateData(docData); showToast('Registro atualizado no sistema!', 'success'); setIsEditing(false); } catch (error) { showToast(`Erro ao salvar.`, 'error'); } finally { setLoading(false); }
  };

  const executeConfirmAction = async () => {
      if (confirmAction === 'history') { try { historyData.forEach(async (h) => { await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'history', h.id)); }); showToast("Memórias apagadas.", "success"); } catch(e) { showToast("Erro ao purgar dados.", "error"); } } 
      else if (confirmAction === 'cache') { localStorage.clear(); sessionStorage.clear(); window.location.reload(true); }
      setConfirmAction(null);
  };

  const level = userProfileData.level || 1; const currentXp = userProfileData.xp || 0; const xpNeeded = getLevelRequirement(level); const progressPercent = Math.min(100, Math.max(0, (currentXp / xpNeeded) * 100));
  const lidosSet = new Set(historyData.map(h => h.mangaId)); const obrasLidasIds = Array.from(lidosSet); const libraryMangaIds = Object.keys(libraryData); const libraryMangas = mangas.filter(m => libraryMangaIds.includes(m.id));
  const eq = userProfileData.equipped_items || {};

  const activeAvatarSrc = (eq.avatar?.preview ? cleanCosmeticUrl(eq.avatar.preview) : null) || avatarBase64 || `https://placehold.co/150x150/0b0e14/22d3ee?text=U`;

  return (
    <div className={`animate-in fade-in duration-700 w-full pb-24 font-sans min-h-screen text-gray-200 ${eq.tema_perfil ? eq.tema_perfil.cssClass : 'bg-[#08080a]'}`}>
      
      {/* MODAL AGRESSIVO */}
      {confirmAction && (
          <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-[#0b0e14] border-t-2 border-red-500 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_20px_50px_rgba(220,38,38,0.2)]">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">{confirmAction === 'history' ? 'Purgar Memórias?' : 'Resetar Matriz?'}</h3>
                  <p className="text-xs text-gray-400 font-bold mb-8 px-2 uppercase tracking-wider">{confirmAction === 'history' ? 'Esta ação é irreversível.' : 'A interface será recarregada.'}</p>
                  <div className="flex gap-3">
                      <button onClick={() => setConfirmAction(null)} className="flex-1 bg-[#050508] border border-white/10 text-gray-400 font-black py-3.5 rounded-xl hover:bg-white/5 transition-colors text-xs uppercase tracking-widest">Cancelar</button>
                      <button onClick={executeConfirmAction} className="flex-1 bg-red-600 text-white font-black py-3.5 rounded-xl transition-colors hover:bg-red-500 text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.4)]">Confirmar</button>
                  </div>
              </div>
          </div>
      )}

      {/* CAPA DE FUNDO CYBERPUNK */}
      <div className="h-48 md:h-72 w-full bg-[#08080a] relative group overflow-hidden border-b border-cyan-500/20">
        {cleanCosmeticUrl(eq.capa_fundo?.preview) ? ( <img src={cleanCosmeticUrl(eq.capa_fundo.preview)} className={`w-full h-full object-cover opacity-60 ${eq.capa_fundo.cssClass || ''}`} /> ) : coverBase64 ? ( <img src={coverBase64} className="w-full h-full object-cover opacity-40" /> ) : ( <div className={`w-full h-full bg-gradient-to-br from-cyan-900/30 to-red-900/30 ${eq.capa_fundo?.cssClass || ''}`} /> )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] to-transparent" />
        
        {isEditing && (
            <button onClick={() => coverInputRef.current.click()} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-cyan-400 border border-cyan-500 px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black z-10 hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Camera className="w-4 h-4" /> Alterar Fundo
            </button>
        )}
        <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-20 md:-mt-28 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10">
          
          {/* AVATAR COM GLOW PIQUE ANIME */}
          <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center flex-shrink-0 group ${(!eq.moldura?.preview && eq.moldura) ? eq.moldura.cssClass : ''}`}>
            <div className={`w-full h-full rounded-full bg-[#0b0e14] flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.4)] ${!eq.moldura ? 'border-4 border-[#08080a]' : ''}`}>
               <img src={activeAvatarSrc} className={`w-full h-full object-cover ${eq.avatar?.cssClass || ''}`} alt="Avatar" />
            </div>
            {cleanCosmeticUrl(eq.particulas?.preview) && ( <img src={cleanCosmeticUrl(eq.particulas.preview)} className={`absolute inset-[-50%] m-auto w-[200%] h-[200%] object-contain z-0 ${eq.particulas.cssClass || ''}`} style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
            {cleanCosmeticUrl(eq.efeito?.preview) && ( <img src={cleanCosmeticUrl(eq.efeito.preview)} className={`absolute inset-0 m-auto w-full h-full object-contain z-20 ${eq.efeito.cssClass || ''}`} style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} /> )}
            {cleanCosmeticUrl(eq.moldura?.preview) && ( <img src={cleanCosmeticUrl(eq.moldura.preview)} className={`absolute inset-[-15%] m-auto w-[130%] h-[130%] object-contain z-30 ${eq.moldura.cssClass || ''}`} style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} /> )}

            {isEditing && <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-0 right-0 bg-cyan-500 text-black p-3 rounded-full z-50 border-[3px] border-[#08080a] hover:bg-cyan-400 transition-colors shadow-[0_0_15px_#22d3ee]"><Camera className="w-4 h-4" /></button>}
            <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
          </div>

          <div className="flex-1 text-center md:text-left mt-2 md:mt-0 w-full">
            <h1 className={`text-3xl md:text-4xl font-black tracking-tighter uppercase drop-shadow-lg ${eq.nickname ? eq.nickname.cssClass : 'text-white'}`}>{name || 'Jogador Desconhecido'}</h1>
            <p className="text-cyan-500 font-bold mb-1 text-[10px] tracking-[0.2em] uppercase">{user.email}</p>
            {bio && !isEditing && <p className="text-gray-400 text-xs mb-3 font-medium mt-2 bg-white/5 inline-block px-3 py-1.5 rounded-lg border border-white/5">{bio}</p>}
            
            {/* STATUS BARRA RPG */}
            <div className="w-full bg-[#050508] p-5 rounded-2xl border-l-4 border-cyan-500 shadow-lg mt-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-full bg-cyan-500/5 blur-xl"></div>
              <div className="flex justify-between items-end mb-3 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-1">Rank Atual</span>
                    <span className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-400"/> LVL {level} - {getLevelTitle(level)}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1 mb-1"><Zap className="w-3 h-3"/> Energia</span>
                    <span className="text-xs font-black text-white">{currentXp} <span className="text-gray-600">/ {xpNeeded} XP</span></span>
                </div>
              </div>
              <div className="relative w-full h-2 bg-[#11141d] rounded-full overflow-hidden border border-white/5 relative z-10">
                 <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-red-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-center">
            <button onClick={() => setIsEditing(!isEditing)} className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-black transition-all flex-1 md:flex-none shadow-[0_0_15px_rgba(34,211,238,0.2)]"><Edit3 className="w-4 h-4" /> {isEditing ? 'Cancelar' : 'Editar'}</button>
            <button onClick={onLogout} className="bg-red-950/40 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-900/50"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSave} className="bg-[#0b0e14] border-t-4 border-cyan-500 rounded-2xl p-8 animate-in fade-in shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="space-y-6">
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 mb-2">Identidade</label>
                 <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#050508] border border-white/5 rounded-xl px-4 py-4 text-white text-sm font-bold outline-none focus:border-cyan-500 transition-colors uppercase tracking-wider" placeholder="NOME DE JOGADOR"/>
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 mb-2">Descrição</label>
                 <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-[#050508] border border-white/5 rounded-xl px-4 py-4 text-white text-sm font-bold resize-none outline-none focus:border-cyan-500 transition-colors uppercase tracking-wider" placeholder="Sua história..."></textarea>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-8 bg-cyan-500 text-black text-xs uppercase tracking-widest font-black px-8 py-4 rounded-xl w-full flex justify-center hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">{loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Sincronizar Dados'}</button>
          </form>
        ) : (
          <div>
            <div className="flex gap-4 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar pb-4 snap-x">
              {['Estatisticas', 'Historico', 'Biblioteca', 'Configuracoes'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`snap-start px-5 py-2.5 rounded-xl font-black transition-all whitespace-nowrap text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ${activeTab === tab ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  {tab === 'Estatisticas' && <Compass className="w-4 h-4"/>} {tab === 'Historico' && <History className="w-4 h-4"/>} {tab === 'Biblioteca' && <Library className="w-4 h-4"/>} {tab === 'Configuracoes' && <Smartphone className="w-4 h-4"/>}
                  {tab}
                </button>
              ))}
            </div>
            
            {activeTab === "Estatisticas" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0b0e14] border-l-2 border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-white mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : Object.keys(libraryData).length}</span><span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Salvos</span></div>
                <div className="bg-[#0b0e14] border-l-2 border-cyan-500 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-cyan-400 mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : historyData.length}</span><span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Lidos</span></div>
                <div className="bg-[#0b0e14] border-l-2 border-amber-500 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-amber-400 mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : obrasLidasIds.length}</span><span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Iniciadas</span></div>
                <div className="bg-[#0b0e14] border-l-2 border-red-500 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"><span className="text-3xl font-black text-red-400 mb-1">{!dataLoaded ? <Loader2 className="w-5 h-5 animate-spin"/> : Object.values(libraryData).filter(s=>s==='Favoritos').length}</span><span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Favoritos</span></div>
              </div>
            )}

            {activeTab === "Historico" && (
                <div className="bg-[#0b0e14] p-6 rounded-3xl border border-white/5 shadow-xl">
                    {historyData.length === 0 ? (
                        <div className="text-center py-12"><History className="w-10 h-10 mx-auto text-gray-700 mb-4"/><p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Nenhum registro encontrado.</p></div>
                    ) : (
                       <div className="flex flex-col gap-3">
                          {historyData.slice(0, 15).map(hist => {
                              const mg = mangas.find(m => m.id === hist.mangaId);
                              return (
                                  <div key={hist.id} onClick={() => { if(mg) onNavigate('details', mg); }} className="bg-[#050508] border border-white/5 p-3.5 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-cyan-500/50 transition-colors group">
                                      <div className="w-12 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">{mg ? <img src={mg.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <BookOpen className="w-5 h-5 m-auto mt-5 text-gray-700"/>}</div>
                                      <div className="flex-1"><h4 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-cyan-400">{hist.mangaTitle}</h4><p className="text-red-400 text-[10px] font-black mt-1 uppercase tracking-widest">Capítulo {hist.chapterNumber}</p></div>
                                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">{new Date(hist.timestamp).toLocaleDateString()}</p>
                                  </div>
                              )
                          })}
                          <button onClick={() => setConfirmAction('history')} className="mt-6 w-full py-4 bg-transparent border-2 border-red-900/50 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all flex justify-center items-center gap-2"><Trash2 className="w-4 h-4"/> Purgar Histórico</button>
                       </div>
                    )}
                </div>
            )}

            {activeTab === "Biblioteca" && (
                <div className="bg-[#0b0e14] p-6 rounded-3xl border border-white/5 shadow-xl">
                    {libraryMangas.length === 0 ? (
                        <div className="text-center py-12"><Library className="w-10 h-10 mx-auto text-gray-700 mb-4"/><p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Acervo Vazio.</p></div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {libraryMangas.map(mg => (
                                <div key={mg.id} onClick={() => onNavigate('details', mg)} className="cursor-pointer group">
                                    <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-cyan-500/50 transition-colors shadow-lg">
                                        <img src={mg.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shadow-md">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">{libraryData[mg.id]}</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <h4 className="font-bold text-xs text-gray-300 line-clamp-1 mt-3 px-1 group-hover:text-cyan-400">{mg.title}</h4>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "Configuracoes" && (
                <div className="space-y-4">
                    <div className="bg-[#0b0e14] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
                      <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 mb-8 border-b border-white/5 pb-4"><LayoutTemplate className="w-5 h-5" /> Opções do Sistema</h3>
                      
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-sm font-bold text-white">Modo de Leitura</p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Orientação das páginas.</p>
                        </div>
                        <select value={userSettings?.readMode || 'Cascata'} onChange={(e) => { updateSettings({ readMode: e.target.value }); showToast("Sistema atualizado.", "success"); }} className="bg-[#050508] border border-white/10 text-white text-xs font-black rounded-xl px-4 py-3 outline-none focus:border-cyan-500 uppercase tracking-widest">
                          <option value="Cascata">Cascata</option>
                          <option value="Paginação">Páginas</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-sm font-bold text-white">Modo Econômico</p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Reduz resolução de imagens.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={userSettings?.dataSaver || false} onChange={(e) => { updateSettings({ dataSaver: e.target.checked }); showToast("Sistema atualizado.", "success"); }} />
                          <div className="w-12 h-6 bg-[#050508] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:border-cyan-400 shadow-inner"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">Aura do Sistema</p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Otimização AMOLED.</p>
                        </div>
                        <select value={userSettings?.theme || 'Escuro'} onChange={(e) => { updateSettings({ theme: e.target.value }); showToast("Aura aplicada.", "success"); }} className="bg-[#050508] border border-white/10 text-white text-xs font-black rounded-xl px-4 py-3 outline-none focus:border-red-500 uppercase tracking-widest">
                          <option value="Escuro">Padrão</option>
                          <option value="Amoled">Breu (OLED)</option>
                        </select>
                      </div>
                    </div>

                    <button onClick={() => setConfirmAction('cache')} className="flex items-center justify-between w-full bg-[#0b0e14] border border-red-900/30 rounded-3xl p-6 md:p-8 hover:bg-red-950/20 transition-colors shadow-xl group">
                        <div className="text-left">
                            <p className="text-sm font-black text-red-500 flex items-center gap-2 uppercase tracking-widest"><RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> Reiniciar Matriz</p>
                            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider">Limpa arquivos temporários do leitor.</p>
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
