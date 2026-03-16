## Ohm Joga

Modern, premium yoga website rebuild in Hungarian with:

- public marketing site
- booking flow
- blog / knowledge base
- admin dashboard
- Supabase-ready data layer
- media upload endpoint

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth / Database / Storage
- Resend-compatible email sending

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start development:

```bash
npm run dev
```

4. Optional Supabase setup:

- apply `/H:/Attila Yoga/supabase/schema.sql`
- create an admin user in Supabase Auth
- insert that auth user id into `public.admin_users`

## Preview admin

If Supabase is not configured, the app falls back to preview admin mode:

- email: `admin@ohm-joga.hu`
- password: `preview123`

## Build checks

```bash
npm run lint
npm run build
```
