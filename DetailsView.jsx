import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Play, Library, Share2, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { APP_ID } from './constants';

export default function DetailsView({ manga, libraryData, historyData, user, userProfileData, onBack, onChapterClick, onRequireLogin, showToast, db }) {
    const [isSharing, setIsSharing] = useState(false);
    const [localRating, setLocalRating] = useState(manga.rating || 0);

    const handleRate = async (ratingValue) => {
        if (!user) return showToast("Apenas Viajantes registados podem avaliar.", "warning");
        try {
            const currentRating = localRating || 5.0;
            const newRating = Number(((currentRating + ratingValue) / 2).toFixed(1));
            setLocalRating(newRating);
            const mangaRef = doc(db, 'obras', manga.id);
            await updateDoc(mangaRef, { rating: newRating });
            showToast(`Avaliação de ${ratingValue} estrelas enviada.`, "success");
        } catch (error) { showToast("O Vazio recusou sua nota.", "error"); }
    };

    const inLibrary = libraryData && libraryData[manga.id];
    const handleLibraryToggle = async () => {
        if (!user) { onRequireLogin(); return; }
        try {
            const ref = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'library', manga.id.toString());
            if (inLibrary) { await deleteDoc(ref); showToast("Removido da coleção.", "info"); } 
            else { await setDoc(ref, { mangaId: manga.id, status: 'Lendo', updatedAt: Date.now() }); showToast("Salvo no Abismo.", "success"); }
        } catch (error) { showToast("Erro na biblioteca.", "error"); }
    };

    const mangaHistory = historyData.filter(h => h.mangaId === manga.id);
    const lastRead = mangaHistory.length > 0 ? mangaHistory[0] : null;
    const chapters = manga.chapters || [];
    const firstChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;
    const nextChapterToRead = lastRead ? (chapters.find(c => Number(c.number) === Number(lastRead.chapterNumber) + 1) || chapters.find(c => c.id === lastRead.id)) : firstChapter;

    return (
        <div className="min-h-screen bg-[#020203] text-zinc-300 font-sans pb-32 animate-in fade-in duration-1000">
            {/* HERO SURREAL */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <img src={manga.coverUrl} className="absolute inset-0 w-full h-full object-cover scale-110 blur-[80px] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020203]/80 to-[#020203]" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <div className="relative mb-8 group">
                        <img src={manga.coverUrl} alt={manga.title} className="w-48 md:w-64 aspect-[2/3] object-cover rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/5 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute -inset-4 border border-white/5 rounded-sm -z-10 animate-pulse"></div>
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4 uppercase drop-shadow-2xl">{manga.title}</h1>
                    
                    <div className="flex items-center gap-6 mb-8 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => handleRate(star)} className="hover:scale-125 transition-transform"><Star className={`w-4 h-4 ${star <= Math.round(localRating) ? 'text-white fill-white' : 'text-zinc-600'}`} /></button>
                            ))}
                            <span className="text-white font-black ml-2 text-sm">{localRating ? Number(localRating).toFixed(1) : "0.0"}</span>
                        </div>
                        <div className="w-[1px] h-4 bg-zinc-700"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{manga.type}</span>
                    </div>
                </div>

                <button onClick={onBack} className="absolute top-8 left-8 p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition-all">
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
                <div className="flex gap-4 mb-16">
                    <button onClick={() => nextChapterToRead ? onChapterClick(manga, nextChapterToRead) : showToast("Indisponível", "warning")} className="flex-[2] bg-white text-black font-black py-5 rounded-sm text-xs uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all shadow-2xl flex items-center justify-center gap-3">
                        <Play className="w-4 h-4 fill-current" /> {lastRead ? 'Continuar' : 'Iniciar'}
                    </button>
                    <button onClick={handleLibraryToggle} className={`flex-1 border font-black py-5 rounded-sm text-xs uppercase tracking-[0.2em] transition-all ${inLibrary ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-transparent border-white/20 text-white hover:bg-white/5'}`}>
                        {inLibrary ? 'Salvo' : 'Salvar'}
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                            <div className="w-8 h-[1px] bg-zinc-700"></div> Sinopse
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium text-justify">{manga.synopsis || "Os registros do Vazio estão em branco."}</p>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                            <div className="w-8 h-[1px] bg-zinc-700"></div> Detalhes
                        </h3>
                        <div className="space-y-4">
                            <div><p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Autor</p><p className="text-zinc-300 text-xs font-bold">{manga.author || 'Desconhecido'}</p></div>
                            <div><p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Status</p><p className="text-zinc-300 text-xs font-bold">{manga.status || 'Ativo'}</p></div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                        <div className="w-12 h-[1px] bg-zinc-700"></div> Registros de Capítulos ({chapters.length})
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {chapters.map(chapter => {
                            const isRead = mangaHistory.some(h => h.chapterNumber === chapter.number);
                            return (
                                <div key={chapter.id} onClick={() => onChapterClick(manga, chapter)} className={`group cursor-pointer p-6 border transition-all duration-500 ${isRead ? 'bg-zinc-950/50 border-zinc-900 opacity-40' : 'bg-transparent border-white/5 hover:border-white/20'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <span className="text-2xl font-black text-zinc-800 group-hover:text-white transition-colors">{chapter.number}</span>
                                            <h4 className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">Capítulo {chapter.number}</h4>
                                        </div>
                                        {isRead && <CheckCircle className="w-4 h-4 text-zinc-700" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
