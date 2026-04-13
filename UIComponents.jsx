import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Zap, Lock, Hexagon, User, Key } from 'lucide-react';

/* ==========================================================================
   ÍCONE RANK S: O OLHO DEMONÍACO MAIOR E COM PISCAR ORGÂNICO
   ========================================================================== */
export const AbyssalLogo = React.memo(({ className = "w-32 h-32", isAwake = true }) => {
  return (
    <div className={`relative flex items-center justify-center group ${className} animate-[float_6s_ease-in-out_infinite]`}>
      
      {/* 1. Aura Sombria Vibrante (Glow de Fundo) */}
      <div className={`absolute inset-[-15%] bg-gradient-to-tr from-red-900/80 via-rose-900/40 to-black rounded-full blur-[35px] transition-all duration-1000 ease-out
        ${isAwake ? 'opacity-100 scale-125 animate-[pulse-heavy_3s_ease-in-out_infinite]' : 'opacity-0 scale-50'}`}></div>

      {/* 2. Imagem Original Intacta */}
      <img 
        src="https://i.ibb.co/GvvpKNPD/design-vetorial-de-ilustracao-de-olhos-de-diabo-vermelho-692212-66-removebg-preview.png"
        className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"
        alt="Olho do Abismo"
      />

      {/* 3. LÓGICA DO PISCAR APRIMORADA E ANATÔMICA 
          A máscara foi milimetricamente ajustada para o centro da íris. */}
      {isAwake && (
        <div 
          className="absolute z-20 overflow-hidden rounded-[50%]"
          style={{
            width: '42%',     
            height: '28%',    
            top: '36%',       
            left: '29%',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)' // Sombra interna para dar profundidade ao globo ocular
          }}
        >
          {/* Pálpebra Superior - Movimento afiado e curvatura realista */}
          <div className="absolute top-0 left-[-10%] w-[120%] h-[60%] bg-[#050000] rounded-b-[50%] shadow-[0_8px_15px_rgba(0,0,0,1)] animate-[blink-top_5s_infinite_cubic-bezier(0.7,0,0.3,1)] border-b border-red-900/30"></div>

          {/* Pálpebra Inferior - Movimento afiado e curvatura realista */}
          <div className="absolute bottom-0 left-[-10%] w-[120%] h-[60%] bg-[#050000] rounded-t-[50%] shadow-[0_-8px_15px_rgba(0,0,0,1)] animate-[blink-bottom_5s_infinite_cubic-bezier(0.7,0,0.3,1)] border-t border-red-900/30"></div>
        </div>
      )}

      {/* Keyframes do Piscar e Flutuação */}
      <style>{`
        @keyframes blink-top {
          0%, 90%, 100% { transform: translateY(-110%); }
          94%, 96% { transform: translateY(10%); } /* Passa um pouco do centro para fechar bem */
        }
        @keyframes blink-bottom {
          0%, 90%, 100% { transform: translateY(110%); }
          94%, 96% { transform: translateY(-10%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-heavy {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
});

/* ==========================================================================
   ABERTURA CINEMATOGRÁFICA: O DESPERTAR DE SANGUE
   ========================================================================== */
export const SplashScreen = React.memo(() => {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Fase 1 (0ms): Breu absoluto
    const t2 = setTimeout(() => setPhase(2), 1000);  // Olho materializa grande e borrado
    const t3 = setTimeout(() => setPhase(3), 2500);  // Olho foca e pisca, onda de choque
    const t4 = setTimeout(() => setPhase(4), 4000);  // Título surge majestoso
    const t5 = setTimeout(() => setPhase(5), 5500);  // Formulário revelado e olho diminui para a posição final

    return () => { clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] overflow-hidden bg-[#000000] flex items-center justify-center font-sans
      ${phase === 3 ? "animate-[shake-heavy_0.5s_ease-in-out]" : ""}`}>
      
      <style>{`
        @keyframes shake-heavy {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-5px, 5px); }
          40% { transform: translate(5px, -4px); }
          60% { transform: translate(-4px, -5px); }
          80% { transform: translate(4px, 4px); }
        }
        @keyframes shockwave-red {
          0% { transform: scale(0); opacity: 1; border-width: 20px; }
          100% { transform: scale(20); opacity: 0; border-width: 0px; }
        }
        @keyframes rise-up {
          0% { transform: translateY(40px); opacity: 0; filter: blur(10px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
      `}</style>

      {/* AMBIENTE: Vazio absoluto clareando com o despertar */}
      <div className={`absolute inset-0 transition-opacity duration-[3000ms] ease-out pointer-events-none
        ${phase >= 2 ? 'bg-[radial-gradient(circle_at_center,_#2a0a0f_0%,_#000000_80%)] opacity-100' : 'opacity-0'}`}></div>

      {/* FASE 3: Onda de Choque de Sangue */}
      {phase === 3 && (
        <div className="absolute z-10 w-40 h-40 rounded-full border-red-500/50 animate-[shockwave-red_1.5s_cubic-bezier(0.1,0.8,0.3,1)_forwards] mix-blend-screen"></div>
      )}

      {/* CONTAINER PRINCIPAL */}
      <div className={`relative z-20 flex flex-col items-center justify-center w-full px-4 transition-all duration-[2000ms] ease-[cubic-bezier(0.25,1,0.5,1)]
        ${phase >= 5 ? '-translate-y-6' : 'translate-y-0'}`}>
        
        {/* FASE 2 & 3 & 5: Dinâmica do Olho */}
        <div className={`relative flex items-center justify-center transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${phase === 1 ? 'opacity-0 scale-150 blur-3xl' : ''}
          ${phase >= 2 && phase < 5 ? 'opacity-100 scale-125 blur-none mb-10' : ''}
          ${phase >= 5 ? 'opacity-100 scale-100 blur-none mb-8' : ''}`}>
          
          <AbyssalLogo 
            className={`${phase >= 5 ? 'w-40 h-40 md:w-56 md:h-56' : 'w-48 h-48 md:w-72 md:h-72'} transition-all duration-[2000ms]`} 
            isAwake={phase >= 3} 
          />
        </div>

        {/* FASE 4 & 5: Revelação do Texto e do Form */}
        <div className={`w-full flex flex-col items-center transition-all duration-[1500ms] ease-out
          ${phase >= 4 ? 'opacity-100' : 'opacity-0 hidden'}`}
          style={{ animation: phase === 4 ? 'rise-up 1.5s cubic-bezier(0.16,1,0.3,1) forwards' : 'none' }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-red-200 to-red-800 tracking-[0.4em] md:tracking-[0.6em] whitespace-nowrap pl-[0.4em] drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] mb-3 text-center">
            MANGÁS ABISSAL
          </h1>
          <p className="text-[10px] md:text-xs text-red-500 uppercase tracking-[1em] font-black animate-pulse mb-10 pl-[1em] text-center">
            O Sangue Desperta
          </p>

          <div className={`w-full max-w-sm bg-[#050102]/80 backdrop-blur-3xl border border-red-900/40 p-7 md:p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(220,38,38,0.1)] transition-all duration-[1500ms] ease-out
            ${phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600/50 group-focus-within:text-red-400 transition-colors" />
                <input type="text" placeholder="Entidade" className="w-full bg-[#030000] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-red-600/80 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all" />
              </div>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600/50 group-focus-within:text-red-400 transition-colors" />
                <input type="password" placeholder="Chave de Sangue" className="w-full bg-[#030000] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-red-600/80 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all" />
              </div>
              <button className="w-full relative overflow-hidden bg-gradient-to-r from-red-900 to-rose-900 text-white font-black text-[10px] md:text-xs uppercase tracking-widest py-4 rounded-xl mt-4 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
   RESTANTE DOS COMPONENTES (ADAPTADOS PARA O TEMA VERMELHO)
   ========================================================================== */
export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050001] text-red-500 p-10 flex flex-col items-center justify-center font-sans border border-red-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-950/10 blur-[150px] rounded-full pointer-events-none"></div>
          <ShieldAlert className="w-16 h-16 mb-4 animate-[pulse-heavy_3s_ease-in-out_infinite] text-red-600 relative z-10"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center relative z-10">Fenda no Sistema</h1>
          <p className="mt-2 text-red-400/80 text-sm max-w-lg text-center break-words font-medium relative z-10">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-black border border-red-900 hover:border-red-500 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all relative z-10">Restaurar Conexão</button>
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
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 backdrop-blur-3xl shadow-2xl ${isError ? 'bg-red-950/90 text-red-200 border-red-600/50' : isSuccess ? 'bg-red-950/90 text-red-400 border-red-500/50' : isInfo ? 'bg-rose-950/90 text-rose-300 border-rose-600/50' : 'bg-black/95 text-zinc-400 border-zinc-800'}`}>
      {isError && <AlertCircle className="w-5 h-5 text-red-500" />}
      {isSuccess && <CheckCircle className="w-5 h-5 text-red-500" />}
      {isInfo && <Hexagon className="w-5 h-5 text-red-400" />}
      <span className='text-center'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#020000] border-t border-white/5 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-3 mb-5 group cursor-pointer">
                    <AbyssalLogo className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                    <span className="font-black text-xl text-zinc-500 group-hover:text-red-500 transition-colors tracking-[0.2em] uppercase">MANGÁS ABISSAL</span>
                </div>
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.3em]">O Vazio Resguarda - © 2026</p>
            </div>
        </footer>
    );
}

export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-[#020000] flex items-center justify-center overflow-hidden font-sans">
            <style>{`
                @keyframes warp-speed { 0% { transform: scale(1); opacity: 0; filter: blur(10px); } 50% { opacity: 1; filter: blur(0px); } 100% { transform: scale(10); opacity: 0; filter: blur(20px); } }
                @keyframes glow-text { 0%, 100% { text-shadow: 0 0 20px rgba(220,38,38,0.5); } 50% { text-shadow: 0 0 40px rgba(220,38,38,0.8); } }
            `}</style>
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-[1px] h-[1px] rounded-full shadow-[0_0_80px_60px_#ef4444,0_0_150px_100px_#9f1239] animate-[warp-speed_0.8s_ease-in_forwards]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-red-500/80 font-black tracking-[1.5em] text-[10px] uppercase mb-6 animate-[pulse-heavy_3s_ease-in-out_infinite] ml-[1.5em]">Transcendendo</div>
                <h2 className="text-[120px] md:text-[200px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-red-800 tracking-tight" style={{ animation: 'glow-text 2s ease-in-out infinite' }}>{chapterNumber}</h2>
            </div>
        </div>
    );
});
