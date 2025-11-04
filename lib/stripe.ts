import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
  typescript: true,
});

export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent,
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
      }
    );

    return updatedSubscription;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
}

export async function createCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    throw error;
  }
}

export async function listInvoices(customerId: string) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10,
    });
    return invoices;
  } catch (error) {
    console.error("Error listing invoices:", error);
    throw error;
  }
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
}
