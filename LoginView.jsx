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
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isRegistering) { await createUserWithEmailAndPassword(auth, email, password); } 
      else { await signInWithEmailAndPassword(auth, email, password); }
      onLoginSuccess();
    } catch (err) { setError('Conexão Rejeitada. Assinatura inválida.'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* BACKGROUND AURA (Suave e Reconfortante) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-[pulse_6s_infinite_alternate]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-[pulse_8s_infinite_alternate-reverse]"></div>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        
        <div className="mb-12 flex flex-col items-center text-center">
          <InfinityLogo className="w-28 h-14 mb-8" />
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2 uppercase drop-shadow-xl flex items-center gap-2">
             Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Gate</span>
          </h1>
          <p className="text-[9px] text-cyan-500 font-black tracking-[0.4em] uppercase">
            Acesso Restrito
          </p>
        </div>

        {/* CARD ESTILO VIDRO FOSCO (Leve, Fluido e Limpo) */}
        <div className="w-full bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group/input">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
              <input type="email" placeholder="Identidade" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#0a0a12] border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-xs font-bold tracking-wider text-white outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all uppercase placeholder:text-gray-600" />
            </div>
            
            <div className="relative group/input">
              <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-indigo-400 transition-colors" />
              <input type="password" placeholder="Chave de Ignição" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#0a0a12] border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-xs font-bold tracking-wider text-white outline-none focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all uppercase placeholder:text-gray-600" />
            </div>

            {error && <p className="text-red-400 text-[9px] text-center font-black uppercase tracking-widest bg-red-950/40 py-3 rounded-lg border border-red-900/50">{error}</p>}

            {/* BOTÃO RADICAL: Estilo Corte Espada */}
            <button type="submit" disabled={loading} className="w-full relative overflow-hidden bg-white text-black hover:bg-cyan-500 font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl mt-8 transition-colors duration-500 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] group/btn">
              {loading ? 'Sincronizando...' : (isRegistering ? 'Forjar Registro' : 'Conectar ao Vazio')}
              {!loading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-5">
            <button onClick={() => setIsRegistering(!isRegistering)} className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] hover:text-white transition-colors">{isRegistering ? 'Já possui acesso? Entrar' : 'Não registrado? Criar ID'}</button>
            <button onClick={onGuestAccess} className="text-[9px] text-indigo-400/80 font-black uppercase tracking-[0.3em] hover:text-indigo-300 transition-colors pb-1 border-b border-indigo-900/50 hover:border-indigo-400">Modo Espectro (Visitante)</button>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-gray-700">
          <Lock className="w-3 h-3" />
          <span className="text-[8px] font-black tracking-[0.4em] uppercase">Rede Neural Segura</span>
        </div>
      </div>
    </div>
  );
}
