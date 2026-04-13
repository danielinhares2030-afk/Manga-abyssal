import React, { useState } from 'react';
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
      setError('Credenciais inválidas. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Animate-in faz a tela surgir imediatamente quando renderizada */}
      <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Cabeçalho Elegante */}
        <div className="mb-10 flex flex-col items-center text-center">
          <InfinityLogo className="w-24 h-12 mb-6" />
          <h1 className="text-2xl font-light text-white/90 tracking-[0.2em] mb-1">
            MANGA<span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">INFINITY</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-[0.1em]">
            Bem-vindo ao seu espaço de leitura.
          </p>
        </div>

        {/* Formulário Limpo */}
        <div className="w-full bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] shadow-2xl">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0a0a12] border border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-sm text-gray-200 outline-none focus:border-indigo-500/50 focus:bg-[#0d0d18] transition-all" 
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="Senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a0a12] border border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-sm text-gray-200 outline-none focus:border-indigo-500/50 focus:bg-[#0d0d18] transition-all" 
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-[10px] text-center font-medium bg-red-950/30 py-2 rounded-lg">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-bold text-xs tracking-wider py-4 rounded-2xl mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Aguarde...' : (isRegistering ? 'Criar Conta' : 'Acessar Plataforma')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Links Suaves */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[11px] text-gray-400 font-medium hover:text-white transition-colors"
            >
              {isRegistering ? 'Já possui conta? Fazer login' : 'Não tem conta? Cadastre-se'}
            </button>
            
            <button 
              onClick={onGuestAccess}
              className="text-[11px] text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
            >
              Acessar como Visitante
            </button>
          </div>

        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-gray-600">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] font-medium tracking-widest uppercase">Conexão Segura</span>
        </div>

      </div>
    </div>
  );
}
