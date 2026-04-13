import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Zap, Lock, Hexagon, User, Key } from 'lucide-react';

/* ==========================================================================
   ÍCONE: LOOP INFINITO (Otimizado - Renderizado via GPU)
   ========================================================================== */
export const InfinityLogo = React.memo(({ className = "w-24 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 50" className="relative z-10 w-full h-full">
        <defs>
          <linearGradient id="inf-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <path d="M25 10 C5 10 5 40 25 40 C45 40 55 10 75 10 C95 10 95 40 75 40 C55 40 45 10 25 10 Z" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <path d="M25 10 C5 10 5 40 25 40 C45 40 55 10 75 10 C95 10 95 40 75 40 C55 40 45 10 25 10 Z" fill="none" stroke="url(#inf-grad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="100" className="animate-[spin-inf_2.5s_linear_infinite]" />
      </svg>
      <style>{`@keyframes spin-inf { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
});

/* ==========================================================================
   ABERTURA: EVENT HORIZON (Surreal e Ultra-Leve)
   ========================================================================== */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);   // Surge o Buraco Negro
    const t2 = setTimeout(() => setPhase(2), 1800);  // Buraco Negro contrai e explode
    const t3 = setTimeout(() => setPhase(3), 3000);  // Título e Formulário
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#010003] flex items-center justify-center font-sans overflow-hidden">
      
      {/* Efeito Surreal: O Buraco Negro / Eclipse */}
      <div className={`absolute flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)]
        ${phase === 0 ? 'scale-0 opacity-0' : phase === 1 ? 'scale-100 opacity-100' : 'scale-[20] opacity-0'}`}>
        <div className="w-32 h-32 rounded-full bg-black shadow-[0_0_50px_10px_#22d3ee,inset_0_0_20px_#d946ef] border border-cyan-500/20"></div>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className={`relative z-20 flex flex-col items-center justify-center w-full max-w-md px-4 transition-transform duration-[1500ms] ease-out ${phase >= 3 ? '-translate-y-4' : 'translate-y-0'}`}>
        
        {/* Logo */}
        <div className={`transition-all duration-[1500ms] ease-out
          ${phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          ${phase >= 3 ? 'mb-8 w-40 h-20 md:w-56 md:h-28' : 'mb-0 w-56 h-28 md:w-80 md:h-40'}`}>
          <InfinityLogo className="w-full h-full" />
        </div>

        {/* Título e Login */}
        <div className={`w-full flex flex-col items-center transition-all duration-[1000ms] ease-out ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-[0.3em] whitespace-nowrap">
            MANGA-INFINITY
          </h1>
          <p className="text-[10px] md:text-xs text-cyan-400/80 uppercase tracking-[1em] font-black mt-2 mb-10 pl-[1em]">A Essência do Vazio</p>

          {/* O Login agora não tem blur. É uma interface dark sólida e elegante */}
          <div className="w-full bg-[#05030a] border border-cyan-900/30 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600/60" />
                <input type="text" placeholder="Entidade" className="w-full bg-[#020105] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fuchsia-600/60" />
                <input type="password" placeholder="Código de Acesso" className="w-full bg-[#020105] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-fuchsia-500 transition-colors" />
              </div>
              <button className="w-full bg-cyan-900 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl mt-4 hover:bg-cyan-800 transition-colors">
                 Sincronizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ==========================================================================
   ERRO, TOAST E FOOTER (Leves e Funcionais)
   ========================================================================== */
export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#010003] text-cyan-400 p-10 flex flex-col items-center justify-center font-sans border-t-[4px] border-fuchsia-600">
          <ShieldAlert className="w-16 h-16 mb-4 animate-pulse text-fuchsia-500"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center">Colapso Estrutural</h1>
          <p className="mt-2 text-cyan-400/80 text-sm text-center max-w-lg">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-[#0a0515] border border-fuchsia-900 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:border-cyan-500 transition-colors">Restaurar Conexão</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GlobalToast({ toast }) {
  if (!toast) return null;
  const colors = toast.type === 'error' ? 'bg-red-950 text-red-200 border-red-800' : 
                 toast.type === 'success' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 
                 'bg-[#05030a] text-fuchsia-300 border-fuchsia-800';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border shadow-xl animate-in slide-in-from-top-5 ${colors}`}>
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#010003] border-t border-white/5 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center relative">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-4 mb-5">
                    <InfinityLogo className="w-12 h-6 opacity-50" />
                    <span className="font-black text-xl text-zinc-500 tracking-[0.2em] uppercase">MANGA-INFINITY</span>
                </div>
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.3em]">O Infinito é o Limite - © 2026</p>
            </div>
        </footer>
    );
}

/* ==========================================================================
   TRANSIÇÃO DE CAPÍTULO: "LUZ CÓSMICA" (Surreal, Instantânea e Sem Lag)
   ========================================================================== */
export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] overflow-hidden bg-black font-sans pointer-events-none flex items-center justify-center">
            <style>{`
                @keyframes cosmic-flash { 0% { opacity: 1; transform: scale(0.8); } 20%, 80% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.2); } }
            `}</style>
            
            {/* O Fundo é uma explosão de luz estática animada apenas via opacity/scale (GPU) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22d3ee_0%,_#000000_60%)] animate-[cosmic-flash_1s_ease-in-out_forwards] mix-blend-screen opacity-0"></div>

            {/* Texto que aparece cravado na tela */}
            <div className="relative z-10 flex flex-col items-center animate-[cosmic-flash_1.2s_ease-out_forwards] opacity-0">
                <div className="text-cyan-300 font-black tracking-[1.5em] text-xs uppercase mb-4 ml-[1.5em]">Transcendendo</div>
                <h2 className="text-6xl sm:text-[100px] md:text-[150px] leading-none font-black text-white">
                  {chapterNumber}
                </h2>
            </div>
        </div>
    );
});
