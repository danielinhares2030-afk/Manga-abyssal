import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';
import {
  Mail,
  Lock,
  ArrowRight,
  UserPlus,
  Ghost
} from 'lucide-react';
import { MangaInfinityLogo } from './UIComponents';

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
    } catch {
      setError('Falha ao conectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center mb-8">
            <MangaInfinityLogo className="w-24 h-24 mb-5" />

            <h1 className="text-3xl font-black text-white">
              MANGA-INFINITY
            </h1>

            <p className="text-xs text-cyan-300 mt-2 tracking-[0.25em] uppercase">
              universo infinito de mangás
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-400"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-2xl font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {loading
                ? 'Entrando...'
                : isRegistering
                ? 'Criar conta'
                : 'Entrar'}

              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-cyan-300 hover:text-white"
            >
              {isRegistering
                ? 'Já tenho conta'
                : 'Criar nova conta'}
            </button>

            <button
              onClick={onGuestAccess}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-2"
            >
              <Ghost className="w-4 h-4" />
              Entrar como visitante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
