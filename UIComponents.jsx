import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

// LOGO MANGAKAGE (Mascote atualizado, tamanho maior e nova aura de raios SVG)
export const KageLogo = React.memo(({ className = "w-56 h-56" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes kageFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            filter: drop-shadow(0 0 20px rgba(220,38,38,0.4)); 
          }
          50% { 
            transform: translateY(-12px) scale(1.05); 
            filter: drop-shadow(0 0 40px rgba(220,38,38,0.8)); 
          }
        }
      `}</style>
      
      {/* NOVA AURA DE RAIOS EM SVG */}
      <svg 
        viewBox="0 0 200 200" 
        className="absolute inset-0 w-full h-full scale-[1.6] z-0 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#991b1b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="lightningGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Núcleo pulsante da aura */}
        <circle cx="100" cy="100" r="65" fill="url(#auraGlow)" className="animate-pulse" />
        
        {/* Raio Elétrico 1 (Girando num sentido) */}
        <g className="origin-center animate-[spin_4s_linear_infinite]" filter="url(#lightningGlow)">
          <path d="M100 25 L110 45 L135 35 L125 60 L155 65 L135 85 L165 100 L135 115 L155 135 L125 140 L135 165 L110 155 L100 175 L90 155 L65 165 L75 140 L45 135 L65 115 L35 100 L65 85 L45 65 L75 60 L65 35 L90 45 Z" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.8" />
        </g>

        {/* Raio Elétrico 2 (Girando no sentido contrário, mais agressivo) */}
        <g className="origin-center animate-[spin_3s_linear_infinite_reverse]" filter="url(#lightningGlow)">
          <path d="M100 15 L115 40 L145 25 L130 55 L165 55 L140 80 L175 100 L140 120 L165 145 L130 145 L145 175 L115 160 L100 185 L85 160 L55 175 L70 145 L35 145 L60 120 L25 100 L60 80 L35 55 L70 55 L55 25 L85 40 Z" 
                fill="none" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="12 6" opacity="0.7" />
        </g>

        {/* Faíscas de energia soltas nas pontas */}
        <g className="origin-center animate-[spin_5s_linear_infinite] animate-pulse">
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(0 100 100)" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(45 100 100)" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(90 100 100)" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(135 100 100)" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(180 100 100)" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(225 100 100)" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(270 100 100)" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#f87171" strokeWidth="2" transform="rotate(315 100 100)" />
        </g>
      </svg>
      
      {/* O Seu Mascote Oficial (Nova URL e sem fundo) */}
      <img 
        src="https://i.ibb.co/gF4zyvkk/Gemini-Generated-Image-gj2yhugj2yhugj2y-removebg-preview.png" 
        alt="Mangakage Mascot" 
        className="relative z-10 w-full h-full object-contain"
        style={{ animation: 'kageFloat 4s ease-in-out infinite' }}
      />
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
    <div className={`fixed inset-0 z-[9999] bg-[#030305] flex flex-col items-center justify-center font-sans transition-all duration-500`}>
      <style>{`body, html { background-color: #030305 !important; margin: 0; padding: 0; }`}</style>
      
      {/* AURAS DAS SOMBRAS DO FUNDO */}
      <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] bg-red-900/20 blur-[120px] rounded-full animate-[pulse_4s_ease-in-out_infinite_alternate]"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-rose-900/15 blur-[120px] rounded-full animate-[pulse_5s_ease-in-out_infinite_alternate-reverse]"></div>

      <div className={`flex flex-col items-center justify-center relative z-10 transition-all duration-[700ms] ease-out px-4 w-full text-center ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        
        {/* MASCOTE NA ENTRADA (Tamanho aumentado aqui também) */}
        <KageLogo className="w-72 h-72 md:w-96 md:h-96" />
        
        <div className="mt-12 flex items-center gap-3 opacity-60">
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
          <button onClick={() => window.location.reload()} className="mt-8 bg-red-600/10 border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white rounded-xl px-8 py-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg">Restaurar Conexão</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GlobalToast({ toast }) {
  if (!toast) return null;
  const colors = toast.type === 'error' ? 'bg-red-950/90 text-red-200 border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 
                 toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 
                 'bg-[#111113]/90 text-gray-200 border-white/20 shadow-xl';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 font-black text-[10px] uppercase tracking-[0.1em] border rounded-xl backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-300 ${colors}`}>
      <span className='text-center flex items-center gap-2'>{toast.text}</span>
    </div>
  );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#030305] border-t border-red-900/20 py-12 mt-auto pb-24 md:pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center relative z-10">
                {/* Tamanho aumentado no rodapé também */}
                <KageLogo className="w-32 h-32 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                <span className="font-black text-[10px] text-gray-700 tracking-[0.5em] uppercase mt-2">MANGAKAGE • ACERVO DAS SOMBRAS</span>
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
            <h2 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-white tracking-tighter animate-in zoom-in-50 duration-300 relative z-10 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
              {chapterNumber}
            </h2>
        </div>
    );
});
