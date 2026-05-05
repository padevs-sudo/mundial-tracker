import React, { useMemo } from 'react';

const StatsView = ({ stickers, progress }) => {
  const sectionStats = useMemo(() => {
    const groups = {};
    stickers.forEach(s => {
      const section = s.team_name || 'General';
      if (!groups[section]) groups[section] = { total: 0, obtained: 0 };
      groups[section].total++;
      if ((progress[s.id] || 0) > 0) groups[section].obtained++;
    });
    return Object.entries(groups)
      .map(([name, data]) => ({
        name, ...data,
        percent: Math.floor((data.obtained / data.total) * 100)
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [stickers, progress]);

  const total = stickers.length;
  const obtained = stickers.filter(s => (progress[s.id] || 0) > 0).length;
  const repeated = stickers.reduce((acc, s) => acc + (progress[s.id] > 1 ? progress[s.id] - 1 : 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-2xl font-black text-green-500">{obtained}</p>
          <p className="text-[9px] font-black text-gray-400 uppercase">Tengo</p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-2xl font-black text-gray-800">{total - obtained}</p>
          <p className="text-[9px] font-black text-gray-400 uppercase">Faltan</p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-2xl font-black text-red-500">{repeated}</p>
          <p className="text-[9px] font-black text-gray-400 uppercase">Repetidas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-3 border-b">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progreso por equipo</h2>
        </div>
        {sectionStats.map(section => (
          <div key={section.name} className="px-3 py-2 border-b last:border-0">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-black text-gray-800 truncate flex-1">{section.name}</p>
              <p className="text-[10px] font-black text-gray-500 ml-2">{section.obtained}/{section.total}</p>
              <p className="text-[10px] font-black text-gray-800 ml-2 w-8 text-right">{section.percent}%</p>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${section.percent}%`,
                  backgroundColor: section.percent === 100 ? '#22c55e' : section.percent > 50 ? '#3b82f6' : '#f97316'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsView;