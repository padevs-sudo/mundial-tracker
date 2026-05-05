import React from 'react';

const Sticker = ({ sticker, quantity, onIncrement, onDecrement, profile }) => {
  const isObtained = quantity > 0;
  const isRepeated = quantity > 1;

  const getProfileBorder = () => {
    if (!isObtained) return 'border-gray-200';
    if (sticker.is_special) return 'border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]';
    return profile === 'PV' ? 'border-sky-400' : 'border-green-500';
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Tarjeta de la estampa */}
      <div className={`
        relative w-full aspect-[3/4] rounded-xl transition-all duration-150
        flex flex-col items-center justify-between py-2 border-2
        ${isObtained ? 'opacity-100 bg-white shadow-sm' : 'opacity-80 bg-gray-100'}
        ${getProfileBorder()}
      `}>
        {/* Badge de repetidas */}
        {isRepeated && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center z-20 border-2 border-white shadow-md">
            {quantity}
          </div>
        )}

        {/* ID de la estampa */}
        <span className="text-[7px] font-black text-gray-400 tracking-tighter">{sticker.id}</span>

        {/* Sigla del equipo + número */}
        <div className="flex flex-col items-center">
          <span className={`text-lg font-black leading-none ${isObtained ? 'text-gray-800' : 'text-gray-400'}`}>
            {sticker.team_sigla}
          </span>
          <span className={`text-[9px] font-black ${sticker.is_special ? 'text-amber-500' : 'text-gray-400'}`}>
            {sticker.id.match(/\d+/)}
          </span>
        </div>

        {/* Nombre del jugador */}
        <div className="w-full px-1">
          <p className={`text-[7px] font-black uppercase text-center leading-tight truncate ${isObtained ? 'text-gray-900' : 'text-gray-500'}`}>
            {sticker.name || 'Jugador'}
          </p>
        </div>

        {/* Brillo especial */}
        {isObtained && sticker.is_special && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-pulse rounded-xl pointer-events-none" />
        )}
      </div>

      {/* Botones + y − */}
      <div className="flex items-center gap-1 mt-1 w-full">
        <button
          onClick={onDecrement}
          disabled={quantity === 0}
          className="flex-1 h-6 rounded-lg bg-gray-200 text-gray-700 font-black text-sm flex items-center justify-center active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="text-[10px] font-black text-gray-600 w-4 text-center">{quantity}</span>
        <button
          onClick={onIncrement}
          className="flex-1 h-6 rounded-lg bg-gray-800 text-white font-black text-sm flex items-center justify-center active:scale-90 transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Sticker;