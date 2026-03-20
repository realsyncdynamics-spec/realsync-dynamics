export type AppID =
  | 'creatorseal'
  | 'adengine'
  | 'trendradar'
  | 'contentforge'
  | 'collabhub'
  | 'monetizemax'
  | 'brandkit'
  | 'analyticspro'
  | 'schedulemaster'
  | 'fanconnect'
  | 'mediavault'
  | 'rightsguard';

export type PlanTier = 'free' | 'bronze' | 'silver' | 'gold';

export const UNIFIED_PRICES: Record<Exclude<PlanTier, 'free'>, { monthly: number }> = {
  bronze: { monthly: 4.99 },
  silver: { monthly: 14.99 },
  gold: { monthly: 29.99 },
};

export interface AppPlanConfig {
  daily_limit: number;
  features: string[];
  trial_days?: number;
}

export const APP_PLANS: Record<AppID, Record<PlanTier, AppPlanConfig>> = {
  creatorseal: {
    free: { daily_limit: 5, features: ['basic_scan'] },
    bronze: { daily_limit: 50, features: ['basic_scan', 'c2pa_watermark'], trial_days: 14 },
    silver: { daily_limit: 200, features: ['basic_scan', 'c2pa_watermark', 'blockchain_anchoring'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'white_label'] },
  },
  adengine: {
    free: { daily_limit: 3, features: ['single_copy'] },
    bronze: { daily_limit: 20, features: ['multi_copy', 'platform_formatting'], trial_days: 14 },
    silver: { daily_limit: 100, features: ['ab_testing', 'image_generation'] },
    gold: { daily_limit: 9999, features: ['unlimited_campaigns', 'custom_models'] },
  },
  trendradar: {
    free: { daily_limit: 3, features: ['basic_trends'] },
    bronze: { daily_limit: 20, features: ['advanced_trends', 'alerts'], trial_days: 14 },
    silver: { daily_limit: 100, features: ['realtime_tracking', 'competitor_analysis'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
  },
  contentforge: {
    free: { daily_limit: 3, features: ['basic_generation'] },
    bronze: { daily_limit: 25, features: ['multi_format', 'templates'], trial_days: 14 },
    silver: { daily_limit: 150, features: ['brand_voice', 'bulk_generation'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'custom_models'] },
  },
  collabhub: {
    free: { daily_limit: 5, features: ['basic_collab'] },
    bronze: { daily_limit: 30, features: ['team_spaces', 'file_sharing'], trial_days: 14 },
    silver: { daily_limit: 200, features: ['workflow_automation', 'integrations'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'white_label'] },
  },
  monetizemax: {
    free: { daily_limit: 3, features: ['basic_analytics'] },
    bronze: { daily_limit: 20, features: ['revenue_tracking', 'sponsor_matching'], trial_days: 14 },
    silver: { daily_limit: 100, features: ['deal_management', 'contract_templates'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
  },
  brandkit: {
    free: { daily_limit: 3, features: ['basic_assets'] },
    bronze: { daily_limit: 25, features: ['brand_guidelines', 'color_palettes'], trial_days: 14 },
    silver: { daily_limit: 150, features: ['ai_brand_generation', 'export_all'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'white_label'] },
  },
  analyticspro: {
    free: { daily_limit: 5, features: ['basic_dashboard'] },
    bronze: { daily_limit: 30, features: ['advanced_metrics', 'custom_reports'], trial_days: 14 },
    silver: { daily_limit: 200, features: ['predictive_analytics', 'exports'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
  },
  schedulemaster: {
    free: { daily_limit: 5, features: ['basic_scheduling'] },
    bronze: { daily_limit: 30, features: ['multi_platform', 'queue'], trial_days: 14 },
    silver: { daily_limit: 200, features: ['ai_optimal_time', 'bulk_schedule'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
  },
  fanconnect: {
    free: { daily_limit: 5, features: ['basic_engagement'] },
    bronze: { daily_limit: 30, features: ['community_tools', 'polls'], trial_days: 14 },
    silver: { daily_limit: 200, features: ['crm_integration', 'segmentation'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
  },
  mediavault: {
    free: { daily_limit: 5, features: ['basic_storage'] },
    bronze: { daily_limit: 50, features: ['cloud_backup', 'version_control'], trial_days: 14 },
    silver: { daily_limit: 500, features: ['ai_tagging', 'advanced_search'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access'] },
  },
  rightsguard: {
    free: { daily_limit: 3, features: ['basic_monitoring'] },
    bronze: { daily_limit: 20, features: ['takedown_requests', 'alerts'], trial_days: 14 },
    silver: { daily_limit: 100, features: ['legal_templates', 'multi_platform'] },
    gold: { daily_limit: 9999, features: ['all_unlimited', 'api_access', 'legal_support'] },
  },
};
