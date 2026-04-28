# BazariAI

`Next.js` aplikace pro tvorbu a správu bazarových inzerátů s AI asistencí, databází v `Supabase` a ukládáním fotek do `Supabase Storage`.

## Aktuální stav

- hlavní aplikace běží už jen přes `Next.js`
- inzeráty se ukládají do `Supabase` přes `Prisma`
- fotky se nahrávají přes backend do `Supabase Storage`
- AI kroky (`Identifikace`, `Analýza`, `Cena`, `Inzerát`) běží přes serverové `/api/ai/*` endpointy

## Spuštění

```bash
copy .env.example .env
npm install
npm run dev
```

Aplikace poběží na:

- `http://localhost:3000`

## Důležité proměnné v `.env`

```bash
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[HESLO]@aws-1-[REGION].pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres:[HESLO]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_service_role_...
SUPABASE_STORAGE_BUCKET=bazariai-photos
```

## AI profil

Výchozí doporučené nastavení je `balanced`:

- `OPENAI_PROFILE=balanced`
- `OPENAI_MODEL_FAST=gpt-5.4-mini`
- `OPENAI_MODEL_SMART=gpt-5.4`
- `OPENAI_ENABLE_WEB_SEARCH_IDENTIFICATION=true`
- `OPENAI_ENABLE_WEB_SEARCH_ANALYSIS=true`
- `OPENAI_ENABLE_WEB_SEARCH_PRICING=false`

Pokud později vyjde novější model, obvykle stačí změnit jen:

- `OPENAI_MODEL_FAST`
- `OPENAI_MODEL_SMART`

## Databáze

Po prvním nastavení databáze spusť:

```bash
npm run db:generate
npm run db:push
```

Tím se připraví `Prisma Client` a synchronizuje tabulka `listings`.
Po přidání auth kroku spusť `npm run db:push` znovu, protože `Listing` nově ukládá i vlastníka (`userId`, `userEmail`).

## Poznámka

Starý `Vite` frontend a `react-router` vrstva byly z projektu odstraněny. Projekt je po migraci sjednocený na `Next.js`.
