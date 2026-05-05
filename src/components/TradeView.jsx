import React, { useMemo } from 'react';

const TradeView = ({ stickers, myProgress, otherProgress, user, otherUser }) => {
  const { canGive, canReceive } = useMemo(() => {
    const canGive = stickers.filter(s =>
      (myProgress[s.id] || 0) > 1 && (otherProgress[s.id] || 0) === 0
    );
    const canReceive = stickers.filter(s =>
      (otherProgress[s.id] || 0) > 1 && (myProgress[s.id] || 0) === 0
    );
    return { canGive, canReceive };
  }, [stickers, myProgress, otherProgress]);

  const Section = ({ title, subtitle, items, color, emptyMsg }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className={`p-3 ${color}`}>
        <h2 className="text-xs font-black text-white uppercase tracking-widest">{title}</h2>
        <p className="text-white/70 text-[10px] font-bold">{subtitle}</p>
      </div>
      {items.length === 0 ? (
        <div className="p-6 text-center text-gray-400">
          <p className="text-xs font-black uppercase">{emptyMsg}</p>
        </div>
      ) : (
        <div className="p-3 flex flex-wrap gap-2">
          {items.map(s => (
            <div key={s.id} className="bg-gray-100 rounded-lg px-2 py-1 text-center min-w-[56px]">
              <p className="text-[10px] font-black text-gray-600">{s.id}</p>
              <p className="text-[9px] text-gray-400 truncate max-w-[60px]">{s.name || s.team_sigla}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Section
        title={`${user} puede dar a ${otherUser}`}
        subtitle={`${canGive.length} estampas disponibles`}
        items={canGive}
        color="bg-green-500"
        emptyMsg="No tienes repetidas que le falten"
      />
      <Section
        title={`${otherUser} puede dar a ${user}`}
        subtitle={`${canReceive.length} estampas disponibles`}
        items={canReceive}
        color="bg-blue-500"
        emptyMsg="No hay intercambios disponibles"
      />
    </div>
  );
};

export default TradeView;