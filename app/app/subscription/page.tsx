"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { Subscription } from "@/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    interval: "month",
    features: [
      "Up to 5 facilities",
      "Basic matching algorithm",
      "Email support",
      "Standard analytics",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    interval: "month",
    features: [
      "Up to 20 facilities",
      "Advanced matching algorithm",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    interval: "month",
    features: [
      "Unlimited facilities",
      "AI-powered matching",
      "24/7 dedicated support",
      "Enterprise analytics",
      "Custom development",
      "SLA guarantees",
    ],
  },
];

interface SubscriptionPageProps {
  currentSubscription?: Subscription;
}

export default function SubscriptionPage({
  currentSubscription,
}: SubscriptionPageProps) {
  const [loading, setLoading] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(planId);
      setError("");

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      const { clientSecret } = await response.json();

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Refresh the page to show updated subscription
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading("");
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading("manage");
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading("");
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Subscription Plans
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            {currentSubscription && (
              <div className="mb-8 bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Current Subscription
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      You are currently on the {currentSubscription.plan} plan.
                      Status: {currentSubscription.status}
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleManageSubscription}
                      disabled={loading === "manage"}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {loading === "manage"
                        ? "Loading..."
                        : "Manage Subscription"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      ${plan.price}
                      <span className="text-base font-normal text-gray-500">
                        /month
                      </span>
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="ml-3 text-sm text-gray-700">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={
                        loading === plan.id ||
                        currentSubscription?.plan === plan.id
                      }
                      className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading === plan.id && "opacity-50 cursor-not-allowed"
                      } ${
                        currentSubscription?.plan === plan.id &&
                        "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {loading === plan.id
                        ? "Processing..."
                        : currentSubscription?.plan === plan.id
                        ? "Current Plan"
                        : "Subscribe"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
