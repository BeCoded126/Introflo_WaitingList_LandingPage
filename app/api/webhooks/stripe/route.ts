import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServerClient } from '@supabase/ssr';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  // Use the raw request headers to retrieve stripe signature
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice, supabase);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice,
          supabase
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const { data: customer } = await supabase
    .from("organizations")
    .select("id")
    .eq("stripe_customer_id", subscription.customer)
    .single();

  if (!customer) {
    throw new Error("Customer not found");
  }

  await supabase.from("subscriptions").insert({
    organization_id: customer.id,
    stripe_id: subscription.id,
    status: subscription.status,
    plan: subscription.items.data[0].price.nickname || "unknown",
    current_period_end: new Date(subscription.current_period_end * 1000),
  });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_id", subscription.id)
    .single();

  if (!existingSub) {
    await handleSubscriptionCreated(subscription, supabase);
    return;
  }

  await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      plan: subscription.items.data[0].price.nickname || "unknown",
      current_period_end: new Date(subscription.current_period_end * 1000),
    })
    .eq("stripe_id", subscription.id);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date(),
    })
    .eq("stripe_id", subscription.id);
}

async function handleInvoicePaid(invoice: Stripe.Invoice, supabase: any) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      last_payment_status: "paid",
      last_payment_date: new Date(),
    })
    .eq("stripe_id", subscriptionId);
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: any
) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      last_payment_status: "failed",
      last_payment_error: (invoice as any).last_payment_error?.message,
    })
    .eq("stripe_id", subscriptionId);
}
