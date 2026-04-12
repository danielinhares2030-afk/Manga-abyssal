import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Zap, Lock } from 'lucide-react';

/* ÍCONE COM ANIMAÇÃO DE PULSAÇÃO ORGÂNICA */
export function AbyssalLogo({ className = "w-10 h-10" }) {
  return (
    <img 
      src="https://i.ibb.co/zh5k9rkG/1775680662923-v4lypu-removebg-preview.png" 
      alt="Logo Mangás Abissal" 
      className={`object-contain transition-all duration-700 animate-[pulse_4s_ease-in-out_infinite] ${className}`}
      onError={(e) => e.target.style.display = 'none'}
    />
  );
}

export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050508] text-red-500 p-10 flex flex-col items-center justify-center font-sans border border-red-900/30">
          <ShieldAlert className="w-16 h-16 mb-4 animate-pulse text-red-600"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center">Fenda no Sistema</h1>
          <p className="mt-2 text-red-400/80 text-sm max-w-lg text-center break-words font-medium">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-zinc-900 border border-zinc-700 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">Restaurar Conexão</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GlobalToast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 backdrop-blur-3xl shadow-2xl ${isError ? 'bg-red-950/90 text-red-200 border-red-600/50' : isSuccess ? 'bg-zinc-950/90 text-amber-400 border-amber-500/50' : 'bg-zinc-950/95 text-zinc-400 border-zinc-800'}`}>
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#050508] border-t border-zinc-900/50 py-12 mt-auto pb-24 md:pb-12 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <div className="flex justify-center items-center gap-3 mb-5">
                    <AbyssalLogo className="w-10 h-10 grayscale opacity-50" />
                    <span className="font-black text-xl text-zinc-500 tracking-[0.2em] uppercase">MANGÁS ABISSAL</span>
                </div>
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em]">O Vazio Resguarda - © 2026</p>
            </div>
        </footer>
    );
}

/* ABERTURA: O BURACO NEGRO ABISSAL (SURREAL E OTIMIZADO) */
export const SplashScreen = React.memo(() => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      <style>{`
        @keyframes singularity {
          0% { transform: scale(0) rotate(0deg); opacity: 0; filter: blur(20px); box-shadow: 0 0 0 rgba(34, 211, 238, 0); }
          30% { transform: scale(1) rotate(180deg); opacity: 1; filter: blur(0px); box-shadow: 0 0 150px rgba(34, 211, 238, 0.8); }
          60% { transform: scale(1.2) rotate(360deg); opacity: 1; box-shadow: inset 0 0 100px rgba(0, 0, 0, 1), 0 0 200px rgba(217, 70, 239, 0.6); }
          100% { transform: scale(50) rotate(720deg); opacity: 1; background: #020204; box-shadow: none; }
        }
        @keyframes reveal-logo {
          0%, 50% { opacity: 0; transform: translateY(50px) scale(0.8) tracking-normal; filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}</style>
      
      {/* O Horizonte de Eventos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black border-[4px] border-cyan-400 rounded-full z-10 mix-blend-screen" style={{ animation: 'singularity 3s cubic-bezier(0.7, 0, 0.3, 1) forwards' }}></div>

      <div className="relative z-20 flex flex-col items-center pointer-events-none" style={{ animation: 'reveal-logo 3.5s ease-out forwards' }}>
        <AbyssalLogo className="w-40 h-40 mb-8 drop-shadow-[0_0_50px_rgba(34,211,238,0.8)] animate-[pulse_2s_infinite]" />
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 tracking-[0.6em] uppercase text-center ml-[0.6em] drop-shadow-2xl">ABISSAL</h1>
        <div className="mt-12 text-cyan-400/80 text-[11px] font-black tracking-[1.5em] uppercase">Mergulhe no Vazio</div>
      </div>
    </div>
  );
});

/* TRANSIÇÃO DE CAPÍTULO: SALTO DIMENSIONAL */
export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-[#020204] flex items-center justify-center overflow-hidden">
            <style>{`
                @keyframes warp-speed {
                    0% { transform: scale(1) translateZ(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: scale(15) translateZ(500px); opacity: 0; }
                }
            `}</style>
            
            {/* Efeito de túnel de luz otimizado */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-[10px] h-[10px] rounded-full shadow-[0_0_100px_50px_#22d3ee,0_0_200px_100px_#d946ef] animate-[warp-speed_0.8s_ease-in_forwards]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="text-cyan-500/80 font-black tracking-[1.5em] text-[10px] uppercase mb-6 animate-pulse ml-[1.5em]">Próxima Camada</div>
                <h2 className="text-[150px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-900 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] animate-in zoom-in-50 duration-500">
                    {chapterNumber}
                </h2>
            </div>
        </div>
    );
});
