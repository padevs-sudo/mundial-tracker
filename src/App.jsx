import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from './lib/supabaseClient';
import Sticker from './components/Sticker';
import StatsView from './components/StatsView';
import TradeView from './components/TradeView';
import ShareView from './components/ShareView';

function App() {
  const [user, setUser] = useState(localStorage.getItem('album_user'));
  const [stickers, setStickers] = useState([]);
  const [progress, setProgress] = useState({});
  const [otherProgress, setOtherProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');
  const [mainView, setMainView] = useState('album');
  const [searchQuery, setSearchQuery] = useState('');

  const otherUser = user === 'PV' ? 'DV' : 'PV';

  const theme = useMemo(() => {
    if (user === 'PV') return { header: 'bg-sky-500', bar: 'bg-sky-200', button: 'bg-sky-700' };
    if (user === 'DV') return { header: 'bg-red-600', bar: 'bg-red-900', button: 'bg-red-800' };
    return { header: 'bg-[#9EDBBE]', bar: 'bg-red-900', button: 'bg-[#6d0a27]' };
  }, [user]);

  useEffect(() => {
    if (user) fetchAlbumData();
  }, [user]);

  async function fetchAlbumData() {
    try {
      setLoading(true);
      const { data: sData, error: sError } = await supabase
        .from('stickers').select('*').order('display_order', { ascending: true });
      if (sError) throw sError;

      const { data: pData, error: pError } = await supabase
        .from('user_progress').select('sticker_id, quantity').eq('profile_name', user);
      if (pError) throw pError;

      const { data: oData } = await supabase
        .from('user_progress').select('sticker_id, quantity').eq('profile_name', otherUser);

      setStickers(sData || []);

      const progressMap = {};
      pData?.forEach(item => { progressMap[item.sticker_id] = item.quantity; });
      setProgress(progressMap);

      const otherMap = {};
      oData?.forEach(item => { otherMap[item.sticker_id] = item.quantity; });
      setOtherProgress(otherMap);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateQuantity = async (stickerId, newQuantity) => {
    if (newQuantity < 0) return;
    const oldQty = progress[stickerId] || 0;
    setProgress(prev => ({ ...prev, [stickerId]: newQuantity }));
    const { error } = await supabase.from('user_progress').upsert({
      profile_name: user, sticker_id: stickerId, quantity: newQuantity
    }, { onConflict: 'profile_name, sticker_id' });
    if (error) {
      console.error("Error al guardar:", error);
      setProgress(prev => ({ ...prev, [stickerId]: oldQty }));
    }
  };

  const stats = useMemo(() => {
    if (!stickers.length) return { countUniques: 0, countRepeated: 0, countMissing: 0, progPercent: 0 };
    const countUniques = stickers.filter(s => (progress[s.id] || 0) > 0).length;
    const countRepeated = stickers.reduce((acc, s) => acc + (progress[s.id] > 1 ? progress[s.id] - 1 : 0), 0);
    const total = stickers.length;
    return {
      countUniques, countRepeated,
      countMissing: total - countUniques,
      progPercent: total > 0 ? Math.floor((countUniques / total) * 100) : 0
    };
  }, [stickers, progress]);

  const groupedStickers = useMemo(() => {
    let filtered = stickers;
    if (filter === 'Tengo') filtered = stickers.filter(s => (progress[s.id] || 0) > 0);
    if (filter === 'Faltantes') filtered = stickers.filter(s => (progress[s.id] || 0) === 0);
    if (filter === 'Repetidas') filtered = stickers.filter(s => (progress[s.id] || 0) > 1);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.team_name?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
      );
    }

    const groups = {};
    filtered.forEach(s => {
      const section = s.team_name || 'General';
      if (!groups[section]) groups[section] = [];
      groups[section].push(s);
    });
    return groups;
  }, [stickers, progress, filter, searchQuery]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#9EDBBE] flex flex-col items-center justify-center p-6 text-white font-black">
        <h1 className="text-5xl italic mb-12 tracking-tighter uppercase">Album 2026</h1>
        <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
          <button onClick={() => { localStorage.setItem('album_user', 'PV'); setUser('PV'); }} className="bg-white text-sky-500 h-32 rounded-2xl text-4xl shadow-2xl active:scale-95 border-b-8 border-sky-200">PV</button>
          <button onClick={() => { localStorage.setItem('album_user', 'DV'); setUser('DV'); }} className="bg-green-600 text-white h-32 rounded-2xl text-4xl shadow-2xl active:scale-95 border-b-8 border-red-800">DV</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#9EDBBE] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black animate-pulse uppercase">Sincronizando Album...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'album',  label: 'Álbum',       icon: '⁛' },
    { id: 'stats',  label: 'Stats',       icon: '%' },
    { id: 'trade',  label: 'Intercambio', icon: '⇄' },
    { id: 'share',  label: 'Compartir',   icon: '☍' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className={`${theme.header} text-white p-4 sticky top-0 z-50 shadow-xl`}>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="font-black italic text-xl">MUNDIAL 2026</h1>
            <p className="text-[10px] opacity-70 font-bold">{user}</p>
          </div>
          <p className="text-3xl font-black">{stats.progPercent}%</p>
        </div>
        <div className={`w-full ${theme.bar} h-3 rounded-full overflow-hidden p-0.5 mb-4`}>
          <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${stats.progPercent}%` }} />
        </div>

        {mainView === 'album' && (
          <>
            <div className={`flex ${theme.button} p-1 rounded-xl gap-1 mb-2`}>
              {['Todas', 'Tengo', 'Faltantes', 'Repetidas'].map(v => (
                <button key={v} onClick={() => setFilter(v)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === v ? 'bg-white text-gray-800' : 'text-white opacity-50'}`}>{v}</button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Buscar jugador, equipo o ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm text-gray-800 font-semibold bg-white/90 placeholder-gray-400 outline-none"
            />
          </>
        )}
      </header>

      <main className="p-3 max-w-3xl mx-auto">
        {mainView === 'album' && (
          <>
            {Object.keys(groupedStickers).length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="font-black uppercase text-sm">Sin resultados</p>
              </div>
            )}
            {Object.keys(groupedStickers).map(section => (
              <div key={section} className="mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1 flex justify-between border-b pb-1">
                  {section} <span>{groupedStickers[section].length}</span>
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {groupedStickers[section].map(s => (
                    <Sticker key={s.id} sticker={s} profile={user}
                      quantity={progress[s.id] || 0}
                      onIncrement={() => updateQuantity(s.id, (progress[s.id] || 0) + 1)}
                      onDecrement={() => updateQuantity(s.id, (progress[s.id] || 0) - 1)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {mainView === 'stats' && <StatsView stickers={stickers} progress={progress} />}
        {mainView === 'trade' && <TradeView stickers={stickers} myProgress={progress} otherProgress={otherProgress} user={user} otherUser={otherUser} />}
        {mainView === 'share' && <ShareView stickers={stickers} progress={progress} user={user} />}
      </main>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center max-w-3xl mx-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setMainView(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all ${mainView === tab.id ? 'text-gray-900' : 'text-gray-400'}`}>
              <span className="text-xl">{tab.icon}</span>
              <span className={`text-[9px] font-black uppercase ${mainView === tab.id ? 'text-gray-900' : 'text-gray-400'}`}>{tab.label}</span>
            </button>
          ))}
          <button onClick={() => { localStorage.removeItem('album_user'); setUser(null); }}
            className="flex-1 flex flex-col items-center py-3 gap-0.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span className="text-[9px] font-black uppercase">Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;