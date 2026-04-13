import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; 
import { User, Key, Lock, ArrowRight } from 'lucide-react';
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
      setError('Acesso Negado. Identidade desconhecida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020105] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* BACKGROUND LUXUOSO E ESCURO */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-[pulse_4s_infinite_alternate]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-[pulse_5s_infinite_alternate-reverse]"></div>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        
        <div className="mb-12 flex flex-col items-center text-center">
          <InfinityLogo className="w-28 h-14 mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          <h1 className="text-3xl font-black text-white tracking-[0.2em] mb-2 uppercase drop-shadow-xl">
            Acesso <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Prisma</span>
          </h1>
          <p className="text-[9px] text-gray-500 font-black tracking-[0.4em] uppercase">
            Autentique-se para entrar
          </p>
        </div>

        {/* Form minimalista, bordas finas, input clean */}
        <div className="w-full bg-white/[0.01] backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  placeholder="E-mail da Entidade" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#05030a] border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-xs font-bold tracking-wider text-white outline-none focus:border-cyan-500/50 focus:bg-black transition-all shadow-inner" 
                />
              </div>
            </div>
            
            <div>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-fuchsia-400 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Código Secreto" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#05030a] border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-xs font-bold tracking-wider text-white outline-none focus:border-fuchsia-500/50 focus:bg-black transition-all shadow-inner" 
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[9px] text-center font-black uppercase tracking-widest bg-red-950/30 py-3 rounded-xl border border-red-900/50">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative overflow-hidden bg-white text-black hover:bg-transparent hover:text-white border border-transparent hover:border-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl mt-8 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] group/btn"
            >
              {loading ? 'Validando...' : (isRegistering ? 'Forjar Assinatura' : 'Sincronizar')}
              {!loading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-5">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] hover:text-cyan-400 transition-colors"
            >
              {isRegistering ? 'Possui a marca? Faça login' : 'Não reconhecido? Forje sua marca'}
            </button>
            
            <button 
              onClick={onGuestAccess}
              className="text-[9px] text-fuchsia-500/80 font-black uppercase tracking-[0.3em] hover:text-fuchsia-400 transition-colors"
            >
              Vagar como Fantasma
            </button>
          </div>

        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-gray-700">
          <Lock className="w-3 h-3" />
          <span className="text-[8px] font-black tracking-[0.4em] uppercase">Conexão Criptografada</span>
        </div>

      </div>
    </div>
  );
}
