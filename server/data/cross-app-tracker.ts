import { db } from '../db';
import { userActivityLog, appUsageMetrics } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { AppID } from '../../shared/stripe/plans-config';

export const DataKrake = {
  async logAction(
    userId: string,
    appName: AppID,
    actionType: string,
    featureName?: string,
    metadata: Record<string, any> = {}
  ) {
    await db.insert(userActivityLog).values({
      userId,
      appName,
      actionType,
      featureName,
      metadata: { ...metadata, timestamp: new Date().toISOString() },
    });

    const metricName = this.getMetricName(actionType);
    if (metricName) {
      await db.insert(appUsageMetrics).values({
        userId,
        appName,
        metricName,
        currentCount: 1,
        lastReset: new Date(),
      }).onConflictDoUpdate({
        target: [appUsageMetrics.userId, appUsageMetrics.appName, appUsageMetrics.metricName],
        set: { currentCount: sql`${appUsageMetrics.currentCount} + 1` },
      });
    }
  },

  getMetricName(action: string): string | null {
    if (action.includes('scan')) return 'scans';
    if (action.includes('generate')) return 'generations';
    if (action.includes('export')) return 'exports';
    if (action.includes('upload')) return 'uploads';
    return null;
  },

  async getUsageCount(userId: string, appName: AppID, metricName: string): Promise<number> {
    const result = await db.select()
      .from(appUsageMetrics)
      .where(and(
        eq(appUsageMetrics.userId, userId),
        eq(appUsageMetrics.appName, appName),
        eq(appUsageMetrics.metricName, metricName)
      ))
      .limit(1);
    return result[0]?.currentCount || 0;
  },

  async resetDailyCounters() {
    await db.update(appUsageMetrics)
      .set({ currentCount: 0, lastReset: new Date() })
      .where(sql`${appUsageMetrics.lastReset} < NOW() - INTERVAL '1 day'`);
  },
};
