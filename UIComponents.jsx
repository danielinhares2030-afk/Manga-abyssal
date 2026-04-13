import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Zap, Lock } from 'lucide-react';

/* NOVO ÍCONE: O OLHO DO ABISMO (100% CSS) */
export const AbyssalLogo = React.memo(({ className = "w-16 h-16" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} animate-[pulse_4s_ease-in-out_infinite]`}>
        {/* Esclerótica (O formato do Olho, feito girando um quadrado com cantos arredondados opostos) */}
        <div className="w-full h-full bg-[#020204] border-[3px] border-blue-500/80 shadow-[0_0_30px_rgba(59,130,246,0.5),inset_0_0_30px_rgba(59,130,246,0.4)] rounded-[80%_0] rotate-45 overflow-hidden flex items-center justify-center">
            
            {/* Íris Radiante (Fica reta compensando a rotação pai) */}
            <div className="w-[60%] h-[60%] bg-[radial-gradient(circle,_#fff_5%,_#3b82f6_50%,_#020204_100%)] rounded-full -rotate-45 flex items-center justify-center shadow-[0_0_20px_#3b82f6]">
                
                {/* Pupila Fendida (Dragão/Gato) */}
                <div className="w-[20%] h-[80%] bg-black rounded-[50%] shadow-[inset_0_0_8px_rgba(0,0,0,1)] flex items-center justify-center">
                    {/* Brilho do olho (Reflexo da luz) */}
                    <div className="w-[30%] h-[30%] bg-white/60 rounded-full blur-[1px] -translate-y-2"></div>
                </div>

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
        <div className="min-h-screen bg-black text-blue-500 p-10 flex flex-col items-center justify-center font-sans border border-blue-900/30">
          <ShieldAlert className="w-16 h-16 mb-4 animate-pulse text-blue-600"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center">Fenda no Sistema</h1>
          <p className="mt-2 text-blue-400/80 text-sm max-w-lg text-center break-words font-medium">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-blue-950 border border-blue-700 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">Restaurar Conexão</button>
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
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 backdrop-blur-3xl shadow-2xl ${isError ? 'bg-red-950/90 text-red-200 border-red-600/50' : isSuccess ? 'bg-blue-950/90 text-blue-400 border-blue-500/50' : 'bg-black/95 text-blue-400 border-blue-900/50'}`}>
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-black border-t border-white/5 py-12 mt-auto pb-24 md:pb-12 relative overflow-hidden flex flex-col items-center justify-center">
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

/* ABERTURA: O OLHO EMERGENDO DO ABISMO (SURREAL E ELEGANTE) */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);   // Fenda azul brilha
    const t2 = setTimeout(() => setPhase(2), 1200);  // Olho se abre
    const t3 = setTimeout(() => setPhase(3), 2200);  // Texto e logo revelados

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black flex items-center justify-center">
      
      {/* FASE 1: A Fenda Fechada (Uma linha de luz azul que surge e some) */}
      <div 
        className={`absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_40px_10px_#3b82f6] rounded-full transition-all duration-700 ease-out 
        ${phase === 1 ? 'w-[100px] md:w-[150px] h-[3px] opacity-100' : 'w-0 h-[3px] opacity-0'}`}
      />

      {/* FASE 2 & 3: O Olho se abre e revela a tela */}
      <div className={`relative z-10 flex flex-col items-center justify-center w-full transition-all duration-[1500ms] ease-out 
          ${phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      >
          
          {/* Container do Olho com a animação das pálpebras abrindo */}
          <div className="relative w-32 h-32 md:w-44 md:h-44 mb-8 flex items-center justify-center">
              
              {/* O Olho (Renderizado sempre, mas oculto pelas pálpebras no início) */}
              <AbyssalLogo className="w-full h-full drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]" />

              {/* Pálpebra Superior (Desliza pra cima) */}
              <div 
                className={`absolute top-0 left-0 w-full h-1/2 bg-black origin-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.7,0,0.2,1)] 
                ${phase >= 2 ? 'scale-y-0' : 'scale-y-100'}`} 
              />
              {/* Pálpebra Inferior (Desliza pra baixo) */}
              <div 
                className={`absolute bottom-0 left-0 w-full h-1/2 bg-black origin-bottom transition-transform duration-[1200ms] ease-[cubic-bezier(0.7,0,0.2,1)] 
                ${phase >= 2 ? 'scale-y-0' : 'scale-y-100'}`} 
              />
          </div>

          {/* FASE 3: Revelação do Texto Elegante */}
          <div className={`transition-all duration-1000 ease-out flex flex-col items-center w-full px-4 
              ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-800 tracking-[0.3em] md:tracking-[0.5em] whitespace-nowrap pl-[0.3em] drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                MANGÁS ABISSAL
              </h1>
              
              <div className="mt-6 md:mt-8 flex items-center justify-center gap-3 md:gap-5 w-full">
                  <div className="flex-1 max-w-[50px] md:max-w-[80px] h-[1px] bg-gradient-to-r from-transparent to-blue-500"></div>
                  
                  <p className="tracking-[0.5em] md:tracking-[1.2em] uppercase text-[9px] md:text-xs font-black text-blue-400 whitespace-nowrap animate-pulse">
                    O Olho do Vazio
                  </p>
                  
                  <div className="flex-1 max-w-[50px] md:max-w-[80px] h-[1px] bg-gradient-to-l from-transparent to-blue-500"></div>
              </div>
          </div>

      </div>

    </div>
  );
});

/* TRANSIÇÃO DE CAPÍTULO: SALTO DIMENSIONAL LÍMPIDO E ELEGANTE */
export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden">
            <style>{`
                @keyframes ripple-pulse {
                    0% { transform: scale(0.5); opacity: 0; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.8); }
                    50% { opacity: 1; }
                    100% { transform: scale(3); opacity: 0; box-shadow: 0 0 0 80px rgba(59, 130, 246, 0); }
                }
            `}</style>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-60">
                <div className="w-32 h-32 rounded-full animate-[ripple-pulse_1.5s_cubic-bezier(0.16,1,0.3,1)_infinite]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="text-blue-500/80 font-black tracking-[1.5em] text-[10px] uppercase mb-6 animate-pulse ml-[1.5em]">Transcendendo</div>
                <h2 className="text-[120px] md:text-[180px] leading-none font-black text-white drop-shadow-[0_0_40px_rgba(59,130,246,0.6)] animate-in zoom-in-75 duration-700">
                    {chapterNumber}
                </h2>
            </div>
        </div>
    );
});
