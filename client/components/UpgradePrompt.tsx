"use client";

import { AppID, PlanTier } from '../../shared/stripe/plans-config';

const PLAN_HIERARCHY: PlanTier[] = ['free', 'bronze', 'silver', 'gold'];

const PLAN_PRICES: Record<Exclude<PlanTier, 'free'>, number> = {
  bronze: 4.99,
  silver: 14.99,
  gold: 29.99
};

const PLAN_COLORS: Record<PlanTier, string> = {
  free: '#6B7280',
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#F0C040'
};

interface UpgradePromptProps {
  app: AppID;
  currentTier: PlanTier;
  featureName?: string;
  onUpgrade?: (tier: PlanTier) => void;
}

export default function UpgradePrompt({
  app,
  currentTier,
  featureName,
  onUpgrade
}: UpgradePromptProps) {
  const currentIndex = PLAN_HIERARCHY.indexOf(currentTier);
  const nextTier = PLAN_HIERARCHY[currentIndex + 1] as Exclude<PlanTier, 'free'> | undefined;

  if (!nextTier) return null;

  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade(nextTier);
      return;
    }
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appName: app,
        planTier: nextTier,
        priceId: `price_${app}_${nextTier}`
      })
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <div className="bg-[#0B0F18] border border-[#C9A84C]/30 p-6 rounded-2xl flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `${PLAN_COLORS[nextTier]}20`, color: PLAN_COLORS[nextTier] }}
        >
          ⚡
        </div>
        <div>
          <p className="text-white font-bold uppercase text-sm tracking-widest">
            {featureName ? `"${featureName}" erfordert Upgrade` : 'Limit erreicht'}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Upgrade von{' '}
            <span className="text-white uppercase">{currentTier}</span>{' '}
            auf{' '}
            <span className="uppercase font-bold" style={{ color: PLAN_COLORS[nextTier] }}>
              {nextTier}
            </span>{' '}
            fuer nur {PLAN_PRICES[nextTier]}EUR/Monat
          </p>
        </div>
      </div>
      <button
        onClick={handleUpgrade}
        className="px-6 py-2 rounded-lg font-black uppercase text-xs text-black hover:opacity-90 transition-all"
        style={{ backgroundColor: PLAN_COLORS[nextTier] }}
      >
        Upgrade Now
      </button>
    </div>
  );
}
