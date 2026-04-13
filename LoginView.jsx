import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Confirme se o caminho do seu firebase.js está correto
import { User, Key, Lock } from 'lucide-react';
import { InfinityLogo } from './UIComponents';

export function LoginView({ onLoginSuccess, onGuestAccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020105] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Fundo Cósmico */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#130a2a_0%,_#020105_80%)] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        {/* Logo e Título */}
        <div className="mb-8 flex flex-col items-center">
          <InfinityLogo className="w-32 h-16 md:w-40 md:h-20 mb-6" />
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-600 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            MANGA-INFINITY
          </h1>
          <p className="text-[10px] text-fuchsia-400 uppercase tracking-[0.8em] font-black mt-3 text-center">
            Além da Eternidade
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="w-full bg-[#05030a]/80 backdrop-blur-3xl border border-cyan-900/30 p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600/50 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="email" 
                placeholder="E-mail Cósmico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#020105] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all" 
              />
            </div>
            
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fuchsia-600/50 group-focus-within:text-fuchsia-400 transition-colors" />
              <input 
                type="password" 
                placeholder="Código de Acesso" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#020105] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-fuchsia-500/60 focus:shadow-[0_0_15px_rgba(217,70,239,0.15)] transition-all" 
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold tracking-wider">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-800 to-purple-800 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl mt-4 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] group disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">{loading ? 'Sincronizando...' : (isRegistering ? 'Criar Entidade' : 'Conectar ao Infinito')}</span>
            </button>
          </form>

          {/* Links Auxiliares */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] text-cyan-500 font-black uppercase tracking-widest hover:text-cyan-300 transition-colors text-center"
            >
              {isRegistering ? 'JÁ TEM ACESSO? CONECTAR AGORA' : 'SEM CADASTRO? DESPERTAR AGORA'}
            </button>
            
            <button 
              onClick={onGuestAccess}
              className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] hover:text-white transition-colors text-center"
            >
              VAGAR PELO INFINITO (ACESSO VISITANTE)
            </button>
          </div>

        </div>

        {/* Rodapé SSL */}
        <div className="mt-12 flex items-center justify-center gap-2 text-cyan-900/50">
          <Lock className="w-3 h-3" />
          <span className="text-[9px] uppercase font-black tracking-[0.3em]">Conexão Blindada SSL</span>
        </div>

      </div>
    </div>
  );
}
