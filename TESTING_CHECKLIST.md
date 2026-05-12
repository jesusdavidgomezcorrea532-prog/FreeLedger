# FreeLedger — Testing E2E Checklist

## Landing Page
- [ ] Landing page carga correctamente en freeledger.dev
- [ ] Responsive: se ve bien en mobile (Chrome DevTools 375px)
- [ ] Dark mode y light mode toggle funciona
- [ ] Nav links "Features" y "Pricing" hacen smooth scroll
- [ ] "Join the waitlist" hace scroll a la sección de waitlist
- [ ] Waitlist form: email válido → toast success + email aparece en Supabase table waitlist
- [ ] Waitlist form: email duplicado → toast "already on the list"
- [ ] Waitlist form: email inválido → error de validación
- [ ] Waitlist confirmation email llega al inbox
- [ ] Footer: link "Admin login" lleva a /login
- [ ] Footer: links a Privacy y Terms funcionan
- [ ] OG image: verificar en https://www.opengraph.xyz/ con URL freeledger.dev
- [ ] Pricing cards muestran "Coming soon" badge

## Auth
- [ ] /signup muestra mensaje "We're not quite ready yet" + waitlist form
- [ ] /login carga correctamente
- [ ] Login con email/password funciona → redirect a /dashboard
- [ ] Login con Google funciona → redirect a /dashboard
- [ ] Login con credenciales incorrectas → error message
- [ ] /dashboard sin sesión → redirect a /login
- [ ] /login ya autenticado → redirect a /dashboard
- [ ] Sign out funciona → redirect a landing page
- [ ] Welcome email llega después del signup (en la primera visita al dashboard)

## Onboarding
- [ ] Primer login → redirect a /onboarding (si no completado)
- [ ] Paso 1: seleccionar país → currency y tax_rate se actualizan automáticamente
- [ ] Paso 2: tax rate slider funciona, fiscal year dropdown funciona
- [ ] Paso 3: crear cliente funciona, "Skip for now" funciona
- [ ] Después de completar → redirect a /dashboard
- [ ] Segundo login → NO redirect a onboarding (ya completado)

## Dashboard
- [ ] Dashboard carga con los datos correctos
- [ ] Summary cards muestran valores correctos (income, expenses, tax reserve, real money)
- [ ] "Real Money" card muestra comparación vs mes anterior
- [ ] Monthly trend chart (line chart) muestra últimos 6 meses
- [ ] Income by client chart (pie chart) muestra distribución correcta
- [ ] Expenses by category chart (bar chart) muestra categorías
- [ ] Recent transactions muestra las últimas 5
- [ ] Month picker cambia los datos
- [ ] Quick action buttons ("+ Add Income", "+ Add Expense") funcionan
- [ ] Empty state aparece cuando no hay datos
- [ ] Upgrade banner aparece para plan Free
- [ ] Responsive en mobile

## Clients
- [ ] Lista de clientes muestra todos los clientes
- [ ] "Add client" → formulario funciona → cliente aparece en la lista
- [ ] Edit client → cambios se guardan
- [ ] Delete client → confirmación → cliente eliminado
- [ ] Límite de 3 clientes (Free): al intentar crear el 4to → error + upgrade prompt
- [ ] Usage indicator "X of 3 clients" visible
- [ ] Empty state cuando no hay clientes

## Income
- [ ] Lista de ingresos del mes actual
- [ ] "Add income" → formulario funciona, dropdown de clientes muestra NOMBRES (no UUIDs)
- [ ] Edit income funciona
- [ ] Delete income funciona
- [ ] Total del mes se actualiza correctamente
- [ ] Filtro por cliente funciona
- [ ] Filtro por status (All/Received/Pending) funciona
- [ ] Búsqueda por descripción funciona
- [ ] Sorting por columnas funciona
- [ ] Month picker cambia el mes
- [ ] Límite de 30 transacciones/mes (Free): después de 30 → error + upgrade prompt
- [ ] Toast al 80% del límite (24+ transacciones)

## Expenses
- [ ] Lista de gastos del mes actual
- [ ] "Add expense" → formulario funciona
- [ ] Categorías dropdown funciona
- [ ] Tipo (Business/Personal/Mixed) funciona
- [ ] Si Mixed → slider de deductible % aparece
- [ ] Edit y delete funcionan
- [ ] Filtros por categoría y tipo funcionan
- [ ] Búsqueda y sorting funcionan

## Settings
- [ ] Profile: editar nombre funciona
- [ ] Financial: cambiar país → currency y tax_rate se actualizan → SE GUARDAN al recargar
- [ ] Account: plan info muestra el plan correcto
- [ ] Usage muestra X/3 clients y Y/30 transactions
- [ ] Export CSV: Income, Expenses, All → descargan archivos correctos
- [ ] "Upgrade to Pro" link lleva a /dashboard/upgrade

## Upgrade & Payments
- [ ] /dashboard/upgrade muestra 3 planes correctamente
- [ ] Badge "Current plan" visible y NO cortado
- [ ] Botón "Upgrade to Pro" → redirect a LemonSqueezy checkout
- [ ] Botón "Get Lifetime" → redirect a LemonSqueezy checkout
- [ ] Checkout con tarjeta 4242... → pago exitoso → redirect a dashboard con ?upgraded=true
- [ ] Toast de éxito "Welcome to Pro!" aparece
- [ ] Plan en sidebar cambia de "Free" a "Pro"
- [ ] Límites se eliminan (puede crear 4+ clientes, 30+ transacciones)
- [ ] Upgrade confirmation email llega

## Dark/Light Mode
- [ ] Toggle funciona en landing page y dashboard
- [ ] Todos los componentes se ven bien en ambos modos
- [ ] Charts son legibles en ambos modos
- [ ] Modals/dialogs se ven bien en ambos modos

## Responsive (Mobile)
- [ ] Landing page en 375px width
- [ ] Dashboard en 375px width (sidebar como drawer)
- [ ] Income/Expenses tables con scroll horizontal si necesario
- [ ] Modals de formularios usables en mobile
- [ ] Auth pages centradas correctamente

## Performance
- [ ] Lighthouse score > 80 en todas las páginas públicas
- [ ] Dashboard carga en < 3 segundos
- [ ] No errores en console del browser

## Emails (Resend)
- [ ] Waitlist confirmation: llega al inbox, asunto correcto, links funcionan
- [ ] Waitlist confirmation: se ve bien en Gmail web, Gmail iOS, Apple Mail, Outlook
- [ ] Welcome email: llega después del primer login al /dashboard
- [ ] Welcome email: el nombre del usuario aparece correctamente (o "there" si no hay nombre)
- [ ] Welcome email: botón "Go to Dashboard" lleva a /dashboard
- [ ] Welcome email: solo se envía UNA VEZ (no en visitas posteriores)
- [ ] Upgrade Pro email: llega tras checkout exitoso de Pro
- [ ] Upgrade Lifetime email: llega tras checkout exitoso de Lifetime, incluye el mensaje extra de "first 200"
- [ ] Si Resend está caído / API key inválida → flujo principal NO se rompe (waitlist insert, signup, plan update siguen funcionando)
- [ ] Resend dashboard: verificar que los 3 tipos de emails aparecen en el log
