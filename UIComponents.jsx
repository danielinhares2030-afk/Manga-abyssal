import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';

/* ==========================================================================
   ÍCONE: INFINITO RADICAL
   ========================================================================== */
export const InfinityLogo = React.memo(({ className = "w-24 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 50" className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
        <defs>
          <linearGradient id="radical-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <path d="M25 15 C10 15 10 35 25 35 C40 35 50 15 75 15 C90 15 90 35 75 35 C60 35 50 15 25 15 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <path d="M25 15 C10 15 10 35 25 35 C40 35 50 15 75 15 C90 15 90 35 75 35 C60 35 50 15 25 15 Z" fill="none" stroke="url(#radical-grad)" strokeWidth="3" strokeLinecap="square" strokeDasharray="150" className="animate-[pulse_1s_infinite_alternate]" />
      </svg>
    </div>
  );
});

/* ==========================================================================
   ABERTURA: ESTILO ANIME / CORTE DE ESPADA (Ousada e rápida)
   ========================================================================== */
export const SplashScreen = React.memo(() => {
  const [fade, setFade] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1. Aparição instantânea
    const t1 = setTimeout(() => setFade(true), 50);
    // 2. Corte agressivo pra sumir (muito mais rápido que o antigo)
    const t2 = setTimeout(() => setFadeOut(true), 1800); 
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#030305] flex flex-col items-center justify-center font-sans overflow-hidden transition-all duration-500 ease-in ${fadeOut ? 'opacity-0 scale-150 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}>
      <style>{`body { background-color: #030305 !important; }`}</style>
      
      {/* O Corte de Fundo */}
      <div className={`absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent -translate-y-1/2 transition-transform duration-[1500ms] ease-out ${fade ? 'scale-x-100 opacity-100 rotate-[-15deg]' : 'scale-x-0 opacity-0 rotate-0'}`}></div>

      <div className={`flex flex-col items-center justify-center relative z-10 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${fade ? 'scale-100' : 'scale-0'}`}>
        <InfinityLogo className="w-40 h-20 mb-2" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic drop-shadow-[4px_4px_0_rgba(220,38,38,0.8)]">
          NEXUS
        </h1>
        <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.5em] mt-2">
          Initializando Sistema
        </p>
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
        <div className="min-h-screen bg-[#030305] p-10 flex flex-col items-center justify-center font-sans border-t-[6px] border-red-600">
          <ShieldAlert className="w-16 h-16 mb-4 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center">Desconexão</h1>
          <p className="mt-2 text-gray-400 text-xs font-bold text-center max-w-lg">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Recarregar Matrix</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GlobalToast({ toast }) {
  if (!toast) return null;
  const colors = toast.type === 'error' ? 'bg-red-950/90 text-red-200 border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 
                 toast.type === 'success' ? 'bg-cyan-950/90 text-cyan-200 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 
                 'bg-[#08080a] text-gray-200 border-gray-500/50';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] border backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-300 ${colors}`}>
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#030305] border-t border-cyan-900/30 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
                <InfinityLogo className="w-12 h-6 opacity-30 mb-4" />
                <span className="font-black text-sm text-cyan-900 tracking-[0.3em] uppercase">NEXUS-INFINITY</span>
            </div>
        </footer>
    );
}

export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-[#030305] font-sans flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-red-900/20 animate-pulse"></div>
            <div className="text-cyan-500/80 font-black tracking-[0.5em] text-[10px] uppercase mb-2 animate-pulse relative z-10">
                Acessando Registro
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter animate-in zoom-in-50 duration-500 relative z-10 drop-shadow-2xl">
              {chapterNumber}
            </h2>
        </div>
    );
});
