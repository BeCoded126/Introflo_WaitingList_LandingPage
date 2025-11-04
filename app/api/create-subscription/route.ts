import { NextResponse } from "next/server";
import { stripe, createSubscription } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/api";
import { createClient } from '@/lib/api';
import { cookies } from "next/headers";

const PRICE_IDS = {
  basic: process.env.STRIPE_BASIC_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { planId } = await req.json();
    const priceId = PRICE_IDS[planId as keyof typeof PRICE_IDS];

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get organization details
    const { data: org } = await supabase
      .from("organizations")
      .select("stripe_customer_id")
      .eq("id", user.org_id)
      .single();

    let customerId = org?.stripe_customer_id;

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          org_id: user.org_id,
        },
      });

      customerId = customer.id;

      // Update organization with customer ID
      await supabase
        .from("organizations")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.org_id);
    }

    // Create the subscription
    const { subscriptionId, clientSecret } = await createSubscription(
      customerId,
      priceId
    );

    return NextResponse.json({ subscriptionId, clientSecret });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Error creating subscription" },
      { status: 500 }
    );
  }
}
