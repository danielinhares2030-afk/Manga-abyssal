import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

// Novo Logo N estilo Brush (Marker) para unificar a identidade
export const NexoLogo = React.memo(({ className = "w-64 h-64" }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nexonBluePurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="50%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d="M 25 80 Q 25 50 30 20 Q 32 15 35 25 L 65 65 Q 68 70 70 60 Q 75 40 75 20" stroke="url(#nexonBluePurple)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 15px rgba(168,85,247,0.8))' }} />
      <path d="M 23 85 L 28 75 M 32 15 L 27 25 M 68 75 L 75 65" stroke="url(#nexonBluePurple)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
});

// NOVA TELA DE ABERTURA ÉPICA (ESTILO CEREJEIRA NEON)
export const SplashScreen = React.memo(() => {
  const [fade, setFade] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { 
      const t1 = setTimeout(() => setFade(true), 50); 
      const duration = 2500;
      const interval = 30;
      const steps = duration / interval;
      let currentStep = 0;
      const timer = setInterval(() => {
          currentStep++;
          setProgress(Math.min(100, Math.floor((currentStep / steps) * 100)));
          if (currentStep >= steps) clearInterval(timer);
      }, interval);

      return () => { clearTimeout(t1); clearInterval(timer); };
  }, []);

  return (
    <div 
        className={`fixed inset-0 z-[9999] bg-[#030108] bg-cover bg-center flex flex-col items-center justify-between font-sans transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: "url('https://i.ibb.co/HTyB8nXS/file-000000001f5871fbbfd097ee10f6bd79.png')" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        .font-marker { font-family: 'Permanent Marker', cursive; }
      `}</style>
      
      {/* OVERLAY ESCURO PARA DESTAQUE */}
      <div className="absolute inset-0 bg-[#05030a]/40 backdrop-blur-[1px] pointer-events-none z-0"></div>

      {/* ELEMENTOS LATERAIS JAPONESES (DIREITA) */}
      <div className="absolute right-4 top-24 z-0 flex flex-col items-center opacity-80 pointer-events-none">
          <div className="text-gray-300 text-[9px] tracking-[0.5em] writing-vertical-rl mb-4 drop-shadow-md">ネクソスキャン</div>
          <div className="border border-red-500/80 text-red-500/90 text-[8px] p-0.5 writing-vertical-rl mt-2 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">未来</div>
      </div>

      {/* ÁREA CENTRAL - LOGO E TEXTOS */}
      <div className={`relative z-10 flex flex-col items-center mt-24 md:mt-32 transition-all duration-1000 ease-out ${fade ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4 opacity-0'}`}>
        
        {/* Círculo Fino com a Estrela e o N */}
        <div className="relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64 border border-purple-500/30 rounded-full mb-4 shadow-[inset_0_0_30px_rgba(168,85,247,0.1)]">
            <NexoLogo className="w-28 h-28 md:w-32 md:h-32 relative z-10 -ml-1" />
            {/* Estrela no topo do circulo */}
            <div className="absolute -top-5 text-purple-400 text-lg drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]">✦</div>
            {/* Pontos Cardeais */}
            <div className="absolute -left-1 top-1/2 w-2 h-2 rounded-full bg-purple-500/50"></div>
            <div className="absolute -right-1 top-1/2 w-2 h-2 rounded-full bg-purple-500/50"></div>
        </div>

        {/* Título NEXO */}
        <h1 className="text-white text-[65px] md:text-[80px] font-marker tracking-widest leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative -ml-2 mb-2 mt-4">
            NEXO
        </h1>
        
        {/* Subtítulo SCAN */}
        <div className="flex items-center gap-4 w-full justify-center mb-6">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500 text-[14px] md:text-[16px] font-black tracking-[1em] uppercase drop-shadow-lg -mr-2">
                S C A N
            </h2>
        </div>

        {/* Frase Japonesa */}
        <p className="text-gray-300 text-[13px] tracking-[0.5em] font-medium mb-4 drop-shadow-md">
            マンガ無限の物語
        </p>

        {/* Divisor "Seu portal..." */}
        <div className="flex items-center gap-4 w-full justify-center opacity-80 mb-8 max-w-xs">
            <div className="h-[1px] flex-1 bg-white/20"></div>
            <span className="text-[8px] font-bold text-gray-300 tracking-[0.2em] uppercase">SEU PORTAL PARA O UNIVERSO DOS MANGÁS</span>
            <div className="h-[1px] flex-1 bg-white/20"></div>
        </div>

        {/* Círculo "Sonho" */}
        <div className="w-12 h-12 rounded-full border border-fuchsia-500/60 flex items-center justify-center text-fuchsia-400 text-lg drop-shadow-[0_0_10px_rgba(217,70,239,0.4)] relative">
            <div className="absolute -top-4 w-[1px] h-4 bg-fuchsia-500/50"></div>
            <div className="absolute -bottom-4 w-[1px] h-4 bg-fuchsia-500/50"></div>
            夢
        </div>
      </div>

      {/* ÁREA INFERIOR - CARREGAMENTO */}
      <div className="relative z-10 mb-16 flex flex-col items-center w-full max-w-[200px]">
         <p className="text-center text-[9px] text-gray-300 font-medium tracking-[0.2em] uppercase mb-2">Carregando sua experiência</p>
         <p className="text-center text-[10px] text-fuchsia-400/80 tracking-[0.3em] mb-4">準備中</p>
         
         {/* Barra de Progresso Minimalista */}
         <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <div className="h-full bg-white transition-all duration-75 shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ width: `${progress}%` }}></div>
         </div>
      </div>

    </div>
  );
});

export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030108] p-10 flex flex-col items-center justify-center font-sans border-t-[4px] border-cyan-500">
          <AlertTriangle className="w-16 h-16 mb-4 text-cyan-500 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center">Falha no Sistema (Erro)</h1>
          <p className="mt-2 text-gray-500 text-xs font-bold text-center max-w-lg">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-cyan-950/30 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-xl px-8 py-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg">Restaurar Conexão</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GlobalToast({ toast }) {
  if (!toast) return null;
  const colors = toast.type === 'error' ? 'bg-red-950/90 text-red-200 border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 
                 toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 
                 'bg-[#080510]/90 text-gray-200 border-blue-900/30 shadow-xl';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 font-black text-[10px] uppercase tracking-[0.1em] border rounded-xl backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-300 ${colors}`}>
      <span className='text-center flex items-center gap-2'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#030108] border-t border-blue-900/20 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center relative z-10">
                <NexoLogo className="w-16 h-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 mb-4" />
                <span className="font-black text-[10px] text-gray-600 tracking-[0.5em] uppercase mt-2">NEXON SCAN</span>
                <span className="font-bold text-[8px] text-gray-700 tracking-[0.2em] uppercase mt-1">SEU PORTAL PARA O UNIVERSO DOS MANGÁS</span>
            </div>
        </footer>
    );
}

export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-[#030108] font-sans flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#030108] to-[#030108]"></div>
            
            <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                <div className="text-cyan-400 font-black tracking-[0.5em] text-[10px] uppercase mb-3 animate-pulse">
                    Carregando
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                    CAPÍTULO {chapterNumber}
                </h2>
            </div>
        </div>
    );
});
