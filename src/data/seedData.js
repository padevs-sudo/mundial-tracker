export const teams = [
  { group: 'A', name: 'México', sigla: 'MEX' },
  { group: 'A', name: 'Sudáfrica', sigla: 'RSA' },
  { group: 'A', name: 'Corea del Sur', sigla: 'KOR' },
  { group: 'A', name: 'Rep. Checa', sigla: 'CZE' },
  { group: 'B', name: 'Canadá', sigla: 'CAN' },
  { group: 'B', name: 'Bosnia', sigla: 'BIH' },
  { group: 'B', name: 'Catar', sigla: 'QAT' },
  { group: 'B', name: 'Suiza', sigla: 'SUI' },
  { group: 'C', name: 'Brasil', sigla: 'BRA' },
  { group: 'C', name: 'Marruecos', sigla: 'MAR' },
  { group: 'C', name: 'Haití', sigla: 'HAI' },
  { group: 'C', name: 'Escocia', sigla: 'SCO' },
  { group: 'D', name: 'EE.UU.', sigla: 'USA' },
  { group: 'D', name: 'Paraguay', sigla: 'PAR' },
  { group: 'D', name: 'Australia', sigla: 'AUS' },
  { group: 'D', name: 'Turquía', sigla: 'TUR' },
  { group: 'E', name: 'Alemania', sigla: 'GER' },
  { group: 'E', name: 'Curazao', sigla: 'CUW' },
  { group: 'E', name: 'Costa Marfil', sigla: 'CIV' },
  { group: 'E', name: 'Ecuador', sigla: 'ECU' },
  { group: 'F', name: 'Países Bajos', sigla: 'NED' },
  { group: 'F', name: 'Japón', sigla: 'JPN' },
  { group: 'F', name: 'Suecia', sigla: 'SWE' },
  { group: 'F', name: 'Túnez', sigla: 'TUN' },
  { group: 'G', name: 'Bélgica', sigla: 'BEL' },
  { group: 'G', name: 'Egipto', sigla: 'EGY' },
  { group: 'G', name: 'Irán', sigla: 'IRN' },
  { group: 'G', name: 'N. Zelanda', sigla: 'NZL' },
  { group: 'H', name: 'España', sigla: 'ESP' },
  { group: 'H', name: 'Cabo Verde', sigla: 'CPV' },
  { group: 'H', name: 'Arabia Saudí', sigla: 'KSA' },
  { group: 'H', name: 'Uruguay', sigla: 'URU' },
  { group: 'I', name: 'Francia', sigla: 'FRA' },
  { group: 'I', name: 'Senegal', sigla: 'SEN' },
  { group: 'I', name: 'Irak', sigla: 'IRQ' },
  { group: 'I', name: 'Noruega', sigla: 'NOR' },
  { group: 'J', name: 'Argentina', sigla: 'ARG' },
  { group: 'J', name: 'Argelia', sigla: 'ALG' },
  { group: 'J', name: 'Austria', sigla: 'AUT' },
  { group: 'J', name: 'Jordania', sigla: 'JOR' },
  { group: 'K', name: 'Portugal', sigla: 'POR' },
  { group: 'K', name: 'RD Congo', sigla: 'COD' },
  { group: 'K', name: 'Uzbekistán', sigla: 'UZB' },
  { group: 'K', name: 'Colombia', sigla: 'COL' },
  { group: 'L', name: 'Inglaterra', sigla: 'ENG' },
  { group: 'L', name: 'Croacia', sigla: 'CRO' },
  { group: 'L', name: 'Ghana', sigla: 'GHA' },
  { group: 'L', name: 'Panamá', sigla: 'PAN' }
];

// ... (mantenemos la lista de teams igual)

export const generateStickers = () => {
  const allStickers = [];

  // 1. Intro (00 + FWC 1-8) = 9 estampas
  allStickers.push({ id: '00', name: 'Logo Panini', team_name: 'FWC Inicio', team_sigla: 'FWC', is_special: true });
  for (let i = 1; i <= 8; i++) {
    allStickers.push({ id: `FWC-${i}`, name: `Intro ${i}`, team_name: 'FWC Inicio', team_sigla: 'FWC', is_special: true });
  }

  // 2. 48 Países (960 estampas)
  teams.forEach(team => {
    for (let i = 1; i <= 20; i++) {
      allStickers.push({
        id: `${team.sigla}-${i}`,
        name: i === 1 ? 'Escudo' : i === 13 ? 'Equipo' : `Jugador ${i}`,
        team_name: team.name,
        team_sigla: team.sigla,
        is_special: (i === 1 || i === 13)
      });
    }
  });

  // 3. Cierre (FWC 10-19) = 10 estampas
  for (let i = 9; i <= 19; i++) {
    allStickers.push({ id: `FWC-${i}`, name: `Final ${i}`, team_name: 'FWC Final', team_sigla: 'FWC', is_special: true });
  }

  // TOTAL: 9 + 960 + 10 = 979 Estampas.

  // 4. Coca-Cola (Extra)
  for (let i = 1; i <= 14; i++) {
    allStickers.push({ id: `COCA-${i}`, name: `Coca-Cola ${i}`, team_name: 'Extra', team_sigla: 'COCA', is_special: true });
  }

  return allStickers;
};