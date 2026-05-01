import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from './firebase'; 
import { Mail, Lock, User, Eye, EyeOff, ChevronRight, AlertCircle, Loader2, BookOpen, Sparkles, ScanLine, Check } from 'lucide-react';

const NexoLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nexoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="nexoPurple" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    <path d="M15,15 L35,15 L85,85 L65,85 Z" fill="url(#nexoCyan)" />
    <path d="M15,85 L35,85 L85,15 L65,15 Z" fill="url(#nexoPurple)" />
  </svg>
);

const NexoInput = ({ label, icon: Icon, type, placeholder, value, onChange, showPasswordToggle, showPass, setShowPass, isValid }) => (
  <div className="mb-5">
      <label className="block text-[9px] font-black text-cyan-500 uppercase tracking-[0.15em] mb-1.5 px-1">{label}</label>
      <div className="relative flex items-center bg-[#08080f] border border-blue-900/30 rounded-2xl p-1.5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#0c0c16] border border-white/5 flex items-center justify-center flex-shrink-0 group-focus-within:bg-blue-950/40 transition-colors">
              <Icon className="w-4 h-4 text-cyan-600 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input 
              type={showPasswordToggle && !showPass ? "password" : type} 
              value={value} 
              onChange={onChange} 
              placeholder={placeholder} 
              className="flex-1 min-w-0 bg-transparent text-gray-300 text-xs font-medium px-4 outline-none placeholder:text-gray-600" 
              required 
          />
          {showPasswordToggle ? (
              <button type="button" onClick={() => setShowPass(!showPass)} className="pr-4 pl-2 flex items-center gap-1.5 text-purple-500 hover:text-purple-400 transition-colors flex-shrink-0">
                  {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">Ver</span>
              </button>
          ) : (
              <div className="pr-4 pl-2 flex items-center justify-center flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isValid ? 'border-cyan-500/50' : 'border-blue-900/50'}`}>
                      {isValid ? <Check className="w-2.5 h-2.5 text-cyan-500" /> : <Check className="w-2.5 h-2.5 text-blue-900/50" />}
                  </div>
              </div>
          )}
      </div>
  </div>
);

export function LoginView({ onLoginSuccess, onGuestAccess, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); setLocalError(null);
    try {
      if (isRegister) {
        if (!name.trim()) throw new Error("missing-name");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        showToast("Conectado ao Nexo com sucesso!", "success");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Bem-vindo de volta ao Nexo Scan.", "success");
      }
      onLoginSuccess();
    } catch (error) { 
        let msg = "Erro na matriz do sistema.";
        if (error.code === 'auth/invalid-credential') msg = "E-mail não encontrado ou senha incorreta.";
        else if (error.code === 'auth/email-already-in-use') msg = "Esta identidade já está em uso.";
        else if (error.code === 'auth/weak-password') msg = "A chave de acesso deve ter 6 ou mais dígitos.";
        else if (error.message === 'missing-name') msg = "Sua identificação é obrigatória.";
        showToast(msg, "error"); setLocalError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#020205]">
      <style>{`body, html { background-color: #020205 !important; }`}</style>
      
      {/* FUNDO AMBIENTE (Simulando a imagem de fundo com personagens e luzes) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://i.ibb.co/gF4zyvkk/Gemini-Generated-Image-gj2yhugj2yhugj2y-removebg-preview.png')] bg-cover bg-center bg-no-repeat opacity-5 mix-blend-screen"></div>
          <div className="absolute top-[-10%] left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020205]/80 to-[#020205]"></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in-95 duration-700 mt-4 md:mt-8 mb-20">
        
        {/* CONTAINER PRINCIPAL COM BORDA NEON */}
        <div className="relative p-[1.5px] rounded-[2.5rem] bg-gradient-to-b from-cyan-500/40 via-purple-600/20 to-purple-800/40 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
            <div className="bg-[#05050a]/95 backdrop-blur-2xl px-6 sm:px-10 pt-14 pb-14 rounded-[2.5rem] relative flex flex-col">
                
                {/* ÁREA DO LOGO E TEXTOS */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <NexoLogo className="w-20 h-20 mb-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    <h1 className="text-[32px] font-black text-white tracking-[0.2em] mb-1">
                        N E X O
                    </h1>
                    <h2 className="text-[10px] font-black text-cyan-400 tracking-[0.5em] mb-6">
                        S C A N
                    </h2>

                    <div className="flex items-center gap-3 text-gray-400">
                        <BookOpen className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <p className="text-[11px] font-medium max-w-[150px] leading-snug text-left">
                            Seu portal para o universo dos mangás.
                        </p>
                    </div>
                    
                    <Sparkles className="w-4 h-4 text-purple-600/50 mt-5" />
                </div>

                {localError && (
                    <div className="mb-6 bg-red-950/40 border border-red-500/30 text-red-200 text-[10px] font-black p-3 rounded-xl text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-3 h-3" /> {localError}
                    </div>
                )}

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit} className="relative z-10 w-full flex flex-col">
                  
                  {isRegister && (
                      <NexoInput 
                          label="Nome" 
                          icon={User} 
                          type="text" 
                          placeholder="Como devemos te chamar?" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          isValid={name.length > 2}
                      />
                  )}

                  <NexoInput 
                      label="E-mail" 
                      icon={Mail} 
                      type="email" 
                      placeholder="Digite seu e-mail" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      isValid={email.includes('@')}
                  />

                  <NexoInput 
                      label="Senha" 
                      icon={Lock} 
                      type="password" 
                      placeholder="Digite sua senha" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      showPasswordToggle={true}
                      showPass={showPass}
                      setShowPass={setShowPass}
                  />

                  <button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black py-4.5 transition-all hover:scale-[1.02] tracking-[0.2em] text-[11px] uppercase flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(139,92,246,0.3)] group disabled:opacity-70 disabled:hover:scale-100">
                     {loading ? <Loader2 className="w-5 h-5 animate-spin text-white"/> : (
                         <>
                            <ScanLine className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
                            {isRegister ? 'Criar Conta' : 'Entrar'}
                         </>
                     )}
                  </button>
                </form>

                {/* ALTERNAR LOGIN/REGISTRO */}
                <div className="text-center mt-6">
                    <span className="text-[10px] text-gray-500 font-medium">
                        {isRegister ? "Já possui acesso? " : "Ainda não tem conta? " }
                    </span>
                    <button type="button" onClick={() => { setIsRegister(!isRegister); setLocalError(null); }} className="text-[10px] text-blue-400 font-black tracking-widest hover:text-cyan-300 transition-colors uppercase ml-1">
                        {isRegister ? "Fazer Login" : "Criar Conta"}
                    </button>
                </div>

                {/* DIVISOR "OU" */}
                <div className="flex items-center justify-center gap-4 my-6">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-purple-900/50"></div>
                    <span className="text-[9px] font-black text-gray-600 tracking-widest uppercase">OU</span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-purple-900/50"></div>
                </div>

                {/* BOTÃO ESPECTADOR */}
                <button onClick={onGuestAccess} className="w-full border border-purple-900/30 bg-[#0a0a16]/50 hover:bg-purple-900/20 px-6 py-4.5 rounded-2xl flex items-center justify-between transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                        <Eye className="w-5 h-5 text-purple-500/80 group-hover:text-purple-400 transition-colors" />
                        <span className="text-[10px] text-gray-300 tracking-[0.2em] font-black uppercase">Acesso de Espectador</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 group-hover:text-purple-400 transition-all" />
                </button>
            </div>
            
            {/* ÍCONE FLUTUANTE NA BORDA INFERIOR (Livro) */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#05050a] rounded-full border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] z-20">
               <BookOpen className="w-5 h-5 text-cyan-400" />
               {/* Linhas decorativas laterais imitando o design */}
               <div className="absolute top-1/2 -left-8 w-6 h-[1px] bg-cyan-500/30">
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-500/50 rounded-full"></div>
               </div>
               <div className="absolute top-1/2 -right-8 w-6 h-[1px] bg-cyan-500/30">
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-500/50 rounded-full"></div>
               </div>
            </div>
        </div>

        {/* TEXTO DE RODAPÉ NEON */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full text-center">
            <p className="text-[8px] font-black tracking-[0.4em] text-gray-600 uppercase flex items-center justify-center gap-2">
                <span className="text-purple-900/60 tracking-[0.2em]">. . .</span> 
                <span>LEIA . <span className="text-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">DESCUBRA</span> . CONTINUE</span>
                <span className="text-purple-900/60 tracking-[0.2em]">. . .</span>
            </p>
        </div>

      </div>
    </div>
  );
}
