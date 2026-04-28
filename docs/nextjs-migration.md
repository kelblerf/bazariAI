# BazariAI: Migrace do Next.js

## Proc do toho jit

- `Next.js` sjednoti frontend a bezpecny backend do jedne aplikace.
- OpenAI klic a AI logika zustanou jen na serveru.
- Pripravime lepsi zaklad pro databazi, autentizaci a produkcni nasazeni.

## Doporucena cilova architektura

- `Next.js App Router`
- `Route Handlers` pro AI endpointy
- `Prisma` jako ORM
- `SQLite` pro lokalni vyvoj
- `PostgreSQL` pro produkci
- objektove uloziste pro fotky

## Proc neprepisovat vse najednou

- Soucasna aplikace uz funguje a umi realne AI kroky.
- Jednorazovy prepis by zvysil riziko rozbiti formularu, uploadu i promptingu.
- Postupna migrace umozni po kazdem kroku zachovat funkcni verzi.

## Kroky migrace

### Krok 1

Pripravit `Next.js` kostru vedle aktualni Vite aplikace.

### Krok 2

Presunout AI endpointy z `server/index.js` a `server/services/*` do `app/api/*`.

Stav:

- hotove route handlery `app/api/ai/identify`
- hotove route handlery `app/api/ai/analyze`
- hotove route handlery `app/api/ai/price`
- hotove route handlery `app/api/ai/generate`
- stale se pouziva stejna sdilena AI logika ze `server/services/ai-service.js`

To znamena, ze uz ted lze pustit Vite frontend proti `Next.js` API bez zmeny promptu a obchodni logiky.

### Krok 3

Nahradit `localStorage` databazi:

- lokalne `SQLite`
- produkcne `PostgreSQL`

### Krok 4

Nahradit lokalni data URL u fotek za realne uloziste souboru.

### Krok 5

Migrovat stranky a editor inzeratu z `react-router-dom` do `Next.js App Router`.

## Doporuceni k databazi

Nejbezpecnejsi start:

- lokalne `Prisma + SQLite`
- pozdeji produkcne `Prisma + PostgreSQL`

To je lepsi nez zavadet hned na zacatku produkcni cloud databazi, kdyz jeste stale migrujeme frontend i backend.
