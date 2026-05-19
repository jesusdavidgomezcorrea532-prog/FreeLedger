# FreeLedger — Testing E2E Checklist

## Landing Page
- [ x ] Landing page carga correctamente en freeledger.dev
- [ x ] Responsive: se ve bien en mobile (Chrome DevTools 375px)
- [ x ] Dark mode y light mode toggle funciona
- [ x ] Nav links "Features" y "Pricing" hacen smooth scroll
- [ x ] "Join the waitlist" hace scroll a la sección de waitlist
- [ x ] Waitlist form: email válido → toast success + email aparece en Supabase table waitlist
- [ x ] Waitlist form: email duplicado → toast "already on the list"
- [ x ] Waitlist form: email inválido → error de validación
- [ x ] Waitlist confirmation email llega al inbox
- [ x ] Footer: link "Admin login" lleva a /login
- [ x ] Footer: links a Privacy y Terms funcionan
- [ x ] OG image: verificar en https://www.opengraph.xyz/ con URL freeledger.dev
- [ x ] Pricing cards muestran "Coming soon" badge

## Auth
- [ x ] /signup muestra mensaje "We're not quite ready yet" + waitlist form
- [ x ] /login carga correctamente
- [ x ] Login con email/password funciona → redirect a /dashboard
- [ x ] Login con Google funciona → redirect a /dashboard
- [ x ] Login con credenciales incorrectas → error message
- [ x ] /dashboard sin sesión → redirect a /login
- [ x ] /login ya autenticado → redirect a /dashboard
- [ x ] Sign out funciona → redirect a landing page
- [ ] Welcome email llega después del signup (en la primera visita al dashboard)

## Onboarding
- [ x ] Primer login → redirect a /onboarding (si no completado)
- [ x ] Paso 1: seleccionar país → currency y tax_rate se actualizan automáticamente
- [ x ] Paso 2: tax rate slider funciona, fiscal year dropdown funciona
- [ x ] Paso 3: crear cliente funciona, "Skip for now" funciona
- [ x ] Después de completar → redirect a /dashboard
- [ x ] Segundo login → NO redirect a onboarding (ya completado)

## Dashboard
- [ x ] Dashboard carga con los datos correctos
- [ x ] Summary cards muestran valores correctos (income, expenses, tax reserve, real money)
- [ x ] "Real Money" card muestra comparación vs mes anterior
- [ x ] Monthly trend chart (line chart) muestra últimos 6 meses
- [ x ] Income by client chart (pie chart) muestra distribución correcta
- [ x ] Expenses by category chart (bar chart) muestra categorías
- [ x ] Recent transactions muestra las últimas 5
- [ x ] Month picker cambia los datos
- [ x ] Quick action buttons ("+ Add Income", "+ Add Expense") funcionan
- [ x ] Empty state aparece cuando no hay datos
- [ x ] Upgrade banner aparece para plan Free
- [ x ] Responsive en mobile

## Clients
- [ x ] Lista de clientes muestra todos los clientes
- [ x ] "Add client" → formulario funciona → cliente aparece en la lista
- [ x ] Edit client → cambios se guardan
- [ x ] Delete client → confirmación → cliente eliminado
- [ x ] Límite de 3 clientes (Free): al intentar crear el 4to → error + upgrade prompt
- [ x ] Usage indicator "X of 3 clients" visible
- [ x ] Empty state cuando no hay clientes

## Income
- [ x ] Lista de ingresos del mes actual
- [ x ] "Add income" → formulario funciona, dropdown de clientes muestra NOMBRES (no UUIDs)
- [ x ] Edit income funciona
- [ x ] Delete income funciona
- [ x ] Total del mes se actualiza correctamente
- [ x ] Filtro por cliente funciona
- [ x ] Filtro por status (All/Received/Pending) funciona
- [ x ] Búsqueda por descripción funciona
- [ x ] Sorting por columnas funciona
- [ x ] Month picker cambia el mes
- [ x ] Límite de 30 transacciones/mes (Free): después de 30 → error + upgrade prompt
- [ x ] Toast al 80% del límite (24+ transacciones)

## Expenses
- [ x ] Lista de gastos del mes actual
- [ x ] "Add expense" → formulario funciona
- [ x ] Categorías dropdown funciona
- [ x ] Tipo (Business/Personal/Mixed) funciona
- [ x ] Si Mixed → slider de deductible % aparece
- [ x ] Edit y delete funcionan
- [ x ] Filtros por categoría y tipo funcionan
- [ x ] Búsqueda y sorting funcionan

## Settings
- [ x ] Profile: editar nombre funciona
- [ x ] Financial: cambiar país → currency y tax_rate se actualizan → SE GUARDAN al recargar
- [ x ] Account: plan info muestra el plan correcto
- [ x ] Usage muestra X/3 clients y Y/30 transactions
- [ x ] Export CSV: Income, Expenses, All → descargan archivos correctos
- [ x ] "Upgrade to Pro" link lleva a /dashboard/upgrade

## Upgrade & Payments
- [ x ] /dashboard/upgrade muestra 3 planes correctamente
- [ x ] Badge "Current plan" visible y NO cortado
- [ x ] Botón "Upgrade to Pro" → redirect a LemonSqueezy checkout
- [ x ] Botón "Get Lifetime" → redirect a LemonSqueezy checkout
- [ x ] Checkout con tarjeta 4242... → pago exitoso → redirect a dashboard con ?upgraded=true
- [ x ] Toast de éxito "Welcome to Pro!" aparece
- [ x ] Plan en sidebar cambia de "Free" a "Pro"
- [ x ] Límites se eliminan (puede crear 4+ clientes, 30+ transacciones)
- [ x ] Upgrade confirmation email llega

## Dark/Light Mode
- [ x ] Toggle funciona en landing page y dashboard
- [ x ] Todos los componentes se ven bien en ambos modos
- [ x ] Charts son legibles en ambos modos
- [ x ] Modals/dialogs se ven bien en ambos modos

## Responsive (Mobile)
- [ x ] Landing page en 375px width
- [ x ] Dashboard en 375px width (sidebar como drawer)
- [ x ] Income/Expenses tables con scroll horizontal si necesario
- [ x ] Modals de formularios usables en mobile
- [ x ] Auth pages centradas correctamente

## Performance
- [ x ] Lighthouse score > 80 en todas las páginas públicas
- [ x ] Dashboard carga en < 3 segundos
- [ x ] No errores en console del browser
