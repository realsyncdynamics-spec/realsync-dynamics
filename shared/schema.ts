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

// ==========================================
// REALSYNC BILDUNG — Bundeslandübergreifende Bildungsplattform
// ==========================================

// Schulen (Schools)
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  bundesland: text("bundesland").notNull(),
  schultyp: text("schultyp").notNull(), // grundschule, hauptschule, realschule, gymnasium, gesamtschule, berufsschule, foerderschule
  adresse: text("adresse"),
  plz: text("plz"),
  stadt: text("stadt"),
  schulleitung: text("schulleitung"),
  email: text("email"),
  telefon: text("telefon"),
  schuelerAnzahl: integer("schueler_anzahl").default(0),
  lehrerAnzahl: integer("lehrer_anzahl").default(0),
  digitalPaktStatus: text("digitalpakt_status").default("beantragt"), // beantragt, genehmigt, aktiv, abgelaufen
  vidisEnabled: boolean("vidis_enabled").default(false),
  schulcloudType: text("schulcloud_type"), // bayerncloud, schulcloud, mebis, logineo, iserv
  plan: text("plan").default("free"), // free, basis, premium, enterprise
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at"),
});

export const insertSchoolSchema = createInsertSchema(schools).pick({
  name: true,
  bundesland: true,
  schultyp: true,
  adresse: true,
  plz: true,
  stadt: true,
  email: true,
});
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

// Schüler-Profile (Student Profiles — pseudonymisiert, DSGVO)
export const studentProfiles = pgTable("student_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id"),
  pseudonym: text("pseudonym").notNull(), // DSGVO: kein Klarname
  klasse: text("klasse"), // z.B. "7a", "10b"
  jahrgang: integer("jahrgang"),
  nfcTagId: text("nfc_tag_id"),
  role: text("role").default("schueler"), // schueler, klassensprecher, schuelersprecher
  isActive: boolean("is_active").default(true),
  lastActive: text("last_active"),
  createdAt: text("created_at"),
});

export const insertStudentSchema = createInsertSchema(studentProfiles).pick({
  schoolId: true,
  pseudonym: true,
  klasse: true,
  jahrgang: true,
});
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type StudentProfile = typeof studentProfiles.$inferSelect;

// Lehrer-Profile (Teacher Profiles)
export const teacherProfiles = pgTable("teacher_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  schoolId: varchar("school_id"),
  faecher: text("faecher"), // JSON array: ["Mathematik", "Physik"]
  rolle: text("rolle").default("lehrkraft"), // lehrkraft, fachleitung, schulleitung, admin
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at"),
});

export const insertTeacherSchema = createInsertSchema(teacherProfiles).pick({
  userId: true,
  schoolId: true,
  faecher: true,
  rolle: true,
});
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type TeacherProfile = typeof teacherProfiles.$inferSelect;

// NFC Zugangspunkte (Access Points)
export const accessPoints = pgTable("access_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id"),
  name: text("name").notNull(), // z.B. "Haupteingang", "Chemielabor", "Bibliothek"
  locationLat: text("location_lat"),
  locationLng: text("location_lng"),
  allowedRoles: text("allowed_roles"), // JSON: ["schueler", "lehrkraft"]
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at"),
});

export const insertAccessPointSchema = createInsertSchema(accessPoints).pick({
  schoolId: true,
  name: true,
  allowedRoles: true,
});
export type InsertAccessPoint = z.infer<typeof insertAccessPointSchema>;
export type AccessPoint = typeof accessPoints.$inferSelect;

// NFC Zugangslogs (Access Logs)
export const accessLogs = pgTable("access_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id"),
  accessPointId: varchar("access_point_id"),
  schoolId: varchar("school_id"),
  result: text("result").notNull(), // granted, denied
  method: text("method").default("nfc"), // nfc, qr, pin
  timestamp: text("timestamp"),
});

export const insertAccessLogSchema = createInsertSchema(accessLogs).pick({
  studentId: true,
  accessPointId: true,
  schoolId: true,
  result: true,
  method: true,
});
export type InsertAccessLog = z.infer<typeof insertAccessLogSchema>;
export type AccessLog = typeof accessLogs.$inferSelect;

// Kurse / Lernmodule
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id"),
  teacherId: varchar("teacher_id"),
  title: text("title").notNull(),
  fach: text("fach").notNull(), // Mathematik, Deutsch, Englisch, Physik, Chemie, Biologie, Informatik, etc.
  klasse: text("klasse"), // Zielklasse
  bundesland: text("bundesland"),
  lehrplanKonform: boolean("lehrplan_konform").default(true),
  description: text("description"),
  modulCount: integer("modul_count").default(0),
  schuelerCount: integer("schueler_count").default(0),
  status: text("status").default("entwurf"), // entwurf, aktiv, archiviert
  createdAt: text("created_at"),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  fach: true,
  klasse: true,
  bundesland: true,
  description: true,
});
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Aufgaben / Hausaufgaben
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id"),
  teacherId: varchar("teacher_id"),
  title: text("title").notNull(),
  description: text("description"),
  typ: text("typ").default("hausaufgabe"), // hausaufgabe, klausur, projekt, quiz
  dueDate: text("due_date"),
  maxPunkte: integer("max_punkte").default(100),
  abgaben: integer("abgaben").default(0),
  status: text("status").default("offen"), // offen, geschlossen, bewertet
  createdAt: text("created_at"),
});

export const insertAssignmentSchema = createInsertSchema(assignments).pick({
  courseId: true,
  title: true,
  description: true,
  typ: true,
  dueDate: true,
  maxPunkte: true,
});
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;

// Anwesenheit (Attendance)
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id"),
  courseId: varchar("course_id"),
  schoolId: varchar("school_id"),
  datum: text("datum").notNull(),
  status: text("status").notNull(), // anwesend, abwesend, entschuldigt, verspaetet
  methode: text("methode").default("manuell"), // manuell, nfc, qr
  createdAt: text("created_at"),
});

export const insertAttendanceSchema = createInsertSchema(attendance).pick({
  studentId: true,
  courseId: true,
  schoolId: true,
  datum: true,
  status: true,
  methode: true,
});
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

// Schulzahlungen (School Payments)
export const schoolPayments = pgTable("school_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id"),
  betrag: integer("betrag").notNull(), // in Cent
  waehrung: text("waehrung").default("EUR"),
  typ: text("typ").notNull(), // lizenz, digitalpakt, spende, elternbeitrag
  status: text("status").default("offen"), // offen, bezahlt, storniert
  stripeSessionId: text("stripe_session_id"),
  beschreibung: text("beschreibung"),
  createdAt: text("created_at"),
});

export const insertSchoolPaymentSchema = createInsertSchema(schoolPayments).pick({
  schoolId: true,
  betrag: true,
  typ: true,
  beschreibung: true,
});
export type InsertSchoolPayment = z.infer<typeof insertSchoolPaymentSchema>;
export type SchoolPayment = typeof schoolPayments.$inferSelect;

// DSGVO Audit-Log
export const dsgvoAuditLogs = pgTable("dsgvo_audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id"),
  aktion: text("aktion").notNull(), // datenzugriff, loeschung, export, avv_erstellt, einwilligung
  betroffener: text("betroffener"), // pseudonymisiert
  details: text("details"),
  ipHash: text("ip_hash"), // gehashte IP
  timestamp: text("timestamp"),
});

export const insertDsgvoLogSchema = createInsertSchema(dsgvoAuditLogs).pick({
  schoolId: true,
  aktion: true,
  betroffener: true,
  details: true,
});
export type InsertDsgvoLog = z.infer<typeof insertDsgvoLogSchema>;
export type DsgvoAuditLog = typeof dsgvoAuditLogs.$inferSelect;

// Stundenpläne (Timetables)
export const timetables = pgTable("timetables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id"),
  klasse: text("klasse").notNull(),
  tag: text("tag").notNull(), // montag, dienstag, mittwoch, donnerstag, freitag
  stunde: integer("stunde").notNull(), // 1-10
  fach: text("fach").notNull(),
  raum: text("raum"),
  lehrkraft: text("lehrkraft"),
  createdAt: text("created_at"),
});

export const insertTimetableSchema = createInsertSchema(timetables).pick({
  schoolId: true,
  klasse: true,
  tag: true,
  stunde: true,
  fach: true,
  raum: true,
  lehrkraft: true,
});
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type Timetable = typeof timetables.$inferSelect;
