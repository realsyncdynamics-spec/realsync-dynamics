import Stripe from 'stripe';
import { db } from '../db';
import { userSubscriptions } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, appName, planTier } = session.metadata || {};
      if (userId && appName) {
        await db.insert(userSubscriptions).values({
          userId,
          appName,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          planTier: planTier || 'bronze',
          status: 'active',
        }).onConflictDoUpdate({
          target: [userSubscriptions.userId, userSubscriptions.appName],
          set: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            planTier: planTier || 'bronze',
            status: 'active',
          },
        });
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const { userId, appName } = sub.metadata || {};
      if (userId && appName) {
        await db.update(userSubscriptions)
          .set({
            status: sub.status,
            planTier: sub.status === 'active' ? (sub.metadata.planTier || 'free') : 'free',
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          })
          .where(and(
            eq(userSubscriptions.userId, userId),
            eq(userSubscriptions.appName, appName)
          ));
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed for customer:', invoice.customer);
      break;
    }
  }
}

export function constructStripeEvent(body: string, sig: string): Stripe.Event {
  return stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
}
