import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Zap, Lock, Hexagon, User, Key } from 'lucide-react';

/* ==========================================================================
   NOVO ÍCONE ORIGINAL: O LOOP DO INFINITO (100% SVG ANIMADO E BLINDADO)
   ========================================================================== */
export const InfinityLogo = React.memo(({ className = "w-24 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Glow de Fundo (Aura de Energia) */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/40 to-fuchsia-600/40 blur-[20px] rounded-full animate-pulse"></div>
      
      {/* Símbolo do Infinito em SVG (À prova de quebras da Vercel) */}
      <svg viewBox="0 0 100 50" className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
        <defs>
          <linearGradient id="inf-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />   {/* Ciano */}
            <stop offset="50%" stopColor="#d946ef" />  {/* Magenta */}
            <stop offset="100%" stopColor="#22d3ee" /> {/* Ciano */}
          </linearGradient>
        </defs>
        
        {/* Linha base suave */}
        <path 
          d="M25 10 C5 10 5 40 25 40 C45 40 55 10 75 10 C95 10 95 40 75 40 C55 40 45 10 25 10 Z" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="3" 
        />
        
        {/* Linha de energia correndo pelo infinito */}
        <path 
          d="M25 10 C5 10 5 40 25 40 C45 40 55 10 75 10 C95 10 95 40 75 40 C55 40 45 10 25 10 Z" 
          fill="none" 
          stroke="url(#inf-gradient)" 
          strokeWidth="4" 
          strokeLinecap="round"
          strokeDasharray="150"
          className="animate-[energy-flow_3s_linear_infinite]"
        />
      </svg>

      {/* Núcleo Estelar (Ponto de encontro da energia) */}
      <div className="absolute z-20 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.9)] animate-ping opacity-80 mix-blend-screen"></div>

      <style>{`
        @keyframes energy-flow {
          0% { stroke-dashoffset: 300; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
});

/* ==========================================================================
   NOVA ABERTURA: A CRIAÇÃO DO INFINITO (Cinematográfica)
   ========================================================================== */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // A coreografia do Universo
    const t1 = setTimeout(() => setPhase(1), 500);   // As estrelas colidem
    const t2 = setTimeout(() => setPhase(2), 1500);  // O Símbolo nasce
    const t3 = setTimeout(() => setPhase(3), 3000);  // Título e Textos
    const t4 = setTimeout(() => setPhase(4), 4500);  // Formulário revelado

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#020105] flex items-center justify-center font-sans">
      
      {/* Fundo do Espaço Profundo (Sempre presente, clareando suavemente) */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#130a2a_0%,_#020105_80%)] transition-opacity duration-[3000ms] ease-in-out
        ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* FASE 1: Colisão Cósmica (Ciano e Magenta se encontram no centro) */}
      <div className={`absolute z-10 w-full h-full flex items-center justify-center transition-opacity duration-700
        ${phase === 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_40px_20px_#22d3ee] transition-all duration-700 ease-in
          ${phase >= 1 ? 'translate-x-0 scale-150' : '-translate-x-[50vw] scale-50'}`}></div>
        <div className={`absolute w-4 h-4 bg-fuchsia-400 rounded-full shadow-[0_0_40px_20px_#d946ef] transition-all duration-700 ease-in
          ${phase >= 1 ? 'translate-x-0 scale-150' : 'translate-x-[50vw] scale-50'}`}></div>
      </div>

      {/* Onda de Choque da Colisão */}
      {phase === 2 && (
        <div className="absolute z-10 w-20 h-20 rounded-full border-2 border-cyan-400/50 animate-[shockwave-cosmic_1.5s_cubic-bezier(0.1,0.8,0.3,1)_forwards]"></div>
      )}

      {/* CONTAINER PRINCIPAL: Logo, Título e Login */}
      <div className={`relative z-20 flex flex-col items-center justify-center w-full max-w-md px-4 transition-all duration-[2000ms] ease-[cubic-bezier(0.25,1,0.5,1)]
        ${phase >= 4 ? '-translate-y-6 md:-translate-y-10' : 'translate-y-0'}`}>
        
        {/* FASE 2: O Infinito se Forma */}
        <div className={`transition-all duration-[1500ms] ease-out
          ${phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          ${phase >= 4 ? 'mb-8 md:mb-10 w-40 h-20 md:w-56 md:h-28' : 'mb-0 w-64 h-32 md:w-80 md:h-40'}`}>
          <InfinityLogo className="w-full h-full" />
        </div>

        {/* FASE 3: Revelação do Título ORIGINAL */}
        <div className={`w-full flex flex-col items-center transition-all duration-[1500ms] ease-out
          ${phase >= 3 ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-10 blur-sm'}`}>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-600 tracking-[0.2em] md:tracking-[0.4em] whitespace-nowrap pl-[0.2em] drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-2 text-center">
            MANGA-INFINITY
          </h1>
          <p className="text-[10px] md:text-xs text-fuchsia-400 uppercase tracking-[1em] md:tracking-[1.2em] font-black animate-pulse mb-10 pl-[1em] text-center">
            Além dos Limites
          </p>

          {/* FASE 4: O Acesso à Plataforma */}
          <div className={`w-full max-w-sm bg-[#05030a]/80 backdrop-blur-3xl border border-cyan-900/30 p-6 md:p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(34,211,238,0.05)] transition-all duration-[1500ms] ease-out
            ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 absolute pointer-events-none'}`}>
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600/50 group-focus-within:text-cyan-400 transition-colors" />
                <input type="text" placeholder="Entidade" className="w-full bg-[#020105] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all" />
              </div>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fuchsia-600/50 group-focus-within:text-fuchsia-400 transition-colors" />
                <input type="password" placeholder="Chave de Acesso" className="w-full bg-[#020105] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-fuchsia-500/60 focus:shadow-[0_0_15px_rgba(217,70,239,0.15)] transition-all" />
              </div>
              <button className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-800 to-purple-800 text-white font-black text-[10px] md:text-xs uppercase tracking-widest py-3.5 rounded-xl mt-4 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Expandir o Infinito</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes shockwave-cosmic {
          0% { transform: scale(0); opacity: 1; border-width: 10px; }
          100% { transform: scale(30); opacity: 0; border-width: 0px; }
        }
      `}</style>
    </div>
  );
});

/* ==========================================================================
   RESTANTE DOS COMPONENTES (TUDO ADAPTADO PARA O NOME ORIGINAL)
   ========================================================================== */
export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020105] text-red-500 p-10 flex flex-col items-center justify-center font-sans border border-fuchsia-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-fuchsia-950/10 blur-[150px] rounded-full pointer-events-none"></div>
          <ShieldAlert className="w-16 h-16 mb-4 animate-pulse text-fuchsia-500 relative z-10"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center relative z-10">Fenda no Infinito</h1>
          <p className="mt-2 text-fuchsia-400/80 text-sm max-w-lg text-center break-words font-medium relative z-10">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-[#010003] border border-fuchsia-900 hover:border-fuchsia-500 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all relative z-10">Restaurar Conexão</button>
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
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 backdrop-blur-3xl shadow-2xl ${isError ? 'bg-red-950/90 text-red-200 border-red-600/50' : isSuccess ? 'bg-cyan-950/90 text-cyan-400 border-cyan-500/50' : isInfo ? 'bg-purple-950/90 text-purple-300 border-purple-600/50' : 'bg-[#020105]/95 text-zinc-400 border-zinc-800'}`}>
      {isError && <AlertCircle className="w-5 h-5 text-red-500" />}
      {isSuccess && <CheckCircle className="w-5 h-5 text-cyan-500" />}
      {isInfo && <Hexagon className="w-5 h-5 text-fuchsia-400" />}
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#010003] border-t border-white/5 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-4 mb-5 group cursor-pointer">
                    <InfinityLogo className="w-16 h-8 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                    <span className="font-black text-xl text-zinc-500 group-hover:text-cyan-400 transition-colors tracking-[0.2em] uppercase">MANGA-INFINITY</span>
                </div>
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.3em]">O Infinito Aguarda - © 2026</p>
            </div>
        </footer>
    );
}

export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-[#020105] flex items-center justify-center overflow-hidden font-sans">
            <style>{`
                @keyframes warp-speed { 0% { transform: scale(1); opacity: 0; filter: blur(10px); } 50% { opacity: 1; filter: blur(0px); } 100% { transform: scale(10); opacity: 0; filter: blur(20px); } }
                @keyframes glow-text { 0%, 100% { text-shadow: 0 0 20px rgba(34,211,238,0.5); } 50% { text-shadow: 0 0 40px rgba(217,70,239,0.8); } }
            `}</style>
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-[1px] h-[1px] rounded-full shadow-[0_0_80px_60px_#22d3ee,0_0_150px_100px_#c026d3] animate-[warp-speed_0.8s_ease-in_forwards]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-cyan-500/80 font-black tracking-[1.5em] text-[10px] uppercase mb-6 ml-[1.5em] animate-pulse">Expandindo Limites</div>
                <h2 className="text-[120px] md:text-[200px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-800 tracking-tight" style={{ animation: 'glow-text 2s ease-in-out infinite' }}>{chapterNumber}</h2>
            </div>
        </div>
    );
});
