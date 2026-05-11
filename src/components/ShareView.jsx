import React, { useMemo, useState } from 'react';

const ShareView = ({ stickers, progress, user }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState('ids');
  const [mode, setMode] = useState('missing');

  const missing = useMemo(() =>
    stickers.filter(s => (progress[s.id] || 0) === 0),
    [stickers, progress]
  );

  const repeated = useMemo(() =>
    stickers.filter(s => (progress[s.id] || 0) > 1),
    [stickers, progress]
  );

  const totalRepeated = useMemo(() =>
    repeated.reduce((acc, s) => acc + (progress[s.id] - 1), 0),
    [repeated, progress]
  );

  const generateText = () => {
    if (mode === 'missing') {
      if (format === 'ids') {
        return `Me faltan ${missing.length} estampas (${user}):\n${missing.map(s => s.id).join(', ')}`;
      }
      const groups = {};
      missing.forEach(s => {
        const team = s.team_name || 'General';
        if (!groups[team]) groups[team] = [];
        groups[team].push(s.id);
      });
      return `🎴 Album Mundial 2026 - Faltantes de ${user}\n\n` +
        Object.entries(groups).map(([team, ids]) => `${team}:\n${ids.join(', ')}`).join('\n\n');
    } else {
      if (format === 'ids') {
        return `Tengo ${totalRepeated} estampas repetidas (${user}):\n${repeated.map(s => `${s.id}${progress[s.id] - 1 > 1 ? ` x${progress[s.id] - 1}` : ''}`).join(', ')}`;
      }
      const groups = {};
      repeated.forEach(s => {
        const team = s.team_name || 'General';
        if (!groups[team]) groups[team] = [];
        const qty = progress[s.id] - 1;
        groups[team].push(qty > 1 ? `${s.id} x${qty}` : s.id);
      });
      return `🎴 Album Mundial 2026 - Repetidas de ${user}\n\n` +
        Object.entries(groups).map(([team, ids]) => `${team}:\n${ids.join(', ')}`).join('\n\n');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(generateText())}`, '_blank');
  };

  const activeCount  = mode === 'missing' ? missing.length : repeated.length;
  const activeLabel  = mode === 'missing' ? 'estampas faltantes' : 'tipos con repetidas';
  const activeTotal  = mode === 'missing' ? null : totalRepeated;

  return (
    <div className="space-y-4">

      {/* Toggle Faltantes / Repetidas */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('missing')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${mode === 'missing' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            Faltantes
          </button>
          <button
            onClick={() => setMode('repeated')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${mode === 'repeated' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            Repetidas
          </button>
        </div>
      </div>

      {/* Contador */}
      <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
        <p className="text-4xl font-black text-gray-800">{activeCount}</p>
        <p className="text-xs font-black text-gray-400 uppercase">{activeLabel}</p>
        {mode === 'repeated' && (
          <p className="text-sm font-bold text-gray-500 mt-1">{totalRepeated} en total</p>
        )}
      </div>

      {/* Formato */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Formato</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('ids')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${format === 'ids' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            Solo IDs
          </button>
          <button
            onClick={() => setFormat('full')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${format === 'full' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            Por equipo
          </button>
        </div>
      </div>

      {/* Vista previa */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Vista previa</p>
        <div className="bg-gray-50 rounded-xl p-3 max-h-40 overflow-y-auto">
          <p className="text-xs text-gray-700 font-mono whitespace-pre-wrap">{generateText()}</p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className={`flex-1 py-3 rounded-2xl font-black text-sm uppercase transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}
        >
          {copied ? '✓ Copiado!' : 'Copiar'}
        </button>
        <button onClick={handleWhatsApp} className="flex-1 py-3 rounded-2xl font-black text-sm uppercase bg-green-500 text-white">
          WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ShareView;

// import React, { useMemo, useState } from 'react';

// const ShareView = ({ stickers, progress, user }) => {
//   const [copied, setCopied] = useState(false);
//   const [format, setFormat] = useState('ids');

//   const missing = useMemo(() =>
//     stickers.filter(s => (progress[s.id] || 0) === 0),
//     [stickers, progress]
//   );

//   const generateText = () => {
//     if (format === 'ids') {
//       return `Me faltan ${missing.length} estampas (${user}):\n${missing.map(s => s.id).join(', ')}`;
//     }
//     const groups = {};
//     missing.forEach(s => {
//       const team = s.team_name || 'General';
//       if (!groups[team]) groups[team] = [];
//       groups[team].push(s.id);
//     });
//     return `🎴 Album Mundial 2026 - Faltantes de ${user}\n\n` +
//       Object.entries(groups).map(([team, ids]) => `${team}:\n${ids.join(', ')}`).join('\n\n');
//   };

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(generateText());
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleWhatsApp = () => {
//     window.open(`https://wa.me/?text=${encodeURIComponent(generateText())}`, '_blank');
//   };

//   return (
//     <div className="space-y-4">
//       <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
//         <p className="text-4xl font-black text-gray-800">{missing.length}</p>
//         <p className="text-xs font-black text-gray-400 uppercase">estampas faltantes</p>
//       </div>

//       <div className="bg-white rounded-2xl p-3 shadow-sm">
//         <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Formato</p>
//         <div className="flex gap-2">
//           <button onClick={() => setFormat('ids')} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${format === 'ids' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
//             Solo IDs
//           </button>
//           <button onClick={() => setFormat('full')} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${format === 'full' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
//             Por equipo
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl p-3 shadow-sm">
//         <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Vista previa</p>
//         <div className="bg-gray-50 rounded-xl p-3 max-h-40 overflow-y-auto">
//           <p className="text-xs text-gray-700 font-mono whitespace-pre-wrap">{generateText()}</p>
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <button onClick={handleCopy} className={`flex-1 py-3 rounded-2xl font-black text-sm uppercase transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}>
//           {copied ? '✓ Copiado!' : 'Copiar'}
//         </button>
//         <button onClick={handleWhatsApp} className="flex-1 py-3 rounded-2xl font-black text-sm uppercase bg-green-500 text-white">
//           WhatsApp
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ShareView;