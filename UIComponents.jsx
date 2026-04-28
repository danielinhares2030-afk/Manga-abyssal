import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

// NOVO LOGO MANGAKAGE (Ninja 2D: Fofinho, Ousado e Digno)
export const KageLogo = React.memo(({ className = "w-32 h-32" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes floatNinja {
          0%, 100% { transform: translateY(0px); filter: drop-shadow(0 0 10px rgba(220,38,38,0.4)); }
          50% { transform: translateY(-6px); filter: drop-shadow(0 0 20px rgba(220,38,38,0.8)); }
        }
        @keyframes blinkNinja {
          0%, 96%, 98%, 100% { transform: scaleY(1); }
          97%, 99% { transform: scaleY(0.1); }
        }
      `}</style>
      <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full" style={{ animation: 'floatNinja 4s ease-in-out infinite' }}>
        {/* Fundo/Contorno Sombrio */}
        <circle cx="50" cy="50" r="45" fill="#030305" stroke="#dc2626" strokeWidth="2" opacity="0.8" />
        
        {/* Capuz do Ninja */}
        <path d="M20 50 C20 15, 80 15, 80 50 C80 85, 50 95, 50 95 C50 95, 20 85, 20 50 Z" fill="#0a0a0c" stroke="#1f2937" strokeWidth="2"/>
        
        {/* Pele / Fenda dos Olhos */}
        <path d="M22 45 Q50 58 78 45 L74 32 Q50 42 26 32 Z" fill="#fcd34d" />
        
        {/* Bandana Carmesim */}
        <path d="M18 35 Q50 45 82 35 L78 22 Q50 30 22 22 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        {/* Símbolo na Bandana */}
        <circle cx="50" cy="28" r="5" fill="#030305" stroke="#fcd34d" strokeWidth="0.5" />
        
        {/* Animação dos Olhos (Piscar) */}
        <g style={{ transformOrigin: '50px 45px', animation: 'blinkNinja 5s infinite' }}>
            {/* Olho Esquerdo */}
            <circle cx="38" cy="44" r="5" fill="#030305" />
            <circle cx="40" cy="42" r="2" fill="#ffffff" />
            
            {/* Olho Direito */}
            <circle cx="62" cy="44" r="5" fill="#030305" />
            <circle cx="64" cy="42" r="2" fill="#ffffff" />
            
            {/* Sobrancelhas Franzidas (Ousadia) */}
            <line x1="30" y1="39" x2="44" y2="42" stroke="#030305" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="39" x2="56" y2="42" stroke="#030305" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        
        {/* Cicatriz de Batalha (Dignidade) */}
        <path d="M60 34 L68 54 M62 49 L66 47" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        
        {/* Máscara inferior / Cachecol */}
        <path d="M22 50 Q50 75 78 50 L85 65 Q50 90 15 65 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        <path d="M30 55 Q50 70 70 55" fill="none" stroke="#991b1b" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      </svg>
    </div>
  );
});

export const SplashScreen = React.memo(() => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 50); 
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#030305] flex flex-col items-center justify-center font-sans transition-all duration-500 ease-in-out opacity-100 scale-100`}>
      <style>{`body, html { background-color: #030305 !important; margin: 0; padding: 0; }`}</style>
      
      {/* AURAS DAS SOMBRAS E SANGUE */}
      <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] bg-red-900/20 blur-[120px] rounded-full animate-[pulse_4s_ease-in-out_infinite_alternate]"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-rose-900/15 blur-[120px] rounded-full animate-[pulse_5s_ease-in-out_infinite_alternate-reverse]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-red-600/10 blur-[150px] rounded-full"></div>

      <div className={`flex flex-col items-center justify-center relative z-10 transition-all duration-[600ms] ease-out px-4 w-full text-center ${fade ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}>
        
        {/* NOVO ÍCONE MANGAKAGE */}
        <KageLogo className="w-40 h-40 md:w-48 md:h-48 mb-6" />
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[0.1em] uppercase drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] mt-2">
          MANGA<span className="text-red-600">KAGE</span>
        </h1>
        
        <div className="mt-12 flex items-center gap-3 opacity-80">
            <div className="w-2.5 h-2.5 bg-red-700 rounded-full animate-ping"></div>
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
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
        <div className="min-h-screen bg-[#030305] p-10 flex flex-col items-center justify-center font-sans border-t-[4px] border-red-600">
          <AlertTriangle className="w-16 h-16 mb-4 text-red-600 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"/>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center">Fenda nas Sombras (Erro)</h1>
          <p className="mt-2 text-gray-500 text-xs font-bold text-center max-w-lg">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-red-600/10 border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-black rounded-xl px-8 py-3 font-black text-[10px] uppercase tracking-widest transition-all">Restaurar Conexão</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GlobalToast({ toast }) {
  if (!toast) return null;
  const colors = toast.type === 'error' ? 'bg-red-950/90 text-red-200 border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 
                 toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
                 'bg-[#111113]/90 text-gray-200 border-white/20 shadow-xl';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 font-black text-[10px] uppercase tracking-[0.1em] border rounded-xl backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-300 ${colors}`}>
      <span className='text-center flex items-center gap-2'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#030305] border-t border-white/5 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center relative z-10">
                <KageLogo className="w-12 h-12 opacity-30 mb-4" />
                <span className="font-black text-xs text-gray-700 tracking-[0.4em] uppercase">MANGAKAGE</span>
            </div>
        </footer>
    );
}

export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-[#030305] font-sans flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full"></div>
            <div className="text-red-500 font-black tracking-[0.5em] text-[10px] uppercase mb-2 animate-pulse relative z-10">
                Adentrando as Sombras
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-white tracking-tighter animate-in zoom-in-50 duration-300 relative z-10 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              {chapterNumber}
            </h2>
        </div>
    );
});
