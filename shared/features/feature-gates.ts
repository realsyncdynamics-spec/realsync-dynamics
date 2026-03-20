import { APP_PLANS, AppID, PlanTier } from '../stripe/plans-config';

export function checkFeatureAccess(
  plan: PlanTier,
  appName: AppID,
  featureName: string
): boolean {
  const allowedFeatures = APP_PLANS[appName]?.[plan]?.features || [];
  return allowedFeatures.includes(featureName) || allowedFeatures.includes('all_unlimited');
}

export function getUpgradeUrl(appName: AppID): string {
  return `/apps/${appName}/pricing`;
}

export function getNextTier(current: PlanTier): PlanTier | null {
  const order: PlanTier[] = ['free', 'bronze', 'silver', 'gold'];
  const idx = order.indexOf(current);
  return idx < order.length - 1 ? order[idx + 1] : null;
}
