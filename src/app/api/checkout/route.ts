import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CHECKOUT_URLS, getCheckoutUrl } from '@/lib/lemonsqueezy'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const plan = searchParams.get('plan') as 'pro_monthly' | 'lifetime'

  if (!plan || !CHECKOUT_URLS[plan]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const checkoutUrl = getCheckoutUrl(plan, user.id, user.email || '')

  return NextResponse.redirect(checkoutUrl)
}
