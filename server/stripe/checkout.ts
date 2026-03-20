import Stripe from 'stripe';
import type { AppID, PlanTier } from '../../shared/stripe/plans-config';
import { APP_PLANS } from '../../shared/stripe/plans-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function createCheckoutSession(opts: {
  priceId: string;
  appName: AppID;
  planTier: PlanTier;
  userId: string;
  email: string;
  baseUrl: string;
}) {
  const trialDays = APP_PLANS[opts.appName]?.[opts.planTier]?.trial_days;

  const session = await stripe.checkout.sessions.create({
    customer_email: opts.email,
    line_items: [{ price: opts.priceId, quantity: 1 }],
    mode: 'subscription',
    subscription_data: {
      trial_period_days: trialDays,
      metadata: { userId: opts.userId, appName: opts.appName, planTier: opts.planTier },
    },
    success_url: `${opts.baseUrl}/apps/${opts.appName}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.baseUrl}/apps/${opts.appName}/pricing`,
    metadata: { userId: opts.userId, appName: opts.appName, planTier: opts.planTier },
  });

  return { url: session.url };
}

export async function createPortalSession(stripeCustomerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return { url: session.url };
}
