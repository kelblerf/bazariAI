# GitHub a Vercel setup

Projekt uz ma lokalni git repozitar s hlavni vetvi `main`.

## 1. Vytvor GitHub repozitar

Na GitHubu vytvor novy prazdny repozitar, idealne bez `README`, `.gitignore` a licence.

Priklad nazvu:

- `BazariAI`

## 2. Napoj lokalni projekt na GitHub

Po vytvoreni repozitare GitHub ukaze URL ve tvaru:

- `https://github.com/TVUJ-UCET/BazariAI.git`

Pak v projektu spust:

```powershell
git remote add origin https://github.com/TVUJ-UCET/BazariAI.git
git add .
git commit -m "Initial BazariAI project setup"
git push -u origin main
```

Pokud Git pozaduje identitu, nastav ji jednorazove:

```powershell
git config user.name "Tvoje Jmeno"
git config user.email "tvuj@email.cz"
```

## 3. Import do Vercel

1. Prihlas se do `Vercel`.
2. Zvol `Add New Project`.
3. Vyber GitHub repozitar `BazariAI`.
4. Nech framework preset `Next.js`.
5. Pred deployem dopln environment variables.

## 4. Environment Variables

Do Vercelu prepis minimalne:

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
- `CORS_ORIGIN`

Pro `CORS_ORIGIN` pouzij produkcni URL z Vercelu.

## 5. Supabase po deployi

Po prvnim uspesnem deployi otevri `Supabase -> Authentication -> URL Configuration` a dopln:

- `Site URL`
- `Redirect URLs`

Obe hodnoty maji obsahovat produkcni URL z Vercelu.

## 6. Prvni kontrola po nasazeni

1. Otevri domenu aplikace.
2. Otestuj prihlaseni pres magic link.
3. Otevri `/api/health`.
4. Vytvor testovaci inzerat.
5. Vyzkousej upload fotky.
6. Spust jeden AI krok.
