# Feestcafé Lotje — website + beheeromgeving

Next.js 15 (App Router) site met eigen CMS op `/admin`. Draait op Vercel; alle content, foto's en aanvragen staan in **Vercel Blob** (geen aparte database nodig).

## Live zetten (± 10 minuten)

1. **GitHub** — maak een nieuwe (private) repo en push deze map:
   ```bash
   git init && git add . && git commit -m "Feestcafé Lotje"
   git branch -M main
   git remote add origin https://github.com/<jouw-account>/lotje-zeewolde.git
   git push -u origin main
   ```
2. **Vercel** — *Add New → Project* → importeer de repo. Framework wordt automatisch herkend.
3. **Environment variables** (Settings → Environment Variables):
   | Naam | Waarde |
   |---|---|
   | `ADMIN_EMAIL` | inlog-e-mail voor `/admin` (bijv. `admin@lotje.nl`) |
   | `ADMIN_PASSWORD` | sterk wachtwoord |
   | `SESSION_SECRET` | lange willekeurige string (bijv. `openssl rand -hex 32`) |
4. **Opslag koppelen** — tabblad *Storage → Create → Blob* → koppel aan dit project. Vercel zet `BLOB_READ_WRITE_TOKEN` automatisch.
5. **Redeploy** (Deployments → ⋯ → Redeploy) zodat de variabelen actief zijn.
6. Ga naar `https://<project>.vercel.app/admin`, log in en upload via **Pagina's → home** de hero- en CTA-foto.
7. Domein: Settings → Domains → `lotjezeewolde.nl` toevoegen en de DNS-records bij de registrar aanpassen.

### Optioneel: aanvragen ook per mail
Aanvragen komen altijd binnen onder **Aanvragen** in de beheeromgeving. Wil je ze ook per mail:
maak een account op [resend.com](https://resend.com), verifieer het domein en zet
`RESEND_API_KEY`, `CONTACT_TO` en `CONTACT_FROM` (zie `.env.example`).

## Beheeromgeving (`/admin`)

- **Dashboard** — tellers + laatste aanvragen
- **Pagina's** — alle teksten en foto's van Home, Evenementen, Foto's en Contact.
  `*woord*` in een titel = schuine serif-letter; een punt/vraagteken aan het eind krijgt de accentkleur.
- **Styling** — 10 huisstijlkleuren met kleurpicker en live voorbeeld
- **Instellingen** — Google Analytics (GA4 ID), contact, socials, adres, openingstijden
- **Evenementen** — agenda met categorie (Live/DJ/Feest/Quiz), status en promotieafbeelding. Verlopen events verdwijnen automatisch van de site.
- **Fotobibliotheek** — mappen met foto's. Zichtbare mappen staan automatisch op `/fotos`; met de shortcode `[album map-slug]` zet je een map op elke pagina (veld *Extra inhoud*).
- **Aanvragen** — inzendingen van het contactformulier

Foto's worden in de browser verkleind (max 2000px) vóór upload. Elke opslag bewaart een nieuwe versie; de laatste 10 blijven als backup in Blob staan (`content/`).

## Lokaal draaien

```bash
npm install
npm run dev        # http://localhost:3000 — admin: admin@lotje.nl / lotje
```
Zonder `BLOB_READ_WRITE_TOKEN` wordt alles lokaal opgeslagen in `.data/`.

## Structuur

```
app/(site)/        publieke pagina's (home, evenementen, fotos, contact)
app/admin/         beheeromgeving + login
app/api/           login/logout, content, upload, aanvragen, contactformulier
lib/defaults.ts    standaardteksten + welke velden per pagina bewerkbaar zijn
lib/store.ts       opslag (Vercel Blob / lokaal)
middleware.ts      beveiliging van /admin en /api/admin
```

Fonts zijn zelf-gehost via `@fontsource` (geen verzoeken naar Google — AVG-vriendelijk).
