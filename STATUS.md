# FreeLedger — Estado del proyecto

> Snapshot al 1 de mayo de 2026 (fin del Día 3 — auth implementado).
> Stack: Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Sonner · lucide-react.

---

## ✅ Lo que ya está hecho

### Setup del proyecto
- Proyecto Next.js 16 inicializado con App Router, TypeScript, ESLint, `src/`, alias `@/*`.
- Dependencias del MVP instaladas: `@supabase/ssr`, `@supabase/supabase-js`, `recharts`, `resend`, `lucide-react`, `sonner`.
- shadcn/ui inicializado (estilo `base-nova`, color base neutral, CSS variables, RSC).
- Componentes shadcn añadidos: `button`, `card`, `input`, `label`, `dialog`, `dropdown-menu`, `avatar`, `badge`, `separator`, `sheet`, `tabs`, `sonner` (Toaster).
- `tsc --noEmit` limpio. `next build` limpio (6 rutas: `/`, `/login`, `/signup`, `/dashboard`, `/auth/callback`, `/_not-found`) con `Proxy (Middleware)` activo.

### Estructura
```
src/
├── proxy.ts                          — Next 16 middleware (auth route protection)
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx            — login real (Server Component, Google + email/password)
│   │   └── signup/page.tsx           — signup real (Google + email/password + confirm email state)
│   ├── (dashboard)/
│   │   ├── layout.tsx                — sidebar con user info + logout, redirige si no hay sesión
│   │   └── dashboard/page.tsx        — placeholder "Coming soon"
│   ├── auth/callback/route.ts        — exchange OAuth code → session
│   ├── globals.css                   — Tailwind v4 + shadcn tokens
│   ├── layout.tsx                    — fonts (Geist), metadata, OG, Toaster
│   └── page.tsx                      — landing
├── components/
│   ├── auth/
│   │   ├── google-button.tsx         — "Continue with Google" (client, signInWithOAuth)
│   │   ├── login-form.tsx            — email/password con useActionState + Sonner
│   │   └── signup-form.tsx           — name/email/password/confirm + estado "check your email"
│   ├── dashboard/
│   │   └── sign-out-button.tsx       — botón logout (client, useTransition)
│   ├── landing/
│   │   ├── hero.tsx                  — headline + waitlist + mockup CSS
│   │   ├── problem.tsx               — 3 pain points
│   │   ├── features.tsx              — 4 feature cards
│   │   ├── waitlist-form.tsx         — Server Action, useActionState, toast
│   │   └── footer.tsx                — Twitter/GitHub icons inline
│   ├── shared/
│   │   ├── logo.tsx                  — wallet icon + wordmark
│   │   └── animate-on-scroll.tsx     — IntersectionObserver fade-in
│   └── ui/                           — shadcn primitives
├── lib/
│   ├── actions/
│   │   ├── auth.ts                   — signInWithPassword, signUpWithPassword, signOut
│   │   └── waitlist.ts               — joinWaitlist Server Action
│   ├── supabase/client.ts            — browser client
│   ├── supabase/server.ts            — server client (await cookies())
│   └── utils.ts                      — shadcn cn()
└── types/index.ts                    — WaitlistEntry, ActionResult<T>
```

### Landing page
- **Hero**: headline "Know your real money." con gradient verde, subheadline, formulario waitlist y mockup de dashboard 100 % CSS/SVG (sin imágenes externas).
- **Problem**: 3 pain points con iconos `TrendingDown`, `Shuffle`, `AlertTriangle`.
- **Features**: 4 cards con iconos `Wallet`, `Users`, `Calculator`, `FolderTree`.
- **Waitlist CTA**: sección dedicada con formulario y nota "Free plan available at launch".
- **Footer**: logo, link a JDA! Apps, Twitter, GitHub, copyright 2026.
- **Diseño**: fondo `zinc-950`, accent `emerald-500`, fuentes Geist Sans/Mono, dark por defecto, mobile-first.
- **Animaciones**: fade-in + translate-y al hacer scroll mediante `AnimateOnScroll` (IntersectionObserver, threshold 0.15, una sola vez), con stagger de 100 ms en las grids de Problem y Features.

### Funcionalidad waitlist
- Server Action `joinWaitlist` en [src/lib/actions/waitlist.ts](src/lib/actions/waitlist.ts):
  - Valida formato de email con regex.
  - Inserta en tabla `waitlist` de Supabase.
  - Maneja duplicados (`error.code === "23505"`) → "You're already on the list!"
  - Devuelve `WaitlistState { success, message?, error?, timestamp }`.
- Cliente con `useActionState` + `useFormStatus`, dispara toast de Sonner según resultado.

### Auth (Día 3)
- **`proxy.ts`** (Next 16: el archivo se llama `proxy.ts`, no `middleware.ts`, y la función exportada es `proxy()`):
  - Crea `createServerClient` de `@supabase/ssr` con manejo correcto de cookies.
  - Refresca la sesión en cada request (llamando `getUser()`).
  - Si no hay user y la ruta empieza con `/dashboard` → redirige a `/login?next=<pathname>`.
  - Si hay user y la ruta es `/login` o `/signup` → redirige a `/dashboard`.
  - Matcher: `["/dashboard/:path*", "/login", "/signup"]`.
- **Server Actions** en [src/lib/actions/auth.ts](src/lib/actions/auth.ts):
  - `signInWithPassword`: valida email + password, llama `supabase.auth.signInWithPassword`, redirige a `next` (default `/dashboard`).
  - `signUpWithPassword`: valida name/email/password (mínimo 8 caracteres) + confirm match, llama `supabase.auth.signUp` con `data.full_name` y `emailRedirectTo`. No redirige — devuelve "Check your email to confirm your account" para que el cliente muestre estado.
  - `signOut`: llama `supabase.auth.signOut` y redirige a `/`.
- **Callback de OAuth** en [src/app/auth/callback/route.ts](src/app/auth/callback/route.ts):
  - GET handler que recibe `?code=...&next=...`.
  - Intercambia el code por sesión con `exchangeCodeForSession`.
  - Maneja `forwardedHost` para deploys detrás de proxy (Vercel).
  - En error redirige a `/login?error=auth`.
- **Login page** [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx):
  - Server Component que lee `searchParams` (`next`, `error`).
  - Logo + título + GoogleButton + separador "or" + LoginForm + link a signup.
  - Banner rojo si `?error=auth`.
- **Signup page** [src/app/(auth)/signup/page.tsx](src/app/(auth)/signup/page.tsx):
  - Mismo layout. Después de signup exitoso, el form muestra estado "Confirm your email" con email del usuario.
- **Dashboard layout** [src/app/(dashboard)/layout.tsx](src/app/(dashboard)/layout.tsx):
  - Server Component que llama `supabase.auth.getUser()` y redirige a `/login` si no hay user (defensa en profundidad — el proxy ya lo hace, pero los Server Components también deben verificar auth según el guide de Next 16).
  - Sidebar muestra nombre (de `user_metadata.full_name`/`name` o email) y email del usuario.
  - Botón "Sign out" en el footer del sidebar.
- **Diseño coherente** con la landing: fondo `zinc-950`, accent `emerald-500`, mismas fuentes, mismos shadcn primitives (Button, Input, Label, Separator).

### SEO / metadata
- Title template, description, applicationName, keywords, authors.
- Open Graph y Twitter card configurados.
- `metadataBase` desde `NEXT_PUBLIC_APP_URL`.
- Favicon placeholder en `src/app/favicon.ico`.

### Configuración
- `.env.local` y `.env.example` con `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`.
- `README.md` con stack, getting started, SQL schema y estructura.
- `AGENTS.md` recordando que esta versión de Next 16 tiene breaking changes (motivo por el que se usa `proxy.ts` en lugar de `middleware.ts`).

---

## 🔴 Bloqueantes — pasos manuales pendientes (sin esto nada funciona en runtime)

### 1. Reemplazar credenciales reales en `.env.local`
Actualmente el archivo tiene placeholders:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
Reemplazar con `https://wfumqkszpjprqtbcaxmr.supabase.co` y la anon key real desde **supabase.com → tu proyecto → Settings → API**.

### 2. Ejecutar SQL en Supabase
Ir a **SQL Editor → New Query** y correr en orden:

#### a) Tabla `waitlist`
```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Deny public reads" ON waitlist
  FOR SELECT USING (false);
```

#### b) Tabla `users` + trigger de auto-creación
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  country TEXT DEFAULT 'US',
  tax_rate DECIMAL(5,2) DEFAULT 25.00,
  fiscal_year_start INTEGER DEFAULT 1,
  currency TEXT DEFAULT 'USD',
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Configurar Google OAuth

#### Google Cloud Console
1. https://console.cloud.google.com/ → crear/seleccionar proyecto.
2. **APIs & Services → OAuth consent screen** → External, llenar nombre "FreeLedger", emails. Save.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → Web application, nombre "FreeLedger Web".
4. **Authorized redirect URIs** → `https://wfumqkszpjprqtbcaxmr.supabase.co/auth/v1/callback` (es el callback de Supabase, NO el tuyo).
5. Copiar **Client ID** y **Client Secret**.

#### Supabase
1. **Authentication → Providers → Google** → Enable, pegar Client ID + Secret. Save.
2. **Authentication → Providers → Email** → Enable.
3. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (cambiar al dominio de Vercel después).
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://<tu-dominio-vercel>/auth/callback`

### 4. Variables de entorno en Vercel (al hacer deploy)
**Settings → Environment Variables** (Production + Preview + Development):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wfumqkszpjprqtbcaxmr.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu anon key real |
| `NEXT_PUBLIC_APP_URL` | `https://<tu-dominio>.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `FreeLedger` |

Después de añadirlas, **Redeploy** y volver a actualizar Site URL + Redirect URLs en Supabase con el dominio de prod.

---

## 🟡 Recomendado antes de lanzar

5. **Probar el flujo completo localmente** (`npm run dev` → http://localhost:3000):
   - Landing carga, animaciones, waitlist (válido + duplicado).
   - `/login` y `/signup` renderizan, ambos con GoogleButton + form email/password.
   - Signup con email → "Check your email to confirm your account" → confirmar → `/dashboard`.
   - Login con email/password → `/dashboard`.
   - Login con Google → redirige a Google → vuelve a `/dashboard`.
   - `/dashboard` sin sesión → redirige a `/login?next=/dashboard`.
   - `/login` ya autenticado → redirige a `/dashboard`.
   - Sign out (sidebar) → vuelve a `/`.

6. **Open Graph image** (`src/app/opengraph-image.tsx` con `next/og`).
7. **Favicon real** (reemplazar `src/app/favicon.ico`).
8. **Dominio y deploy** en Vercel.
9. **Rate limiting / anti-spam** en waitlist (Cloudflare Turnstile, hCaptcha, o rate-limit por IP).
10. **Analytics** (Vercel Analytics, Plausible, o PostHog).

---

## 🟢 Nice to have (no urgente)

11. **Forgot password flow** — el link en `/login` está como placeholder (`href="#"`). Implementar con `supabase.auth.resetPasswordForEmail`.
12. **Email de bienvenida al unirse a la waitlist** (Resend ya instalado).
13. **Eliminar dependencias no usadas** (`@base-ui/react`, `next-themes`, `tw-animate-css`).
14. **Páginas `/privacy` y `/terms`** linkeadas en footer.
15. **`robots.txt` y `sitemap.xml`** (`src/app/robots.ts` y `src/app/sitemap.ts`).
16. **Tests** (al menos smoke test de los Server Actions de auth y waitlist).
17. **Avatar real en sidebar** — actualmente solo muestra texto. Usar `<Avatar>` de shadcn con `user_metadata.avatar_url` (Google ya lo provee al hacer login OAuth).

---

## 🗺️ Después de auth — siguientes hitos

- **Día 4 — Modelo de datos**: tablas `clients`, `transactions`, `categories`, `tax_settings` con RLS por `user_id`.
- **Onboarding** post-signup: pedir país (para % de impuestos default), monedas, primer cliente.
- **Dashboard real**: ingresos por cliente, expenses con tag business/personal/mixed, tax reserve calculator, "real money" como single number arriba.
- **Charts** con `recharts`: ingreso mensual, distribución por cliente, evolución del tax reserve.

---

## 📍 Comandos rápidos

```bash
npm run dev            # http://localhost:3000
npm run build          # production build
npx tsc --noEmit       # typecheck
npm run lint           # eslint
```

---

## 📝 Notas de Next.js 16

- **`middleware.ts` → `proxy.ts`**: el archivo de middleware fue renombrado en Next 16. La función exportada es `proxy()` (no `middleware()`). El build lo confirma con la línea `ƒ Proxy (Middleware)` en el output.
- **Auth en profundidad**: el guide de Next 16 advierte que el proxy *no* es suficiente como única capa de auth (un cambio de matcher o un refactor de Server Actions puede dejar rutas desprotegidas silenciosamente). Por eso el dashboard layout también verifica `supabase.auth.getUser()`.
- Si hay duda sobre alguna API de Next 16, leer primero `node_modules/next/dist/docs/` antes de asumir comportamiento de versiones anteriores.
