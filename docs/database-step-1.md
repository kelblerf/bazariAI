# Databaze: krok 1

V tomto kroku je pripraveny pouze zaklad:

- `Prisma`
- schema `Listing`
- `DATABASE_URL` v `.env` pro aplikaci
- `DIRECT_URL` v `.env` pro Prisma CLI

## Co udelat ted

0. Zkontrolovat, ze:

- `DATABASE_URL` pouziva `Session pooler`
- `DIRECT_URL` pouziva primy `db.[PROJECT-REF].supabase.co:5432`

1. `npm install`
2. `npm run db:generate`
3. `npm run db:push`

## Co se stane

- Prisma si vygeneruje klienta
- v Supabase vznikne tabulka `listings`

## Co se jeste nedeje

- aplikace jeste stale pouziva `localStorage`
- fotky jeste stale nejsou v Supabase Storage
- Next.js API jeste necita inzeraty z databaze

To prijde az v dalsim kroku.
