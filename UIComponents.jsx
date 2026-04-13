import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Zap, Lock, Hexagon, User, Key } from 'lucide-react';

/* ==========================================================================
   ÍCONE RANK S: A SINGULARIDADE DO ABISMO (Buraco Negro Cósmico)
   ========================================================================== */
export const AbyssalLogo = React.memo(({ className = "w-20 h-20" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      
      {/* 1. Aura de Distorção (Glow de Fundo) */}
      <div className="absolute inset-[-20%] bg-gradient-to-tr from-blue-900/40 via-cyan-600/20 to-purple-900/40 rounded-full blur-[20px] animate-[pulse_4s_ease-in-out_infinite]"></div>

      {/* 2. Anéis de Acreção (Discos de energia girando) */}
      <div className="absolute w-full h-full rounded-full border border-transparent border-t-cyan-400 border-b-blue-700 opacity-70 animate-[spin_3s_linear_infinite]"></div>
      <div className="absolute w-[85%] h-[85%] rounded-full border border-transparent border-r-fuchsia-500 border-l-purple-800 opacity-60 animate-[spin_4s_linear_infinite_reverse]"></div>
      <div className="absolute w-[70%] h-[70%] rounded-full border-[0.5px] border-dashed border-cyan-300/40 animate-[spin_10s_linear_infinite]"></div>

      {/* 3. O Vazio Absoluto (O Buraco Negro no centro) */}
      <div className="w-[65%] h-[65%] bg-[#010103] rounded-full shadow-[0_0_30px_rgba(0,0,0,1),inset_0_0_20px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center relative overflow-hidden">
        
        {/* Reflexo de evento no horizonte do buraco negro */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(34,211,238,0.3)]"></div>
        
        {/* A Faísca da Singularidade no fundo do vazio */}
        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_3px_rgba(255,255,255,0.8)] animate-ping opacity-80"></div>
      </div>
    </div>
  );
});

/* ==========================================================================
   ABERTURA: O NASCIMENTO DA SINGULARIDADE (CINEMÁTICA)
   ========================================================================== */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const p1 = setTimeout(() => setPhase(1), 500);   // Faísca no escuro
    const p2 = setTimeout(() => setPhase(2), 1500);  // Colapso e expansão da Singularidade
    const p3 = setTimeout(() => setPhase(3), 3000);  // Onda de choque e título
    const p4 = setTimeout(() => setPhase(4), 4500);  // Formulário revelado

    return () => { clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); clearTimeout(p4); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#000000] flex items-center justify-center font-sans perspective-[1000px]">
      
      <style>{`
        @keyframes shockwave {
          0% { transform: scale(0); opacity: 1; border-width: 10px; }
          100% { transform: scale(15); opacity: 0; border-width: 0px; }
        }
        @keyframes float-up {
          0% { transform: translateY(30px) scale(0.9); opacity: 0; filter: blur(10px); }
          100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
        }
      `}</style>

      {/* AMBIENTE: Fundo absoluto que clareia suavemente */}
      <div className={`absolute inset-0 transition-opacity duration-[3000ms] ease-out pointer-events-none
        ${phase >= 2 ? 'bg-[radial-gradient(circle_at_center,_#0b1836_0%,_#000000_70%)] opacity-100' : 'opacity-0'}`}></div>

      {/* FASE 1: A Faísca Solitária */}
      <div className={`absolute z-20 w-1 h-1 bg-white rounded-full shadow-[0_0_30px_10px_#fff] transition-all duration-[1000ms] ease-in
        ${phase === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>

      {/* FASE 3: Onda de Choque da Expansão */}
      {phase === 3 && (
        <div className="absolute z-10 w-32 h-32 rounded-full border-cyan-400/50 animate-[shockwave_1.5s_cubic-bezier(0.1,0.8,0.3,1)_forwards]"></div>
      )}

      {/* CONTAINER PRINCIPAL */}
      <div className={`relative z-30 flex flex-col items-center w-full max-w-md px-6 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
        ${phase >= 4 ? '-translate-y-6' : 'translate-y-0'}`}>
        
        {/* FASE 2: A Singularidade Surge */}
        <div className={`relative flex items-center justify-center transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          ${phase >= 4 ? 'w-24 h-24 md:w-28 md:h-28 mb-8' : 'w-40 h-40 md:w-48 md:h-48 mb-0'}`}>
          <AbyssalLogo className="w-full h-full" />
        </div>

        {/* FASE 3: O Título Desperta da Escuridão */}
        <div className={`w-full flex flex-col items-center transition-all duration-[1500ms] ease-out
          ${phase >= 3 ? 'opacity-100' : 'opacity-0'}
          ${phase < 3 ? 'hidden' : 'block'}`}
          style={{ animation: phase === 3 ? 'float-up 1.5s cubic-bezier(0.16,1,0.3,1) forwards' : 'none' }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-50 to-cyan-800 tracking-[0.4em] whitespace-nowrap pl-[0.4em] drop-shadow-[0_0_25px_rgba(34,211,238,0.4)] mb-3">
            MANGÁS ABISSAL
          </h1>
          <p className="text-[9px] md:text-[10px] text-cyan-400 uppercase tracking-[1.2em] font-black animate-pulse mb-10 pl-[1.2em]">
            A Singularidade
          </p>

          {/* FASE 4: O Acesso ao Sistema */}
          <div className={`w-full bg-[#030407]/80 backdrop-blur-xl border border-cyan-900/30 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(34,211,238,0.05)] transition-all duration-[1500ms] ease-out
            ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600/50 group-focus-within:text-cyan-400 transition-colors" />
                <input type="text" placeholder="Entidade" className="w-full bg-[#010103] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500/80 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all" />
              </div>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600/50 group-focus-within:text-cyan-400 transition-colors" />
                <input type="password" placeholder="Chave Cósmica" className="w-full bg-[#010103] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500/80 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all" />
              </div>
              <button className="w-full relative overflow-hidden bg-cyan-800 text-white font-black text-[10px] md:text-xs uppercase tracking-widest py-4 rounded-xl mt-4 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Cruzar o Horizonte</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

/* ==========================================================================
   RESTANTE DOS COMPONENTES (ERROS, TOASTS E TRANSIÇÃO)
   ========================================================================== */

export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050508] text-red-500 p-10 flex flex-col items-center justify-center font-sans border border-red-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#020204] opacity-90"></div>
          <ShieldAlert className="w-16 h-16 mb-4 animate-pulse text-red-600 relative z-10"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center relative z-10">Fenda no Sistema</h1>
          <p className="mt-2 text-red-400/80 text-sm max-w-lg text-center break-words font-medium relative z-10">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-zinc-900 border border-zinc-700 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all relative z-10">Restaurar Conexão</button>
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
  const isInfo = toast.type === 'info';

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 backdrop-blur-3xl shadow-2xl ${isError ? 'bg-red-950/90 text-red-200 border-red-600/50' : isSuccess ? 'bg-cyan-950/90 text-cyan-400 border-cyan-500/50' : isInfo ? 'bg-blue-950/90 text-blue-300 border-blue-600/50' : 'bg-zinc-950/95 text-zinc-400 border-zinc-800'}`}>
      {isError && <AlertCircle className="w-5 h-5 text-red-500" />}
      {isSuccess && <CheckCircle className="w-5 h-5 text-cyan-500" />}
      {isInfo && <Hexagon className="w-5 h-5 text-blue-400" />}
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#030407] border-t border-white/5 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-3 mb-5 group cursor-pointer">
                    <AbyssalLogo className="w-8 h-8 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-50 group-hover:opacity-100" />
                    <span className="font-black text-xl text-zinc-500 group-hover:text-cyan-400 transition-colors tracking-[0.2em] uppercase">MANGÁS ABISSAL</span>
                </div>
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.3em]">O Vazio Resguarda - © 2026</p>
            </div>
        </footer>
    );
}

export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-[#010103] flex items-center justify-center overflow-hidden font-sans">
            <style>{`
                @keyframes warp-speed { 0% { transform: scale(1); opacity: 0; filter: blur(10px); } 50% { opacity: 1; filter: blur(0px); } 100% { transform: scale(10); opacity: 0; filter: blur(20px); } }
                @keyframes glow-text { 0%, 100% { text-shadow: 0 0 20px rgba(34,211,238,0.5); } 50% { text-shadow: 0 0 40px rgba(34,211,238,0.8); } }
            `}</style>
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-[1px] h-[1px] rounded-full shadow-[0_0_80px_60px_#22d3ee,0_0_150px_100px_#0284c7] animate-[warp-speed_0.8s_ease-in_forwards]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-cyan-500/80 font-black tracking-[1.5em] text-[10px] uppercase mb-6 animate-pulse ml-[1.5em]">Transcendendo</div>
                <h2 className="text-[120px] md:text-[200px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-700 tracking-tight" style={{ animation: 'glow-text 2s ease-in-out infinite' }}>{chapterNumber}</h2>
            </div>
        </div>
    );
});
