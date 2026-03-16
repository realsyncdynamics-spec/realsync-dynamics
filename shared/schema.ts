import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  plan: text("plan").default("free"),
  displayName: text("display_name"),
  bio: text("bio"),
  socialLinks: text("social_links"),
  createdAt: text("created_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Protected Content (CreatorSeal)
export const protectedContent = pgTable("protected_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  title: text("title").notNull(),
  contentType: text("content_type").notNull(),
  hash: text("hash"),
  blockchainTxId: text("blockchain_tx_id"),
  barcodeData: text("barcode_data"),
  watermarkStatus: text("watermark_status").default("pending"),
  verificationLevel: text("verification_level").default("bronze"),
  status: text("status").default("active"),
});

export const insertContentSchema = createInsertSchema(protectedContent).pick({
  title: true,
  contentType: true,
  hash: true,
});
export type InsertContent = z.infer<typeof insertContentSchema>;
export type ProtectedContent = typeof protectedContent.$inferSelect;

// KI-Agenten (RealSync Optimus)
export const aiAgents = pgTable("ai_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  name: text("name").notNull(),
  type: text("type").notNull(), // content-optimizer, seo-agent, social-manager, security-auditor, analytics, workflow
  status: text("status").default("idle"), // idle, running, paused, error, completed
  description: text("description"),
  config: text("config"), // JSON config
  performance: integer("performance").default(0), // 0-100
  tasksCompleted: integer("tasks_completed").default(0),
  lastActive: text("last_active"),
  createdAt: text("created_at"),
});

export const insertAgentSchema = createInsertSchema(aiAgents).pick({
  name: true,
  type: true,
  description: true,
  config: true,
});
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type AIAgent = typeof aiAgents.$inferSelect;

// Agent Tasks
export const agentTasks = pgTable("agent_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, in_progress, completed, failed
  priority: text("priority").default("medium"), // low, medium, high, critical
  result: text("result"),
  createdAt: text("created_at"),
  completedAt: text("completed_at"),
});

export const insertTaskSchema = createInsertSchema(agentTasks).pick({
  agentId: true,
  title: true,
  description: true,
  priority: true,
});
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type AgentTask = typeof agentTasks.$inferSelect;

// Community Posts (RealSyncCommunity)
export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  authorName: text("author_name"),
  authorAvatar: text("author_avatar"),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"), // image, video, reel, text
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  verified: boolean("verified").default(false),
  trustScore: integer("trust_score").default(0),
  createdAt: text("created_at"),
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).pick({
  content: true,
  mediaUrl: true,
  mediaType: true,
});
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

// Social Posts (legacy — kept for compat)
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  content: text("content").notNull(),
  platform: text("platform").default("optimus"),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  verified: boolean("verified").default(false),
});

export const insertPostSchema = createInsertSchema(socialPosts).pick({
  content: true,
  platform: true,
});
export type InsertPost = z.infer<typeof insertPostSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;

// App Builder Projects
export const appProjects = pgTable("app_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  name: text("name").notNull(),
  description: text("description"),
  aiModel: text("ai_model").default("auto"),
  status: text("status").default("draft"),
  template: text("template"),
});

export const insertProjectSchema = createInsertSchema(appProjects).pick({
  name: true,
  description: true,
  aiModel: true,
  template: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type AppProject = typeof appProjects.$inferSelect;

// Market Gaps
export const marketGaps = pgTable("market_gaps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  trendScore: integer("trend_score").default(0),
  opportunity: text("opportunity"),
  status: text("status").default("detected"),
});

export const insertGapSchema = createInsertSchema(marketGaps).pick({
  category: true,
  title: true,
  description: true,
});
export type InsertGap = z.infer<typeof insertGapSchema>;
export type MarketGap = typeof marketGaps.$inferSelect;

// Pricing Plans
export const pricingPlans = pgTable("pricing_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appName: text("app_name").notNull(),
  tierName: text("tier_name").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").default("EUR"),
  interval: text("interval").default("monthly"),
  features: text("features").array(),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
});

export const insertPlanSchema = createInsertSchema(pricingPlans).pick({
  appName: true,
  tierName: true,
  price: true,
  features: true,
});
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type PricingPlan = typeof pricingPlans.$inferSelect;

// Creator Profiles
export const creatorProfiles = pgTable("creator_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  socialLinks: text("social_links"),
  verificationTier: text("verification_tier").default("bronze"),
  portfolioItems: text("portfolio_items"),
  isPublic: boolean("is_public").default(false),
});

export const insertCreatorProfileSchema = createInsertSchema(creatorProfiles).pick({
  displayName: true,
  bio: true,
  avatarUrl: true,
  socialLinks: true,
  verificationTier: true,
  portfolioItems: true,
  isPublic: true,
});
export type InsertCreatorProfile = z.infer<typeof insertCreatorProfileSchema>;
export type CreatorProfile = typeof creatorProfiles.$inferSelect;

// Content Certificates
export const contentCertificates = pgTable("content_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id"),
  certificateType: text("certificate_type"),
  metadata: text("metadata"),
  issuedAt: text("issued_at"),
  expiresAt: text("expires_at"),
});

export const insertCertificateSchema = createInsertSchema(contentCertificates).pick({
  contentId: true,
  certificateType: true,
  metadata: true,
});
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type ContentCertificate = typeof contentCertificates.$inferSelect;

// Stories
export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  authorName: text("author_name"),
  mediaUrl: text("media_url"),
  caption: text("caption"),
  expiresAt: text("expires_at"),
  views: integer("views").default(0),
});

export const insertStorySchema = createInsertSchema(stories).pick({
  mediaUrl: true,
  caption: true,
});
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// Groups
export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  memberCount: integer("member_count").default(0),
  category: text("category"),
  isPrivate: boolean("is_private").default(false),
});

export const insertGroupSchema = createInsertSchema(groups).pick({
  name: true,
  description: true,
  category: true,
  isPrivate: true,
});
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

// Marketplace Items
export const marketplaceItems = pgTable("marketplace_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").default(0),
  category: text("category"),
  status: text("status").default("active"),
});

export const insertMarketplaceItemSchema = createInsertSchema(marketplaceItems).pick({
  title: true,
  description: true,
  price: true,
  category: true,
});
export type InsertMarketplaceItem = z.infer<typeof insertMarketplaceItemSchema>;
export type MarketplaceItem = typeof marketplaceItems.$inferSelect;

// Uploads
export const uploads = pgTable("uploads", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  filename: text("filename").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  hash: text("hash"),
  protectionLevel: text("protection_level"),
  methods: text("methods"), // JSON array
  status: text("status").default("pending"),
  createdAt: text("created_at"),
});

export const insertUploadSchema = createInsertSchema(uploads).pick({
  filename: true,
  fileSize: true,
  mimeType: true,
  hash: true,
  protectionLevel: true,
  methods: true,
});
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;
