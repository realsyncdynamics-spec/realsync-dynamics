import Stripe from 'stripe';
import { supabaseAdmin } from '../supabase/admin';
import { APP_PLANS, AppID } from '../../shared/stripe/plans-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const ALL_APPS: AppID[] = [
  'creatorseal', 'adengine', 'trendradar', 'contentforge',
  'collabhub', 'monetizemax', 'brandkit', 'analyticspro',
  'schedulemaster', 'fanconnect', 'mediavault', 'rightsguard'
];

/**
 * Called on every new user signup.
 * Creates a Stripe Customer and initializes Free plan for all 12 apps.
 */
export async function handleNewUserSignup(supabaseUser: {
  id: string;
  email: string;
}) {
  const { id, email } = supabaseUser;

  // 1. Create Stripe Customer
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_id: id }
  });

  // 2. Upsert profile with Stripe link
  await supabaseAdmin
    .from('profiles')
    .upsert({
      id,
      email,
      stripe_customer_id: customer.id,
      current_plan: 'free',
      is_onboarded: true
    });

  // 3. Initialize Free subscription for ALL 12 apps
  const appSubscriptions = ALL_APPS.map(app => ({
    user_id: id,
    app_name: app,
    stripe_customer_id: customer.id,
    plan_tier: 'free',
    status: 'active'
  }));

  await supabaseAdmin
    .from('user_subscriptions')
    .insert(appSubscriptions);

  // 4. Initialize usage metrics for each app
  const usageMetrics = ALL_APPS.map(app => ({
    user_id: id,
    app_name: app,
    metric_name: 'daily_usage',
    current_count: 0
  }));

  await supabaseAdmin
    .from('app_usage_metrics')
    .insert(usageMetrics);

  return { customerId: customer.id };
}

/**
 * Maps a Stripe Customer ID back to a Supabase user.
 */
export async function getUserByStripeCustomer(stripeCustomerId: string) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id, email, current_plan')
    .eq('stripe_customer_id', stripeCustomerId)
    .single();

  return data;
}

/**
 * Gets the current plan tier for a specific app.
 */
export async function getUserAppPlan(
  userId: string,
  appName: AppID
): Promise<string> {
  const { data } = await supabaseAdmin
    .from('user_subscriptions')
    .select('plan_tier')
    .eq('user_id', userId)
    .eq('app_name', appName)
    .single();

  return data?.plan_tier || 'free';
}
