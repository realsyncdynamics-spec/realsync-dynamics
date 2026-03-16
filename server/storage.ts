import {
  type User,
  type InsertUser,
  type ProtectedContent,
  type InsertContent,
  type SocialPost,
  type InsertPost,
  type AppProject,
  type InsertProject,
  type MarketGap,
  type InsertGap,
  type PricingPlan,
  type CreatorProfile,
  type InsertCreatorProfile,
  type ContentCertificate,
  type InsertCertificate,
  type Story,
  type InsertStory,
  type Group,
  type InsertGroup,
  type MarketplaceItem,
  type InsertMarketplaceItem,
  type Upload,
  type InsertUpload,
  type AIAgent,
  type InsertAgent,
  type AgentTask,
  type InsertTask,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getStats(): Promise<{ content: number; posts: number; projects: number; gaps: number }>;
  getContent(): Promise<ProtectedContent[]>;
  createContent(content: InsertContent): Promise<ProtectedContent>;
  getPosts(): Promise<SocialPost[]>;
  createPost(post: InsertPost): Promise<SocialPost>;
  likePost(id: string): Promise<SocialPost | undefined>;
  getProjects(): Promise<AppProject[]>;
  createProject(project: InsertProject): Promise<AppProject>;
  getGaps(): Promise<MarketGap[]>;
  getPricing(): Promise<PricingPlan[]>;
  verifyByHash(hash: string): Promise<ProtectedContent | undefined>;
  createSession(userId: string): string;
  getUserBySession(token: string): Promise<User | undefined>;
  deleteSession(token: string): void;
  // Creator Profiles
  getCreatorProfiles(): Promise<CreatorProfile[]>;
  getCreatorProfile(id: string): Promise<CreatorProfile | undefined>;
  createCreatorProfile(profile: InsertCreatorProfile): Promise<CreatorProfile>;
  // Certificates
  getCertificates(): Promise<ContentCertificate[]>;
  createCertificate(cert: InsertCertificate): Promise<ContentCertificate>;
  // Stories
  getStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  // Groups
  getGroups(): Promise<Group[]>;
  createGroup(group: InsertGroup): Promise<Group>;
  // Marketplace
  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem>;
  // Uploads
  getUploads(userId?: string): Promise<Upload[]>;
  createUpload(upload: InsertUpload & { userId?: string }): Promise<Upload>;
  getUploadStats(userId?: string): Promise<{ total: number; protected: number; pending: number }>;
  // AI Agents
  getAgents(userId?: string): Promise<AIAgent[]>;
  getAgent(id: string): Promise<AIAgent | undefined>;
  createAgent(agent: InsertAgent, userId?: string): Promise<AIAgent>;
  updateAgent(id: string, data: Partial<Pick<AIAgent, "status" | "performance" | "config" | "description">>): Promise<AIAgent | undefined>;
  deleteAgent(id: string): Promise<boolean>;
  // Agent Tasks
  getAgentTasks(agentId: string): Promise<AgentTask[]>;
  createAgentTask(task: InsertTask): Promise<AgentTask>;
  // Community Posts
  getCommunityPosts(): Promise<import("@shared/schema").CommunityPost[]>;
  createCommunityPost(post: import("@shared/schema").InsertCommunityPost): Promise<import("@shared/schema").CommunityPost>;
  likeCommunityPost(id: string): Promise<import("@shared/schema").CommunityPost | undefined>;
  // Complete agent task
  completeAgentTask(id: string, result: string): Promise<AgentTask | undefined>;
  // User updates
  updateUser(id: string, data: Partial<Pick<User, "displayName" | "bio" | "socialLinks" | "email">>): Promise<User | undefined>;
  getUserStats(userId: string): Promise<{
    protectedContent: number;
    certificates: number;
    blockchainVerifications: number;
    trustScore: number;
    planUsage: { used: number; limit: number };
    recentActivity: { type: string; title: string; time: string }[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private content: Map<string, ProtectedContent>;
  private posts: Map<string, SocialPost>;
  private projects: Map<string, AppProject>;
  private gaps: Map<string, MarketGap>;
  private pricing: Map<string, PricingPlan>;
  private sessions: Map<string, string>;
  private creatorProfilesMap: Map<string, CreatorProfile>;
  private certificates: Map<string, ContentCertificate>;
  private storiesMap: Map<string, Story>;
  private groupsMap: Map<string, Group>;
  private marketplace: Map<string, MarketplaceItem>;
  private uploadsMap: Map<string, Upload>;
  private agentsMap: Map<string, AIAgent>;
  private agentTasksMap: Map<string, AgentTask>;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.posts = new Map();
    this.projects = new Map();
    this.gaps = new Map();
    this.pricing = new Map();
    this.sessions = new Map();
    this.creatorProfilesMap = new Map();
    this.certificates = new Map();
    this.storiesMap = new Map();
    this.groupsMap = new Map();
    this.marketplace = new Map();
    this.uploadsMap = new Map();
    this.agentsMap = new Map();
    this.agentTasksMap = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed protected content
    const contentItems: ProtectedContent[] = [
      {
        id: randomUUID(),
        userId: null,
        title: "Produktvideo Q1 2026",
        contentType: "video",
        hash: "a3f2b8c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
        blockchainTxId: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
        barcodeData: "RSEAL-2026-VID-001",
        watermarkStatus: "applied",
        verificationLevel: "gold",
        status: "active",
      },
      {
        id: randomUUID(),
        userId: null,
        title: "Markenbild Design System",
        contentType: "bild",
        hash: "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
        blockchainTxId: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        barcodeData: "RSEAL-2026-IMG-002",
        watermarkStatus: "applied",
        verificationLevel: "silver",
        status: "active",
      },
      {
        id: randomUUID(),
        userId: null,
        title: "Podcast Episode 47 – KI-Trends",
        contentType: "audio",
        hash: "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
        blockchainTxId: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
        barcodeData: "RSEAL-2026-AUD-003",
        watermarkStatus: "pending",
        verificationLevel: "bronze",
        status: "active",
      },
      {
        id: randomUUID(),
        userId: null,
        title: "Whitepaper: Digitale Authentizität",
        contentType: "text",
        hash: "d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
        blockchainTxId: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
        barcodeData: "RSEAL-2026-TXT-004",
        watermarkStatus: "applied",
        verificationLevel: "gold",
        status: "active",
      },
      {
        id: randomUUID(),
        userId: null,
        title: "Social Media Kit – März 2026",
        contentType: "bild",
        hash: "e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
        blockchainTxId: null,
        barcodeData: "RSEAL-2026-IMG-005",
        watermarkStatus: "pending",
        verificationLevel: "bronze",
        status: "active",
      },
    ];
    for (const item of contentItems) {
      this.content.set(item.id, item);
    }

    // Seed social posts
    const postItems: SocialPost[] = [
      {
        id: randomUUID(),
        userId: null,
        content: "Gerade unser neues KI-gestütztes Content-Schutz-System getestet. Die Blockchain-Verifizierung funktioniert einwandfrei! 🔒 #CreatorSeal #DigitalTrust",
        platform: "optimus",
        likes: 142,
        shares: 38,
        verified: true,
      },
      {
        id: randomUUID(),
        userId: null,
        content: "Thüringen wird zum nächsten europäischen Tech-Hub. Unsere Server stehen in Frankfurt – DSGVO-konform und blitzschnell. 🇩🇪 #MadeInGermany",
        platform: "optimus",
        likes: 289,
        shares: 67,
        verified: true,
      },
      {
        id: randomUUID(),
        userId: null,
        content: "Der Multi-App Builder hat gerade meine erste SaaS-App in 20 Minuten erstellt. Claude + Gemini im Auto-Modus – beeindruckend! 🚀",
        platform: "optimus",
        likes: 456,
        shares: 112,
        verified: true,
      },
      {
        id: randomUUID(),
        userId: null,
        content: "Marktlücke entdeckt: Es gibt noch keine DSGVO-native Social-Media-Plattform für Kreative in Europa. Bis jetzt. #DigitalerOptimus",
        platform: "optimus",
        likes: 723,
        shares: 201,
        verified: false,
      },
      {
        id: randomUUID(),
        userId: null,
        content: "Wer hat gesagt, dass deutsche Software nicht innovativ sein kann? Unser Market Scanner hat 3 neue Trends erkannt, bevor sie in den USA aufgetaucht sind. 📊",
        platform: "optimus",
        likes: 567,
        shares: 89,
        verified: true,
      },
    ];
    for (const post of postItems) {
      this.posts.set(post.id, post);
    }

    // Seed app projects
    const projectItems: AppProject[] = [
      {
        id: randomUUID(),
        userId: null,
        name: "HealthTracker Pro",
        description: "DSGVO-konforme Gesundheits-App mit KI-Diagnose-Assistent",
        aiModel: "claude",
        status: "live",
        template: "saas-dashboard",
      },
      {
        id: randomUUID(),
        userId: null,
        name: "EduConnect",
        description: "Online-Lernplattform mit Echtzeit-Kollaboration",
        aiModel: "gemini",
        status: "development",
        template: "social-app",
      },
      {
        id: randomUUID(),
        userId: null,
        name: "GreenMarket",
        description: "Nachhaltiger E-Commerce Marktplatz für lokale Produkte",
        aiModel: "gpt",
        status: "draft",
        template: "e-commerce",
      },
      {
        id: randomUUID(),
        userId: null,
        name: "FinanzPilot",
        description: "KI-gestützte Finanzberatung für Startups und KMU",
        aiModel: "auto",
        status: "development",
        template: "saas-dashboard",
      },
      {
        id: randomUUID(),
        userId: null,
        name: "EventFlow",
        description: "Veranstaltungsmanagement mit automatischer Planung",
        aiModel: "deepseek",
        status: "live",
        template: "landing-page",
      },
    ];
    for (const project of projectItems) {
      this.projects.set(project.id, project);
    }

    // Seed market gaps
    const gapItems: MarketGap[] = [
      {
        id: randomUUID(),
        category: "Tech",
        title: "KI-gestützte Barrierefreiheitsprüfung",
        description: "Automatische Überprüfung von Websites auf Barrierefreiheit mit KI-Empfehlungen zur Behebung",
        trendScore: 92,
        opportunity: "hoch",
        status: "validated",
      },
      {
        id: randomUUID(),
        category: "Health",
        title: "Telemedizin für ländliche Gebiete",
        description: "DSGVO-konforme Telemedizin-Plattform speziell für unterversorgte ländliche Regionen",
        trendScore: 87,
        opportunity: "hoch",
        status: "detected",
      },
      {
        id: randomUUID(),
        category: "Finance",
        title: "Krypto-Steuer-Automatisierung EU",
        description: "Automatisierte Krypto-Steuererklärung nach EU-MiCA-Verordnung",
        trendScore: 84,
        opportunity: "mittel",
        status: "analyzing",
      },
      {
        id: randomUUID(),
        category: "Education",
        title: "KI-Nachhilfe für berufliche Weiterbildung",
        description: "Personalisierte KI-Tutoren für Fachkräfteumschulung im Bereich Digitalisierung",
        trendScore: 79,
        opportunity: "hoch",
        status: "validated",
      },
      {
        id: randomUUID(),
        category: "Green",
        title: "CO₂-Fußabdruck-Tracker für KMU",
        description: "Einfache CO₂-Bilanzierung und ESG-Berichterstattung für kleine und mittlere Unternehmen",
        trendScore: 76,
        opportunity: "mittel",
        status: "detected",
      },
      {
        id: randomUUID(),
        category: "AI",
        title: "Datenschutz-KI-Assistent",
        description: "KI-Tool für automatische DSGVO-Compliance-Überprüfung von Software und Datenflüssen",
        trendScore: 91,
        opportunity: "hoch",
        status: "validated",
      },
      {
        id: randomUUID(),
        category: "Tech",
        title: "No-Code API-Orchestrierung",
        description: "Visuelle Plattform zur Verknüpfung und Orchestrierung von APIs ohne Programmierkenntnisse",
        trendScore: 73,
        opportunity: "mittel",
        status: "analyzing",
      },
      {
        id: randomUUID(),
        category: "Health",
        title: "Mental-Health-App für Gründer",
        description: "Auf Unternehmensgründer zugeschnittene Mental-Health-Plattform mit KI-Coaching",
        trendScore: 68,
        opportunity: "mittel",
        status: "detected",
      },
    ];
    for (const gap of gapItems) {
      this.gaps.set(gap.id, gap);
    }

    // Seed pricing plans — 5-tier model
    const plans: PricingPlan[] = [
      // CreatorSeal
      { id: randomUUID(), appName: "creatorseal", tierName: "Free", price: 0, currency: "EUR", interval: "monthly", features: ["3 Inhalte/Monat", "SHA-256 Hash", "Barcode (Code128)", "Community Support", "Bronze-Verifizierung"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "creatorseal", tierName: "Starter", price: 9, currency: "EUR", interval: "monthly", features: ["25 Inhalte/Monat", "SHA-256 Hash", "Barcode (Code128)", "QR-Code", "C2PA Basis-Zertifikat", "E-Mail Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "creatorseal", tierName: "Pro", price: 29, currency: "EUR", interval: "monthly", features: ["100 Inhalte/Monat", "SHA-256 Hash", "Barcode + QR-Code", "C2PA Erweitert", "Blockchain-Verifizierung", "Wasserzeichen", "Creator-Seite Custom", "API-Zugang", "3 Team-User"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "creatorseal", tierName: "Business", price: 79, currency: "EUR", interval: "monthly", features: ["Unbegrenzte Inhalte", "SHA-256 Hash", "Barcode + QR-Code", "C2PA Voll", "Blockchain-Verifizierung", "Wasserzeichen", "Creator-Seite + Custom Domain", "API-Zugang", "10 Team-User", "Prioritäts-Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "creatorseal", tierName: "Enterprise", price: 0, currency: "EUR", interval: "monthly", features: ["Unbegrenzte Inhalte", "Alles aus Business", "Whitelabel Creator-Seite", "Unbegrenzte Team-User", "Dedizierte Infrastruktur", "SLA 99.9%", "Persönlicher Account Manager"], stripeProductId: null, stripePriceId: null },
      // RealSync Optimus
      { id: randomUUID(), appName: "optimus", tierName: "Free", price: 0, currency: "EUR", interval: "monthly", features: ["10 Posts/Monat", "1 Gruppe", "E2E Encryption", "Community Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "optimus", tierName: "Starter", price: 9, currency: "EUR", interval: "monthly", features: ["100 Posts/Monat", "Stories", "5 Gruppen", "E2E Encryption", "Basis-Analytics", "E-Mail Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "optimus", tierName: "Pro", price: 29, currency: "EUR", interval: "monthly", features: ["Unbegrenzte Posts", "Stories + Reels", "20 Gruppen", "Marketplace Verkaufen", "E2E Encryption", "Erweiterte Analytics"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "optimus", tierName: "Business", price: 49, currency: "EUR", interval: "monthly", features: ["Unbegrenzte Posts", "Stories + Reels", "Live-Streaming", "Unbegrenzte Gruppen", "Marketplace Verkaufen", "E2E Encryption", "Enterprise Analytics"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "optimus", tierName: "Enterprise", price: 0, currency: "EUR", interval: "monthly", features: ["Alles aus Business", "Whitelabel Marketplace", "Custom Analytics", "Dedizierte Instanz", "SLA 99.9%", "24/7 Support"], stripeProductId: null, stripePriceId: null },
      // Multi-App Builder
      { id: randomUUID(), appName: "builder", tierName: "Free", price: 0, currency: "EUR", interval: "monthly", features: ["1 Projekt", "1 KI-Modell", "3 Templates", "Community Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "builder", tierName: "Starter", price: 19, currency: "EUR", interval: "monthly", features: ["5 Projekte", "3 KI-Modelle", "Alle Templates", "E-Mail Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "builder", tierName: "Pro", price: 49, currency: "EUR", interval: "monthly", features: ["20 Projekte", "Alle KI-Modelle", "Alle + Custom Templates", "Custom Domain", "3 Team-User"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "builder", tierName: "Business", price: 99, currency: "EUR", interval: "monthly", features: ["Unbegrenzte Projekte", "Alle KI-Modelle", "Alle + Custom Templates", "Custom Domain", "10 Team-User", "Prioritäts-Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "builder", tierName: "Enterprise", price: 0, currency: "EUR", interval: "monthly", features: ["Alles aus Business", "Custom KI-Modelle", "Whitelabel Templates", "Unbegrenzte Team-User", "SLA 99.9%", "Dedizierter Support"], stripeProductId: null, stripePriceId: null },
      // Market Scanner
      { id: randomUUID(), appName: "scanner", tierName: "Free", price: 0, currency: "EUR", interval: "monthly", features: ["3 Analysen/Monat", "Basis-Trendanalyse", "Community Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "scanner", tierName: "Starter", price: 19, currency: "EUR", interval: "monthly", features: ["25 Analysen/Monat", "CSV Export", "3 Alerts", "E-Mail Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "scanner", tierName: "Pro", price: 49, currency: "EUR", interval: "monthly", features: ["100 Analysen/Monat", "Echtzeit-Daten", "CSV + PDF Export", "10 Alerts"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "scanner", tierName: "Business", price: 99, currency: "EUR", interval: "monthly", features: ["Unbegrenzte Analysen", "Echtzeit-Daten", "API Export", "Unbegrenzte Alerts", "Prioritäts-Support"], stripeProductId: null, stripePriceId: null },
      { id: randomUUID(), appName: "scanner", tierName: "Enterprise", price: 0, currency: "EUR", interval: "monthly", features: ["Alles aus Business", "Custom Datenquellen", "White-Label Reports", "Team-Dashboards", "SLA 99.9%", "Dedizierter Analyst"], stripeProductId: null, stripePriceId: null },
    ];
    for (const plan of plans) {
      this.pricing.set(plan.id, plan);
    }

    // Seed creator profiles
    const profiles: CreatorProfile[] = [
      {
        id: randomUUID(),
        userId: null,
        displayName: "Anna Schreiber",
        bio: "Fotografin & Content-Creatorin aus Berlin. Spezialisiert auf Produktfotografie und visuelle Markenidentität.",
        avatarUrl: null,
        socialLinks: JSON.stringify({ twitter: "@annaschreiber", instagram: "@anna.creates", website: "annaschreiber.de" }),
        verificationTier: "gold",
        portfolioItems: JSON.stringify(["Produktvideo Q1 2026", "Markenbild Design System"]),
        isPublic: true,
      },
      {
        id: randomUUID(),
        userId: null,
        displayName: "Max Hoffmann",
        bio: "YouTuber und Tech-Reviewer aus München. 150K Abonnenten. Fokus auf nachhaltige Technologie und Datenschutz.",
        avatarUrl: null,
        socialLinks: JSON.stringify({ twitter: "@maxhofftech", youtube: "@MaxHoffmann", website: "maxhoffmann.tech" }),
        verificationTier: "platin",
        portfolioItems: JSON.stringify(["Podcast Episode 47 – KI-Trends", "Social Media Kit – März 2026"]),
        isPublic: true,
      },
      {
        id: randomUUID(),
        userId: null,
        displayName: "Lena Weber",
        bio: "Grafikdesignerin und Illustratorin aus Hamburg. Digitale Kunst, Brand Design und UI/UX.",
        avatarUrl: null,
        socialLinks: JSON.stringify({ instagram: "@lena.designs", website: "lenaweber.design" }),
        verificationTier: "silver",
        portfolioItems: JSON.stringify(["Whitepaper: Digitale Authentizität"]),
        isPublic: true,
      },
    ];
    for (const profile of profiles) {
      this.creatorProfilesMap.set(profile.id, profile);
    }

    // Seed stories
    const storyItems: Story[] = [
      { id: randomUUID(), userId: null, authorName: "RealSync Team", mediaUrl: null, caption: "Neues Projekt gestartet! Blockchain-Verifizierung für Creator 🔗", expiresAt: "2026-03-16T00:00:00Z", views: 234 },
      { id: randomUUID(), userId: null, authorName: "Dominik S.", mediaUrl: null, caption: "Behind the Scenes: Unser neues Studio in Erfurt 🎬", expiresAt: "2026-03-16T00:00:00Z", views: 567 },
      { id: randomUUID(), userId: null, authorName: "Creator Max", mediaUrl: null, caption: "DSGVO-konformes Streaming ist endlich Realität! 🇪🇺", expiresAt: "2026-03-16T00:00:00Z", views: 891 },
      { id: randomUUID(), userId: null, authorName: "Lisa K.", mediaUrl: null, caption: "Mein erstes C2PA-Zertifikat erhalten — so cool! 🏆", expiresAt: "2026-03-16T00:00:00Z", views: 345 },
      { id: randomUUID(), userId: null, authorName: "FotoProfi", mediaUrl: null, caption: "Tipp: So schützt ihr eure Fotos mit unsichtbaren Wasserzeichen 💧", expiresAt: "2026-03-16T00:00:00Z", views: 1203 },
    ];
    for (const story of storyItems) {
      this.storiesMap.set(story.id, story);
    }

    // Seed groups
    const groupItems: Group[] = [
      { id: randomUUID(), name: "Deutsche Creator Community", description: "Der Treffpunkt für alle deutschsprachigen Content-Creator. Tipps, Austausch und Networking.", memberCount: 1247, category: "Kreativ", isPrivate: false },
      { id: randomUUID(), name: "Tech & Innovation DE", description: "Diskussionen über Technologie, Startups und Innovation im deutschsprachigen Raum.", memberCount: 892, category: "Tech", isPrivate: false },
      { id: randomUUID(), name: "Gründer & Selbstständige", description: "Netzwerk für Gründer, Freelancer und Selbstständige. Erfahrungsaustausch und gegenseitige Unterstützung.", memberCount: 634, category: "Business", isPrivate: false },
      { id: randomUUID(), name: "Kreativ & Design Hub", description: "Für Designer, Fotografen, Illustratoren und alle Kreativen. Portfolio-Feedback und Inspiration.", memberCount: 456, category: "Lifestyle", isPrivate: false },
    ];
    for (const group of groupItems) {
      this.groupsMap.set(group.id, group);
    }

    // Seed marketplace items
    const marketplaceItemsList: MarketplaceItem[] = [
      { id: randomUUID(), userId: null, title: "Social Media Template Pack", description: "50 professionelle Instagram- und TikTok-Templates. Canva-kompatibel, sofort einsetzbar.", price: 29, category: "Templates", status: "active" },
      { id: randomUUID(), userId: null, title: "KI-Prompt Kollektion für Creator", description: "200+ getestete Prompts für ChatGPT, Claude und Gemini. Speziell für Content-Erstellung.", price: 19, category: "Digitale Produkte", status: "active" },
      { id: randomUUID(), userId: null, title: "Fotografie Preset Bundle", description: "30 Lightroom-Presets im moody Dark-Aesthetic Style. Perfekt für Produktfotografie.", price: 39, category: "Assets", status: "active" },
      { id: randomUUID(), userId: null, title: "DSGVO-Masterclass für Creator", description: "Online-Kurs: Datenschutz verstehen und umsetzen als Content-Creator. 4 Stunden Video.", price: 49, category: "Kurse", status: "active" },
    ];
    for (const item of marketplaceItemsList) {
      this.marketplace.set(item.id, item);
    }

    // Seed demo user with extended fields
    const demoUserId = randomUUID();
    this.users.set(demoUserId, {
      id: demoUserId,
      username: "demo",
      password: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", // SHA-256 of "123"
      email: "demo@realsync.de",
      plan: "pro",
      displayName: "Max Mustermann",
      bio: "Content Creator & Digital Strategist aus Berlin. Spezialisiert auf KI-gestützte Inhaltserstellung.",
      socialLinks: JSON.stringify({ twitter: "@maxmuster", website: "maxmustermann.de" }),
      createdAt: "2026-01-15T10:00:00Z",
    });

    // Seed uploads
    const uploadItems: Upload[] = [
      {
        id: randomUUID(),
        userId: demoUserId,
        filename: "produktvideo-q1.mp4",
        fileSize: 52428800,
        mimeType: "video/mp4",
        hash: "a3f2b8c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
        protectionLevel: "gold",
        methods: JSON.stringify(["sha256", "barcode", "blockchain", "watermark"]),
        status: "protected",
        createdAt: "2026-03-10T14:30:00Z",
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        filename: "markenbild-design.png",
        fileSize: 8388608,
        mimeType: "image/png",
        hash: "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
        protectionLevel: "silver",
        methods: JSON.stringify(["sha256", "barcode", "c2pa"]),
        status: "protected",
        createdAt: "2026-03-12T09:15:00Z",
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        filename: "podcast-ep47.mp3",
        fileSize: 31457280,
        mimeType: "audio/mpeg",
        hash: "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
        protectionLevel: "bronze",
        methods: JSON.stringify(["sha256", "barcode"]),
        status: "pending",
        createdAt: "2026-03-14T16:45:00Z",
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        filename: "whitepaper-authentizitaet.pdf",
        fileSize: 2097152,
        mimeType: "application/pdf",
        hash: "d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
        protectionLevel: "gold",
        methods: JSON.stringify(["sha256", "barcode", "c2pa", "blockchain"]),
        status: "protected",
        createdAt: "2026-03-08T11:20:00Z",
      },
    ];
    for (const upload of uploadItems) {
      this.uploadsMap.set(upload.id, upload);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      email: insertUser.email ?? null,
      plan: "free",
      displayName: null,
      bio: null,
      socialLinks: null,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async getStats() {
    return {
      content: this.content.size,
      posts: this.posts.size,
      projects: this.projects.size,
      gaps: this.gaps.size,
    };
  }

  async getContent(): Promise<ProtectedContent[]> {
    return Array.from(this.content.values());
  }

  async createContent(insertContent: InsertContent): Promise<ProtectedContent> {
    const id = randomUUID();
    const item: ProtectedContent = {
      id,
      userId: null,
      title: insertContent.title,
      contentType: insertContent.contentType,
      hash: insertContent.hash ?? null,
      blockchainTxId: `0x${randomUUID().replace(/-/g, "").slice(0, 40)}`,
      barcodeData: `RSEAL-2026-${insertContent.contentType.toUpperCase().slice(0, 3)}-${String(this.content.size + 1).padStart(3, "0")}`,
      watermarkStatus: "pending",
      verificationLevel: "bronze",
      status: "active",
    };
    this.content.set(id, item);
    return item;
  }

  async getPosts(): Promise<SocialPost[]> {
    return Array.from(this.posts.values());
  }

  async createPost(insertPost: InsertPost): Promise<SocialPost> {
    const id = randomUUID();
    const post: SocialPost = {
      id,
      userId: null,
      content: insertPost.content,
      platform: insertPost.platform ?? "optimus",
      likes: 0,
      shares: 0,
      verified: false,
    };
    this.posts.set(id, post);
    return post;
  }

  async getProjects(): Promise<AppProject[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<AppProject> {
    const id = randomUUID();
    const project: AppProject = {
      id,
      userId: null,
      name: insertProject.name,
      description: insertProject.description ?? null,
      aiModel: insertProject.aiModel ?? "auto",
      status: "draft",
      template: insertProject.template ?? null,
    };
    this.projects.set(id, project);
    return project;
  }

  async getGaps(): Promise<MarketGap[]> {
    return Array.from(this.gaps.values());
  }

  async getPricing(): Promise<PricingPlan[]> {
    return Array.from(this.pricing.values());
  }

  async likePost(id: string): Promise<SocialPost | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    post.likes = (post.likes ?? 0) + 1;
    this.posts.set(id, post);
    return post;
  }

  async verifyByHash(hash: string): Promise<ProtectedContent | undefined> {
    return Array.from(this.content.values()).find((c) => c.hash === hash);
  }

  createSession(userId: string): string {
    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }

  async getUserBySession(token: string): Promise<User | undefined> {
    const userId = this.sessions.get(token);
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  deleteSession(token: string): void {
    this.sessions.delete(token);
  }

  // Creator Profiles
  async getCreatorProfiles(): Promise<CreatorProfile[]> {
    return Array.from(this.creatorProfilesMap.values());
  }

  async getCreatorProfile(id: string): Promise<CreatorProfile | undefined> {
    return this.creatorProfilesMap.get(id);
  }

  async createCreatorProfile(insert: InsertCreatorProfile): Promise<CreatorProfile> {
    const id = randomUUID();
    const profile: CreatorProfile = {
      id,
      userId: null,
      displayName: insert.displayName,
      bio: insert.bio ?? null,
      avatarUrl: insert.avatarUrl ?? null,
      socialLinks: insert.socialLinks ?? null,
      verificationTier: insert.verificationTier ?? "bronze",
      portfolioItems: insert.portfolioItems ?? null,
      isPublic: insert.isPublic ?? false,
    };
    this.creatorProfilesMap.set(id, profile);
    return profile;
  }

  // Certificates
  async getCertificates(): Promise<ContentCertificate[]> {
    return Array.from(this.certificates.values());
  }

  async createCertificate(insert: InsertCertificate): Promise<ContentCertificate> {
    const id = randomUUID();
    const cert: ContentCertificate = {
      id,
      contentId: insert.contentId ?? null,
      certificateType: insert.certificateType ?? "c2pa",
      metadata: insert.metadata ?? null,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.certificates.set(id, cert);
    return cert;
  }

  // Stories
  async getStories(): Promise<Story[]> {
    return Array.from(this.storiesMap.values());
  }

  async createStory(insert: InsertStory): Promise<Story> {
    const id = randomUUID();
    const story: Story = {
      id,
      userId: null,
      authorName: null,
      mediaUrl: insert.mediaUrl ?? null,
      caption: insert.caption ?? null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      views: 0,
    };
    this.storiesMap.set(id, story);
    return story;
  }

  // Groups
  async getGroups(): Promise<Group[]> {
    return Array.from(this.groupsMap.values());
  }

  async createGroup(insert: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const group: Group = {
      id,
      name: insert.name,
      description: insert.description ?? null,
      memberCount: 0,
      category: insert.category ?? null,
      isPrivate: insert.isPrivate ?? false,
    };
    this.groupsMap.set(id, group);
    return group;
  }

  // Marketplace
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplace.values());
  }

  async createMarketplaceItem(insert: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const id = randomUUID();
    const item: MarketplaceItem = {
      id,
      userId: null,
      title: insert.title,
      description: insert.description ?? null,
      price: insert.price ?? 0,
      category: insert.category ?? null,
      status: "active",
    };
    this.marketplace.set(id, item);
    return item;
  }

  // Uploads
  async getUploads(userId?: string): Promise<Upload[]> {
    const all = Array.from(this.uploadsMap.values());
    if (userId) return all.filter((u) => u.userId === userId);
    return all;
  }

  async createUpload(insert: InsertUpload & { userId?: string }): Promise<Upload> {
    const id = randomUUID();
    const upload: Upload = {
      id,
      userId: insert.userId ?? null,
      filename: insert.filename,
      fileSize: insert.fileSize ?? null,
      mimeType: insert.mimeType ?? null,
      hash: insert.hash ?? null,
      protectionLevel: insert.protectionLevel ?? null,
      methods: insert.methods ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.uploadsMap.set(id, upload);
    return upload;
  }

  async getUploadStats(userId?: string): Promise<{ total: number; protected: number; pending: number }> {
    const uploads = await this.getUploads(userId);
    return {
      total: uploads.length,
      protected: uploads.filter((u) => u.status === "protected").length,
      pending: uploads.filter((u) => u.status === "pending").length,
    };
  }

  // AI Agents
  async getAgents(userId?: string): Promise<AIAgent[]> {
    const all = Array.from(this.agentsMap.values());
    if (userId) return all.filter((a) => a.userId === userId);
    return all;
  }

  async getAgent(id: string): Promise<AIAgent | undefined> {
    return this.agentsMap.get(id);
  }

  async createAgent(insert: InsertAgent, userId?: string): Promise<AIAgent> {
    const id = randomUUID();
    const agent: AIAgent = {
      id,
      userId: userId ?? null,
      name: insert.name,
      type: insert.type,
      status: "idle",
      description: insert.description ?? null,
      config: insert.config ?? null,
      performance: 0,
      tasksCompleted: 0,
      lastActive: null,
      createdAt: new Date().toISOString(),
    };
    this.agentsMap.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, data: Partial<Pick<AIAgent, "status" | "performance" | "config" | "description">>): Promise<AIAgent | undefined> {
    const agent = this.agentsMap.get(id);
    if (!agent) return undefined;
    const updated: AIAgent = {
      ...agent,
      status: data.status !== undefined ? data.status : agent.status,
      performance: data.performance !== undefined ? data.performance : agent.performance,
      config: data.config !== undefined ? data.config : agent.config,
      description: data.description !== undefined ? data.description : agent.description,
      lastActive: new Date().toISOString(),
    };
    this.agentsMap.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agentsMap.delete(id);
  }

  // Agent Tasks
  async getAgentTasks(agentId: string): Promise<AgentTask[]> {
    return Array.from(this.agentTasksMap.values()).filter((t) => t.agentId === agentId);
  }

  async createAgentTask(insert: InsertTask): Promise<AgentTask> {
    const id = randomUUID();
    const task: AgentTask = {
      id,
      agentId: insert.agentId ?? null,
      title: insert.title,
      description: insert.description ?? null,
      status: "pending",
      priority: insert.priority ?? "medium",
      result: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    this.agentTasksMap.set(id, task);
    return task;
  }

  // Community Posts
  async getCommunityPosts(): Promise<import("@shared/schema").CommunityPost[]> {
    const posts = Array.from(this.content.values());
    // Return community posts from the communityPosts map if we add one, for now use seeded data
    const communityData: import("@shared/schema").CommunityPost[] = [
      { id: randomUUID(), userId: null, authorName: "Anna Schreiber", authorAvatar: null, content: "Gerade mein erstes C2PA-Zertifikat erhalten! Der Schutz für meine Produktfotos ist jetzt blockchain-verifiziert. Absolute Empfehlung für alle Creator! 🔒", mediaUrl: null, mediaType: "text", likes: 142, comments: 23, shares: 18, verified: true, trustScore: 92, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
      { id: randomUUID(), userId: null, authorName: "Max Hoffmann", authorAvatar: null, content: "Der KI-Optimierer hat meinen YouTube-Titel verbessert — 40% mehr Klickrate! RealSync Optimus versteht wirklich, was funktioniert.", mediaUrl: null, mediaType: "text", likes: 289, comments: 45, shares: 67, verified: true, trustScore: 96, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
      { id: randomUUID(), userId: null, authorName: "Lena Weber", authorAvatar: null, content: "Tipp: Nutzt den Barcode-Generator zusammen mit Wasserzeichen — doppelter Schutz für eure Designs! Tutorial kommt morgen. 🎨", mediaUrl: null, mediaType: "text", likes: 456, comments: 89, shares: 34, verified: true, trustScore: 88, createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
      { id: randomUUID(), userId: null, authorName: "Tim Fischer", authorAvatar: null, content: "Market Scanner hat mir eine Nische gezeigt, die kein anderes Tool gefunden hat. Mein neues SaaS-Projekt basiert komplett darauf. Danke RealSync! 🚀", mediaUrl: null, mediaType: "text", likes: 567, comments: 78, shares: 112, verified: false, trustScore: 75, createdAt: new Date(Date.now() - 12 * 3600000).toISOString() },
      { id: randomUUID(), userId: null, authorName: "Sarah Klein", authorAvatar: null, content: "Die Community hier ist unglaublich supportive. Endlich eine Plattform, die DSGVO ernst nimmt UND Creator wirklich unterstützt. 🇩🇪", mediaUrl: null, mediaType: "text", likes: 723, comments: 134, shares: 89, verified: true, trustScore: 91, createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
    ];
    return communityData;
  }

  async createCommunityPost(post: import("@shared/schema").InsertCommunityPost): Promise<import("@shared/schema").CommunityPost> {
    const id = randomUUID();
    const newPost: import("@shared/schema").CommunityPost = {
      id,
      userId: null,
      authorName: "Du",
      authorAvatar: null,
      content: post.content,
      mediaUrl: post.mediaUrl ?? null,
      mediaType: post.mediaType ?? "text",
      likes: 0,
      comments: 0,
      shares: 0,
      verified: false,
      trustScore: 50,
      createdAt: new Date().toISOString(),
    };
    return newPost;
  }

  async likeCommunityPost(id: string): Promise<import("@shared/schema").CommunityPost | undefined> {
    return undefined; // In-memory community posts are re-generated each time
  }

  // Complete agent task
  async completeAgentTask(id: string, result: string): Promise<AgentTask | undefined> {
    const task = this.agentTasksMap.get(id);
    if (!task) return undefined;
    const updated: AgentTask = {
      ...task,
      status: "completed",
      result,
      completedAt: new Date().toISOString(),
    };
    this.agentTasksMap.set(id, updated);
    return updated;
  }

  // User updates
  async updateUser(id: string, data: Partial<Pick<User, "displayName" | "bio" | "socialLinks" | "email">>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated: User = {
      ...user,
      displayName: data.displayName !== undefined ? data.displayName : user.displayName,
      bio: data.bio !== undefined ? data.bio : user.bio,
      socialLinks: data.socialLinks !== undefined ? data.socialLinks : user.socialLinks,
      email: data.email !== undefined ? data.email : user.email,
    };
    this.users.set(id, updated);
    return updated;
  }

  async getUserStats(userId: string): Promise<{
    protectedContent: number;
    certificates: number;
    blockchainVerifications: number;
    trustScore: number;
    planUsage: { used: number; limit: number };
    recentActivity: { type: string; title: string; time: string }[];
  }> {
    const allContent = Array.from(this.content.values()).filter((c) => c.userId === userId);
    const allUploads = Array.from(this.uploadsMap.values()).filter((u) => u.userId === userId);
    const allCerts = Array.from(this.certificates.values());
    const contentIds = new Set(allContent.map((c) => c.id));
    const userCerts = allCerts.filter((c) => c.contentId && contentIds.has(c.contentId));
    const blockchainCount = allContent.filter((c) => c.blockchainTxId).length;
    const protectedCount = allUploads.filter((u) => u.status === "protected").length + allContent.length;

    // Trust score: based on protected content, certs, blockchain verifications
    const trustScore = Math.min(100, Math.round(
      (protectedCount * 8) + (userCerts.length * 12) + (blockchainCount * 15)
    ));

    return {
      protectedContent: protectedCount,
      certificates: userCerts.length,
      blockchainVerifications: blockchainCount,
      trustScore: trustScore || 72, // fallback demo score
      planUsage: { used: protectedCount, limit: 100 },
      recentActivity: [
        { type: "protection", title: "Produktvideo Q1 2026 geschützt", time: "vor 2 Stunden" },
        { type: "certificate", title: "C2PA-Zertifikat erstellt", time: "vor 5 Stunden" },
        { type: "blockchain", title: "Blockchain-Verifizierung abgeschlossen", time: "vor 1 Tag" },
        { type: "upload", title: "Markenbild Design System hochgeladen", time: "vor 2 Tagen" },
        { type: "protection", title: "Podcast Episode 47 geschützt", time: "vor 3 Tagen" },
      ],
    };
  }
}

export const storage = new MemStorage();
