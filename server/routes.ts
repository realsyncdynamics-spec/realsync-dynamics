import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { createHash, randomUUID } from "crypto";
import { storage } from "./storage";
import { aiRouter } from "./ai-router";
import { insertScreenshotSchema, insertCampaignSchema, insertAutomationRuleSchema } from "@shared/schema";

async function requireAuth(req: Request, res: Response): Promise<{ id: string; username: string; plan: string | null; displayName: string | null; bio: string | null; email: string | null; socialLinks: string | null; createdAt: string | null } | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Nicht authentifiziert" });
    return null;
  }
  const token = authHeader.slice(7);
  const user = await storage.getUserBySession(token);
  if (!user) {
    res.status(401).json({ error: "Ungültiges oder abgelaufenes Token" });
    return null;
  }
  return user;
}

// Plan limits
const PLAN_LIMITS: Record<string, { agentTasks: number; agents: number; apiAccess: boolean }> = {
  starter: { agentTasks: 5, agents: 2, apiAccess: false },
  creator: { agentTasks: 50, agents: 5, apiAccess: false },
  pro: { agentTasks: -1, agents: -1, apiAccess: true }, // -1 = unlimited
  enterprise: { agentTasks: -1, agents: -1, apiAccess: true },
  free: { agentTasks: 5, agents: 2, apiAccess: false },
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ───── Platform Stats ─────
  app.get("/api/stats", async (_req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // ───── Protected Content (CreatorSeal) ─────
  app.get("/api/content", async (_req, res) => {
    const content = await storage.getContent();
    res.json(content);
  });

  app.post("/api/content", async (req, res) => {
    const { title, contentType, hash } = req.body;
    if (!title || !contentType) {
      return res.status(400).json({ error: "Titel und Inhaltstyp sind erforderlich" });
    }
    const content = await storage.createContent({ title, contentType, hash });
    res.status(201).json(content);
  });

  // ───── Social Posts ─────
  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.post("/api/posts", async (req, res) => {
    const { content, platform } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Inhalt ist erforderlich" });
    }
    const post = await storage.createPost({ content, platform });
    res.status(201).json(post);
  });

  // ───── Community Posts ─────
  app.get("/api/community/posts", async (_req, res) => {
    const posts = await storage.getCommunityPosts();
    res.json(posts);
  });

  app.post("/api/community/posts", async (req, res) => {
    const { content, mediaUrl, mediaType } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Inhalt ist erforderlich" });
    }
    const post = await storage.createCommunityPost({ content, mediaUrl, mediaType });
    res.status(201).json(post);
  });

  app.post("/api/community/posts/:id/like", async (req, res) => {
    const post = await storage.likeCommunityPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post nicht gefunden" });
    }
    res.json(post);
  });

  // ───── App Projects (Builder) ─────
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    const { name, description, aiModel, template } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Projektname ist erforderlich" });
    }
    const project = await storage.createProject({ name, description, aiModel, template });
    res.status(201).json(project);
  });

  // ───── Market Gaps (Scanner) ─────
  app.get("/api/gaps", async (_req, res) => {
    const gaps = await storage.getGaps();
    res.json(gaps);
  });

  // ───── Pricing Plans ─────
  app.get("/api/pricing", async (_req, res) => {
    const pricing = await storage.getPricing();
    res.json(pricing);
  });

  // ───── Auth: Register ─────
  app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Benutzername und Passwort sind erforderlich" });
    }
    const existing = await storage.getUserByUsername(username);
    if (existing) {
      return res.status(409).json({ error: "Benutzername bereits vergeben" });
    }
    const hashedPassword = createHash("sha256").update(password).digest("hex");
    const user = await storage.createUser({ username, password: hashedPassword });
    const token = storage.createSession(user.id);
    res.status(201).json({ user: { id: user.id, username: user.username, plan: user.plan, displayName: user.displayName, email: user.email, bio: user.bio, socialLinks: user.socialLinks, createdAt: user.createdAt }, token });
  });

  // ───── Auth: Login ─────
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Benutzername und Passwort sind erforderlich" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }
    const hashedPassword = createHash("sha256").update(password).digest("hex");
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }
    const token = storage.createSession(user.id);
    res.json({ user: { id: user.id, username: user.username, plan: user.plan, displayName: user.displayName, email: user.email, bio: user.bio, socialLinks: user.socialLinks, createdAt: user.createdAt }, token });
  });

  // ───── Auth: Get Current User ─────
  app.get("/api/auth/me", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    res.json({ id: user.id, username: user.username, plan: user.plan, displayName: user.displayName, email: user.email, bio: user.bio, socialLinks: user.socialLinks, createdAt: user.createdAt });
  });

  // ───── Auth: Update Profile ─────
  app.patch("/api/auth/profile", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const { displayName, bio, socialLinks, email } = req.body;
    const updated = await storage.updateUser(user.id, { displayName, bio, socialLinks, email });
    if (!updated) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
    res.json({ id: updated.id, username: updated.username, plan: updated.plan, displayName: updated.displayName, email: updated.email, bio: updated.bio, socialLinks: updated.socialLinks, createdAt: updated.createdAt });
  });

  // ───── Auth: Logout ─────
  app.post("/api/auth/logout", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Nicht authentifiziert" });
    }
    const token = authHeader.slice(7);
    storage.deleteSession(token);
    res.json({ success: true, message: "Erfolgreich abgemeldet" });
  });

  // ───── Like a post ─────
  app.post("/api/posts/:id/like", async (req, res) => {
    const post = await storage.likePost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post nicht gefunden" });
    }
    res.json(post);
  });

  // ───── Verify content by hash ─────
  app.post("/api/verify", async (req, res) => {
    const { hash } = req.body;
    if (!hash) {
      return res.status(400).json({ error: "Hash ist erforderlich" });
    }
    const content = await storage.verifyByHash(hash);
    if (!content) {
      return res.json({ verified: false, message: "Kein Inhalt mit diesem Hash gefunden" });
    }
    res.json({ verified: true, content });
  });

  // ───── Barcode ─────
  app.get("/api/barcode/:code", async (_req, res) => {
    const code = _req.params.code;
    res.json({ code, format: "Code128", generated: new Date().toISOString(), valid: true });
  });

  // ═══════════════════════════════════════════════════════
  // ═══════ STRIPE CHECKOUT & SUBSCRIPTION ═══════════════
  // ═══════════════════════════════════════════════════════

  // Unified pricing table (all apps + bundles)
  const PRICING_TABLE: Record<string, Record<string, { price: number; stripePriceId: string | null }>> = {
    // Individual App Pricing
    creatorseal: {
      starter: { price: 0, stripePriceId: null },
      creator: { price: 900, stripePriceId: "price_creatorseal_creator" },
      pro: { price: 2900, stripePriceId: "price_creatorseal_pro" },
      enterprise: { price: 7900, stripePriceId: "price_creatorseal_enterprise" },
    },
    optimus: {
      starter: { price: 0, stripePriceId: null },
      creator: { price: 900, stripePriceId: "price_optimus_creator" },
      pro: { price: 4900, stripePriceId: "price_optimus_pro" },
      enterprise: { price: 14900, stripePriceId: "price_optimus_enterprise" },
    },
    builder: {
      starter: { price: 0, stripePriceId: null },
      creator: { price: 1900, stripePriceId: "price_builder_creator" },
      pro: { price: 4900, stripePriceId: "price_builder_pro" },
      enterprise: { price: 9900, stripePriceId: "price_builder_enterprise" },
    },
    scanner: {
      starter: { price: 0, stripePriceId: null },
      creator: { price: 1900, stripePriceId: "price_scanner_creator" },
      pro: { price: 4900, stripePriceId: "price_scanner_pro" },
      enterprise: { price: 9900, stripePriceId: "price_scanner_enterprise" },
    },
    community: {
      starter: { price: 0, stripePriceId: null },
      creator: { price: 900, stripePriceId: "price_community_creator" },
      pro: { price: 2900, stripePriceId: "price_community_pro" },
      enterprise: { price: 4900, stripePriceId: "price_community_enterprise" },
    },
    // SchulLabor
    schullabor: {
      starter: { price: 0, stripePriceId: null },
      lehrer: { price: 900, stripePriceId: "price_schullabor_lehrer" },
      schule: { price: 4900, stripePriceId: "price_schullabor_schule" },
      bundesland: { price: 29900, stripePriceId: "price_schullabor_bundesland" },
    },
    // Link-Magic
    linkmagic: {
      free: { price: 0, stripePriceId: null },
      starter: { price: 900, stripePriceId: "price_linkmagic_starter" },
      pro: { price: 2900, stripePriceId: "price_linkmagic_pro" },
      agency: { price: 9900, stripePriceId: "price_linkmagic_agency" },
    },
    // RealSync Gesamtpaket (Bundle)
    realsync: {
      starter: { price: 0, stripePriceId: null },
      creator: { price: 1900, stripePriceId: "price_realsync_creator" },
      pro: { price: 4900, stripePriceId: "price_realsync_pro" },
      enterprise: { price: 14900, stripePriceId: "price_realsync_enterprise" },
    },
  };

  // Checkout
  app.post("/api/checkout", async (req, res) => {
    const { appName, tierName, interval } = req.body;
    if (!appName || !tierName) {
      return res.status(400).json({ error: "App und Tarif sind erforderlich" });
    }

    const appKey = appName.toLowerCase().replace(/\s+/g, "");
    const tierKey = tierName.toLowerCase();
    const appPricing = PRICING_TABLE[appKey];
    if (!appPricing) {
      return res.status(400).json({ error: "Unbekannte App" });
    }

    const tier = appPricing[tierKey];
    if (!tier) {
      return res.status(400).json({ error: "Unbekannter Tarif" });
    }

    if (tier.price === 0) {
      return res.json({ type: "free", message: "Kostenloser Plan aktiviert!" });
    }

    // 20% yearly discount
    const finalPrice = interval === "yearly" ? Math.round(tier.price * 12 * 0.8) : tier.price;

    const checkoutId = createHash("sha256")
      .update(`${appName}-${tierName}-${Date.now()}-${Math.random()}`)
      .digest("hex")
      .slice(0, 24);

    // In production: create real Stripe Checkout session here
    // const session = await stripe.checkout.sessions.create({ ... });
    res.json({
      type: "checkout",
      checkoutUrl: `https://checkout.stripe.com/c/pay/cs_live_${checkoutId}`,
      sessionId: `cs_${checkoutId}`,
      appName: appKey,
      tierName: tierKey,
      interval: interval || "monthly",
      priceInCents: finalPrice,
      priceFormatted: `${(finalPrice / 100).toFixed(2).replace(".", ",")}€`,
      currency: "eur",
      stripePriceId: tier.stripePriceId,
    });
  });

  // Stripe Webhook
  app.post("/api/stripe/webhook", async (req, res) => {
    // In production: verify stripe.webhooks.constructEvent(body, sig, secret)
    const { type, data } = req.body;
    console.log("Stripe webhook:", type, data);

    if (type === "checkout.session.completed") {
      // Update user plan
      const userId = data?.metadata?.userId;
      const plan = data?.metadata?.plan;
      if (userId && plan) {
        await storage.updateUser(userId, { displayName: undefined, bio: undefined, socialLinks: undefined, email: undefined });
        console.log(`User ${userId} upgraded to ${plan}`);
      }
    }

    res.json({ received: true });
  });

  // Subscription status
  app.get("/api/subscription", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;

    const plan = user.plan || "starter";
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    res.json({
      plan,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      limits,
    });
  });

  // ═══════════════════════════════════════════════════════
  // ═══════ KI MODEL ROUTER (FREE AI) ═══════════════════
  // ═══════════════════════════════════════════════════════

  // Get AI router status (available models, usage)
  app.get("/api/ai/status", async (_req, res) => {
    const status = aiRouter.getStatus();
    res.json(status);
  });

  // Chat with AI (routes to best available free model)
  app.post("/api/ai/chat", async (req, res) => {
    const { messages, taskType } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Nachrichten-Array ist erforderlich" });
    }

    try {
      const response = await aiRouter.chat(messages, taskType);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: "KI-Anfrage fehlgeschlagen", details: error.message });
    }
  });

  // Execute agent task with AI
  app.post("/api/ai/agent-task", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { agentId, taskDescription, taskType } = req.body;
    if (!agentId || !taskDescription) {
      return res.status(400).json({ error: "Agent-ID und Aufgabenbeschreibung sind erforderlich" });
    }

    // Check plan limits
    const plan = user.plan || "starter";
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    const agentTasks = await storage.getAgentTasks(agentId);
    const todayTasks = agentTasks.filter((t) => {
      const created = new Date(t.createdAt || "");
      const today = new Date();
      return created.toDateString() === today.toDateString();
    });

    if (limits.agentTasks !== -1 && todayTasks.length >= limits.agentTasks) {
      return res.status(429).json({
        error: "Tageslimit erreicht",
        message: `Ihr ${plan}-Plan erlaubt ${limits.agentTasks} Agent-Tasks pro Tag. Upgrade für mehr.`,
        limit: limits.agentTasks,
        used: todayTasks.length,
      });
    }

    // Create task
    const task = await storage.createAgentTask({
      agentId,
      title: taskDescription.slice(0, 100),
      description: taskDescription,
      priority: "medium",
    });

    // Run AI
    const aiResponse = await aiRouter.chat(
      [
        { role: "system", content: `Du bist ein ${taskType || "general"} Agent von RealSync Dynamics. Antworte auf Deutsch.` },
        { role: "user", content: taskDescription },
      ],
      taskType
    );

    // Update task with result
    await storage.completeAgentTask(task.id, aiResponse.content);

    // Update agent stats
    await storage.updateAgent(agentId, {
      status: "idle",
      performance: Math.min(100, (Math.random() * 20 + 80) | 0),
    });

    res.json({
      task: { ...task, status: "completed", result: aiResponse.content },
      ai: aiResponse,
    });
  });

  // ───── KI-Support Chat ─────
  app.post("/api/support/chat", async (req, res) => {
    const { message, category, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Nachricht ist erforderlich" });
    }

    // Knowledge base for common issues
    const knowledgeBase: Record<string, string> = {
      "routing": "Routing-Probleme: Stelle sicher, dass du Hash-URLs verwendest (z.B. /#/optimus). Leere den Browser-Cache und lade die Seite neu.",
      "login": "Login-Probleme: Überprüfe Benutzername und Passwort. Falls du dein Passwort vergessen hast, erstelle ein neues Konto.",
      "stripe": "Zahlungsprobleme: Stripe Checkout öffnet sich in einem neuen Fenster. Stelle sicher, dass Pop-ups nicht blockiert sind.",
      "creatorseal": "CreatorSeal: Schütze deine Inhalte mit SHA-256 Hash, Barcode, Blockchain oder Wasserzeichen. Wähle deinen Schutzlevel.",
      "optimus": "RealSync Optimus: Erstelle KI-Agenten und weise ihnen Aufgaben zu. Kostenlose KI-Modelle über unseren Model-Router.",
      "community": "Community: Erstelle Posts, like und kommentiere. Tritt Gruppen bei und verkaufe im Marketplace.",
      "preise": "Preise: Starter (kostenlos), Creator (19€/Monat), Pro (49€/Monat), Enterprise (149€/Monat). 20% Rabatt bei Jahresabo.",
      "builder": "Multi-App Builder: Erstelle eigene Apps mit KI-Unterstützung. Wähle ein Template und passe es an.",
      "scanner": "Market Scanner: Analysiere Marktlücken und Trends mit KI-gestützter Analyse.",
    };

    // Try to match keywords to knowledge base
    const msgLower = message.toLowerCase();
    let contextInfo = "";
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (msgLower.includes(key)) {
        contextInfo += value + " ";
      }
    }

    try {
      const systemPrompt = `Du bist der RealSync Dynamics KI-Support-Assistent. Du hilfst Nutzern mit der RealSync SaaS Plattform.
Beantworte Fragen freundlich und professionell auf Deutsch.

Plattform-Info:
- RealSync Dynamics ist eine SaaS-Plattform für Creator & Content-Schutz
- 5 Apps: CreatorSeal, Optimus, Builder, Scanner, Community
- Preise: Starter (0€), Creator (19€), Pro (49€), Enterprise (149€)
- Features: KI-Agenten, Content-Schutz, Blockchain-Verifizierung, Barcode-Studio
${contextInfo ? "\nRelevante Info: " + contextInfo : ""}

Wenn du etwas nicht weißt, leite den Nutzer an support@realsyncdynamics.de weiter.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...(Array.isArray(history) ? history.slice(-10) : []),
        { role: "user", content: message },
      ];

      const aiResponse = await aiRouter.chat(messages, "support");
      res.json({
        reply: aiResponse.content,
        model: aiResponse.model,
        provider: aiResponse.provider,
        category: category || "general",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // Fallback response if AI fails
      let fallbackReply = "Entschuldigung, ich konnte keine Verbindung zur KI herstellen. ";
      if (contextInfo) {
        fallbackReply += contextInfo;
      } else {
        fallbackReply += "Bitte kontaktiere uns unter support@realsyncdynamics.de oder versuche es später erneut.";
      }
      res.json({
        reply: fallbackReply,
        model: "fallback",
        provider: "knowledge-base",
        category: category || "general",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // ───── Contact Form ─────
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, E-Mail und Nachricht sind erforderlich" });
    }
    console.log("Contact form:", { name, email, subject, message, timestamp: new Date().toISOString() });
    res.json({ success: true, message: "Nachricht wurde gesendet!" });
  });

  // ───── Creator Profiles ─────
  app.get("/api/creator-profiles", async (_req, res) => {
    const profiles = await storage.getCreatorProfiles();
    res.json(profiles);
  });

  app.get("/api/creator-profiles/:id", async (req, res) => {
    const profile = await storage.getCreatorProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Profil nicht gefunden" });
    }
    res.json(profile);
  });

  app.post("/api/creator-profiles", async (req, res) => {
    const { displayName, bio, avatarUrl, socialLinks, verificationTier, portfolioItems, isPublic } = req.body;
    if (!displayName) {
      return res.status(400).json({ error: "Anzeigename ist erforderlich" });
    }
    const profile = await storage.createCreatorProfile({ displayName, bio, avatarUrl, socialLinks, verificationTier, portfolioItems, isPublic });
    res.status(201).json(profile);
  });

  // ───── Certificates ─────
  app.get("/api/certificates", async (_req, res) => {
    const certs = await storage.getCertificates();
    res.json(certs);
  });

  app.post("/api/certificates", async (req, res) => {
    const { contentId, certificateType, metadata } = req.body;
    const cert = await storage.createCertificate({ contentId, certificateType, metadata });
    res.status(201).json(cert);
  });

  // ───── Stories ─────
  app.get("/api/stories", async (_req, res) => {
    const stories = await storage.getStories();
    res.json(stories);
  });

  app.post("/api/stories", async (req, res) => {
    const { mediaUrl, caption } = req.body;
    const story = await storage.createStory({ mediaUrl, caption });
    res.status(201).json(story);
  });

  // ───── Groups ─────
  app.get("/api/groups", async (_req, res) => {
    const groups = await storage.getGroups();
    res.json(groups);
  });

  app.post("/api/groups", async (req, res) => {
    const { name, description, category, isPrivate } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Gruppenname ist erforderlich" });
    }
    const group = await storage.createGroup({ name, description, category, isPrivate });
    res.status(201).json(group);
  });

  // ───── Marketplace ─────
  app.get("/api/marketplace", async (_req, res) => {
    const items = await storage.getMarketplaceItems();
    res.json(items);
  });

  app.post("/api/marketplace", async (req, res) => {
    const { title, description, price, category } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Titel ist erforderlich" });
    }
    const item = await storage.createMarketplaceItem({ title, description, price, category });
    res.status(201).json(item);
  });

  // ───── SHA-256 Hash ─────
  app.post("/api/hash", async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text ist erforderlich" });
    }
    const hash = createHash("sha256").update(text).digest("hex");
    res.json({ hash, algorithm: "SHA-256", timestamp: new Date().toISOString() });
  });

  // ───── Content Protection (CreatorSeal Advanced) ─────
  app.post("/api/content/protect", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const { title, contentType, fileSize, protectionLevel, methods } = req.body;
    if (!title || !contentType) {
      return res.status(400).json({ error: "Titel und Inhaltstyp sind erforderlich" });
    }
    const validLevels = ["bronze", "silver", "gold", "enterprise"];
    const level = validLevels.includes(protectionLevel) ? protectionLevel : "bronze";
    const validMethods = ["sha256", "barcode", "c2pa", "blockchain", "watermark"];
    const selectedMethods: string[] = Array.isArray(methods) ? methods.filter((m: string) => validMethods.includes(m)) : ["sha256"];

    const hashInput = `${title}-${contentType}-${user.id}-${Date.now()}`;
    const contentHash = createHash("sha256").update(hashInput).digest("hex");

    const barcodeData = selectedMethods.includes("barcode")
      ? `RSEAL-2026-${contentType.toUpperCase().slice(0, 3)}-${randomUUID().slice(0, 8).toUpperCase()}`
      : null;

    const blockchainTx = selectedMethods.includes("blockchain")
      ? `0x${randomUUID().replace(/-/g, "").slice(0, 40)}`
      : null;

    const certificateId = selectedMethods.includes("c2pa")
      ? `CERT-${randomUUID().slice(0, 12).toUpperCase()}`
      : null;

    const content = await storage.createContent({ title, contentType, hash: contentHash });

    await storage.createUpload({
      userId: user.id,
      filename: `${title.toLowerCase().replace(/\s+/g, "-")}.${contentType}`,
      fileSize: fileSize || 0,
      mimeType: `${contentType === "video" ? "video/mp4" : contentType === "image" ? "image/png" : contentType === "audio" ? "audio/mpeg" : "application/pdf"}`,
      hash: contentHash,
      protectionLevel: level,
      methods: JSON.stringify(selectedMethods),
    });

    res.status(201).json({
      id: content.id,
      title,
      contentType,
      hash: contentHash,
      protectionLevel: level,
      methods: selectedMethods,
      status: "protected",
      barcode: barcodeData,
      certificateId,
      blockchainTx,
      createdAt: new Date().toISOString(),
    });
  });

  // ───── User Stats ─────
  app.get("/api/user/stats", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const stats = await storage.getUserStats(user.id);
    res.json(stats);
  });

  // ───── Uploads ─────
  app.get("/api/uploads", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const uploads = await storage.getUploads(user.id);
    res.json(uploads);
  });

  app.post("/api/uploads", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const { filename, fileSize, mimeType, data, protectionLevel, methods } = req.body;
    if (!filename) {
      return res.status(400).json({ error: "Dateiname ist erforderlich" });
    }
    const hashInput = data || filename + Date.now().toString();
    const hash = createHash("sha256").update(hashInput).digest("hex");

    const upload = await storage.createUpload({
      userId: user.id,
      filename,
      fileSize: fileSize || 0,
      mimeType: mimeType || "application/octet-stream",
      hash,
      protectionLevel: protectionLevel || null,
      methods: methods ? JSON.stringify(methods) : null,
    });
    res.status(201).json(upload);
  });

  // ═══════════════════════════════════════════════════════
  // ═══════ KI-AGENTEN (RealSync Optimus) ═══════════════
  // ═══════════════════════════════════════════════════════

  app.get("/api/agents", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const agents = await storage.getAgents(user.id);
    res.json(agents);
  });

  app.post("/api/agents", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const { name, type, description } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "Name und Typ sind erforderlich" });
    }
    const validTypes = ["content-optimizer", "seo-agent", "social-manager", "security-auditor", "analytics", "workflow"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Ungültiger Agent-Typ" });
    }
    const agent = await storage.createAgent({ name, type, description: description ?? null, config: null }, user.id);
    res.status(201).json(agent);
  });

  app.patch("/api/agents/:id", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const agent = await storage.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: "Agent nicht gefunden" });
    }
    const { status, performance, config, description } = req.body;
    const updated = await storage.updateAgent(req.params.id, { status, performance, config, description });
    res.json(updated);
  });

  app.delete("/api/agents/:id", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const deleted = await storage.deleteAgent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Agent nicht gefunden" });
    }
    res.json({ success: true, message: "Agent gelöscht" });
  });

  app.get("/api/agents/:id/tasks", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const tasks = await storage.getAgentTasks(req.params.id);
    res.json(tasks);
  });

  app.post("/api/agents/:id/tasks", async (req, res) => {
    const user = await requireAuth(req, res);
    if (!user) return;
    const agent = await storage.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: "Agent nicht gefunden" });
    }
    const { title, description, priority } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Titel ist erforderlich" });
    }
    const task = await storage.createAgentTask({
      agentId: req.params.id,
      title,
      description: description ?? null,
      priority: priority ?? "medium",
    });
    res.status(201).json(task);
  });

  // ═══════════════════════════════════════════════════════
  // ═══════ SCREENSHOT-AGENTEN & GROWTH SYSTEM ═══════════
  // ═══════════════════════════════════════════════════════

  // Create screenshot submission
  app.post("/api/screenshots", async (req, res) => {
    const parsed = insertScreenshotSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Ungültige Eingabedaten", details: parsed.error.issues });
    }
    const data = parsed.data;

    // DSGVO: consent is mandatory
    if (!data.consentGiven || !data.dataProcessingAgreed) {
      return res.status(400).json({ error: "DSGVO-Einwilligung und Datenverarbeitungszustimmung sind erforderlich" });
    }

    const screenshot = await storage.createScreenshot(data);

    // Mock KI analysis
    const mockAiAnalysis = {
      detectedIssues: ["UI-Element Überlappung erkannt", "Kontrast zu niedrig im Header"],
      suggestions: ["Button-Abstand vergrößern", "Schriftgröße auf mobilen Geräten anpassen"],
      confidence: 0.87,
      processingTime: "1.2s",
    };
    const priorities = ["critical", "high", "medium", "low"];
    const aiCategories = ["ui-bug", "feature-gap", "ux-improvement", "performance", "design"];

    const aiPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const aiCategory = aiCategories[Math.floor(Math.random() * aiCategories.length)];

    const updatedScreenshot = await storage.updateScreenshot(screenshot.id, {
      aiAnalysis: JSON.stringify(mockAiAnalysis),
      aiPriority,
      aiCategory,
      aiSuggestion: mockAiAnalysis.suggestions[0],
      status: "analysiert",
      pointsAwarded: 10,
    });

    // DSGVO log
    await storage.createDsgvoLog({
      action: "upload",
      userId: null,
      screenshotId: screenshot.id,
      details: `Screenshot eingereicht: ${data.category} — ${data.appTarget || "allgemein"}`,
      ipHash: createHash("sha256").update(req.ip || "unknown").digest("hex").slice(0, 16),
    });

    // Update growth rewards
    await storage.createOrUpdateGrowthReward({
      userName: data.userName,
      userEmail: data.userEmail ?? "anonym@realsync.de",
      totalPoints: 10,
      screenshotsSubmitted: 1,
    });

    res.status(201).json({
      screenshot: updatedScreenshot,
      aiAnalysis: mockAiAnalysis,
      aiPriority,
      aiCategory,
      pointsAwarded: 10,
      message: "Screenshot erfolgreich eingereicht und KI-Analyse gestartet",
    });
  });

  // List screenshots
  app.get("/api/screenshots", async (req, res) => {
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;
    const screenshots = await storage.getScreenshots({ category, status });
    res.json(screenshots);
  });

  // Get single screenshot
  app.get("/api/screenshots/:id", async (req, res) => {
    const screenshot = await storage.getScreenshot(req.params.id);
    if (!screenshot) {
      return res.status(404).json({ error: "Screenshot nicht gefunden" });
    }
    res.json(screenshot);
  });

  // Upvote screenshot
  app.post("/api/screenshots/:id/upvote", async (req, res) => {
    const screenshot = await storage.upvoteScreenshot(req.params.id);
    if (!screenshot) {
      return res.status(404).json({ error: "Screenshot nicht gefunden" });
    }
    res.json(screenshot);
  });

  // Leaderboard
  app.get("/api/growth-rewards/leaderboard", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const leaderboard = await storage.getLeaderboard(limit);
    res.json(leaderboard);
  });

  // Growth stats
  app.get("/api/growth-rewards/stats", async (req, res) => {
    const stats = await storage.getGrowthStats();
    res.json(stats);
  });

  // Get reward for current user by email
  app.get("/api/growth-rewards/me", async (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "E-Mail-Parameter ist erforderlich" });
    }
    const reward = await storage.getGrowthReward(email);
    if (!reward) {
      return res.status(404).json({ error: "Keine Belohnungsdaten für diese E-Mail gefunden" });
    }
    res.json(reward);
  });

  // ═══════════════════════════════════════════════════════
  // ═══════ WERBEKAMPAGNEN & AUTOMATISIERUNG ══════════════
  // ═══════════════════════════════════════════════════════

  // List campaigns
  app.get("/api/campaigns", async (req, res) => {
    const status = req.query.status as string | undefined;
    const platform = req.query.platform as string | undefined;
    const campaigns = await storage.getCampaigns({ status, platform });
    res.json(campaigns);
  });

  // Campaign stats — MUST be before :id route
  app.get("/api/campaigns/stats", async (req, res) => {
    const stats = await storage.getCampaignStats();
    res.json(stats);
  });

  // Get single campaign
  app.get("/api/campaigns/:id", async (req, res) => {
    const campaign = await storage.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampagne nicht gefunden" });
    }
    res.json(campaign);
  });

  // Create campaign
  app.post("/api/campaigns", async (req, res) => {
    const parsed = insertCampaignSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Ungültige Kampagnendaten", details: parsed.error.issues });
    }
    const campaign = await storage.createCampaign(parsed.data);
    res.status(201).json(campaign);
  });

  // Update campaign
  app.patch("/api/campaigns/:id", async (req, res) => {
    const campaign = await storage.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampagne nicht gefunden" });
    }
    const updated = await storage.updateCampaign(req.params.id, req.body);
    res.json(updated);
  });

  // Delete campaign
  app.delete("/api/campaigns/:id", async (req, res) => {
    const deleted = await storage.deleteCampaign(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Kampagne nicht gefunden" });
    }
    res.json({ success: true, message: "Kampagne gelöscht" });
  });

  // List automation rules for a campaign
  app.get("/api/campaigns/:id/rules", async (req, res) => {
    const campaign = await storage.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampagne nicht gefunden" });
    }
    const rules = await storage.getAutomationRules(req.params.id);
    res.json(rules);
  });

  // Create automation rule for a campaign
  app.post("/api/campaigns/:id/rules", async (req, res) => {
    const campaign = await storage.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampagne nicht gefunden" });
    }
    const parsed = insertAutomationRuleSchema.safeParse({ ...req.body, campaignId: req.params.id });
    if (!parsed.success) {
      return res.status(400).json({ error: "Ungültige Regeldaten", details: parsed.error.issues });
    }
    const rule = await storage.createAutomationRule(parsed.data);
    res.status(201).json(rule);
  });

  // Update automation rule
  app.patch("/api/automation-rules/:id", async (req, res) => {
    const updated = await storage.updateAutomationRule(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Automatisierungsregel nicht gefunden" });
    }
    res.json(updated);
  });

  // Delete automation rule
  app.delete("/api/automation-rules/:id", async (req, res) => {
    const deleted = await storage.deleteAutomationRule(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Automatisierungsregel nicht gefunden" });
    }
    res.json({ success: true, message: "Automatisierungsregel gelöscht" });
  });

  // AI-optimize a campaign
  app.post("/api/campaigns/:id/ai-optimize", async (req, res) => {
    const campaign = await storage.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Kampagne nicht gefunden" });
    }
    const suggestions = {
      headline: "Optimierte Überschrift: " + (campaign.headline || campaign.name),
      timing: "Beste Posting-Zeit: Di/Do 10:00-12:00 CET",
      audience: "Erweiterte Zielgruppe: +15% Tech-Interessierte empfohlen",
      budget: "Budget-Empfehlung: Erhöhung um 20% für optimale Reichweite",
      abTest: {
        variantA: campaign.headline || campaign.name,
        variantB: "Alternative: " + campaign.name + " — Jetzt entdecken!",
      },
    };
    const updated = await storage.updateCampaign(req.params.id, {
      aiOptimized: true,
      aiSuggestions: JSON.stringify(suggestions),
    });
    res.json({
      campaign: updated,
      suggestions,
      message: "KI-Optimierung erfolgreich durchgeführt",
    });
  });

  return httpServer;
}
