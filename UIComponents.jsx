import React, { useState, useEffect } from 'react';
import { ShieldAlert, Bell, CheckCircle, Zap, Lock } from 'lucide-react';

/* NOVO ÍCONE: O OLHO QUE TUDO VÊ (ABRINDO) */
export const AbyssalLogo = React.memo(({ className = "w-16 h-16" }) => {
  return (
    <div className={`relative overflow-hidden rounded-full border border-blue-900/20 bg-black ${className}`}>
      {/* Pupila e Brilho Interno (Sempre lá no fundo) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[60%] h-[60%] bg-blue-600 rounded-full blur-[4px] opacity-40 animate-pulse"></div>
        <div className="absolute w-[15%] h-[70%] bg-white rounded-full shadow-[0_0_15px_#fff,0_0_30px_#3b82f6]"></div>
      </div>

      {/* Pálpebras do Vazio (Abertura Suave) */}
      <style>{`
        @keyframes open-lid-top {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes open-lid-bottom {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      `}</style>
      <div className="absolute inset-0 bg-[#020204] origin-top animate-[open-lid-top_1.5s_cubic-bezier(0.85,0,0.15,1)_forwards_delay-500]"></div>
      <div className="absolute inset-0 bg-[#020204] origin-bottom animate-[open-lid-bottom_1.5s_cubic-bezier(0.85,0,0.15,1)_forwards_delay-500]"></div>
      
      {/* Aura externa giratória */}
      <div className="absolute inset-0 rounded-full border-[2px] border-t-white/20 border-l-blue-500/30 animate-[spin_4s_linear_infinite]"></div>
    </div>
  );
});

export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-blue-500 p-10 flex flex-col items-center justify-center font-sans">
          <ShieldAlert className="w-16 h-16 mb-4 animate-pulse text-blue-600"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center">Fenda no Sistema</h1>
          <p className="mt-2 text-blue-400/80 text-sm max-w-lg text-center break-words font-medium">{this.state.error?.message}</p>
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
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 backdrop-blur-3xl shadow-2xl ${isError ? 'bg-red-950/90 text-red-200 border-red-600/50' : isSuccess ? 'bg-blue-950/90 text-blue-400 border-blue-500/50' : 'bg-zinc-950/95 text-zinc-400 border-zinc-800'}`}>
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-black border-t border-white/5 py-12 mt-auto pb-24 md:pb-12 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <div className="flex justify-center items-center gap-3 mb-5">
                    <AbyssalLogo className="w-10 h-10" />
                    <span className="font-black text-xl text-zinc-500 tracking-[0.2em] uppercase">MANGÁS ABISSAL</span>
                </div>
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em]">O Vazio Resguarda - © 2026</p>
            </div>
        </footer>
    );
}

/* ABERTURA: SINGULARIDADE SURREAL (PRETO, AZUL E BRANCO) */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);   // Ponto de luz surge
    const t2 = setTimeout(() => setPhase(2), 1100);  // Expansão da névoa azul
    const t3 = setTimeout(() => setPhase(3), 2200);  // Bloom branco e revelação total

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black flex items-center justify-center">
      <style>{`
        @keyframes singularity-pulse {
          0% { transform: scale(1); opacity: 0.5; filter: blur(2px); }
          50% { transform: scale(1.5); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 0.5; filter: blur(2px); }
        }
        @keyframes liquid-void {
          0% { transform: scale(0.5) rotate(0deg); opacity: 0; filter: blur(20px); }
          100% { transform: scale(2.5) rotate(180deg); opacity: 1; filter: blur(40px); }
        }
      `}</style>

      {/* Fase 1: O Ponto de Origem */}
      <div className={`absolute w-2 h-2 bg-white rounded-full transition-all duration-1000 shadow-[0_0_20px_#fff,0_0_40px_#3b82f6] ${phase >= 1 ? 'opacity-100 scale-[2]' : 'opacity-0 scale-0'}`}></div>

      {/* Fase 2: Expansão Etérea Azul */}
      <div className={`absolute w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-600/20 via-transparent to-white/5 transition-all duration-[2000ms] ease-out pointer-events-none ${phase >= 2 ? 'opacity-100 scale-100 rotate-180 blur-3xl' : 'opacity-0 scale-0 rotate-0'}`}></div>
      
      {/* Fase 3: Bloom de Luz Branca e Revelação */}
      <div className={`absolute inset-0 bg-white transition-opacity duration-700 pointer-events-none z-50 ${phase === 3 ? 'opacity-20' : 'opacity-0'}`}></div>

      {/* CONTEÚDO FINAL */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-out ${phase >= 3 ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-10 blur-md'}`}>
        <AbyssalLogo className="w-32 h-32 md:w-40 md:h-40 mb-10" />
        
        <h1 className="text-4xl md:text-6xl font-black tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-blue-900 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] pl-[0.5em] text-center">
          MANGÁS ABISSAL
        </h1>
        
        <div className="mt-12 flex items-center gap-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <p className="tracking-[1.2em] uppercase text-[10px] md:text-xs font-black text-blue-400/80 animate-pulse">
              Manifestando o Inevitável
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>
      </div>

      {/* Partículas Sutis de Luz (Brancas e Azuis) */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${phase >= 2 ? 'opacity-40' : 'opacity-0'}`}>
         {[...Array(15)].map((_, i) => (
           <div key={i} className="absolute bg-white rounded-full animate-pulse" 
                style={{
                  width: Math.random() * 3 + 'px',
                  height: Math.random() * 3 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 3 + 's',
                  boxShadow: '0 0 10px #3b82f6'
                }}></div>
         ))}
      </div>
    </div>
  );
});

/* TRANSIÇÃO DE CAPÍTULO: DESLOCAMENTO DO ESPAÇO-TEMPO */
export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden">
            <style>{`
                @keyframes ripple {
                    0% { transform: scale(1); opacity: 0; border: 1px solid #fff; }
                    50% { opacity: 0.5; }
                    100% { transform: scale(5); opacity: 0; border: 10px solid #3b82f6; }
                }
            `}</style>
            
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full animate-[ripple_1s_ease-out_infinite]"></div>
                <div className="absolute w-60 h-60 rounded-full animate-[ripple_1.2s_ease-out_infinite_delay-200]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="text-blue-500/80 font-black tracking-[1.5em] text-[10px] uppercase mb-6 animate-pulse ml-[1.5em]">Transcendendo</div>
                <h2 className="text-[120px] md:text-[180px] leading-none font-black text-white drop-shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-in zoom-in-50 duration-500">
                    {chapterNumber}
                </h2>
            </div>
        </div>
    );
});
