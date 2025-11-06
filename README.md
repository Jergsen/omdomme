# OmdømmeLand

En MVP for en nøkkelorddrevet omdømme-feed bygget på Next.js (App Router), Prisma og en enkel ingest-prosess for norske RSS-kilder.

## Kom i gang

```bash
npm install
npx prisma migrate deploy  # eller prisma db push i utvikling
npm run seed
npm run dev
```

Applikasjonen forventer en `.env` basert på `.env.example`. I utvikling benyttes SQLite (`file:./prisma/dev.db`).

### Viktige mapper

- `app/` – Next.js App Router med API-endepunkter og UI-komponenter.
- `components/feed` – Feed, filter og statistikk-komponenter.
- `config/` – RSS-kilder og reach-vekter.
- `ingest/rss.ts` – Cronstyrt RSS-innhenting, berikelse og lagring av artikler.
- `services/` – Berikning (nøkkelordmatch, sentiment, fokus, reach og PR-score).
- `prisma/` – Databaseskjema og seed-data.

## Funksjonelt overblikk

- Poller en forhåndsdefinert liste norske RSS-kilder hvert 10. minutt (ENV-styrt) og dedupliserer på URL + publiseringstidspunkt.
- Beriker hver artikkel med sentiment, fokusnivå, reach og PR-score, samt kobling mot profiler, drivere og talspersoner.
- Tilgjengeliggjør REST-endepunkter for feed og tidsseriestatistikk, samt CRUD-endepunkter for profiler, nøkkelord, drivere og talspersoner.
- Viser en feed i sanntid med filtre, nøkkelindikatorer og en enkel trendgraf.

## Videre arbeid

- Koble filtrene i UI-et mot API-et for ekte sanntidsfiltrering.
- Utvide sentiment- og fokusmodellene med mer domene-spesifikk logikk eller eksterne tjenester.
- Legge til robust køhåndtering (BullMQ) og retry/backoff ved hente-feil.
- Implementere lisensierte datakilder og avanserte analyser (NER, sitatdeteksjon m.m.).
