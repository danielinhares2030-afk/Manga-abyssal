import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Zap, Lock } from 'lucide-react';

/* ÍCONE COM ANIMAÇÃO DE PULSAÇÃO ORGÂNICA (Caso não esteja usando a sua própria imagem) */
export const AbyssalLogo = React.memo(({ className = "w-16 h-16" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Anéis de energia rodando */}
      <div className="absolute inset-0 rounded-full border-t-[3px] border-blue-500 border-r-[3px] border-transparent animate-[spin_3s_linear_infinite] opacity-80"></div>
      <div className="absolute inset-2 rounded-full border-b-[3px] border-white/50 border-l-[3px] border-transparent animate-[spin_2s_linear_infinite_reverse] opacity-80"></div>
      
      {/* Núcleo pulsante (Buraco Negro/Olho) */}
      <div className="w-1/2 h-1/2 bg-black rounded-full shadow-[0_0_20px_8px_rgba(59,130,246,0.7)] animate-[pulse_1.5s_ease-in-out_infinite] border border-blue-900 flex items-center justify-center overflow-hidden">
         {/* Fenda central */}
         <div className="w-[15%] h-[70%] bg-white rounded-full blur-[1px] shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
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
          <button onClick={() => window.location.reload()} className="mt-8 bg-blue-900 border border-blue-700 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">Restaurar Conexão</button>
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
                    <AbyssalLogo className="w-10 h-10 grayscale opacity-50" />
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
    // 1. Ponto de luz se forma
    const t1 = setTimeout(() => setPhase(1), 200);   
    // 2. Explosão de energia azul (Névoa)
    const t2 = setTimeout(() => setPhase(2), 1000);  
    // 3. Revelação do texto e logo
    const t3 = setTimeout(() => setPhase(3), 1800);  

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black flex items-center justify-center">
      
      {/* FASE 1: O Núcleo (Ponto de luz branca que surge no escuro) */}
      <div 
        className={`absolute w-2 h-2 bg-white rounded-full transition-all duration-700 ease-in shadow-[0_0_20px_10px_rgba(59,130,246,0.8),0_0_40px_20px_rgba(255,255,255,0.5)] 
        ${phase === 1 ? 'scale-100 opacity-100' : phase >= 2 ? 'scale-[100] opacity-0' : 'scale-0 opacity-0'}`} 
      />

      {/* FASE 2: A Névoa do Abismo (Onda Azul de fundo) */}
      <div 
        className={`absolute w-[150vw] h-[150vw] rounded-full bg-blue-900/20 blur-[100px] transition-all duration-[3000ms] ease-out pointer-events-none 
        ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} 
      />

      {/* FASE 3: O Despertar (Conteúdo Principal) */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center w-full px-4 transition-all duration-[1500ms] ease-out 
        ${phase >= 3 ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-10 blur-sm'}`}
      >
        {/* Se você tiver a sua própria imagem do olho mágico, pode substituir o componente AbyssalLogo abaixo por uma tag <img /> */}
        <AbyssalLogo className="w-32 h-32 md:w-48 md:h-48 mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]" />
        
        {/* whitespace-nowrap GANTE QUE O TEXTO NUNCA MAIS VAI QUEBRAR COMO NA PRINT */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-50 to-blue-600 tracking-[0.3em] md:tracking-[0.5em] whitespace-nowrap pl-[0.3em] drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          MANGÁS ABISSAL
        </h1>
        
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 md:gap-4 w-full">
            <div className="flex-1 max-w-[40px] md:max-w-[60px] h-[1px] bg-gradient-to-r from-transparent to-blue-500"></div>
            
            {/* O subtítulo também protegido contra quebras */}
            <p className="tracking-[0.4em] md:tracking-[1em] uppercase text-[9px] md:text-xs font-black text-blue-400/80 whitespace-nowrap animate-pulse">
              O Vazio Desperta
            </p>
            
            <div className="flex-1 max-w-[40px] md:max-w-[60px] h-[1px] bg-gradient-to-l from-transparent to-blue-500"></div>
        </div>
      </div>
      
    </div>
  );
});

/* TRANSIÇÃO DE CAPÍTULO: SALTO DIMENSIONAL (Limpo e elegante) */
export const ChapterTransitionOverlay = React.memo(({ isVisible, chapterNumber }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden">
            <style>{`
                @keyframes ripple-pulse {
                    0% { transform: scale(0.8); opacity: 0; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    50% { opacity: 1; }
                    100% { transform: scale(2); opacity: 0; box-shadow: 0 0 0 50px rgba(59, 130, 246, 0); }
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
