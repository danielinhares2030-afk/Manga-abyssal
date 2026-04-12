import React, { useState, useEffect, useMemo } from 'react';
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

/* ABERTURA: FENDA DO ABISMO (Versão Ultra - Sem Blocos Feios) */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Timings mais agressivos para impacto
    const t1 = setTimeout(() => setPhase(1), 100);   // Tremor da energia instável
    const t2 = setTimeout(() => setPhase(2), 800);   // Rompimento brutal
    const t3 = setTimeout(() => setPhase(3), 2000);  // Foco total no logo

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const debris = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => {
        // Formatos irregulares para não parecer caixas
        const isEnergy = Math.random() > 0.7;
        return {
          id: i,
          size: Math.random() * 20 + 4,
          left: 30 + Math.random() * 40, // Focadas mais no centro da ruptura
          delay: Math.random() * 0.8,    // Caem quase todas juntas num desmoronamento
          duration: Math.random() * 1.5 + 1.2,
          rotate: Math.random() * 720,
          drift: (Math.random() - 0.5) * 400,
          isEnergy, // Algumas são pedras, outras são pura energia caindo
          borderRadius: `${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}%`,
        };
      }),
    []
  );

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-black flex items-center justify-center perspective-[1000px]
      ${phase === 1 ? "animate-[shake-violent_0.08s_ease-in-out_infinite]" : ""}`}
    >
      <style>{`
        @keyframes shake-violent {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          25% { transform: translate(-4px,3px) rotate(-1deg); filter: blur(1px); }
          50% { transform: translate(4px,-3px) rotate(1deg); filter: blur(0px); }
          75% { transform: translate(-3px,2px) rotate(-0.5deg); filter: blur(1px); }
        }

        @keyframes plasma-surge {
          0% { transform: scaleY(0) scaleX(0.5); opacity: 0; }
          50% { transform: scaleY(1.2) scaleX(1); opacity: 1; filter: brightness(2); }
          100% { transform: scaleY(1) scaleX(0); opacity: 0; }
        }

        @keyframes shatter-fall {
          0% {
            transform: translateY(-20vh) translateX(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) translateX(var(--drift)) rotate(var(--rot)) scale(0.2);
            opacity: 0;
          }
        }

        /* Recortes otimizados e mais caóticos */
        .void-wall-left {
          clip-path: polygon(0 0, 100% 0, 92% 8%, 98% 18%, 88% 28%, 96% 40%, 85% 55%, 95% 70%, 88% 85%, 100% 100%, 0 100%);
        }
        .void-wall-right {
          clip-path: polygon(100% 0, 0 0, 8% 8%, 2% 18%, 12% 28%, 4% 40%, 15% 55%, 5% 70%, 12% 85%, 0 100%, 100% 100%);
        }
      `}</style>

      {/* O VAZIO VERDADEIRO (Fundo Revelado) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#08152b] via-[#03050a] to-black">
        {/* Nebulosa de Fundo */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[120vw] h-[120vw] rounded-full bg-cyan-600/10 blur-[120px] mix-blend-screen
          transition-all duration-[2000ms] ease-out
          ${phase >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[80vw] h-[80vw] rounded-full bg-fuchsia-700/10 blur-[150px] mix-blend-screen
          transition-all duration-[2000ms] ease-out delay-150
          ${phase >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        />
      </div>

      {/* FRAGMENTOS ESTILHAÇADOS (Caindo) */}
      {phase >= 2 &&
        debris.map((frag) => (
          <div
            key={frag.id}
            className={`absolute top-0 z-20 shadow-2xl backdrop-blur-sm
              ${frag.isEnergy 
                ? 'bg-cyan-400 shadow-[0_0_20px_5px_rgba(34,211,238,0.8)] border border-white' 
                : 'bg-[#0a0c10] border border-cyan-900/40 shadow-[inset_0_0_10px_rgba(0,0,0,1)]'
              }
            `}
            style={{
              width: `${frag.size}px`,
              height: `${frag.size}px`,
              left: `${frag.left}%`,
              borderRadius: frag.borderRadius,
              animation: `shatter-fall ${frag.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${frag.delay}s forwards`,
              "--drift": `${frag.drift}px`,
              "--rot": `${frag.rotate}deg`,
            }}
          />
        ))}

      {/* RAIO DE PLASMA CENTRAL QUE CORTA A TELA */}
      <div
        className={`absolute left-1/2 top-0 bottom-0 z-30
        w-[6px] -translate-x-1/2 bg-white
        shadow-[0_0_80px_25px_rgba(34,211,238,1),0_0_150px_50px_rgba(217,70,239,0.8)]
        mix-blend-screen origin-center
        ${phase === 1 ? "animate-[plasma-surge_0.8s_ease-out_forwards]" : "opacity-0"}`}
      />

      {/* PAREDES DIMENSIONAIS QUE SE ABREM COM PROFUNDIDADE 3D */}
      
      {/* Parede Esquerda */}
      <div
        className={`absolute inset-y-0 left-0 z-40 w-[55%] bg-[#020203] void-wall-left
        transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-left shadow-[20px_0_100px_rgba(0,0,0,1)]
        ${phase >= 2 ? "transform -translate-x-[120%] scale-110" : "transform translate-x-0 scale-100"}`}
      >
        {/* Calor da borda rasgada */}
        <div className={`absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-cyan-400/50 via-cyan-600/10 to-transparent mix-blend-screen transition-opacity duration-300 ${phase === 1 ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* Parede Direita */}
      <div
        className={`absolute inset-y-0 right-0 z-40 w-[55%] bg-[#020203] void-wall-right
        transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-right shadow-[-20px_0_100px_rgba(0,0,0,1)]
        ${phase >= 2 ? "transform translate-x-[120%] scale-110" : "transform translate-x-0 scale-100"}`}
      >
        {/* Calor da borda rasgada */}
        <div className={`absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-cyan-400/50 via-cyan-600/10 to-transparent mix-blend-screen transition-opacity duration-300 ${phase === 1 ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* LOGOTIPO E TEXTO (Surge do abismo) */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none
        transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]
        ${phase >= 3 ? "opacity-100 transform translate-y-0 scale-100 filter-none" : "opacity-0 transform translate-y-10 scale-75 blur-sm"}`}
      >
        <AbyssalLogo className="w-40 h-40 mb-6 drop-shadow-[0_0_60px_rgba(34,211,238,0.7)] animate-[pulse_3s_ease-in-out_infinite]" />
        
        <h1 className="text-5xl md:text-7xl font-black tracking-[0.4em] md:tracking-[0.6em] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] pl-[0.4em]">
          ABISSAL
        </h1>
        
        <div className="mt-8 flex items-center gap-4 text-cyan-400/80">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/50"></div>
            <p className="tracking-[1em] uppercase text-[10px] md:text-xs font-black animate-pulse">
              O Vazio Desperta
            </p>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/50"></div>
        </div>
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
