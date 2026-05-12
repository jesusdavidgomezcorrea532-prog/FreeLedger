# FreeLedger — Estado del proyecto

> Snapshot al 12 de mayo de 2026 (fin del Día 10 — Emails transaccionales con Resend: welcome, waitlist confirmation, upgrade confirmation. Checklist E2E manual creada).
> Stack: Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Recharts · Resend · Sonner · lucide-react · next-themes.

---

## ✅ Lo que ya está hecho

### Setup del proyecto
- Proyecto Next.js 16 inicializado con App Router, TypeScript, ESLint, `src/`, alias `@/*`.
- Dependencias del MVP instaladas: `@supabase/ssr`, `@supabase/supabase-js`, `recharts`, `resend`, `lucide-react`, `sonner`.
- shadcn/ui inicializado (estilo `base-nova`, color base neutral, CSS variables, RSC).
- Componentes shadcn añadidos: `button`, `card`, `input`, `label`, `dialog`, `dropdown-menu`, `avatar`, `badge`, `separator`, `sheet`, `tabs`, `sonner` (Toaster).
- `tsc --noEmit` limpio. `next build` limpio (11 rutas) con `Proxy (Middleware)` activo.

### Rutas finales (post Día 6)
```
/                         landing (estática) — con theme toggle
/login                    auth — email/password + Google
/signup                   auth — email/password + Google
/auth/callback            OAuth code exchange
/onboarding               wizard de 3 pasos (post-signup)
/dashboard                Real Money Dashboard — summary cards + 3 charts + alerts + quick actions + recent transactions
/dashboard/income         CRUD ingresos + month picker + filtros (cliente/status/search) + sorting
/dashboard/expenses       CRUD gastos + month picker + filtros (categoría/tipo/search) + sorting
/dashboard/clients        CRUD clientes + delete confirm
/dashboard/settings       perfil + ajustes financieros + export CSV (income/expenses/all) + danger zone
/api/export/income        Route Handler — CSV de income filtrado por user_id
/api/export/expenses      Route Handler — CSV de expenses filtrado por user_id
/api/export/all           Route Handler — CSV combinado income + expenses + clients
```

`next build` verificado: 16 rutas, 0 errores. `tsc --noEmit` limpio.

### Estructura
```
src/
├── proxy.ts                                — Next 16 middleware (auth route protection)
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                      — auth gate (Server Component)
│   │   ├── onboarding/page.tsx             — wizard standalone (sin sidebar)
│   │   └── dashboard/
│   │       ├── layout.tsx                  — sidebar + mobile nav + theme toggle + KeyboardShortcuts
│   │       ├── page.tsx                    — dashboard con quick actions, alerts, charts
│   │       ├── clients/page.tsx
│   │       ├── income/page.tsx             — lee searchParams (filtros + sort) y los pasa al client
│   │       ├── expenses/page.tsx           — lee searchParams (filtros + sort) y los pasa al client
│   │       └── settings/page.tsx
│   ├── api/
│   │   └── export/
│   │       ├── income/route.ts             — GET CSV income (auth + filtro user_id)
│   │       ├── expenses/route.ts           — GET CSV expenses (auth + filtro user_id)
│   │       └── all/route.ts                — GET CSV combinado income+expenses+clients con headers de sección
│   ├── auth/callback/route.ts
│   ├── globals.css
│   ├── layout.tsx                          — ThemeProvider (next-themes, default dark, enableSystem)
│   └── page.tsx                            — landing con theme toggle en nav
├── components/
│   ├── auth/                               — google-button, login-form, signup-form (con dark variants)
│   ├── clients/
│   │   ├── client-form-dialog.tsx          — Dialog create/edit con color picker
│   │   ├── clients-page-client.tsx         — lista + empty state + data-shortcut-new
│   │   └── delete-confirm-dialog.tsx       — Dialog reusable (también usado en income/expenses)
│   ├── dashboard/
│   │   ├── nav-items.ts                    — definición de las 5 entradas del sidebar
│   │   ├── sidebar-nav.tsx                 — links con active state (usePathname)
│   │   ├── mobile-nav.tsx                  — Sheet de shadcn para móvil
│   │   ├── month-picker.tsx                — control de mes/año reusable (router.push con searchParams)
│   │   ├── sign-out-button.tsx
│   │   ├── quick-actions.tsx               — botones "+ Add income" / "+ Add expense" con ?action=new (Día 6)
│   │   ├── dashboard-alerts.tsx            — pending banner + concentration warning (Día 6)
│   │   ├── keyboard-shortcuts.tsx          — wrapper que monta los shortcuts globales (Día 6)
│   │   ├── summary-cards.tsx               — Real Money card (con mini bar chart) + 4 metric cards
│   │   ├── monthly-trend-chart.tsx         — Recharts LineChart con useChartTheme (Día 6: theme reactive)
│   │   ├── income-by-client-chart.tsx      — Recharts PieChart con useChartTheme
│   │   ├── expenses-by-category-chart.tsx  — Recharts BarChart con useChartTheme
│   │   ├── recent-transactions.tsx         — últimas 5 transacciones (income + expenses combinados)
│   │   └── empty-dashboard.tsx             — welcome state cuando no hay datos (3 action cards)
│   ├── expenses/
│   │   ├── expense-form-dialog.tsx         — radio business/personal/mixed + slider deductible
│   │   └── expenses-page-client.tsx        — tabla + filtros + sorting + búsqueda debounced (Día 6)
│   ├── income/
│   │   ├── income-form-dialog.tsx          — selector cliente, payment method, status
│   │   └── income-page-client.tsx          — tabla + filtros + sorting + búsqueda debounced (Día 6)
│   ├── landing/                            — hero, problem, features, waitlist-form, footer (con dark variants)
│   ├── onboarding/
│   │   └── onboarding-wizard.tsx           — 3 steps con stepper, animaciones tailwind
│   ├── settings/
│   │   ├── profile-form.tsx                — display_name editable, email read-only
│   │   ├── financial-form.tsx              — country/currency/tax_rate/fiscal_year_start
│   │   └── export-csv-button.tsx           — DropdownMenu con 3 opciones de export (Día 6)
│   ├── shared/                             — logo, animate-on-scroll, theme-provider, theme-toggle (Día 6)
│   └── ui/                                 — shadcn primitives
├── lib/
│   ├── actions/
│   │   ├── auth.ts                         — signInWithPassword, signUpWithPassword, signOut
│   │   ├── waitlist.ts
│   │   ├── onboarding.ts                   — completeOnboardingAction, finishOnboardingAndRedirect
│   │   ├── clients.ts                      — getClients, create/update/deleteClientAction
│   │   ├── income.ts                       — getMonthlyIncome, create/update/deleteIncomeAction
│   │   ├── expenses.ts                     — getMonthlyExpenses, create/update/deleteExpenseAction
│   │   ├── settings.ts                     — getUserRecord, updateProfileAction, updateFinancialAction
│   │   └── dashboard.ts                    — getDashboardSummary, getIncomeByClient, getMonthlyTrend, getExpensesByCategory, getRecentTransactions
│   ├── hooks/
│   │   ├── use-debounced-value.ts          — debounce genérico para inputs (Día 6)
│   │   ├── use-keyboard-shortcuts.ts       — hook global de shortcuts con detección de inputs (Día 6)
│   │   └── use-chart-theme.ts              — paletas DARK/LIGHT para Recharts según resolvedTheme (Día 6)
│   ├── constants.ts                        — COUNTRIES, CURRENCIES, MONTHS, CLIENT_COLORS, formatters
│   ├── csv.ts                              — escapeCsvField, buildCsv, buildCsvFilename (Día 6)
│   ├── dates.ts                            — buildMonthRange, parseMonthParams, formatDateShort
│   ├── supabase/{client,server}.ts
│   └── utils.ts
└── types/index.ts                          — todas las entidades + ActionResult<T>
```

### Día 6 — implementado (Export CSV, filtros, sorting, dashboard alerts, dark/light, shortcuts)

#### Export CSV
- `src/lib/csv.ts` — utilidades `escapeCsvField` (escape de `"`, `,`, `\n`, `\r` con doble comilla), `buildCsv(headers, rows)` y `buildCsvFilename(kind)` (formato `freeledger-<kind>-YYYY-MM.csv` UTC).
- 3 Route Handlers en `src/app/api/export/`:
  - `income/route.ts` — columnas `Date, Client, Description, Amount, Payment Method, Status`.
  - `expenses/route.ts` — columnas `Date, Description, Category, Type, Deductible %, Amount`.
  - `all/route.ts` — CSV combinado con headers de sección (`# Income`, `# Expenses`, `# Clients`) + timestamp ISO de generación.
- Todos verifican `supabase.auth.getUser()`, filtran por `user_id`, ordenan por `date desc`, y devuelven `Content-Type: text/csv; charset=utf-8` + `Content-Disposition: attachment; filename="..."` + `Cache-Control: no-store`.
- `ExportCsvButton` en Settings: `DropdownMenu` con 3 ítems (`<a href download>`) que reemplaza el botón placeholder de Día 4.

#### Filtros + sorting en Income (`/dashboard/income`)
- `IncomePageClient` ahora recibe `initialClientId`, `initialStatus`, `initialSearch`, `initialSort`, `initialDir`, `initialAction` desde el Server Component.
- `FilterBar` con: input de búsqueda (icono Search, debounced 300ms vía `useDebouncedValue`), select de cliente ("All clients" + "Unassigned" si hay income sin cliente + cada cliente), tabs de status (All/Received/Pending).
- Filtrado client-side en `useMemo`: cliente, status, y término de búsqueda en `description` y `client.name`.
- Sorting con `SortableHeader` reusable (chevron up/down activo): columnas Date, Client, Amount; default Date desc; toggle asc↔desc al re-clickear.
- Persistencia en URL: `useEffect` sincroniza `searchParams` (`?client=&status=&search=&sort=&dir=`) sin romper el `MonthPicker` existente. Limpieza automática del `?action` al cargar.
- "Showing X of Y" + "Clear filters" cuando hay filtros activos. `NoMatchesState` reusable cuando el filtro deja la lista vacía.
- Botón "Add income" lleva `data-shortcut-new` para el shortcut `N`.

#### Filtros + sorting en Expenses (`/dashboard/expenses`)
- Misma arquitectura: `ExpensesPageClient` recibe `initialCategory`, `initialType`, `initialSearch`, `initialSort`, `initialDir`, `initialAction`.
- `FilterBar` con: input de búsqueda (debounced 300ms), select de categoría (sólo lista categorías con ≥1 expense del mes — `availableCategories` calculado con `useMemo`), tabs de tipo (All/Business/Personal/Mixed).
- Sorting: Date, Category (alfabético por label legible), Amount.
- URL params: `?category=&type=&search=&sort=&dir=`.
- Page server reorganizada con `readParam` helper para narrowing seguro de `string | string[] | undefined`.

#### Dashboard mejorado (`/dashboard`)
- `QuickActions` componente con 2 links bajo el `MonthPicker`: "+ Add income" (`/dashboard/income?action=new`) y "+ Add expense" (`/dashboard/expenses?action=new`); las páginas destino abren el dialog de creación si reciben `?action=new` y limpian el param tras montar.
- `DashboardAlerts` componente que renderiza:
  - **Pending banner** ámbar (link a `/dashboard/income?status=pending`) si `summary.pendingIncome > 0`. Muestra el monto formateado en la moneda del usuario.
  - **Concentration warning** naranja si el top cliente representa >60% del income recibido del mes. Muestra el porcentaje redondeado y nombre del cliente.
- Ambos alerts son opcionales (no se renderiza el contenedor si no hay nada que mostrar) y respetan dark/light.

#### Dark/light mode
- `ThemeProvider` (`src/components/shared/theme-provider.tsx`) wrappea `next-themes` con `attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`.
- `ThemeToggle` (`src/components/shared/theme-toggle.tsx`) — botón Sun/Moon con `mounted` flag para evitar hydration mismatch (devuelve placeholder neutral en SSR), tamaños `sm`/`md`. Disponible en:
  - Header del landing (`src/app/page.tsx`).
  - Sidebar desktop del dashboard (junto al Logo).
  - Header móvil del dashboard (junto al MobileNav).
- Estrategia de colores: el repo tenía ~440 ocurrencias de `zinc-{100..950}` hardcoded. Se transformaron sistemáticamente a pares `<light> dark:<original>` (e.g. `bg-zinc-950` → `bg-white dark:bg-zinc-950`, `text-zinc-100` → `text-zinc-900 dark:text-zinc-100`, `border-zinc-900` → `border-zinc-200 dark:border-zinc-900`, etc.) en 31 archivos, conservando el aspecto dark idéntico al de Día 5.
- Mapping bidireccional para los grises medios (300/400/600/700) con cleanup pass para evitar dobles aplicaciones. `text-zinc-500` se mantuvo (mid-tone funciona en ambos modos).
- Charts de Recharts: nuevo hook `useChartTheme()` retorna `{grid, axis, tick, tooltipBg, tooltipBorder, tooltipText, tooltipLabel, cursor, legend, ringStroke}` según `resolvedTheme`. Aplicado en los 3 charts (LineChart, PieChart, BarChart) reemplazando los hex fijos como `#27272a`, `#18181b`, `#a1a1aa`. Default DARK durante SSR para evitar flicker.
- Persistencia: localStorage vía next-themes. `enableSystem: true` para respetar preferencia del sistema, pero el toggle alterna explícitamente dark↔light.

#### Keyboard shortcuts
- `useKeyboardShortcuts(shortcuts: Shortcut[])` hook genérico:
  - Detecta inputs editables (`INPUT`, `TEXTAREA`, `SELECT`, `contentEditable`) y ignora atajos de tecla simple cuando hay foco en uno (excepto `Escape`).
  - Soporta modificadores `meta` (Ctrl o Cmd indistintamente), `shift`, `alt`.
  - Cleanup automático del `keydown` listener.
- `KeyboardShortcuts` componente cliente sin UI (`return null`) que:
  - Lee `usePathname` y monta condicionalmente el shortcut `N` solo en `/dashboard/income`, `/dashboard/expenses`, `/dashboard/clients`.
  - Atajos globales: `Ctrl/Cmd+K` y `/` enfocan + seleccionan el `[data-search-input]` visible; `N` clickea el `[data-shortcut-new]` visible (si no está disabled).
- `Escape` se delega a los Dialog/Sheet de shadcn (que ya lo manejan).
- Atributos `data-search-input` añadidos a los inputs de búsqueda de income y expenses; `data-shortcut-new` añadido a los botones "Add" de income, expenses y clients.

#### Calidad
- `npx tsc --noEmit` limpio.
- `next build` limpio (16 rutas, 0 errores).
- `npm run lint`: 4 errores **pre-existentes** que no fueron introducidos en Día 6 (3 apostrophes sin escapar en textos del landing/settings/problem y 1 `setState-in-effect` en `animate-on-scroll`). Los hooks nuevos llevan `eslint-disable-next-line react-hooks/set-state-in-effect` justificado para el patrón mounted-safe.

---

### Día 5 — implementado (Real Money Dashboard)

#### Server Actions de dashboard
- `src/lib/actions/dashboard.ts` con cinco funciones, todas con `supabase.auth.getUser()` y `.eq("user_id", user.id)`:
  - `getDashboardSummary(year, month)` — totalIncome (received), pendingIncome, totalExpenses, business/personal/mixed splits, deductibleAmount = Σ(amount × deductible_pct/100), taxReserve = max(income − deductible, 0) × tax_rate/100, realMoney = totalIncome − totalExpenses − taxReserve.
  - `getIncomeByClient(year, month)` — income `received` agrupado por cliente con join a `clients(id, name, color)`. Devuelve total + porcentaje, ordenado descendente. "Unassigned" cuando `client_id` es null.
  - `getMonthlyTrend(months = 6)` — itera `buildMonthRange` hacia atrás desde el mes actual UTC, lee income+expenses en una sola query rango y agrega por `YYYY-MM`. Calcula realMoney mes a mes con la misma fórmula que el summary. Clamped a [1, 24] meses.
  - `getExpensesByCategory(year, month)` — agrupa por `category`, sumas + porcentajes, ordenado desc, label legible vía `getCategoryLabel`.
  - `getRecentTransactions(limit = 5)` — combina los últimos N de income (con cliente) + expenses (con categoría), merge sort por fecha, slice al límite. Clamped a [1, 20].
- Tipos exportados: `DashboardSummary`, `IncomeByClientPoint`, `MonthlyTrendPoint`, `ExpensesByCategoryPoint`, `RecentTransaction`.

#### Página `/dashboard`
- Server Component que parsea `?year=&month=` con `parseMonthParams` y paraleliza 7 fetches: summary, incomeByClient, monthlyTrend(6), expensesByCategory, recentTransactions(5), getUserRecord, getClients.
- Empty state: si no hay clientes, ni income, ni expenses, ni trend con datos → renderiza `EmptyDashboard` con 3 action cards (clients/income/expenses).
- Layout normal: header con título + label del mes + `MonthPicker` (basePath `/dashboard`); luego `SummaryCards`; grid 2 columnas (lg) con `MonthlyTrendChart` + `IncomeByClientChart`; `ExpensesByCategoryChart` ancho completo; `RecentTransactions` ancho completo.

#### Summary cards (`summary-cards.tsx`)
- Card grande "Your real money" (col-span-1 en lg, gradient emerald si positivo / rose si negativo, número 4xl–5xl tabular-nums) con:
  - Delta vs. mes anterior calculado desde `monthlyTrend` (last vs prev). 4 estados: up/down/flat/new ("First tracked month").
  - Mini bar chart 6 meses construido con `<div>`/CSS (sin Recharts), barras emerald-400 (mes actual) + emerald-500/40 (anteriores), o rose si negativo, altura proporcional al máximo abs(realMoney) del trend.
- Grid 2×2 al lado: Income (emerald, subtext pending si > 0), Expenses (rose, subtext business), Deductible (blue, subtext "of $X total"), Tax reserve (amber, subtext "at XX% rate").

#### Monthly trend chart (`monthly-trend-chart.tsx`)
- Recharts `LineChart` con 3 líneas: Income (#10b981), Expenses (#f43f5e), Real money (#06b6d4).
- Tema oscuro: grid #27272a dashed horizontal, ejes sin axisLine, ticks #a1a1aa, tooltip bg #18181b border #3f3f46, formatter con `formatCurrency` del usuario, YAxis con compactNumber (k/M).
- Empty state si todos los puntos están en 0.

#### Income by client chart (`income-by-client-chart.tsx`)
- Recharts `PieChart` donut (innerRadius 48 / outerRadius 80) con `paddingAngle` 2 cuando hay >1 cliente y stroke #09090b.
- Cada `Cell` usa el `client.color` real.
- Centro del donut: total del mes con label "Total".
- Leyenda al lado (sm:grid 2 col) con dot de color, nombre, monto, porcentaje.
- Empty state si total === 0.

#### Expenses by category chart (`expenses-by-category-chart.tsx`)
- Recharts `BarChart` horizontal (`layout="vertical"`), una fila por categoría ordenadas desc, barSize 18 con border-radius 4 derecho.
- Color emerald (#10b981) con `fillOpacity` 0.5–1.0 escalado por ratio (mayor barra = más opaco). Altura dinámica: `data.length * 36 + 24` (mínimo 180).
- YAxis labels = label legible (Software/Office/Travel…), tick #d4d4d8, width 120.
- Empty state si data.length === 0 o el máximo es 0.

#### Recent transactions (`recent-transactions.tsx`)
- Server Component (no `"use client"`).
- Lista divisible con icon ↑ verde para income, ↓ rojo para expenses, ring + bg coloreado.
- Cada item: descripción · meta (cliente o categoría) · fecha corta. Status pending añade tag ámbar.
- Header con dos links: "All income →" y "All expenses →".
- Empty state con icono Receipt cuando no hay transacciones.

#### Empty dashboard (`empty-dashboard.tsx`)
- Hero card con gradient emerald, ícono Wallet 8x8 en cuadro 16x16, saludo "Welcome to FreeLedger, {firstName}!", copy motivador.
- 3 action cards en grid 3 col: clients (blue), income (emerald), expenses (rose). Cada card tiene Icon, título, descripción y CTA "Get started →" con hover translate.

#### Decisiones de diseño/cálculo
- `realMoney = totalIncome(received) − totalExpenses − taxReserve`; pendientes NO se incluyen en real money pero se muestran aparte.
- `taxableBase = max(totalIncome − deductibleAmount, 0)` (nunca negativo) → evita tax reserve negativa cuando deducciones > ingresos del mes.
- `getMonthlyTrend` usa el mismo cálculo mes a mes para que el delta del card principal sea consistente con la línea cyan del chart.
- Currency siempre desde `getUserRecord().currency` (fallback "USD") y se propaga como prop a todos los charts/cards.

---

### Día 4 — implementado

#### Tablas de datos
- `clients`, `income`, `expenses` definidas con RLS por `auth.uid() = user_id` y FKs con `ON DELETE CASCADE` (excepto `income.client_id` que es `ON DELETE SET NULL`).
- Índices por `user_id` y por `(user_id, date)` para los queries mensuales.
- **SQL pendiente de ejecutar en Supabase** (ver sección 🔴 más abajo).

#### Onboarding wizard
- Ruta `/onboarding` (`src/app/(dashboard)/onboarding/page.tsx`) — Server Component que verifica auth y, si el usuario ya completó onboarding (country ≠ default O ≥1 cliente), redirige a `/dashboard`.
- Componente cliente `OnboardingWizard` con 3 pasos:
  1. **About you** — country (20 opciones), currency (auto-set por país pero editable).
  2. **Tax settings** — tax rate slider 0-50% + número, fiscal year start dropdown.
  3. **Your first client** — name (required), email (optional), color picker (8 colores), opción "Skip for now".
- Stepper visual (3 barras) + transición `animate-in fade-in-50 slide-in-from-bottom-2` al cambiar de paso.
- Server Action `finishOnboardingAndRedirect` actualiza `users` y opcionalmente inserta el primer cliente, luego `redirect("/dashboard")`.
- **Lógica de redirect**: el layout `(dashboard)/dashboard/layout.tsx` verifica auth + onboarding done; si no, redirige a `/onboarding`. El propio `/onboarding` redirige a `/dashboard` cuando ya está completo, evitando loops.

#### Dashboard layout (sidebar)
- Layout en `src/app/(dashboard)/dashboard/layout.tsx` — sólo aplica a `/dashboard/*`, no a `/onboarding` (que es sibling dentro del mismo route group y conserva la presentación de wizard a pantalla completa).
- Sidebar fija de 250 px en `lg+`: Logo arriba, `SidebarNav` (5 entradas con active state vía `usePathname`), bloque de usuario (display name + email) y botón Sign out abajo.
- En `<lg`: header sticky con Logo + botón hamburger que abre un `Sheet` de shadcn (`MobileNav`) con la misma navegación + footer de usuario.
- `nav-items.ts` centraliza las entradas para que `SidebarNav` y `MobileNav` no diverjan.

#### CRUD clientes (`/dashboard/clients`)
- Lista con color indicator, email, fecha de alta, badge Active/Archived, acciones edit/delete inline.
- `ClientFormDialog` reusable para crear y editar (mismo set de campos, en modo edit aparece toggle Active).
- `DeleteConfirmDialog` con copy específico ("Income tagged to this client will be unlinked").
- Empty state con CTA grande.
- Server Actions con verificación `user_id = auth.uid()` en todas las queries (ownership) y `revalidatePath` de `/dashboard/clients`, `/dashboard/income`, `/dashboard`.

#### Income tracker (`/dashboard/income`)
- Server Component que paraleliza `getMonthlyIncome`, `getClients` y `getUserRecord`.
- `MonthPicker` que escribe `?year=&month=` a la URL (back/next + selects).
- Dos cards arriba: Received this month (verde) y Pending this month (ámbar) — totales calculados client-side con `useMemo`.
- Tabla con fecha, cliente (color dot + nombre), descripción, método de pago, importe (verde/ámbar según status), edit/delete.
- Si el usuario no tiene clientes aún, se muestra `NoClientsState` y se desactiva el botón Add income.
- `IncomeFormDialog` con amount + date (grid 2 col), client (select), description, payment_method + status (grid 2 col).

#### Expense tracker (`/dashboard/expenses`)
- Misma estructura que Income: paralelización + month picker + totales (Total + Deductible portion calculado con `deductible_pct`).
- Tabla con badge por tipo: Business (verde), Personal (azul), Mixed (ámbar — muestra "Mixed · NN%").
- `ExpenseFormDialog` con toggle visual de 3 botones para tipo; al elegir Mixed aparece un slider 0-100 (default 50). Business fija deductible 100, Personal lo fija a 0.
- 13 categorías predefinidas (`EXPENSE_CATEGORIES`).

#### Settings (`/dashboard/settings`)
- Tres cards: Profile (display_name editable, email read-only), Financial (country/currency/tax_rate/fiscal_year_start con auto-set de currency al cambiar país), Account (plan badge "free", export CSV deshabilitado, danger zone deshabilitada como placeholder).
- Server Actions con `useActionState` + toast de Sonner según resultado.

#### Validación y guardarraíles
- Toda mutación pasa por Server Action con `await supabase.auth.getUser()` y filtros `.eq("user_id", user.id)` o `.eq("id", user.id)`.
- `revalidatePath` después de cada mutación para que la UI quede sincronizada.
- Errores se devuelven como `ActionResult<T>` y se muestran con toast de error en el cliente.
- TypeScript estricto, sin `any` en todo lo nuevo (algún `as Record<string, unknown>` puntual para `user_metadata`).

### Auth (Día 3, sin cambios)
- `proxy.ts` (Next 16: el archivo se llama `proxy.ts`, función exportada `proxy()`) refresca sesión con `getUser()`, redirige `/dashboard/*` sin sesión a `/login?next=...` y `/login`/`/signup` con sesión a `/dashboard`.
- Server Actions `signInWithPassword`, `signUpWithPassword`, `signOut`.
- `/auth/callback` intercambia el code OAuth por sesión (con manejo de `forwardedHost` para Vercel).
- Dashboard layout también verifica `getUser()` (defensa en profundidad).

### Landing & Waitlist (Día 1-2, sin cambios)
- Hero, Problem, Features, Waitlist CTA, Footer.
- Server Action `joinWaitlist` con validación, manejo de duplicados (`23505`) y toast.
- Animaciones IntersectionObserver con stagger.

### SEO / metadata (sin cambios)
- Title template, OG, Twitter card, `metadataBase` desde `NEXT_PUBLIC_APP_URL`.

---

## 🔴 Bloqueantes — pasos manuales pendientes para Día 4

### 1. Ejecutar SQL nuevo en Supabase

Ir a **Supabase → SQL Editor → New Query** y correr **todo este bloque**:

```sql
-- Clientes del freelancer
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  color TEXT DEFAULT '#10b981',
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own clients" ON clients FOR ALL USING (auth.uid() = user_id);

-- Ingresos
CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'bank_transfer',
  status TEXT DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own income" ON income FOR ALL USING (auth.uid() = user_id);

-- Gastos
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  expense_type TEXT NOT NULL DEFAULT 'business',
  deductible_pct INTEGER DEFAULT 100,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_income_user_id ON income(user_id);
CREATE INDEX idx_income_date ON income(user_id, date);
CREATE INDEX idx_income_client ON income(client_id);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(user_id, date);
```

Sin esto, `getClients`, `getMonthlyIncome` y `getMonthlyExpenses` devolverán `[]` silenciosamente y cualquier mutación fallará con `relation "clients" does not exist`.

### 2. Bloqueantes anteriores que siguen aplicando si no se resolvieron en Día 3

- `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` reales.
- Tablas `waitlist` y `users` (con trigger `handle_new_user`) creadas en Supabase.
- Google OAuth configurado en Google Cloud + Supabase, redirect URLs sincronizadas.
- Variables de entorno también en Vercel (Production + Preview + Development) y Supabase Site URL apuntando al dominio prod.

---

## 🧪 Cómo probar Día 6 localmente

`npm run dev` → http://localhost:3000 → loguearse y entrar a `/dashboard`. Se asume que ya hay datos de prueba (clientes, income, expenses) creados en Día 4/5; si no, crearlos primero.

### Export CSV
1. Ir a `/dashboard/settings`.
2. Click en "Export CSV" → aparecen 3 opciones en el dropdown.
3. **Income (CSV)** → descarga `freeledger-income-YYYY-MM.csv`. Abrir en hoja de cálculo y verificar columnas `Date, Client, Description, Amount, Payment Method, Status` y filas ordenadas por fecha desc.
4. **Expenses (CSV)** → descarga `freeledger-expenses-YYYY-MM.csv` con columnas `Date, Description, Category, Type, Deductible %, Amount`.
5. **All data (CSV)** → descarga `freeledger-all-YYYY-MM.csv` con secciones `# Income`, `# Expenses`, `# Clients` separadas por líneas en blanco.
6. **Edge case caracteres especiales**: crear un income con descripción que incluya coma y comillas (e.g. `Project "Apollo", phase 2`), exportar, verificar que en el CSV queda correctamente entre comillas con escape (`"Project ""Apollo"", phase 2"`).
7. **Auth**: hacer logout, intentar GET directo a `/api/export/income` → debe devolver 401 Unauthorized.

### Filtros + sorting en Income (`/dashboard/income`)
1. **Filtro cliente**: cambiar dropdown → tabla se filtra al instante. La URL queda `?client=<uuid>`. Si hay income sin cliente asignado, aparece "Unassigned" en el dropdown.
2. **Filtro status**: tabs All / Received / Pending. URL → `?status=pending`.
3. **Búsqueda**: escribir en el input → tras 300ms la URL se actualiza con `?search=...` y la tabla muestra solo coincidencias en `description` o `client.name`.
4. **Combinables**: aplicar los 3 filtros a la vez → URL contiene los 3 params, "Showing X of Y" arriba de la tabla.
5. **Clear filters**: aparece cuando hay filtros activos; un click resetea todos los filtros + limpia la URL.
6. **Sorting**: click en headers Date / Client / Amount → chevron ↑↓ aparece en la columna activa. Re-click invierte la dirección. Default Date desc al cargar.
7. **Persistencia URL**: copiar la URL con filtros, abrir en otra pestaña → mismos filtros aplicados al cargar.
8. **Compatibilidad MonthPicker**: cambiar mes con los botones — los filtros se preservan y solo `year`/`month` cambian.

### Filtros + sorting en Expenses (`/dashboard/expenses`)
- Mismo flujo, con dropdown de **categoría** (sólo lista categorías que tienen ≥1 expense en el mes), tabs de **tipo** (Business/Personal/Mixed), y búsqueda en `description`. URL params `?category=&type=&search=&sort=&dir=`.

### Dashboard improvements (`/dashboard`)
1. **Quick actions**: ver "+ Add income" y "+ Add expense" al lado del MonthPicker. Click → navega a la página correspondiente con el dialog de creación abierto. Cerrar el dialog y observar que `?action=new` se limpia de la URL.
2. **Pending banner**: crear un income del mes con status `pending` → al volver al dashboard aparece arriba un banner ámbar con el monto. Click en el banner → lleva a `/dashboard/income?status=pending` con el filtro aplicado.
3. **Concentration warning**: crear varios income para que un solo cliente represente >60% del total recibido del mes → aparece warning naranja con el porcentaje y nombre del cliente. Si la concentración baja a ≤60% → desaparece.

### Dark/light mode
1. Click en el toggle Sun/Moon (en el header del landing, en el sidebar desktop o en el header móvil del dashboard).
2. Verificar que **todas** las secciones cambian: landing (hero, problem, features, waitlist, footer), auth pages (login/signup), onboarding wizard, dashboard (sidebar, summary cards, los 3 charts incluido tooltip/grid/axes, recent transactions, alerts), income/expenses tablas, settings (cards y forms).
3. Toggle se persiste — recargar la página → mismo modo.
4. Charts: hover sobre puntos del LineChart o segmentos del PieChart → tooltip blanco con borde gris en light, oscuro con borde dim en dark.
5. SSR: refrescar la página → no hay flash de modo equivocado (el ThemeProvider lo gestiona en root layout con `suppressHydrationWarning`).
6. **Edge case hydration**: el ThemeToggle muestra un placeholder neutro (icono Sun) durante SSR y se hidrata correctamente con el icono real (Sun en dark, Moon en light).

### Keyboard shortcuts
1. Estando en cualquier página de dashboard con search visible (income, expenses):
   - `Ctrl+K` (Win/Linux) o `Cmd+K` (Mac) → enfoca + selecciona el input de búsqueda.
   - `/` → mismo efecto.
2. En `/dashboard/income`, `/dashboard/expenses`, o `/dashboard/clients`:
   - `N` → abre el dialog de creación (equivalente a click en el botón Add).
3. **Edge case input editable**: con foco en un input, presionar `/` o `N` → no dispara el shortcut (solo Ctrl+K funciona dentro de inputs).
4. **Edge case sin clientes**: en `/dashboard/income` sin clientes creados, el botón "Add income" está disabled → `N` no hace nada (chequea `el.disabled`).
5. `Escape` → cierra cualquier Dialog/Sheet abierto (delegado a shadcn).

---

## 🧪 Cómo probar Día 5 localmente

`npm run dev` → http://localhost:3000 → loguearse y entrar a `/dashboard`.

### Estado vacío (usuario nuevo sin datos)
- Borrar/recrear un usuario sin ingresos/gastos/clientes (o ejecutar onboarding y elegir "Skip for now").
- `/dashboard` muestra el `EmptyDashboard` con saludo personalizado y 3 action cards (clients/income/expenses).
- Click en cada card → navega a la ruta correspondiente.

### Dashboard con datos de prueba
1. Crear 2–3 clientes en `/dashboard/clients` con colores distintos.
2. Crear varios ingresos del mes actual: algunos `received`, alguno `pending`, distribuidos entre los clientes.
3. Crear ingresos en meses anteriores (ajustar la fecha hacia atrás 1, 2, 3 meses) para ver la línea de trend con datos reales.
4. Crear gastos del mes en distintas categorías y mezclando business/personal/mixed (con deductible_pct variable).
5. Volver a `/dashboard`.

### Qué verificar
- **Real money card**: número grande consistente con `received − expenses − tax reserve`. Si el mes anterior tiene datos en el trend, aparece "+X% vs last month" en verde o rojo. Mini bar chart muestra 6 barras (mes actual destacado).
- **Income card**: total en emerald; si hay pending muestra "$X pending" en ámbar.
- **Expenses / Deductible / Tax reserve cards**: tonos correctos (rose/blue/amber), textos consistentes con el tax_rate del usuario.
- **Monthly trend chart**: 3 líneas (income emerald / expenses rose / real money cyan). Hover sobre punto → tooltip con valores formateados en la moneda del usuario.
- **Income by client**: donut con colores reales de cada cliente, leyenda con monto y %, total al centro. Probar con 1 solo cliente → donut único.
- **Expenses by category**: barras horizontales ordenadas desc, opacidad mayor en la barra más grande.
- **Recent transactions**: 5 items mezclados ordenados por fecha desc; income con flecha ↑ verde, expense con flecha ↓ rojo. Pending añade etiqueta ámbar. Links "All income →" / "All expenses →" funcionan.
- **MonthPicker**: cambiar mes → URL se actualiza con `?year=&month=`, summary cards + charts del mes (trend siempre últimos 6 calendario, no cambia con el picker — comportamiento intencional) + recent transactions (no filtran por mes — son las últimas globales, intencional).
- **Currency**: cambiar `currency` en settings → recargar dashboard → todos los importes y ticks de eje cambian de símbolo.
- **Mobile**: < lg el grid del summary se stackea, charts ocupan ancho completo, leyenda del pie va abajo.

### Edge cases a verificar
- Mes sin ingresos pero con gastos → real money negativo, card en tono rose, mini bar chart con barras invertidas.
- Mes con sólo pending income → totalIncome=0 (card muestra $0), pending card muestra el monto en ámbar, real money card refleja sólo gastos negativos.
- Income sin cliente asignado (`client_id` null) → aparece como "Unassigned" en la pie con el color por defecto.
- Tax rate = 0 (usuario que aún no ajustó settings) → tax reserve = 0, real money = received − expenses.
- Deductible amount > totalIncome → taxable base se clampa a 0 (nunca tax reserve negativa).
- Sólo 1 mes con datos → delta dice "First tracked month", mini bar chart muestra esa única barra contra fondo de 5 vacías.

---

## 🧪 Cómo probar Día 4 localmente

`npm run dev` → http://localhost:3000.

1. **Onboarding**
   - Crear un usuario nuevo (signup email/password o Google).
   - Después del primer login deberías aterrizar en `/dashboard` y ser redirigido inmediatamente a `/onboarding`.
   - Step 1: cambiar país a "Colombia" → ver que currency salta a `COP` y tax rate a `19%`.
   - Step 2: mover el slider, cambiar fiscal year.
   - Step 3a: meter nombre "Acme Inc.", email opcional, color → Finish.
   - Verificar redirect a `/dashboard` y que la fila en `users` quedó actualizada y que se creó el cliente.
   - Step 3b (alternativo): "Skip for now" → Finish → verificar que no se creó cliente y la redirección igual.
   - Volver a entrar a `/onboarding` manualmente con onboarding completo → redirige a `/dashboard`.

2. **Sidebar / mobile nav**
   - Desktop ≥ lg: sidebar visible, active state cambia al navegar entre secciones.
   - Resize a < lg: sidebar desaparece, aparece header con menu hamburger; abrir Sheet, navegar, verificar que se cierra al hacer click en un item.
   - Sign out funciona en ambos contextos.

3. **Clients**
   - Empty state al inicio. Add client → guarda → aparece en lista con color y "Active".
   - Edit cliente: cambiar nombre/email/color/notes y togglear Active → revalida.
   - Delete: confirm dialog → revalida.

4. **Income**
   - Sin clientes: ver `NoClientsState` y botón Add income deshabilitado.
   - Con cliente: Add income → completar form → aparece en tabla; el card "Received this month" actualiza.
   - Crear uno con status `pending` → aparece en card ámbar.
   - Cambiar mes con MonthPicker (back/next, selects) → la URL queda `?year=YYYY&month=MM` y la lista se filtra.
   - Edit y delete.

5. **Expenses**
   - Add expense Business → deductible_pct=100, aparece badge verde.
   - Add expense Personal → deductible_pct=0, badge azul.
   - Add expense Mixed → aparece slider deductible (default 50), badge ámbar muestra "Mixed · 50%".
   - Card "Deductible portion" se actualiza correctamente.
   - Filtro por mes idéntico al de income.

6. **Settings**
   - Profile: cambiar display_name → toast success → recargar y persiste.
   - Financial: cambiar país → currency salta automáticamente; cambiar tax rate y fiscal year → save → persiste.
   - Cards "Export CSV" y "Delete account" están visibles pero deshabilitadas (placeholders).

---

## 🟡 Recomendado antes de seguir construyendo

- Tests de los Server Actions de clients/income/expenses/dashboard (al menos smoke con Vitest).
- Avatar real en sidebar (el layout ya soporta `avatar_url`, falta verificar que el trigger de `handle_new_user` está poblando `avatar_url` con el de Google y/o que se sincroniza al login).
- Validación más fuerte en el lado servidor (Zod) — actualmente la validación es manual en cada parser.
- Year-over-year comparison opcional en el dashboard (además del MoM delta del Real Money card).
- Filtro del MonthPicker que también afecte el rango del trend chart (hoy es siempre últimos 6 calendario UTC).

---

## 🟢 Nice to have (mantenido del Día 3)

- Forgot password flow.
- Email de bienvenida al unirse a la waitlist (Resend ya instalado).
- Eliminar dependencias no usadas (`@base-ui/react` está en uso por avatar — revisar el resto).
- Páginas `/privacy` y `/terms` linkeadas en footer.
- `robots.txt` y `sitemap.xml`.
- Rate limiting en waitlist.
- Open Graph image dinámica.

---

## 🗺️ Después del Día 8 — siguientes hitos

- **Activar pagos reales con LemonSqueezy** cuando se decida lanzar (rellenar variant IDs, implementar verificación de firma, conectar checkout en `UpgradeCtaButton`). Estructura ya lista — solo falta el cableado real.
- **Bloquear CSV export para Free** post-launch (cambiar `PLANS.free.canExportCSV = false` y agregar guard en los 3 Route Handlers de `/api/export/*`).
- **Métricas / analytics** sobre clicks en banner, paywall y página `/dashboard/upgrade` para optimizar el funnel free→pro.
- **Día 7 (referencia histórica) — Pulido y deploy a producción** (favicon, OG image, robots/sitemap, smoke tests, monitoring, plan paywall, posiblemente date range filter en lugar/además de month picker).
- **Mejoras opcionales pendientes de Día 6**:
  - Range de fechas en filtros (hoy el filtro por mes lo hace el `MonthPicker`; añadir un date-range picker permitiría queries multi-mes).
  - Multi-select para categorías en expenses (hoy es single-select).
  - Export filtrado: hoy `/api/export/income` exporta TODOS los registros del usuario; podríamos respetar searchParams para exportar solo lo filtrado en pantalla.
  - Resolver los 4 errores pre-existentes de lint (3 apostrophes + 1 setState-in-effect en animate-on-scroll).
  - Charts con grid lines más sutiles en light mode (actualmente `#e4e4e7` puede ser visible de más).

---

## ✅ Día 7 — Polish + SEO + Legal + Production prep (5 mayo 2026)

### Lo que se hizo

**SEO y metadata dinámica**
- `src/app/opengraph-image.tsx` — OG image dinámica (1200x630) con `next/og`, gradiente oscuro, logo, headline "Know your real money.", URL `freeledger.dev`. `runtime = 'edge'`.
- `src/app/twitter-image.tsx` — Twitter card (mismo diseño que OG, inline porque Next 16 no permite re-exportar `runtime`).
- `src/app/icon.tsx` — favicon dinámico 32x32 (wallet en emerald sobre fondo zinc-950).
- `src/app/apple-icon.tsx` — Apple touch icon 180x180 con borde emerald.
- `src/app/favicon.ico` placeholder eliminado y `icons.icon` quitado del `metadata` del root layout (Next.js auto-detecta `icon.tsx`).
- `src/app/robots.ts` — disallow `/dashboard/`, `/api/`, `/auth/`, `/onboarding/` + `sitemap` apuntando a `https://freeledger.dev/sitemap.xml`.
- `src/app/sitemap.ts` — incluye `/`, `/login`, `/signup`, `/privacy`, `/terms`.

**Legal pages**
- `src/components/legal/legal-shell.tsx` — shell reusable (header con logo + theme toggle, footer con privacy/terms/home, contenedor `max-w-3xl prose-style`) + helper `LegalSection` con título h2.
- `src/app/privacy/page.tsx` — Privacy Policy (qué recolectamos, cómo se usa, storage en Supabase/AWS, cookies esenciales únicamente, derechos export/delete, contacto).
- `src/app/terms/page.tsx` — Terms of Service (no es asesoría financiera/legal, acceptable use, pricing, governing law: Colombia, contacto).
- Ambas con `metadata` específico y `alternates.canonical`.

**Landing page redesign**
- `src/components/landing/landing-nav.tsx` — nav fijo (sticky/fixed `top-0 z-50`) **transparente al top** y **con backdrop-blur al hacer scroll**. Links a `#features`, `#pricing`, theme toggle, "Sign in" y CTA "Get started free" → `/signup`. Hamburger menu en mobile (`<md`) con state local.
- `src/components/landing/pricing.tsx` — 3 cards (Free $0, Pro $9/mo con badge "Most popular", Lifetime $69 one-time). Pro y Lifetime están como "Coming soon" disabled. Free CTA → `/signup`.
- `src/components/landing/hero.tsx` — añadida línea de social proof "Trusted by 50+ freelancers on the waitlist" con 3 dots emerald. `pt-32 sm:pt-40` para no chocar con el nav fijo.
- `src/components/landing/features.tsx` — añadido `id="features"` para anchor links.
- `src/components/landing/footer.tsx` — añadidos links Privacy, Terms, Sign in en una nav row.
- `src/app/page.tsx` — usa `LandingNav` (reemplaza el viejo `<Nav>` interno) y agrega `<Pricing />` entre Features y WaitlistCTA. WaitlistCTA tiene ahora `id="waitlist"`.
- `src/app/layout.tsx` — añadido `scroll-smooth` al `<html>` para que los anchor links del nav scrolleen suavemente.

**Loading states + error boundary**
- `src/components/dashboard/skeletons.tsx` — primitivos reusables (`Skeleton`, `PageHeaderSkeleton`, `CardSkeleton`, `ChartSkeleton`, `TableSkeleton`, `ListSkeleton`) con `animate-pulse` y `bg-zinc-200 dark:bg-zinc-800`.
- `src/app/(dashboard)/dashboard/loading.tsx` — header + 4 metric cards + 2 charts + 1 chart full + tabla.
- `src/app/(dashboard)/dashboard/income/loading.tsx` — header + tabla (8 rows).
- `src/app/(dashboard)/dashboard/expenses/loading.tsx` — header + tabla (8 rows).
- `src/app/(dashboard)/dashboard/clients/loading.tsx` — header + grid de cards (6 rows).
- `src/app/(dashboard)/dashboard/error.tsx` — error boundary con icono AlertTriangle, mensaje, digest opcional, botón "Try again" → `reset()`.

**Performance**
- `src/app/(dashboard)/dashboard/page.tsx` — `MonthlyTrendChart`, `IncomeByClientChart` y `ExpensesByCategoryChart` ahora se cargan vía `next/dynamic` con `loading: () => <ChartSkeleton />`. Sin `ssr: false` porque la página es Server Component (no permitido en Next 15+); igualmente los componentes son `"use client"` y el chunk de Recharts queda en su propio bundle.
- Todas las páginas del dashboard ya tenían `metadata.title`. Con el template del root layout (`"%s · FreeLedger"`) renderizan como "Dashboard · FreeLedger", "Income · FreeLedger", etc.

**Responsive**
- `src/components/expenses/expenses-page-client.tsx` y `src/components/income/income-page-client.tsx` — tablas envueltas en `<div className="overflow-x-auto">` con `min-w-[640px]` para evitar squeezing en mobile.
- Landing nav ya tiene hamburger menu < md.
- Pricing cards ya stackean (1 col → 3 col en lg).

### Rutas tras Día 7

```
/                         landing — sticky nav + hero + problem + features + pricing + waitlist + footer
/login, /signup           auth — email/password + Google
/auth/callback            OAuth code exchange
/onboarding               wizard de 3 pasos
/dashboard                Real Money Dashboard (loading + error boundaries, charts dinámicos)
/dashboard/income         CRUD ingresos (con loading, tabla scroll horizontal)
/dashboard/expenses       CRUD gastos (con loading, tabla scroll horizontal)
/dashboard/clients        CRUD clientes (con loading)
/dashboard/settings       perfil + financiero + export CSV
/api/export/{income,expenses,all}   CSV exports
/privacy                  Privacy Policy (estática)
/terms                    Terms of Service (estática)
/robots.txt               generado por src/app/robots.ts
/sitemap.xml              generado por src/app/sitemap.ts
/opengraph-image          OG image dinámica (edge)
/twitter-image            Twitter card dinámica (edge)
/icon                     favicon 32x32 (edge)
/apple-icon               apple-touch 180x180 (edge)
```

### Verificación
- `next build` → ✅ limpio, 22 rutas, 0 errores. Todas las legal pages, robots, sitemap como `○ Static`. OG/twitter/icon como `ƒ Dynamic` (edge runtime).

### Pasos manuales pendientes (post-Día 7)

1. **Dominio `freeledger.dev`**:
   - Comprar el dominio (Namecheap/Cloudflare/etc).
   - En Vercel Dashboard → Project → Settings → Domains → Add `freeledger.dev` y `www.freeledger.dev`.
   - Configurar DNS según instrucciones de Vercel (A record `76.76.21.21` para apex + CNAME `cname.vercel-dns.com` para www).
   - Esperar a que Vercel emita SSL automáticamente.
2. **Variable de entorno en Vercel**: actualizar `NEXT_PUBLIC_APP_URL=https://freeledger.dev` (Production env).
3. **Supabase Auth**: en Supabase Dashboard → Authentication → URL Configuration → añadir `https://freeledger.dev` a Site URL y Redirect URLs (también `https://freeledger.dev/auth/callback` para OAuth).
4. **Google OAuth**: en Google Cloud Console → Credentials → editar el OAuth client → añadir `https://freeledger.dev` a Authorized JavaScript origins y `https://freeledger.dev/auth/callback` a Authorized redirect URIs.
5. **Verificar OG image en producción**: una vez deployado, abrir `https://www.opengraph.xyz/url/https%3A%2F%2Ffreeledger.dev` para preview de cómo se ve en Twitter/Slack/Discord/LinkedIn. También probar con `https://freeledger.dev/opengraph-image` directamente para ver el PNG.
6. **Twitter handle**: el `metadata.twitter.creator` apunta a `@FreeLedgerApp` — verificar que la cuenta exista o cambiarla.
7. **Resend domain**: verificar `freeledger.dev` en Resend para enviar emails desde `noreply@freeledger.dev` (waitlist + transactional).

---

## ✅ Día 8 — Free tier limits + paywall + estructura LemonSqueezy (10 mayo 2026)

### Lo que se hizo

**Configuración de planes**
- `src/lib/plans.ts` — fuente de verdad de `PLANS` con `free`, `pro` y `lifetime`. Cada plan declara `name`, `maxClients`, `maxTransactionsPerMonth`, `canExportCSV`, `price`. Pro y Lifetime usan `Infinity` en los maxes. Helpers `isPlanType` / `normalizePlan(value)` para narrowing seguro desde la DB.
- `UserPlan` en `src/types/index.ts` actualizado a `"free" | "pro" | "lifetime"`.
- **Decisión**: `canExportCSV` está en `true` para Free **temporalmente** (testing pre-launch). Cambiar a `false` post-launch — todavía no hay enforcement del export en server porque el dueño necesita hacer pruebas desde su cuenta.

**Verificación de límites (Server Actions)**
- `src/lib/actions/limits.ts` con tres funciones públicas:
  - `canCreateClient(userId): { allowed, current, limit }` — cuenta clientes del usuario y compara con `PLANS[plan].maxClients`.
  - `canCreateTransaction(userId): { allowed, current, limit }` — cuenta `income` + `expenses` del **mes actual UTC** (usa `currentMonthRange()`) y compara con `PLANS[plan].maxTransactionsPerMonth`. Income y expenses comparten el contador.
  - `getUsage(userId): { clients, transactionsThisMonth, plan }` — agregada para SSR de banners/cards.
  - `getCurrentUserUsage()` — wrapper que resuelve el `userId` desde `supabase.auth.getUser()`. Devuelve `null` si no hay sesión.
- Los counts usan `select("id", { count: "exact", head: true })` para evitar traer rows.
- Plan se lee siempre desde `users.plan` (con fallback a `"free"` vía `normalizePlan`) — fuente de verdad única, no se confía en cookies/sessionClaims.

**Enforcement en server**
- `createClientAction` (en `clients.ts`): antes del `insert`, llama `canCreateClient(user.id)`. Si `!allowed` devuelve `{ success: false, error: "You've reached the limit of 3 clients on the Free plan. Upgrade to Pro for unlimited clients." }`.
- `createIncomeAction` y `createExpenseAction`: misma lógica con `canCreateTransaction`. Mensaje: `"You've reached 30 transactions this month on the Free plan. Upgrade to Pro for unlimited transactions."`
- Las funciones `update*Action` **no** chequean límites (editar no incrementa el conteo) — intencional.
- El error vuelve por el `ActionResult` y se muestra como toast rojo en el cliente vía Sonner.

**UI: indicador de uso (UsageMeter)**
- `src/components/shared/usage-meter.tsx` — server-friendly (sin `"use client"`), recibe `label`, `current`, `limit`. Renderiza:
  - Texto `<current> of <limit> <label>` con tabular-nums.
  - Link "Upgrade" a `/dashboard/upgrade`.
  - Mini barra con tono dinámico: emerald si <80%, amber si ≥80%, red si ≥100%.
  - Si `limit === Infinity` retorna `null` (no se muestra para Pro/Lifetime).
- Renderizado debajo del header en `/dashboard/clients`, `/dashboard/income`, `/dashboard/expenses`. Solo visible cuando `plan === "free"`.

**UI: límite alcanzado**
- Botones "Add client", "Add income", "Add expense" se deshabilitan visualmente cuando `transactionsThisMonth >= limit` (o `clients.length >= limit`). Tooltip via `title`: `"Limit reached — Upgrade to Pro"`.
- Al click se abre el `UpgradePrompt` en lugar del form dialog.
- Los `EmptyState` de income/expenses ahora también respetan `disabled` y cambian su copy a `"You've reached this month's transaction limit."` cuando aplica.

**UI: UpgradePrompt (paywall dialog)**
- `src/components/shared/upgrade-prompt.tsx` — Dialog reusable con dos `kind`s: `"clients"` o `"transactions"` (cambia el subtítulo).
- Card con borde emerald, icono Sparkles, lista de features de Pro (Unlimited clients, Unlimited transactions, CSV export, Email reports coming soon), botón principal `"Upgrade to Pro — $9/mo"` → `/dashboard/upgrade`, botón secundario `"Maybe later"` → cierra.
- Implementado como `<Link>` estilizado en lugar de `Button asChild` porque el `Button` del repo (base-ui/react) no soporta `asChild` — usa el patrón `render={...}`.

**Página de upgrade (`/dashboard/upgrade`)**
- `src/app/(dashboard)/dashboard/upgrade/page.tsx` — Server Component que lee `getCurrentUserUsage()` para detectar el plan actual y mostrar el badge "Current plan" en la card correspondiente.
- 3 cards comparativas en grid (1 col mobile → 3 col lg):
  - **Free**: 3 clients, 30 transactions/month, Basic dashboard. CTA disabled "Current plan" (o gris si ya estás en otro plan).
  - **Pro** (highlighted con borde emerald + ring + sombra emerald): Unlimited clients/transactions, CSV export, Advanced filters, Email reports. Precio "$9/month or $79/year (save 27%)". Badge "Most popular". CTA "Upgrade to Pro" → toast info.
  - **Lifetime**: Everything in Pro, forever. "$69 one-time · only first 200 customers". CTA "Get Lifetime" → toast info.
- Header centrado con badge "Upgrade", titular y copy explicando la diferencia entre planes.
- `src/components/upgrade/upgrade-cta-button.tsx` — wrapper client component que dispara `toast.info("Payments are coming soon! You'll be notified when Pro is available.")`. Reutilizado por Pro y Lifetime.

**Plan card en Settings**
- `src/components/settings/plan-card.tsx` — nuevo bloque "Your plan" en `/dashboard/settings` con badge del plan actual (gris para Free, emerald para Pro/Lifetime).
- Dos progress rows: "Clients" y "Transactions this month" — cada una muestra `current / limit` (o `current / unlimited` para Pro/Lifetime) + barra con el mismo tono dinámico que el `UsageMeter`.
- Botón "Upgrade to Pro" embebido en la card si `plan === "free"`.
- El bloque "Current plan" placeholder de Día 4 fue **reemplazado** por esta card. La card "Account" remanente conserva Export CSV + Danger Zone.

**Banner de upgrade en Dashboard**
- `src/components/dashboard/upgrade-banner.tsx` — banner sutil con borde emerald + icono Sparkles arriba del dashboard. Solo se renderiza si `plan === "free"` y si no fue dismissed en los últimos 7 días.
- Persistencia de dismiss: `localStorage["freeledger:upgrade-banner-dismissed-at"]` con timestamp en ms. Re-aparece automáticamente después de 7 días.
- Botón X cierra el banner sin re-aparecer hasta vencimiento.
- Lleva el patrón `eslint-disable-next-line react-hooks/set-state-in-effect` igual que `animate-on-scroll` (justificado: el setState es para el patrón mounted-safe que evita hydration mismatch).

**Sidebar: badge de plan + link a Upgrade**
- `dashboard/layout.tsx` ahora también lee `users.plan` en la query del usuario. Calcula `planLabel` y `planBadgeClass` y muestra el badge al lado del display name (sidebar desktop + mobile sheet).
- `SidebarNav` actualizado: acepta prop `plan`. Si `plan === "free"`, agrega un nav item extra **debajo** de los 5 normales: icono Sparkles, label "Upgrade", badge "New" emerald al final, color emerald (más prominente que los grises de los otros). Se hace active cuando la ruta es `/dashboard/upgrade`.
- `MobileNav` actualizado: forwarda `plan` al `SidebarNav` y muestra el mismo badge al lado del nombre.

**Toast al 80% del límite mensual**
- `IncomePageClient` y `ExpensesPageClient` usan un `useRef` que guarda el `transactionsThisMonth` previo. Cuando el valor *aumenta* y cruza el umbral `Math.ceil(limit * 0.8)` (24 en Free) **sin todavía alcanzar el límite**, dispara `toast.warning("You've used 24 of 30 transactions this month. Consider upgrading to Pro.")`.
- La detección de "cruzó el umbral" compara prev < 24 && current ≥ 24, así no re-fira en cada render entre 24 y 29.
- No se dispara al alcanzar el límite (30) — en ese punto el server ya rechaza nuevas transacciones y el flujo de UI cambia al UpgradePrompt.

**Estructura LemonSqueezy (placeholder)**
- `src/lib/lemonsqueezy.ts` — interface `LemonSqueezyWebhookEvent` (meta + data + attributes) y constante `LEMON_VARIANTS = { pro_monthly: 0, pro_yearly: 0, lifetime: 0 }`. Los `0` son placeholders — hay que rellenarlos con los variant IDs reales antes de activar pagos.
- `src/app/api/webhooks/lemonsqueezy/route.ts` — POST handler con TODOs claros:
  1. Verificar firma `X-Signature` con HMAC SHA256 + `LEMON_SQUEEZY_WEBHOOK_SECRET`.
  2. Parsear body como `LemonSqueezyWebhookEvent`.
  3. Switch sobre `meta.event_name`:
     - `subscription_created` / `subscription_updated` → `users.plan = 'pro'`.
     - `subscription_cancelled` / `subscription_expired` → `users.plan = 'free'`.
     - `order_created` con `variant_id === LEMON_VARIANTS.lifetime` → `users.plan = 'lifetime'`.
  4. Persistir `customer_id` / `variant_id` en el user row para futuros portal/refund flows.
- Por ahora retorna `200 { received: true }` — suficiente para que LemonSqueezy no marque el endpoint como fallido durante setup.
- `.env.example` actualizado con `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_WEBHOOK_SECRET`, `LEMON_SQUEEZY_STORE_ID`.

### Rutas tras Día 8

```
/                              landing — sticky nav + hero + problem + features + pricing + waitlist + footer
/login, /signup                auth
/auth/callback                 OAuth code exchange
/onboarding                    wizard de 3 pasos
/dashboard                     Real Money Dashboard (con UpgradeBanner si Free)
/dashboard/income              CRUD income (con UsageMeter + UpgradePrompt + 80% toast)
/dashboard/expenses            CRUD expenses (con UsageMeter + UpgradePrompt + 80% toast)
/dashboard/clients             CRUD clients (con UsageMeter + UpgradePrompt)
/dashboard/settings            perfil + financiero + Plan card + export CSV + danger zone
/dashboard/upgrade             3 tiers comparativos (Free/Pro/Lifetime), CTAs con toast "coming soon"
/api/export/{income,expenses,all}      CSV exports
/api/webhooks/lemonsqueezy     POST placeholder con TODOs (retorna 200)
/privacy, /terms               legal
/robots.txt, /sitemap.xml      generados
/opengraph-image, /twitter-image, /icon, /apple-icon    edge dynamic
```

### Estructura nueva (Día 8)

```
src/
├── app/
│   ├── (dashboard)/dashboard/
│   │   └── upgrade/page.tsx                    — página de upgrade con 3 tiers
│   └── api/webhooks/
│       └── lemonsqueezy/route.ts               — webhook placeholder
├── components/
│   ├── dashboard/
│   │   └── upgrade-banner.tsx                  — banner free-tier dismissable 7 días
│   ├── settings/
│   │   └── plan-card.tsx                       — bloque "Your plan" con progress bars
│   ├── shared/
│   │   ├── usage-meter.tsx                     — barra reusable verde/amber/red
│   │   └── upgrade-prompt.tsx                  — dialog paywall (kind: clients | transactions)
│   └── upgrade/
│       └── upgrade-cta-button.tsx              — botón "coming soon" con toast info
└── lib/
    ├── plans.ts                                — PLANS config + helpers de PlanType
    ├── lemonsqueezy.ts                         — types + LEMON_VARIANTS placeholders
    └── actions/
        └── limits.ts                           — canCreateClient/canCreateTransaction/getUsage
```

### Calidad

- `npx tsc --noEmit` → ✅ limpio.
- `next build` → ✅ limpio, **24 rutas**, 0 errores (las 22 de Día 7 + `/dashboard/upgrade` + `/api/webhooks/lemonsqueezy`).
- `npm run lint`: los **2 errores pre-existentes** que ya estaban en Día 7 (`problem.tsx` apostrophe, `animate-on-scroll` setState-in-effect). No se introdujeron errores nuevos. El `setState` en `upgrade-banner.tsx` lleva `eslint-disable-next-line react-hooks/set-state-in-effect` con el mismo patrón mounted-safe documentado.

### Decisiones / consideraciones

- **CSV export sigue habilitado en Free** — `PLANS.free.canExportCSV = true`. El bloqueo se hará post-launch; necesario para que el dueño pruebe desde su propia cuenta. Cuando se active, el guard debe ir en los 3 Route Handlers de `/api/export/*` (verificar `getUserPlan(user.id)` antes de servir el CSV).
- **Income + expenses comparten el contador mensual de 30**. No es 30 income + 30 expenses. Esto es deliberado y coherente con el copy ("30 transactions/month" en la página de upgrade).
- **El plan se lee siempre desde `users.plan` con `normalizePlan()`** — si el value es inválido o null, cae a `"free"`. Esto cubre el período pre-launch en que la columna podría estar vacía.
- **Server-side first**: aunque el botón está disabled en UI, el server siempre re-verifica. No es posible saltarse el límite editando devtools.
- **Update no consume cuota**: solo el create. Editar un income existente no incrementa `transactionsThisMonth` (ni en cliente ni en server).

### Pasos manuales pendientes (post-Día 8)

1. **Validar columna `users.plan` en Supabase**: si tiene CHECK constraint que solo permite `'free'` o `'pro'`, hay que ampliarlo para aceptar `'lifetime'`. Ejecutar:
   ```sql
   ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;
   ALTER TABLE users ADD CONSTRAINT users_plan_check CHECK (plan IN ('free', 'pro', 'lifetime'));
   ```
   Si no hay CHECK (columna libre TEXT), no se requiere acción.
2. **Cuando se active LemonSqueezy** — ✅ **resuelto en Día 9** (ver sección Día 9 más abajo). Pendiente del owner: ejecutar el SQL del paso 1, llenar `SUPABASE_SERVICE_ROLE_KEY` en Vercel, y hacer un checkout de prueba en test mode.
3. **Bloquear CSV export post-launch**: cuando se decida cerrar el feature para Free, agregar `if (!PLANS[plan].canExportCSV) return new Response('Upgrade required', { status: 402 })` al inicio de los 3 GETs de `/api/export/*`. Y poner `PLANS.free.canExportCSV = false`.

---

## 🧪 Cómo probar Día 8 localmente

`npm run dev` → http://localhost:3000 → loguearse y entrar a `/dashboard`. Asume usuario con `plan = 'free'` en la DB (default).

### Límite de clientes (3 en Free)
1. Ir a `/dashboard/clients`. Confirmar que aparece el `UsageMeter`: "0 of 3 clients" con barra emerald.
2. Crear 3 clientes. Tras el 3ro la barra está al 100% en rojo.
3. El botón "Add client" aparece deshabilitado con tooltip nativo "Limit reached — Upgrade to Pro".
4. Click en el botón (igual no abre el dialog porque está disabled). Si se simula click programático, abre el `UpgradePrompt`.
5. **Server-side**: en Network → forzar el form action a través del existente form (e.g. dejar el dialog abierto desde antes de llegar al límite): el server devuelve toast rojo con el mensaje del límite. Inserción rechazada.

### Límite de transacciones (30/mes en Free)
1. Ir a `/dashboard/income`. Confirmar `UsageMeter` "X of 30 transactions this month".
2. Crear income+expenses combinados hasta 23 → la barra pasa de emerald a amber al cruzar 24.
3. **Toast 80%**: al crear la transacción #24, después del `revalidatePath` debe aparecer el toast warning: "You've used 24 of 30 transactions this month. Consider upgrading to Pro." Crear la #25-#29 NO repite el toast (solo cruzar el umbral lo dispara).
4. Al llegar a 30: barra roja, botones disabled, click abre `UpgradePrompt`.
5. **Server-side**: el create #31 retorna toast de error desde el server.

### Página /dashboard/upgrade
1. Sidebar (mientras `plan === "free"`) tiene un nav item "Upgrade" con icono Sparkles + badge "New" emerald al final de la lista.
2. Click → llega a `/dashboard/upgrade`. Layout: header centrado con badge, 3 cards en grid (1 col mobile, 3 col lg).
3. La card del plan actual ("Free" si recién señalado en DB) tiene badge "Current plan" arriba y CTA disabled "Current plan".
4. Pro card tiene borde emerald, ring, sombra y badge "Most popular". Lifetime con CTA outline.
5. Click en "Upgrade to Pro — $9/mo" o "Get Lifetime $69" → toast info: "Payments are coming soon! You'll be notified when Pro is available."

### Settings — Plan card
1. `/dashboard/settings` → debajo de Financial aparece la card "Your plan" con badge gris "Free".
2. Dos progress rows visibles: "Clients" (X / 3) y "Transactions this month" (Y / 30) con barras de color dinámico.
3. Botón "Upgrade to Pro" → `/dashboard/upgrade`.
4. Si manualmente se cambia `users.plan = 'pro'` en Supabase y se recarga: el badge se vuelve emerald "Pro", los rows muestran "X / unlimited" con barras emerald llenas, y el botón Upgrade desaparece.

### Banner de upgrade en Dashboard
1. `/dashboard` → arriba de todo (después del empty state si aplica) aparece banner emerald sutil: "You're on the Free plan. Upgrade to Pro for unlimited tracking. [Upgrade →]".
2. Click en X → desaparece. `localStorage.freeledger:upgrade-banner-dismissed-at` queda con un timestamp.
3. Recargar la página → banner sigue oculto.
4. **Test de re-aparición**: en devtools, eliminar la key del localStorage (o setear un timestamp viejo manualmente: `localStorage.setItem("freeledger:upgrade-banner-dismissed-at", "0")`). Recargar → vuelve a aparecer.
5. Cambiar `users.plan = 'pro'` en DB → banner deja de renderizarse aunque el localStorage no tenga dismiss.

### Sidebar badge de plan
1. Plan Free → badge gris "Free" al lado del display name (sidebar desktop + mobile sheet).
2. Cambiar a Pro o Lifetime en DB → badge se vuelve emerald con el nombre del plan, y el nav item "Upgrade" desaparece del sidebar.

### Webhook placeholder
1. `curl -X POST http://localhost:3000/api/webhooks/lemonsqueezy -d '{}'` → `{ "received": true }` con 200. (Sin verificación de firma todavía — eso es TODO.)

### UpgradePrompt directo
1. Estando en Income/Expenses con limit reached, click en cualquier botón Add → se abre el dialog paywall.
2. Verificar copy correcto según `kind`: "Upgrade to Pro for unlimited transactions" en income/expenses, "Upgrade to Pro for unlimited clients" en clients.
3. Lista de 4 features con checks emerald.
4. "Maybe later" cierra el dialog. "Upgrade to Pro — $9/mo" navega a `/dashboard/upgrade`.

---

## ✅ Día 9 — Activación real de pagos LemonSqueezy (11 mayo 2026)

### Lo que se hizo

**Datos reales de LemonSqueezy cableados**
- `src/lib/lemonsqueezy.ts` — reemplazados los placeholders por los IDs reales:
  - `LEMON_STORE_ID = 366692`.
  - `LEMON_VARIANTS = { pro_monthly: 1634640, lifetime: 1634662 }`. Se eliminó `pro_yearly` (no hay producto yearly).
  - `LemonSqueezyWebhookEvent.data.attributes` extendido con `first_order_item?: { variant_id }` (campo que aparece en eventos `order_created` con line items).
- Nueva función `getCheckoutUrl(variantId, userId, userEmail)`: construye la URL del LemonSqueezy hosted checkout en `https://freeledger.lemonsqueezy.com/buy/<variantId>` con `checkout[custom][user_id]`, `checkout[email]` y `checkout[success_url]=https://freeledger.dev/dashboard?upgraded=true` (URL-encoded vía `URLSearchParams`).

**Webhook handler completo**
- `src/app/api/webhooks/lemonsqueezy/route.ts` — reemplaza el placeholder de Día 8. Flujo:
  1. `runtime = "nodejs"` (necesario para `crypto` y para el cliente service-role).
  2. Lee el body con `request.text()` (no `request.json()` — la firma se calcula sobre el raw body) y el header `x-signature`.
  3. `verifySignature(payload, signature, secret)` calcula HMAC SHA256 hex del raw body con `LEMON_SQUEEZY_WEBHOOK_SECRET` y compara con `crypto.timingSafeEqual` sobre `Buffer.from(..., "hex")`. **Antes** del `timingSafeEqual` se compara `signatureBuf.length !== digestBuf.length` y se retorna `false` para evitar el throw que tira `timingSafeEqual` cuando los buffers difieren en longitud (importante porque un atacante podría mandar una firma corta y crashear el handler).
  4. Si la firma no valida → `401 { error: "Invalid signature" }`. Si no viene `user_id` en `custom_data` → `400`.
  5. Switch sobre `meta.event_name`:
     - `subscription_created` / `subscription_updated` con `status ∈ {"active", "on_trial"}` → `users.plan = 'pro'`.
     - `subscription_cancelled` / `subscription_expired` → `users.plan = 'free'`.
     - `order_created` con `variant_id === LEMON_VARIANTS.lifetime` (1634662) → `users.plan = 'lifetime'`. Lee tanto `attributes.first_order_item.variant_id` como `attributes.variant_id` (LS varía el shape según el evento).
  6. Errores se loggean y devuelven `500 { error: "Webhook processing failed" }`.
- El cliente Supabase para el webhook se crea con `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` (no la anon key) para poder hacer `update` sobre `users` sin sesión autenticada. El service role bypassa RLS — por eso vive **solo** en este Route Handler y nunca cruza al cliente.

**Checkout API**
- Nuevo `src/app/api/checkout/route.ts` — Route Handler `GET` server-side:
  1. `supabase.auth.getUser()`. Si no hay sesión → redirige a `/login?next=/dashboard/upgrade` (en vez de devolver 401, mejor UX si el botón se clicketea con la sesión expirada).
  2. Lee `?plan=pro_monthly` o `?plan=lifetime` con type guard `isLemonVariant`. Plan inválido → `400`.
  3. Llama `getCheckoutUrl(LEMON_VARIANTS[plan], user.id, user.email)` y hace `NextResponse.redirect(checkoutUrl)`.
- Resultado: los botones de upgrade pueden ser un simple `<a href="/api/checkout?plan=...">` y el servidor inyecta el `user_id` correcto en el custom_data sin que el cliente lo manipule.

**UpgradeCtaButton cableado al checkout real**
- `src/components/upgrade/upgrade-cta-button.tsx` — rediseñado:
  - Nueva prop obligatoria `plan: "pro_monthly" | "lifetime"`.
  - Click ejecuta `window.location.href = '/api/checkout?plan=<plan>'` envuelto en `useTransition` + flag `hasRedirected` para mostrar estado loading.
  - Mientras redirige: spinner `Loader2 animate-spin` + label "Redirecting…" y `disabled` para evitar dobles clicks.
  - Si la asignación a `window.location` lanza, se resetea el estado y se muestra `toast.error("Could not start checkout. Please try again.")`.

**Upgrade page con CTAs en vivo**
- `src/app/(dashboard)/dashboard/upgrade/page.tsx`:
  - `Tier` ahora declara `checkoutPlan?: "pro_monthly" | "lifetime"`.
  - Tier Pro: label `"Upgrade to Pro — $9/mo"`, `checkoutPlan: "pro_monthly"`.
  - Tier Lifetime: label `"Get Lifetime $69"`, `checkoutPlan: "lifetime"`.
  - Los `<UpgradeCtaButton>` reciben el `plan` y solo se renderizan si el tier tiene `checkoutPlan` definido — guarda contra mostrar un botón "primario" sin destino.
  - El botón del tier Free sigue siendo "Current plan" disabled cuando aplica.

**UpgradePrompt apunta directo al checkout**
- `src/components/shared/upgrade-prompt.tsx` — el link "Upgrade to Pro — $9/mo" ahora apunta a `/api/checkout?plan=pro_monthly` (antes iba a `/dashboard/upgrade`). Razón: cuando el usuario ya está mirando el paywall por límite alcanzado, llevarlo a otra página de comparación es fricción innecesaria — el botón promete checkout, así que abre checkout.
- El banner del dashboard y la plan card de settings **se mantienen** apuntando a `/dashboard/upgrade` (intencional: esos accesos son menos urgentes y conviene que el usuario vea la comparación de planes antes de pagar).

**Success state al volver del checkout**
- Nuevo `src/components/dashboard/upgrade-success-toast.tsx` (`"use client"`):
  - Lee `useSearchParams()` y dispara `toast.success("Welcome to Pro! 🎉 Your upgrade is active. Enjoy unlimited tracking.", { duration: 6000 })` cuando detecta `?upgraded=true`.
  - Un `useRef(firedRef)` evita re-disparos en re-renders.
  - Después del toast, `router.replace()` limpia el param `upgraded` de la URL sin reload (`scroll: false`).
- Montado en `src/app/(dashboard)/dashboard/page.tsx` dentro de `<Suspense fallback={null}>` (requerido por Next 16 para `useSearchParams` en componentes que podrían sufrir bail-out de static rendering).
- Importante: hay un gap natural entre "vuelves del checkout" y "tu plan está actualizado en la DB" porque el webhook procesa asíncronamente. El toast confirma que la transacción fue exitosa según LemonSqueezy; el badge del sidebar puede tardar 1-3 segundos en reflejar el nuevo plan tras el siguiente render. No se hace polling — un refresh manual basta y mantiene la UX simple.

**Botones que no cambian (intencional)**
- **Landing pricing cards**: se mantienen como "Join the waitlist" porque el registro sigue cerrado. Cuando el registro abra al público, se ajustan en su propio día.
- **Sidebar / mobile nav "Upgrade" item**: sigue navegando a `/dashboard/upgrade` (ahí están las 3 opciones).
- **Settings → Plan card "Upgrade to Pro"**: sigue a `/dashboard/upgrade`.
- **Dashboard banner "Upgrade →"**: sigue a `/dashboard/upgrade`.

**Env vars**
- `.env.example` actualizado con `SUPABASE_SERVICE_ROLE_KEY` (server-only). La variable ya está presente en `.env.local` del owner; falta agregarla en Vercel Production.

### Rutas tras Día 9

```
/api/checkout                          GET — auth + redirect a LemonSqueezy con user_id+email pre-llenados
/api/webhooks/lemonsqueezy             POST — firma HMAC verificada + update users.plan según evento
```
(el resto de rutas sin cambios respecto a Día 8.)

### Estructura nueva (Día 9)

```
src/
├── app/api/
│   ├── checkout/route.ts                    — NEW — redirige al checkout LemonSqueezy
│   └── webhooks/lemonsqueezy/route.ts       — reescrito (verificación firma + switch eventos)
├── components/
│   ├── dashboard/upgrade-success-toast.tsx  — NEW — toast cuando ?upgraded=true
│   ├── shared/upgrade-prompt.tsx            — link ahora va a /api/checkout?plan=pro_monthly
│   └── upgrade/upgrade-cta-button.tsx       — rediseñado con prop `plan` + loading state
└── lib/lemonsqueezy.ts                      — IDs reales + LEMON_STORE_ID + getCheckoutUrl()
```

### Calidad

- `next build` → ✅ limpio, **25 rutas** (las 24 de Día 8 + `/api/checkout`), 0 errores.
- TypeScript estricto: no se introdujeron `any`. El webhook event type ya soporta `first_order_item` opcional.
- Sin nuevas dependencias.
- El webhook usa `crypto` y `runtime = "nodejs"` (no edge) — `crypto.timingSafeEqual` y `Buffer` requieren el runtime de Node.

### Decisiones / consideraciones

- **Success URL hard-coded a `https://freeledger.dev/dashboard?upgraded=true`** — pedido explícito del prompt. Esto significa que un checkout disparado desde `localhost:3000` redirige a producción al terminar. Para testing local, una alternativa sería usar `${process.env.NEXT_PUBLIC_APP_URL}` pero requiere que la env exista y sea pública del lado server, y la decisión actual es preferir simplicidad de configuración. Si se quiere cambiar, es un one-liner en `getCheckoutUrl()`.
- **`SUPABASE_SERVICE_ROLE_KEY` solo se lee en `src/app/api/webhooks/lemonsqueezy/route.ts`**. Si en algún momento se necesita el service role en otro server-only path, conviene moverlo a un módulo dedicado (`src/lib/supabase/admin.ts`) y nunca tocarlo desde código que pueda llegar al bundle del cliente. Nunca prefijar la variable con `NEXT_PUBLIC_`.
- **`timingSafeEqual` con length check previo**: la documentación de Node.js es explícita en que `timingSafeEqual` **tira** si los buffers tienen longitudes distintas. Comparar lengths antes y retornar `false` cubre ese vector (atacante mandando una firma vacía/corta para tumbar el handler en vez de obtener `401`).
- **`on_trial` cuenta como Pro**: si LemonSqueezy emite `subscription_created` con `status=on_trial` (caso de un cupón/trial), se sube a `plan='pro'`. Cuando expire el trial sin convertir, LS manda `subscription_expired` y baja a free.
- **`order_created` se filtra a `variant_id === lifetime`**: el evento `order_created` también dispara con compras de Pro (que además generan un `subscription_created`). Solo nos interesa el lifetime aquí — el subscription event ya maneja el Pro mensual.
- **El webhook actualmente no persiste `customer_id` ni `variant_id` en el row del user**. El plan original (Día 8) lo tenía como TODO. Se omitió en Día 9 porque la columna no existe en `users` y agregar el ALTER TABLE no estaba en el alcance. Si en algún momento se quiere abrir el customer portal de LemonSqueezy para autoservicio de cancelación, esto será necesario.
- **`window.location.href` vs `router.push`**: para el checkout se usa la primera porque el target es un dominio externo (LemonSqueezy). `router.push` solo navega dentro de la app.

### Pasos manuales pendientes (post-Día 9)

1. **SQL en Supabase** — asegurar que el constraint de `users.plan` permite `lifetime`:
   ```sql
   ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;
   ALTER TABLE users ADD CONSTRAINT users_plan_check CHECK (plan IN ('free', 'pro', 'lifetime'));
   ```
   (Era el paso 1 pendiente de Día 8 — sigue pendiente. Sin esto, el webhook fallará silenciosamente al intentar setear `plan='lifetime'`.)
2. **Vercel env vars** (Production + Preview):
   - `SUPABASE_SERVICE_ROLE_KEY` — copiar de Supabase → Project Settings → API → `service_role` key (es la clave secreta, no la anon).
   - `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_WEBHOOK_SECRET`, `LEMON_SQUEEZY_STORE_ID=366692` — si aún no están.
   - `NEXT_PUBLIC_APP_URL=https://freeledger.dev` — confirmar.
3. **LemonSqueezy webhook**: confirmar en LS Dashboard → Settings → Webhooks que el endpoint `https://freeledger.dev/api/webhooks/lemonsqueezy` está activo, suscrito al menos a `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`, `order_created`, y que el "Signing secret" coincide con `LEMON_SQUEEZY_WEBHOOK_SECRET` en Vercel.
4. **Test mode end-to-end** (post-deploy):
   - Activar test mode en LemonSqueezy (toggle arriba a la derecha del dashboard).
   - Loguearse en `https://freeledger.dev`, ir a `/dashboard/upgrade`, click en "Upgrade to Pro — $9/mo". Pagar con `4242 4242 4242 4242`.
   - Tras el checkout: verificar que vuelves a `/dashboard?upgraded=true`, que el toast aparece, y que `users.plan` cambió a `pro` en Supabase (puede tardar 1-3s).
   - Repetir con Lifetime para verificar el path de `order_created`.
   - Probar `Send test event` desde LemonSqueezy → debe responder `200 { received: true }`. Cambiar el signing secret en LS y reenviar → `401 Invalid signature`.
5. **(Opcional) Postlaunch cleanup**:
   - Bloquear CSV export para Free (`PLANS.free.canExportCSV = false` + guard server-side).
   - Persistir `lemon_customer_id` y `lemon_variant_id` en `users` para abrir el customer portal de LS.

---

## 🧪 Cómo probar Día 9 localmente

Pre-requisito: tener `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` (ya está). Test mode de LemonSqueezy activado.

### Checkout
1. `npm run dev` → loguearse → `/dashboard/upgrade`.
2. Click en "Upgrade to Pro — $9/mo" → el botón muestra spinner + "Redirecting…" → te lleva a `https://freeledger.lemonsqueezy.com/buy/1634640?...` con email pre-rellenado.
3. Confirmar visualmente que en la URL hay `checkout[custom][user_id]=<uuid>` y `checkout[email]=<tu email>`. Si la URL no contiene el `user_id`, el webhook nunca podrá vincular el pago al usuario correcto.
4. Pagar con `4242 4242 4242 4242` (test mode). La redirección de éxito te lleva a `https://freeledger.dev/dashboard?upgraded=true` — para ver el toast en local, manualmente copia el path y abre `http://localhost:3000/dashboard?upgraded=true`. Aparece el toast verde y la URL se limpia a `/dashboard`.
5. Repetir con "Get Lifetime $69" (variant 1634662) — mismo flujo pero el evento que dispara la actualización en el webhook es `order_created`.

### Webhook (localmente con ngrok, opcional)
1. `ngrok http 3000` → copiar la URL pública.
2. En LemonSqueezy → Webhooks → cambiar temporalmente el endpoint al de ngrok (`<ngrok>/api/webhooks/lemonsqueezy`).
3. En el dashboard de LS, abrir el webhook y click en "Send test event" → escoger `subscription_created`. Debe responder `200`.
4. Modificar el `LEMON_SQUEEZY_WEBHOOK_SECRET` en `.env.local` y volver a enviar → debe responder `401 Invalid signature`. Restaurar el valor real.
5. Restaurar el endpoint en LS al de producción cuando termines.

### Estados de error
1. **Sesión expirada**: cerrar sesión y abrir directamente `http://localhost:3000/api/checkout?plan=pro_monthly` → redirige a `/login?next=/dashboard/upgrade`.
2. **Plan inválido**: `http://localhost:3000/api/checkout?plan=foo` → `400 { error: "Invalid plan" }`.
3. **UpgradePrompt directo a checkout**: en `/dashboard/income` con límite alcanzado, click en "Add income" → se abre el paywall dialog → click en "Upgrade to Pro — $9/mo" → debe redirigirte directamente al checkout (no a `/dashboard/upgrade`).

### Toast de éxito (sin checkout real)
1. Loguearse y abrir manualmente `http://localhost:3000/dashboard?upgraded=true`.
2. Debe aparecer el toast verde "Welcome to Pro! 🎉 Your upgrade is active. Enjoy unlimited tracking." (6 segundos de duración).
3. Tras el toast la URL queda en `/dashboard` (param `upgraded` removido).
4. Refrescar la página → el toast NO vuelve a aparecer (porque ya no está el param).

---

## ✅ Día 10 — Emails con Resend + Testing E2E checklist (12 mayo 2026)

### Lo que se hizo

**Cliente Resend (lazy)**
- `src/lib/resend.ts` (nuevo) — singleton lazy del cliente Resend. La construcción `new Resend(apiKey)` se difiere hasta el primer `send()` real porque durante `next build` el step "Collecting page data" evalúa los módulos importados con la env stripped, y un cliente instanciado al top-level con `apiKey === undefined` rompe el build. Patrón:
  ```ts
  let client: Resend | null = null;
  function getClient() { if (!client) client = new Resend(process.env.RESEND_API_KEY!); return client; }
  export const resend = { emails: { send: (p) => getClient().emails.send(p) } };
  ```
- Constantes exportadas: `FROM_EMAIL = "FreeLedger <noreply@freeledger.dev>"` (con comentario que indica el fallback `onboarding@resend.dev` mientras DNS no esté verificado) y `APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freeledger.dev"`.
- `.env.example` actualizado con `RESEND_API_KEY=re_xxxxxxxxxxxx` y comentario que apunta a `https://resend.com/api-keys` y advierte que sin DNS verificado Resend solo entrega al email de la cuenta.

**Templates de email (HTML strings, sin React Email)**
- Decisión: **no se instaló `@react-email/components`**. La regla 7 del prompt lo permitía, y los HTML strings simples con tablas dan máxima compatibilidad Gmail / Outlook / Apple Mail / Yahoo sin agregar dependencias. Cada template exporta `xxxSubject()`, `xxxHtml(params)` y `xxxText(params)` (versión texto plano para clientes que no renderizan HTML).
- `src/lib/emails/components.ts` (nuevo) — building blocks reusables:
  - `escapeHtml(value)` — escapa `& < > " '`.
  - `emailLogo()` — "FreeLedger" en texto (no imagen).
  - `emailButton(label, href)` — CTA con tabla + fondo emerald `#10b981`, padding 12/24, radius 8, texto blanco bold.
  - `emailFooter()` — "You're receiving this because…" + link `freeledger.dev`.
  - `emailLayout({ preheader, body })` — wrapper con doctype, `<meta x-apple-disable-message-reformatting>`, preheader oculto (`display:none; max-height:0; mso-hide:all`) y outer table 600px max-width con padding 32, border 1px y radius 12.
  - Tipografía system stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`. Colores explícitos (hex) — los emails NO heredan Tailwind.
- `src/lib/emails/welcome.ts` (nuevo) — subject `"Welcome to FreeLedger! 🎉"`. Saludo personalizado con el primer token del `display_name` (o `"there"` si null). Lista numerada de 3 pasos (add client / record income / check Real Money). CTA "Go to Dashboard" → `${APP_URL}/dashboard`. Firma "— Jesús, founder of FreeLedger".
- `src/lib/emails/waitlist-confirmation.ts` (nuevo) — subject `"You're on the FreeLedger waitlist!"`. Body con agradecimiento + links a Twitter `@FreeLedgerApp` y `freeledger.dev`. Sin CTA button (intencional — el usuario aún no tiene cuenta).
- `src/lib/emails/upgrade-confirmation.ts` (nuevo) — `UpgradePlan = "pro" | "lifetime"`. Subject según plan (`"Welcome to FreeLedger Pro! 🚀"` o `"Welcome to FreeLedger Lifetime! 🎉"`). Body con lista de 4 features desbloqueados. Si `plan === "lifetime"`, párrafo extra: `"You have lifetime access — no monthly fees, ever. Thank you for being one of the first 200!"`.

**Wire-up: welcome email**
- **Decisión arquitectónica importante**: el welcome email se envía **únicamente desde `src/app/(dashboard)/dashboard/layout.tsx`** (no desde `signUpWithPassword`), con detección de "primera visita" vía el campo `users.welcome_email_sent`. Razón: cubre con una sola fuente de verdad los dos paths de signup (email/password y Google OAuth) y elimina el riesgo de doble envío. Trade-off: los usuarios de password no reciben el welcome inmediatamente al hacer signup (reciben primero el "verify email" de Supabase), sino al hacer su primera visita al dashboard tras verificar — esto es deseable porque alinea el welcome con el momento en que realmente empiezan a usar el producto.
- Implementación en `dashboard/layout.tsx`:
  - Se añade `welcome_email_sent` a la lista de columnas leídas del row de `users`.
  - Si `userRow.welcome_email_sent === false` y existe email, se envía el welcome (en `try/catch`, no bloquea el render) y se updatea `users.welcome_email_sent = true` con la misma sesión Supabase.
  - El name se resuelve en cascada: `userRow.display_name` → `user.user_metadata.full_name` → `user.user_metadata.name` → `null`.

**Wire-up: waitlist confirmation**
- `src/lib/actions/waitlist.ts` modificado — después del `insert` exitoso en `waitlist`, envuelve `resend.emails.send(...)` en `try/catch` con `console.error("Waitlist email failed:", emailError)`. La inserción nunca se revierte si el email falla — el lead sigue capturado, solo perdemos la confirmación.
- Se envía `html` + `text` para mejorar deliverability (los clientes que prefieren texto plano lo reciben sin tener que parsear HTML).

**Wire-up: upgrade confirmation**
- `src/app/api/webhooks/lemonsqueezy/route.ts` modificado — nuevo helper `sendUpgradeEmail(userId, plan)` que:
  1. Lee `email, display_name` desde `users` via service-role client.
  2. Envía el upgrade email correspondiente (Pro o Lifetime).
  3. Captura cualquier error con `console.error("Upgrade email failed:", ...)` — el plan ya quedó actualizado en DB, el email es best-effort.
- **Guard anti-duplicado**: el switch ahora hace `SELECT plan` antes del `UPDATE` y solo envía el email si la transición es **real** (free → pro, o no-lifetime → lifetime). Razón: LemonSqueezy emite `subscription_updated` en cada renovación mensual y en cambios menores (e.g. métodos de pago). Sin el guard, el usuario recibiría un "Welcome to Pro" cada mes.
  ```ts
  if (existing?.plan !== "pro" && existing?.plan !== "lifetime") {
    await sendUpgradeEmail(userId, "pro");
  }
  ```
- Para `order_created` (lifetime): el guard chequea `existing?.plan !== "lifetime"`.

**Testing checklist E2E (manual)**
- `TESTING_CHECKLIST.md` (nuevo, en root) — checklist exhaustivo en markdown con ~80 items agrupados por sección: Landing, Auth, Onboarding, Dashboard, Clients, Income, Expenses, Settings, Upgrade & Payments, Dark/Light Mode, Responsive, Performance, Emails.
- La sección Emails verifica: llegada al inbox, render correcto en Gmail/Outlook/Apple Mail, nombre personalizado en el welcome, dispatch único (no doble), guard de transición en upgrade, y graceful degradation si Resend está caído.

### Rutas tras Día 10

Sin nuevas rutas. Los emails se disparan desde Server Actions (`joinWaitlist`), Server Components (`dashboard/layout.tsx`) y Route Handlers (`api/webhooks/lemonsqueezy`) ya existentes.

### Estructura nueva (Día 10)

```
src/
└── lib/
    ├── resend.ts                                    — NEW — cliente lazy + FROM_EMAIL + APP_URL
    └── emails/                                      — NEW directorio
        ├── components.ts                            — emailLayout, emailButton, emailFooter, emailLogo, escapeHtml
        ├── welcome.ts                               — subject + html + text
        ├── waitlist-confirmation.ts                 — subject + html + text
        └── upgrade-confirmation.ts                  — subject + html + text (Pro / Lifetime)

TESTING_CHECKLIST.md                                 — NEW — checklist E2E manual con ~80 items
```

Archivos modificados:
- `src/app/(dashboard)/dashboard/layout.tsx` — lee `welcome_email_sent`, envía welcome en primera visita, marca el flag.
- `src/lib/actions/waitlist.ts` — envía confirmation tras insert exitoso.
- `src/app/api/webhooks/lemonsqueezy/route.ts` — envía upgrade email con guard de transición.
- `.env.example` — añade `RESEND_API_KEY`.

### Calidad

- `next build` → ✅ limpio, 25 rutas (sin cambios vs Día 9), 0 errores. **Verificado tras refactor lazy client** — el primer intento de build falló con `Missing API key. Pass it to the constructor` porque `new Resend(undefined)` se evaluaba al cargar el módulo durante page data collection; el patrón lazy lo arregla.
- TypeScript estricto, sin `any`.
- Sin nuevas dependencias (`resend` ya estaba instalado desde Día 1; `@react-email/components` descartado a propósito).
- Los emails NO bloquean el flujo principal: cada send está en `try/catch` con `console.error`. Si Resend está caído o la API key es inválida, el waitlist insert / signup / plan update siguen funcionando.

### Decisiones / consideraciones

- **HTML strings vs React Email**: descartado `@react-email/components` para mantener el bundle ligero y evitar el overhead de renderizar JSX en runtime. Las tablas HTML son el formato más portable entre clientes de email (especialmente Outlook 2016+ que aún no soporta flex/grid de forma consistente).
- **Welcome email solo desde dashboard layout**: ver decisión arquitectónica detallada arriba. Si en el futuro se quiere mover al Server Action de signup (e.g. para entregar el welcome antes de verificar el email), habría que también marcar `welcome_email_sent = true` ahí — pero conviene esperar a tener métricas reales de abridos.
- **El layout lee `welcome_email_sent` con la sesión del usuario (anon key + RLS)**: esto funciona porque la RLS de `users` permite `SELECT/UPDATE` sobre `auth.uid() = id`. No necesita service-role.
- **`escapeHtml` en el `name`**: el nombre del usuario viene del display_name (que el propio usuario controla) o de los metadata de OAuth — escapamos para evitar HTML injection en el inbox del usuario.
- **Plain text version (`text`)**: los providers (Gmail, Outlook) usan la versión texto cuando el cliente del receptor no acepta HTML o cuando el usuario tiene "show plain text" forzado. Adicionalmente, tener `text` ayuda al spam score — un email solo-HTML es señal débil de spam.
- **Preheader oculto**: el text dentro de `<div style="display:none">` aparece como preview en el inbox de Gmail/Apple Mail. Cada template define uno específico (e.g. `"Get started with FreeLedger in 3 quick steps."`).
- **Sender `noreply@freeledger.dev` requiere DNS verificado**: hasta que el usuario configure SPF/DKIM/DMARC en Namecheap y verifique en Resend, los envíos a destinatarios distintos de la cuenta de Resend rebotarán. El comentario en `resend.ts` apunta al fallback `onboarding@resend.dev` (un sender compartido que Resend habilita por defecto y entrega a cualquier email).

### Pasos manuales pendientes (post-Día 10)

1. **Añadir `RESEND_API_KEY` a `.env.local`** — obtenerla en `https://resend.com/api-keys` (permiso "Sending access"). Sin esto, el primer `resend.emails.send(...)` lanza `Error: RESEND_API_KEY is not set` y queda capturado en el `try/catch` (silencioso para el usuario).
2. **SQL en Supabase** — agregar la columna `welcome_email_sent`:
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT false;
   -- Opcional: marcar usuarios existentes como ya bienvenidos para evitar que reciban el email en su próxima visita
   UPDATE users SET welcome_email_sent = true WHERE created_at < now();
   ```
3. **DNS en Namecheap** para `freeledger.dev` — los valores exactos los da Resend al añadir el dominio. Registros típicos:
   - MX `send` → `feedback-smtp.us-east-1.amazonses.com` priority 10 (bounce/feedback).
   - TXT `send` → `v=spf1 include:amazonses.com ~all` (SPF).
   - TXT `resend._domainkey` → la cadena `p=MIG...` que Resend genera (DKIM).
   - TXT `_dmarc` → `v=DMARC1; p=none;` (DMARC, recomendado).
   - En Namecheap: Domain List → Manage → Advanced DNS → Add New Record. Host omite `.freeledger.dev` (Namecheap lo añade). TTL Automatic. Tras guardar, click "Verify DNS Records" en Resend (propagación 5 min – 1 h).
4. **Vercel env vars** — `RESEND_API_KEY` también en Production + Preview.
5. **Mientras DNS no esté verificado**: descomentar el fallback en `src/lib/resend.ts:30` (`FROM_EMAIL = "FreeLedger <onboarding@resend.dev>"`) para poder enviar a cualquier destinatario en testing.
6. **Test end-to-end**:
   - Waitlist: hacer signup con tu propio email (el de la cuenta de Resend, mientras DNS no esté listo) → verificar inbox + Resend Dashboard → Logs.
   - Welcome: login fresh con cuenta nueva → visitar `/dashboard` → verificar email + que el campo `welcome_email_sent` quedó en `true` en Supabase.
   - Upgrade: simular un webhook `order_created` con `variant_id=1634662` desde LS test mode → verificar email Lifetime + que el plan cambió a `lifetime` en DB.

---

## 🧪 Cómo probar Día 10 localmente

Pre-requisito: `RESEND_API_KEY` en `.env.local` + (opcional pero recomendado) sender de fallback activado mientras DNS no esté listo. SQL del paso 2 ejecutado en Supabase.

### Waitlist confirmation
1. `npm run dev` → abrir landing page → scroll a sección Waitlist.
2. Introducir un email (idealmente el mismo de tu cuenta Resend mientras DNS no esté verificado).
3. Submit → toast verde `"You're on the list!"`.
4. Verificar:
   - Supabase → tabla `waitlist` → la fila nueva está ahí.
   - Resend Dashboard → Logs → entrada con asunto `"You're on the FreeLedger waitlist!"`, status `Delivered`.
   - Inbox: el correo llega en < 30s. Verificar render en Gmail (web y mobile) y Apple Mail.
5. **Edge case fallo de Resend**: temporalmente poner una API key inválida en `.env.local`, reiniciar dev server, intentar otro email. La fila SÍ debe insertarse en `waitlist`. El terminal muestra `Waitlist email failed: ...`. El user recibe el toast verde igualmente (graceful degradation).

### Welcome email
1. Crear un usuario nuevo (signup con email/password O Google).
2. Para password: verificar el email en el link de Supabase → llegar a `/dashboard`.
3. Para Google: directamente cae en `/dashboard`.
4. Tras el render del layout: verificar inbox → llega "Welcome to FreeLedger! 🎉".
5. El saludo dice "Hi <primer nombre>," si el usuario tiene `display_name`, o "Hi there," si no.
6. Refrescar `/dashboard` → el email NO se reenvía. Verificar en Supabase que `welcome_email_sent = true`.
7. **Test de re-envío manual**: en Supabase, setear `welcome_email_sent = false` para tu user y volver a entrar a `/dashboard` → el email se vuelve a enviar.

### Upgrade confirmation
1. Activar test mode en LemonSqueezy.
2. `/dashboard/upgrade` → "Upgrade to Pro — $9/mo" → pagar con `4242 4242 4242 4242`.
3. Volver al dashboard. El webhook procesa async, así que esperar 2-3s.
4. Verificar:
   - Supabase → `users.plan = 'pro'`.
   - Resend Logs → email "Welcome to FreeLedger Pro! 🚀" → Delivered.
   - Inbox: el correo lista los 4 features desbloqueados (Unlimited clients/transactions, CSV export, Advanced filters) y el botón CTA "Go to Dashboard".
5. **Test de no-duplicado**: forzar otro `subscription_updated` desde LS Dashboard → "Send test event" → verificar que **NO** llega un segundo email (el guard `existing?.plan !== "pro"` lo bloquea).
6. Repetir con Lifetime — verificar que el body incluye el párrafo extra "You have lifetime access — no monthly fees, ever. Thank you for being one of the first 200!".

### Compatibilidad email clients
1. Gmail web (modo claro y oscuro) — verificar que el botón emerald se ve correctamente, que la tabla no se rompe, que el preheader aparece en la preview de la inbox list.
2. Gmail iOS / Android app.
3. Apple Mail (macOS / iOS).
4. Outlook web — verificar especialmente el botón (Outlook a veces no respeta `border-radius`; nuestro CTA cae en un cuadrado con esquinas rectas pero sigue funcional).
5. **Plain text fallback**: en cliente de email, ver "Show original" → confirmar que el text version es legible y tiene el link al dashboard.

---

## 📍 Comandos rápidos

```bash
npm run dev            # http://localhost:3000
npm run build          # production build (verificado Día 10: 25 rutas, 0 errores)
npx tsc --noEmit       # typecheck (limpio)
npm run lint           # eslint (errores pre-existentes únicamente, no nuevos)
```

---

## 📝 Notas de Next.js 16

- **`middleware.ts` → `proxy.ts`**: el archivo de middleware fue renombrado en Next 16. La función exportada es `proxy()`.
- **Auth en profundidad**: el guide de Next 16 advierte que el proxy *no* es suficiente como única capa de auth. Por eso `(dashboard)/layout.tsx` y `(dashboard)/dashboard/layout.tsx` también verifican `supabase.auth.getUser()` y la lógica de onboarding redirect vive en el layout, no en el proxy.
- **Route groups**: `/onboarding` y `/dashboard/*` viven dentro del mismo route group `(dashboard)` para compartir el auth gate, pero la presentación con sidebar está en un sub-layout (`/dashboard/layout.tsx`) para que la wizard de onboarding ocupe pantalla completa sin sidebar.
- **Route Handlers para CSV**: los exports usan el patrón estándar `GET()` de App Router en `src/app/api/export/*/route.ts` retornando `new Response(csv, { headers })`. Auth con `supabase.auth.getUser()` igual que en Server Actions.
- **searchParams en Server Components (Next 16)**: la prop `searchParams` es una `Promise<Record<string, string | string[] | undefined>>` y debe ser awaited. El helper `readParam(sp, key)` colapsa el caso `string[]` tomando el primero.
- Si hay duda sobre alguna API de Next 16, leer primero `node_modules/next/dist/docs/` antes de asumir comportamiento de versiones anteriores.
