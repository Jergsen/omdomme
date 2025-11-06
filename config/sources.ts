export const SOURCES: { name: string; url: string }[] = [
  { name: 'VG', url: 'https://www.vg.no/rss/feed' },
  { name: 'NRK', url: 'https://www.nrk.no/toppsaker.rss' },
  { name: 'TV2', url: 'https://www.tv2.no/rss/' },
  { name: 'Dagbladet', url: 'https://www.dagbladet.no/rss.xml' },
  { name: 'E24', url: 'https://e24.no/rss' },
  { name: 'Aftenposten', url: 'https://www.aftenposten.no/rss' },
  { name: 'Dagens Næringsliv', url: 'https://www.dn.no/rss' },
  { name: 'Nettavisen', url: 'https://www.nettavisen.no/rss' },
  { name: 'Finansavisen', url: 'https://finansavisen.no/rss' },
  { name: 'Adressa', url: 'https://www.adressa.no/rss' }
];

export const SOURCE_DOMAINS = SOURCES.map((s) => new URL(s.url).hostname.replace(/^www\./, ''));
