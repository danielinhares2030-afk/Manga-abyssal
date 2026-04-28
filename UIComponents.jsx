// NOVO LOGO MANGAKAGE (Ninja 2D de Corpo Inteiro, Sentado no Nome)
export const KageLogo = React.memo(({ className = "w-48 h-48" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes floatNinja {
          0%, 100% { transform: translateY(0px); filter: drop-shadow(0 0 10px rgba(220,38,38,0.4)); }
          50% { transform: translateY(-8px); filter: drop-shadow(0 0 25px rgba(220,38,38,0.8)); }
        }
        @keyframes blinkNinja {
          0%, 96%, 98%, 100% { transform: scaleY(1); }
          97%, 99% { transform: scaleY(0.1); }
        }
      `}</style>
      <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full" style={{ animation: 'floatNinja 4s ease-in-out infinite' }}>
        
        {/* AURA VERMELHA SUTIL DE FUNDO */}
        <circle cx="100" cy="90" r="85" fill="#dc2626" opacity="0.1" filter="blur(20px)" />

        {/* CACHECOIS FLOWING IN THE BACK */}
        <path d="M50,110 Q80,130 110,110" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" transform="rotate(-15 100 100)" />
        <path d="M140,70 Q170,90 200,70" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" transform="rotate(15 100 100)" />

        {/* NINJA CHIBI DE CORPO INTEIRO SENTADO (Fofinho, Ousado, Digno) */}
        <g transform="translate(50, 10) scale(1)">
          {/* Cabeça, Capuz e Máscara (baseado no antigo) */}
          <path d="M20,60 C20,25 80,25 80,60 C80,95 50,105 50,105 C50,105 20,95 20,60 Z" fill="#0a0a0c" stroke="#1f2937" strokeWidth="2.5"/>
          <path d="M22,55 Q50,68 78,55 L74,42 Q50,52 26,42 Z" fill="#fcd34d" />
          <path d="M18,45 Q50,55 82,45 L78,32 Q50,40 22,32 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
          <circle cx="50" cy="38" r="5" fill="#030305" stroke="#fcd34d" strokeWidth="0.5" />
          {/* Animação dos Olhos (Piscar) */}
          <g style={{ transformOrigin: '50px 55px', animation: 'blinkNinja 5s infinite' }}>
              <circle cx="38" cy="54" r="5" fill="#030305" />
              <circle cx="40" cy="52" r="2" fill="#ffffff" />
              <circle cx="62" cy="54" r="5" fill="#030305" />
              <circle cx="64" cy="52" r="2" fill="#ffffff" />
              {/* Sobrancelhas Franzidas (Ousadia) */}
              <line x1="30" y1="49" x2="44" y2="52" stroke="#030305" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="70" y1="49" x2="56" y2="52" stroke="#030305" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Cicatriz de Batalha (Dignidade) */}
          <path d="M60,44 L68,64 M62,59 L66,57" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
          {/* Máscara inferior / Cachecol */}
          <path d="M22,60 Q50,85 78,60 L85,75 Q50,100 15,75 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
          
          {/* CORPO CHIBI SENTADO */}
          <path d="M35,95 L65,95 L75,125 L25,125 Z" fill="#0a0a0c" stroke="#1f2937" strokeWidth="2" /> {/* Tronco */}
          <path d="M35,95 Q50,105 65,95" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" /> {/* Gola Carmesim */}
          <path d="M30,125 L70,125 L75,140 L25,140 Z" fill="#0a0a0c" stroke="#1f2937" strokeWidth="2" /> {/* Pernas Cruzadas */}
          <path d="M35,125 Q50,135 65,125" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/> {/* Detalhe Pernas */}
          
          {/* BRAÇOS CRUZADOS (Ousadia/Imponência) */}
          <path d="M30,100 Q50,110 70,100 Q60,115 40,115 Q40,115 30,100 Z" fill="#0a0a0c" stroke="#1f2937" strokeWidth="2.2" /> {/* Braços */}
          
          {/* CACHECOIS FLOWING */}
          <path d="M35,90 C25,80 50,70 50,80 C50,90 75,80 65,90" fill="#dc2626" stroke="#991b1b" strokeWidth="1" /> {/* Cachecol no Pescoço */}
        </g>
        
        {/* TEXTO `MANGAKAGE` CENTRALIZADO ABAIXO DO NINJA SENTADO */}
        <text x="100" y="170" textAnchor="middle" fill="#dc2626" font-weight="black" font-size="36" font-family="black, sans-serif" letter-spacing="0.15em" style={{ transform: 'scale(1, 1.3)' }}>
          MANGAKAGE
        </text>
        
        {/* DECO SÉPTA ANULAR DO TEXTO */}
        <path d="M30,185 Q100,200 170,185" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
        <circle cx="30" cy="185" r="3.5" fill="#030305" stroke="#fcd34d" strokeWidth="1.2"/>
        <circle cx="170" cy="185" r="3.5" fill="#030305" stroke="#fcd34d" strokeWidth="1.2"/>

      </svg>
    </div>
  );
});
