-- RealSync Dynamics: Stripe Scaling DB Schema
-- Run in Supabase SQL Editor

-- 1. User Subscriptions (maps user -> app -> plan)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  app_name TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_tier TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, app_name)
);

-- 2. User Activity Log (Datenkrake: cross-app tracking)
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  app_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  feature_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. App Usage Metrics (for gating/limits)
CREATE TABLE IF NOT EXISTS public.app_usage_metrics (
  user_id UUID REFERENCES auth.users NOT NULL,
  app_name TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  current_count INT DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, app_name, metric_name)
);

-- 4. Extend profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS current_plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;

-- 5. RLS Policies
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity"
  ON public.user_activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own metrics"
  ON public.app_usage_metrics FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Increment function for usage tracking
CREATE OR REPLACE FUNCTION public.increment_app_usage(
  u_id UUID,
  a_name TEXT,
  m_name TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.app_usage_metrics (user_id, app_name, metric_name, current_count)
  VALUES (u_id, a_name, m_name, 1)
  ON CONFLICT (user_id, app_name, metric_name)
  DO UPDATE SET current_count = app_usage_metrics.current_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Daily reset function (run via cron)
CREATE OR REPLACE FUNCTION public.reset_daily_usage() RETURNS VOID AS $$
BEGIN
  UPDATE public.app_usage_metrics
  SET current_count = 0, last_reset = NOW()
  WHERE metric_name LIKE 'daily_%'
  AND last_reset < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user
  ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_user_app
  ON public.user_activity_log(user_id, app_name);
CREATE INDEX IF NOT EXISTS idx_activity_created
  ON public.user_activity_log(created_at DESC);
