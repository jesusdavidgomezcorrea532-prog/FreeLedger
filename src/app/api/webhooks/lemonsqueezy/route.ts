import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  LEMON_VARIANTS,
  type LemonSqueezyWebhookEvent,
} from "@/lib/lemonsqueezy";
import { APP_URL, FROM_EMAIL, resend } from "@/lib/resend";
import {
  upgradeEmailHtml,
  upgradeEmailSubject,
  upgradeEmailText,
  type UpgradePlan,
} from "@/lib/emails/upgrade-confirmation";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function sendUpgradeEmail(userId: string, plan: UpgradePlan) {
  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("email, display_name")
    .eq("id", userId)
    .single();

  if (!userData?.email) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userData.email,
      subject: upgradeEmailSubject(plan),
      html: upgradeEmailHtml({
        name: userData.display_name,
        plan,
        dashboardUrl: `${APP_URL}/dashboard`,
      }),
      text: upgradeEmailText({
        name: userData.display_name,
        plan,
        dashboardUrl: `${APP_URL}/dashboard`,
      }),
    });
  } catch (emailError) {
    console.error("Upgrade email failed:", emailError);
  }
}

function verifySignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  const signatureBuf = Buffer.from(signature, "hex");
  const digestBuf = Buffer.from(digest, "hex");
  if (signatureBuf.length !== digestBuf.length) return false;
  return crypto.timingSafeEqual(signatureBuf, digestBuf);
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? "";

    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as LemonSqueezyWebhookEvent;
    const eventName = event.meta?.event_name;
    const userId = event.meta?.custom_data?.user_id;

    if (!userId) {
      return NextResponse.json(
        { error: "No user_id in custom_data" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated": {
        const status = event.data?.attributes?.status;
        if (status === "active" || status === "on_trial") {
          const { data: existing } = await supabaseAdmin
            .from("users")
            .select("plan")
            .eq("id", userId)
            .single();

          await supabaseAdmin
            .from("users")
            .update({ plan: "pro", updated_at: now })
            .eq("id", userId);

          // Only email on the upgrade transition, not on every subscription
          // renewal/update event LemonSqueezy fires.
          if (existing?.plan !== "pro" && existing?.plan !== "lifetime") {
            await sendUpgradeEmail(userId, "pro");
          }
        }
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        await supabaseAdmin
          .from("users")
          .update({ plan: "free", updated_at: now })
          .eq("id", userId);
        break;
      }

      case "order_created": {
        const variantId =
          event.data?.attributes?.first_order_item?.variant_id ??
          event.data?.attributes?.variant_id;
        if (variantId === LEMON_VARIANTS.lifetime) {
          const { data: existing } = await supabaseAdmin
            .from("users")
            .select("plan")
            .eq("id", userId)
            .single();

          await supabaseAdmin
            .from("users")
            .update({ plan: "lifetime", updated_at: now })
            .eq("id", userId);

          if (existing?.plan !== "lifetime") {
            await sendUpgradeEmail(userId, "lifetime");
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
