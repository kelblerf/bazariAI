# Deployment na Vercel

Projekt je pripraveny pro nasazeni na `Vercel` jako `Next.js` aplikace s `Node.js` API routami.

## Pred nasazenim

- zkontroluj, ze produkcni databaze v `Supabase` uz obsahuje schema z `prisma/schema.prisma`
- pocitej s tim, ze `Prisma Client` se pri instalaci generuje automaticky pres `postinstall`
- produkcni frontend i backend pobezi idealne na stejne domene, takze `NEXT_PUBLIC_API_BASE_URL` neni nutne nastavovat

## Environment Variables ve Vercel

Z lokalniho `.env` prepis do Vercelu tyto promenne:

- `OPENAI_API_KEY`
- `OPENAI_PROFILE`
- `OPENAI_MODEL_FAST`
- `OPENAI_MODEL_SMART`
- `OPENAI_ENABLE_WEB_SEARCH_IDENTIFICATION`
- `OPENAI_ENABLE_WEB_SEARCH_ANALYSIS`
- `OPENAI_ENABLE_WEB_SEARCH_PRICING`
- `DATABASE_URL`
- `DIRECT_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `CORS_ORIGIN`

Pro `CORS_ORIGIN` pouzij produkcni URL aplikace, napriklad `https://bazariai.vercel.app`.
Pro `NEXT_PUBLIC_SITE_URL` pouzij stejnou stabilni produkcni URL, aby `magic link` prihlaseni nevytvarelo odkazy na docasny deployment.

## Postup nasazeni

1. Importuj repozitar do `Vercel`.
2. Nech vybrany framework preset `Next.js`.
3. Doplnene environment variables uloz pro `Production`.
4. Spust prvni deploy.
5. Po uspesnem deployi otevri `Supabase Auth` a dopln produkcni URL do `Site URL` a `Redirect URLs`.

## Co zkontrolovat po deployi

1. Otevri `/api/health` a over, ze endpoint odpovida.
2. Vyzkousej prihlaseni pres magic link.
3. Vytvor testovaci inzerat.
4. Nahraj jednu fotku a over, ze se vytvori public URL ze `Supabase Storage`.
5. Spust jeden AI krok a over, ze funguje volani na `OpenAI`.

## Zname poznamky

- API routy jsou nastaveny na `runtime = "nodejs"`, coz je pro `Prisma` a serverove integrace spravne.
- Upload routa umi bucket v `Supabase Storage` vytvorit automaticky, pokud ma service role dostatecna opravneni.
- Pokud by byl frontend nekdy oddeleny na jinou domenu, `CORS_ORIGIN` uz musi odpovidat te konkretni domene.
