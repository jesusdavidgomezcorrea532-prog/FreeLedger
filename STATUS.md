# FreeLedger — Estado del proyecto

> Snapshot al 5 de mayo de 2026 (fin del Día 7 — Polish, SEO, legal, landing redesign, loading/error states).
> Stack: Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Recharts · Sonner · lucide-react · next-themes.

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

## 🗺️ Después del Día 6 — siguientes hitos

- **Día 7 — Pulido y deploy a producción** (favicon, OG image, robots/sitemap, smoke tests, monitoring, plan paywall, posiblemente date range filter en lugar/además de month picker).
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

## 📍 Comandos rápidos

```bash
npm run dev            # http://localhost:3000
npm run build          # production build (verificado Día 7: 22 rutas, 0 errores)
npx tsc --noEmit       # typecheck (limpio)
npm run lint           # eslint (4 errores pre-existentes, no introducidos en Día 7)
```

---

## 📝 Notas de Next.js 16

- **`middleware.ts` → `proxy.ts`**: el archivo de middleware fue renombrado en Next 16. La función exportada es `proxy()`.
- **Auth en profundidad**: el guide de Next 16 advierte que el proxy *no* es suficiente como única capa de auth. Por eso `(dashboard)/layout.tsx` y `(dashboard)/dashboard/layout.tsx` también verifican `supabase.auth.getUser()` y la lógica de onboarding redirect vive en el layout, no en el proxy.
- **Route groups**: `/onboarding` y `/dashboard/*` viven dentro del mismo route group `(dashboard)` para compartir el auth gate, pero la presentación con sidebar está en un sub-layout (`/dashboard/layout.tsx`) para que la wizard de onboarding ocupe pantalla completa sin sidebar.
- **Route Handlers para CSV**: los exports usan el patrón estándar `GET()` de App Router en `src/app/api/export/*/route.ts` retornando `new Response(csv, { headers })`. Auth con `supabase.auth.getUser()` igual que en Server Actions.
- **searchParams en Server Components (Next 16)**: la prop `searchParams` es una `Promise<Record<string, string | string[] | undefined>>` y debe ser awaited. El helper `readParam(sp, key)` colapsa el caso `string[]` tomando el primero.
- Si hay duda sobre alguna API de Next 16, leer primero `node_modules/next/dist/docs/` antes de asumir comportamiento de versiones anteriores.
