import React, { useState, useEffect } from 'react';
import { Target, Hexagon, ShoppingCart, Trophy, Timer, Skull, Zap, Loader2, ArrowRight, Key, Sparkles, Moon, Flame, AlertTriangle } from 'lucide-react';
import { doc, updateDoc, collectionGroup, getDocs, query } from "firebase/firestore";
import { db } from './firebase';
import { addXpLogic, removeXpLogic, getLevelTitle, getRarityColor, cleanCosmeticUrl } from './helpers';
import { APP_ID } from './constants';

export function NexoView({ user, userProfileData, showToast, mangas, onNavigate, onLevelUp, synthesizeCrystal, shopItems, buyItem }) {
    const [activeTab, setActiveTab] = useState("Missões");
    const [enigmaAnswer, setEnigmaAnswer] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [confirmModal, setConfirmModal] = useState(null); 
    const [isForgingMission, setIsForgingMission] = useState(false); 
    const [synthesizing, setSynthesizing] = useState(false);
    const [rankingList, setRankingList] = useState([]);
    const [loadingRank, setLoadingRank] = useState(false);

    // Categoria selecionada no Mercado Negro (Loja)
    const [shopCategory, setShopCategory] = useState('avatar');

    const rankConfigs = {
        'Rank E': { rxp: 30, rcoin: 15, pxp: 15, pcoin: 10, time: 15, charLimit: 300, enigmaTries: 3, color: 'text-gray-400', border: 'border-gray-500/30' },
        'Rank C': { rxp: 100, rcoin: 50, pxp: 50, pcoin: 25, time: 10, charLimit: 200, enigmaTries: 3, color: 'text-emerald-400', border: 'border-emerald-500/30' },
        'Rank B': { rxp: 150, rcoin: 80, pxp: 80, pcoin: 40, time: 8, charLimit: 120, enigmaTries: 2, color: 'text-blue-400', border: 'border-blue-500/30' },
        'Rank A': { rxp: 300, rcoin: 150, pxp: 150, pcoin: 80, time: 5, charLimit: 80, enigmaTries: 2, color: 'text-amber-500', border: 'border-amber-500/40' },
        'Rank S': { rxp: 800, rcoin: 400, pxp: 400, pcoin: 200, time: 3, charLimit: 60, enigmaTries: 1, color: 'text-orange-500', border: 'border-orange-500/50' },
        'Rank SSS':{ rxp: 2000, rcoin: 1000, pxp: 1000, pcoin: 500, time: 1, charLimit: 40, enigmaTries: 1, color: 'text-red-600', border: 'border-red-600/60' }
    };

    const RANK_CARDS = Object.keys(rankConfigs);

    useEffect(() => {
        if(activeTab === 'Ranking') fetchRanking();
    }, [activeTab]);

    const fetchRanking = async () => {
        setLoadingRank(true);
        try {
            const snap = await getDocs(query(collectionGroup(db, 'profile')));
            let rankData = [];
            snap.forEach(doc => {
                if(doc.ref.path.includes('main') && (doc.data().level || doc.data().name)) { 
                   rankData.push({ id: doc.ref.parent.parent.id, ...doc.data() });
                }
            });
            rankData.sort((a, b) => {
                if (b.level !== a.level) return (b.level || 1) - (a.level || 1);
                return (b.xp || 0) - (a.xp || 0);
            });
            setRankingList(rankData.slice(0, 50));
        } catch (e) {
            showToast("Falha na Matriz Sombria.", "error");
        } finally {
            setLoadingRank(false);
        }
    };

    useEffect(() => {
        if (!userProfileData.activeMission) return;
        const updateTimer = () => {
            const diff = userProfileData.activeMission.deadline - Date.now();
            if (diff <= 0) { setTimeLeft("00:00:00 (FALHA)"); } else {
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / 1000 / 60) % 60);
                const s = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            }
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [userProfileData.activeMission]);

    const triggerForgeMission = async (difficulty) => {
        setConfirmModal(null); setIsForgingMission(true);
        setTimeout(() => { generateMission(difficulty); }, 1500); 
    };

    const generateMission = async (difficulty) => {
        try {
            const now = Date.now();
            const conf = rankConfigs[difficulty];
            const missionPool = ['read', 'search_visual', 'enigma'];
            const chosenType = missionPool[Math.floor(Math.random() * missionPool.length)];

            if (mangas && mangas.length > 0) {
                const randomManga = mangas[Math.floor(Math.random() * mangas.length)];
                let newMission = null;

                if (chosenType === 'search_visual' && randomManga.synopsis) {
                    let cleanDesc = randomManga.synopsis.replace(/<[^>]*>?/gm, '').replace(new RegExp(randomManga.title, 'gi'), '█████');
                    let q = `[ ECO DAS SOMBRAS ]\n\nFragmento:\n"${cleanDesc.substring(0, conf.charLimit)}..."\n\nLocalize a obra no catálogo.`;
                    newMission = { id: Date.now().toString(), type: 'search_local', difficulty, title: "Caçada Abissal", question: q, targetManga: randomManga.id, rewardXp: conf.rxp, rewardCoins: conf.rcoin, penaltyXp: conf.pxp, penaltyCoins: conf.pcoin, deadline: now + (conf.time * 60 * 1000) };
                } else if (chosenType === 'enigma') {
                    let q = `[ MISTÉRIO ]\nAutoria: ${randomManga.author || '???'} \nQual é o nome da obra?`;
                    newMission = { id: Date.now().toString(), type: 'enigma', difficulty, title: "Enigma do Vazio", question: q, answer: [randomManga.title.toLowerCase().trim()], attemptsLeft: conf.enigmaTries, rewardXp: conf.rxp, rewardCoins: conf.rcoin, penaltyXp: conf.pxp, penaltyCoins: conf.pcoin, deadline: now + (conf.time * 60 * 1000) };
                } else {
                    let readTarget = difficulty === 'Rank E' ? 1 : 3;
                    newMission = { id: Date.now().toString(), type: 'read', difficulty, title: `Extração de Sangue`, desc: `Lê ${readTarget} capítulo(s) de "${randomManga.title}".`, targetManga: randomManga.id, targetCount: readTarget, currentCount: 0, rewardXp: conf.rxp, rewardCoins: conf.rcoin, penaltyXp: conf.pxp, penaltyCoins: conf.pcoin, deadline: now + (readTarget * 45 * 60 * 1000) };
                }

                if (newMission) {
                    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), { activeMission: newMission });
                    showToast(`Pacto Selado.`, "success");
                }
            }
        } catch(e) { showToast("Falha ao gerar contrato.", "error"); } finally { setIsForgingMission(false); }
    };

    const handleEnigmaSubmit = async (e) => {
        e.preventDefault(); const m = userProfileData.activeMission;
        if (enigmaAnswer.toLowerCase().trim() === m.answer[0]) {
           let { newXp, newLvl, didLevelUp } = addXpLogic(userProfileData.xp || 0, userProfileData.level || 1, m.rewardXp);
           await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main'), { coins: (userProfileData.coins || 0) + m.rewardCoins, xp: newXp, level: newLvl, activeMission: null });
           showToast("Sucesso!", "success"); if(didLevelUp) onLevelUp(newLvl); 
        } else { showToast("Incorreto.", "error"); }
    };

    const cancelMission = async () => {
        const m = userProfileData.activeMission;
        const profileRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'main');
        let { newXp, newLvl } = removeXpLogic(userProfileData.xp || 0, userProfileData.level || 1, m.penaltyXp);
        await updateDoc(profileRef, { coins: Math.max(0, (userProfileData.coins || 0) - m.penaltyCoins), xp: newXp, level: newLvl, activeMission: null });
        showToast("Pacto quebrado.", "error");
    };

    const runSynthesis = async () => {
        if ((userProfileData.crystals || 0) < 5) return showToast("Faltam cristais.", "error");
        setSynthesizing(true);
        setTimeout(async () => {
          const res = await synthesizeCrystal(); setSynthesizing(false);
          if (res?.success) showToast(`Sucesso!`, 'success');
          else showToast(`Falha no Ritual.`, 'error');
        }, 1500);
    };

    const equipped = userProfileData.equipped_items || {};

    return (
        <div className={`pb-24 animate-in fade-in duration-500 relative font-sans min-h-screen text-gray-200 ${equipped.tema_perfil ? equipped.tema_perfil.cssClass : 'bg-[#030305]'}`}>
            
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-[#030305] to-[#000000] pointer-events-none z-0"></div>

            {/* MODAL DE MISSÃO */}
            {confirmModal && (
                <div className="fixed inset-0 z-[3000] bg-[#030305]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setConfirmModal(null)}>
                    <div className="bg-[#0a0a0c] border border-red-600/50 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
                        <Target className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-xl font-black text-white mb-2 uppercase">Firmar Pacto?</h3>
                        <p className="text-[10px] text-gray-500 font-bold mb-6 uppercase">A falha resultará em perda de XP e Moedas.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setConfirmModal(null)} className="flex-1 bg-transparent border border-white/10 text-gray-400 font-black py-3 rounded-lg text-[10px] uppercase">Recuar</button>
                            <button onClick={() => triggerForgeMission(confirmModal)} className="flex-1 bg-red-600 text-white font-black py-3 rounded-lg text-[10px] uppercase shadow-lg">Aceitar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
                
                {/* MENU ABAS PRINCIPAIS */}
                <div className="flex justify-center gap-2 mb-10 overflow-x-auto no-scrollbar snap-x">
                    {['Missões', 'Forja', 'Loja', 'Ranking'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest border transition-all ${activeTab === tab ? 'bg-red-600 border-transparent text-white shadow-lg' : 'bg-[#0a0a0c] border-white/5 text-gray-500 hover:text-white'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* MISSÕES */}
                {activeTab === "Missões" && (
                    <div className="animate-in fade-in duration-300">
                        {userProfileData.activeMission ? (
                            <div className="bg-[#0a0a0c]/90 border border-red-600/20 p-6 md:p-10 rounded-xl max-w-2xl mx-auto shadow-2xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className={`text-[8px] font-black uppercase px-3 py-1 rounded border ${rankConfigs[userProfileData.activeMission.difficulty].border} ${rankConfigs[userProfileData.activeMission.difficulty].color}`}>
                                            {userProfileData.activeMission.difficulty}
                                        </span>
                                        <h3 className="text-2xl font-black text-white mt-3 uppercase">{userProfileData.activeMission.title}</h3>
                                    </div>
                                    <div className="bg-red-950/30 border border-red-600/30 px-3 py-1.5 rounded-lg text-red-500 font-black text-xs">
                                        <Timer className="w-3 h-3 inline mr-2 mb-0.5" /> {timeLeft}
                                    </div>
                                </div>
                                <div className="bg-black/40 border border-white/5 p-5 rounded-lg mb-6">
                                    <p className="text-gray-300 text-xs font-bold leading-relaxed uppercase tracking-wider">
                                        {userProfileData.activeMission.desc || userProfileData.activeMission.question}
                                    </p>
                                    {userProfileData.activeMission.type === 'enigma' && (
                                        <form onSubmit={handleEnigmaSubmit} className="mt-4 flex gap-2">
                                            <input type="text" value={enigmaAnswer} onChange={e=>setEnigmaAnswer(e.target.value)} placeholder="Resposta..." className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-xs outline-none focus:border-red-600" />
                                            <button type="submit" className="bg-red-600 p-2.5 rounded-lg text-white"><Key className="w-4 h-4"/></button>
                                        </form>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <div className="flex gap-4 text-[9px] font-black uppercase text-gray-400">
                                        <span className="text-white">+ {userProfileData.activeMission.rewardXp} XP</span>
                                        <span className="text-amber-500">+ {userProfileData.activeMission.rewardCoins} M</span>
                                    </div>
                                    <button onClick={cancelMission} className="text-red-600 text-[9px] font-black uppercase hover:underline">Abortar</button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {RANK_CARDS.map(rId => (
                                    <div key={rId} className={`bg-[#0a0a0c] border ${rankConfigs[rId].border} p-5 rounded-xl flex flex-col justify-between hover:-translate-y-1 transition-all group`}>
                                        <h3 className={`text-lg font-black uppercase ${rankConfigs[rId].color}`}>{rId}</h3>
                                        <div className="my-4 text-[8px] font-black uppercase text-gray-500 space-y-1">
                                            <p>Ganhos: <span className="text-white">{rankConfigs[rId].rxp}XP | {rankConfigs[rId].rcoin}M</span></p>
                                            <p>Risco: <span className="text-red-800">{rankConfigs[rId].pxp}XP | {rankConfigs[rId].pcoin}M</span></p>
                                        </div>
                                        <button onClick={() => setConfirmModal(rId)} className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase group-hover:bg-red-600 group-hover:border-transparent transition-all">Firmar</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* FORJA */}
                {activeTab === "Forja" && (
                    <div className="animate-in fade-in duration-300 max-w-sm mx-auto text-center bg-[#0a0a0c] border border-red-600/20 p-8 rounded-xl">
                        <Flame className="w-12 h-12 text-red-600 mx-auto mb-4 animate-pulse" />
                        <h2 className="text-2xl font-black text-white mb-2 uppercase">Fornalha</h2>
                        <p className="text-[10px] text-gray-500 font-bold mb-8 uppercase">Sintetize 5 Cristais. 40% de chance de falha.</p>
                        <div className="bg-black border border-white/10 p-5 rounded-lg mb-8">
                            <div className="text-3xl font-black text-white flex items-center justify-center gap-3">
                                {userProfileData.crystals || 0} <Hexagon className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                        <button onClick={runSynthesis} disabled={synthesizing || (userProfileData.crystals || 0) < 5} className="w-full bg-red-600 text-white font-black py-3 rounded-lg text-[10px] uppercase shadow-lg disabled:opacity-30">
                            {synthesizing ? "Fundindo..." : "Iniciar Ritual"}
                        </button>
                    </div>
                )}

                {/* MERCADO NEGRO (LOJA) */}
                {activeTab === "Loja" && (
                    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-6 bg-[#0a0a0c] p-5 rounded-xl border border-white/5">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase">Mercado Negro</h3>
                                <p className="text-[9px] text-gray-500 font-bold uppercase">Cosméticos Proibidos.</p>
                            </div>
                            <div className="bg-black px-4 py-2 rounded-lg border border-amber-500/30 text-amber-500 font-black text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div> {userProfileData.coins || 0}
                            </div>
                        </div>

                        {/* SUB-ABAS DA LOJA */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2 snap-x">
                            {[ {id:'avatar', label:'Avatar'}, {id:'capa_fundo', label:'Capa'}, {id:'moldura', label:'Moldura'}, {id:'nickname', label:'Nick'} ].map(cat => (
                                <button key={cat.id} onClick={() => setShopCategory(cat.id)} className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase transition-all border ${ shopCategory === cat.id ? 'bg-red-600 border-transparent text-white shadow-lg' : 'bg-black border-white/5 text-gray-500 hover:text-white' }`}>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                          
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {shopItems.filter(item => {
                                const cat = (item.categoria || item.type || '').toLowerCase();
                                if (shopCategory === 'capa_fundo') return cat === 'capa_fundo' || cat === 'capa';
                                return cat === shopCategory;
                            }).map(item => {
                              const hasItem = userProfileData.inventory?.includes(item.id);
                              const cat = (item.categoria || item.type || '').toLowerCase();

                              return (
                                <div key={item.id} className="bg-[#0a0a0c] border border-white/5 rounded-xl p-3 flex flex-col items-center text-center hover:border-red-600/40 transition-all relative">
                                  {(item.css || item.animacao) && ( <style dangerouslySetInnerHTML={{__html: `.${item.cssClass} { ${item.css} } ${item.animacao || ''}`}} /> )}
                                  
                                  {/* Rarity Tag */}
                                  <div className={`absolute top-2 right-2 text-[6px] font-black px-1.5 py-0.5 rounded border bg-black/80 ${getRarityColor(item.raridade)}`}>
                                      {item.raridade || 'COMUM'}
                                  </div>

                                  <div className={`w-20 h-20 rounded-lg mt-2 mb-3 bg-black flex items-center justify-center overflow-hidden border border-white/5 relative flex-shrink-0 ${cat === 'avatar' ? item.cssClass : ''}`}>
                                    {['capa_fundo', 'capa'].includes(cat) && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className="w-full h-full object-cover opacity-70" /> )}
                                    {cat === 'moldura' && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none scale-[1.15]" style={{ mixBlendMode: 'screen' }} /> )}
                                    {cat === 'avatar' && cleanCosmeticUrl(item.preview) && ( <img src={cleanCosmeticUrl(item.preview)} className="w-full h-full object-cover relative z-10" /> )}
                                    {cat === 'nickname' && ( <div className={`font-black text-sm z-20 ${item.cssClass}`}>Kage</div> )}
                                  </div>
                                  
                                  <h4 className="text-gray-300 font-black mb-3 text-[10px] line-clamp-1 w-full">{item.nome || item.name}</h4>
                                  
                                  {hasItem ? (
                                    <button disabled className="w-full rounded-lg bg-black text-gray-600 font-black py-2 text-[8px] uppercase cursor-not-allowed">Já Possui</button>
                                  ) : (
                                    <button onClick={() => buyItem(item)} className="w-full rounded-lg bg-amber-600 text-black font-black py-2 text-[8px] uppercase hover:bg-amber-500 transition-colors">Comprar • {item.preco}</button>
                                  )}
                                </div>
                              )
                            })}
                        </div>
                    </div>
                )}

                {/* RANKING */}
                {activeTab === "Ranking" && (
                    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-white uppercase">Hierarquia</h2>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Os Líderes das Sombras.</p>
                        </div>
                        {loadingRank ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-red-600 animate-spin"/></div>
                        ) : (
                            <div className="space-y-2">
                                {rankingList.map((player, index) => (
                                    <div key={player.id} className={`bg-[#0a0a0c] rounded-xl border p-3 flex items-center gap-4 transition-all ${index < 3 ? 'border-red-600/40 bg-red-950/10' : 'border-white/5'}`}>
                                        <div className={`w-8 font-black text-center text-sm ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : 'text-gray-600'}`}>#{index + 1}</div>
                                        <img src={cleanCosmeticUrl(player.avatarUrl) || 'https://placehold.co/100x100/030305/dc2626?text=K'} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                        <div className="flex-1">
                                            <h4 className="font-black text-xs text-white uppercase truncate">{player.displayName || "Oculto"}</h4>
                                            <p className="text-[8px] text-red-500 font-bold uppercase">{getLevelTitle(player.level)}</p>
                                        </div>
                                        <div className="text-right text-[8px] font-black">
                                            <div className="text-white">Nível {player.level}</div>
                                            <div className="text-gray-500">{player.xp} XP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
