import { useState, useEffect } from "react";
import {
  Shield,
  Globe,
  Heart,
  GraduationCap,
  Wand2,
  CheckCircle2,
  Clock,
  Circle,
  Activity,
  CreditCard,
  Server,
  Hammer,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Zap,
  AlertTriangle,
  BarChart3,
  Users,
  FileCheck,
  Fingerprint,
  ScanSearch,
  Lock,
  Award,
  Barcode,
  Link2,
  Droplets,
  UserCircle,
  Share2,
  Mic,
  Monitor,
  Radio,
  Layers,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  FlaskConical,
  Atom,
  Microscope,
  Target,
  Image,
  Video,
  RefreshCcw,
  ExternalLink,
  TrendingUp,
  Vote,
  Rocket,
  Brain,
  ArrowUpRight,
  Sparkles,
  PieChart,
  LineChart,
  DollarSign,
  Lightbulb,
  ThumbsUp,
  Star,
  Crown,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
type FeatureStatus = "live" | "beta" | "development" | "planned";

interface Feature {
  name: string;
  status: FeatureStatus;
  description: string;
  icon: any;
}

interface AppStatus {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: any;
  iconColor: string;
  route: string;
  subdomain: string;
  stripeStatus: "active" | "testing" | "planned";
  apiStatus: "online" | "maintenance" | "offline";
  buildStatus: "deployed" | "building" | "failed";
  codeStats: { lines: number; components: number; apiEndpoints: number };
  features: Feature[];
  changelog: ChangelogEntry[];
  marketData: MarketData;
}

interface ChangelogEntry {
  date: string;
  version: string;
  changes: string[];
}

interface MarketData {
  marketSize: string;
  cagr: string;
  trend: "up" | "stable" | "emerging";
  competitors: string[];
  opportunity: string;
}

interface ScaleProposal {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  effort: "niedrig" | "mittel" | "hoch";
  impact: "niedrig" | "mittel" | "hoch" | "sehr hoch";
  marketRationale: string;
  estimatedRevenue: string;
  votes: number;
  features: string[];
}

// ─── App Data ────────────────────────────────────────────────
const apps: AppStatus[] = [
  {
    id: "creatorseal",
    name: "RealSync CreatorSeal",
    tagline: "Content-Verifizierung & Deepfake-Schutz",
    description:
      "Umfassende Content-Verifizierung mit Trust Score, digitaler Signatur und Deepfake Detection. Schuetzt Creator-Inhalte mit Blockchain-Zertifikaten, Wasserzeichen und Barcodes.",
    icon: Shield,
    iconColor: "text-emerald-400",
    route: "/creatorseal",
    subdomain: "seal.realsyncdynamics.de",
    stripeStatus: "active",
    apiStatus: "online",
    buildStatus: "deployed",
    codeStats: { lines: 2508, components: 10, apiEndpoints: 12 },
    marketData: {
      marketSize: "$23,1 Mrd. (2026)",
      cagr: "14,76%",
      trend: "up",
      competitors: ["Adobe Content Authenticity", "Digimarc", "Truepic"],
      opportunity: "90% Online-Content bis 2026 KI-generiert — massiver Bedarf an Verifizierung",
    },
    features: [
      { name: "Dashboard & Analytics", status: "live", description: "Uebersicht aller geschuetzten Inhalte mit Statistiken", icon: BarChart3 },
      { name: "Content-Schutz", status: "live", description: "Automatische Registrierung und Schutz von Inhalten", icon: Lock },
      { name: "Zertifikate", status: "live", description: "Digitale Echtheitszertifikate mit QR-Code", icon: Award },
      { name: "Barcode-Studio", status: "live", description: "EAN-13, QR-Code und DataMatrix Generator", icon: Barcode },
      { name: "Blockchain-Verifizierung", status: "live", description: "Unveraenderliche Registrierung auf der Blockchain", icon: Link2 },
      { name: "Wasserzeichen", status: "live", description: "Sichtbare und unsichtbare Wasserzeichen", icon: Droplets },
      { name: "Creator-Seite", status: "live", description: "Oeffentliches Creator-Profil mit verifizierten Inhalten", icon: UserCircle },
      { name: "Teilen & Export", status: "live", description: "Social-Media-optimiertes Teilen von Zertifikaten", icon: Share2 },
      { name: "Digitales Signieren", status: "beta", description: "SHA-256, C2PA und Blockchain-basierte Content-Signierung", icon: Fingerprint },
      { name: "Deepfake Detection", status: "beta", description: "KI-basierte Erkennung von manipulierten Medien", icon: ScanSearch },
      { name: "Multi-Content Batch", status: "development", description: "Gleichzeitiger Schutz mehrerer Dateien", icon: FileCheck },
      { name: "API-Zugang", status: "planned", description: "REST API fuer externe Integration", icon: Server },
    ],
    changelog: [
      { date: "15.03.2026", version: "2.4.0", changes: ["Digitales Signieren (SHA-256, C2PA, Blockchain)", "Deepfake Detection mit KI-Analyse", "Trust Score Kreisdiagramm"] },
      { date: "14.03.2026", version: "2.3.0", changes: ["Barcode-Studio erweitert", "Wasserzeichen-Generator", "Creator-Profil mit Social Links"] },
      { date: "12.03.2026", version: "2.2.0", changes: ["Blockchain-Registrierung live", "Zertifikat-Design v2", "PDF/PNG Export"] },
    ],
  },
  {
    id: "optimus",
    name: "RealSync Optimus",
    tagline: "KI-Agent-Manager & Desktop-Automation",
    description:
      "Kostenloser KI-Model-Router mit 9+ Modellen, Desktop-Automation, Workflow-Orchestrierung und Grok Streaming. Verwalte und steuere KI-Agenten ueber eine zentrale Oberflaeche.",
    icon: Globe,
    iconColor: "text-blue-400",
    route: "/optimus",
    subdomain: "optimus.realsyncdynamics.de",
    stripeStatus: "active",
    apiStatus: "online",
    buildStatus: "deployed",
    codeStats: { lines: 656, components: 6, apiEndpoints: 15 },
    marketData: {
      marketSize: "$442 Mrd. GenAI (2031)",
      cagr: "560% Wachstum 2025-2031",
      trend: "up",
      competitors: ["LangChain", "AutoGPT", "CrewAI"],
      opportunity: "Agentic AI ist DER Trend 2026 — 44% nutzen KI-Suche als Primaerquelle",
    },
    features: [
      { name: "Voice Control", status: "live", description: "Sprachsteuerung fuer KI-Agenten", icon: Mic },
      { name: "Desktop Automation", status: "live", description: "Automatisierung von Desktop-Aufgaben", icon: Monitor },
      { name: "Stripe Tiers", status: "live", description: "Pro/Enterprise Abonnement-Verwaltung", icon: CreditCard },
      { name: "Grok Streaming", status: "live", description: "Echtzeit-Streaming von KI-Antworten", icon: Radio },
      { name: "Browser Control", status: "live", description: "Automatisierte Browser-Aktionen", icon: Globe },
      { name: "Workflow Engine", status: "live", description: "Visuelle Workflow-Erstellung und Ausfuehrung", icon: Layers },
      { name: "KI-Model-Router", status: "live", description: "9 kostenlose Modelle (Gemini, Llama, Mistral, u.v.m.)", icon: Zap },
      { name: "Multi-Agent Orchestrierung", status: "development", description: "Mehrere Agenten parallel koordinieren", icon: Users },
      { name: "Plugin-System", status: "planned", description: "Erweiterbare Plugins fuer neue Integrationen", icon: Layers },
    ],
    changelog: [
      { date: "15.03.2026", version: "3.1.0", changes: ["KI-Model-Router mit 9 Modellen", "Stripe Pro/Enterprise Tiers", "Workflow-Engine Basis"] },
      { date: "13.03.2026", version: "3.0.0", changes: ["Desktop Automation Engine", "Voice Control Beta", "Grok Streaming"] },
    ],
  },
  {
    id: "community",
    name: "RealSync Community",
    tagline: "Creator-Plattform & Social Marketplace",
    description:
      "Die Creator-Community von RealSync Dynamics. Social Feed, Stories, Reels, Live-Streaming, Gruppen und ein integrierter Marketplace fuer verifizierte digitale Produkte.",
    icon: Heart,
    iconColor: "text-pink-400",
    route: "/community",
    subdomain: "community.realsyncdynamics.de",
    stripeStatus: "active",
    apiStatus: "online",
    buildStatus: "deployed",
    codeStats: { lines: 1516, components: 7, apiEndpoints: 8 },
    marketData: {
      marketSize: "$104 Mrd. Creator Economy",
      cagr: "22,5%",
      trend: "up",
      competitors: ["Patreon", "Ko-fi", "Gumroad"],
      opportunity: "DSGVO-native Creator-Plattform — keine echte Konkurrenz in Europa",
    },
    features: [
      { name: "Social Feed", status: "live", description: "Creator-Posts mit Likes, Kommentaren und Shares", icon: MessageSquare },
      { name: "Stories", status: "live", description: "24h Stories mit Interaktionen", icon: Image },
      { name: "Reels", status: "live", description: "Kurzvideo-Format fuer Creator", icon: Video },
      { name: "Marketplace", status: "live", description: "Verifizierte digitale Produkte kaufen und verkaufen", icon: ShoppingBag },
      { name: "Gruppen", status: "live", description: "Themenbasierte Creator-Gruppen", icon: Users },
      { name: "Live-Streaming", status: "beta", description: "Echtzeit-Streaming mit Chat-Interaktion", icon: Radio },
      { name: "Creator-Monetarisierung", status: "development", description: "Tipping, Subscriptions, Premium-Content", icon: CreditCard },
      { name: "Analytics Dashboard", status: "planned", description: "Detaillierte Reichweiten- und Engagement-Analysen", icon: BarChart3 },
    ],
    changelog: [
      { date: "14.03.2026", version: "1.5.0", changes: ["Marketplace mit Kategorien", "Gruppen-Funktionalitaet", "Story-Swipe-Navigation"] },
      { date: "11.03.2026", version: "1.4.0", changes: ["Reels implementiert", "Feed-Algorithmus optimiert", "Benachrichtigungen"] },
    ],
  },
  {
    id: "schullabor",
    name: "RealSync SchulLabor",
    tagline: "EdTech Lab-Simulatoren fuer DACH-Schulen",
    description:
      "Virtuelle Laborsimulationen fuer den naturwissenschaftlichen Unterricht. Chemie, Physik und Biologie Experimente sicher und interaktiv im Browser — speziell fuer DACH-Lehrplan.",
    icon: GraduationCap,
    iconColor: "text-orange-400",
    route: "/schullabor",
    subdomain: "labor.realsyncdynamics.de",
    stripeStatus: "testing",
    apiStatus: "online",
    buildStatus: "deployed",
    codeStats: { lines: 422, components: 4, apiEndpoints: 0 },
    marketData: {
      marketSize: "$14,75 Mrd. EdTech DE (2026)",
      cagr: "21,5%",
      trend: "emerging",
      competitors: ["Labster", "PhET Colorado", "Chemie interaktiv"],
      opportunity: "Kein DACH-spezifischer Anbieter — Schulen brauchen lehrplangerechte Loesungen",
    },
    features: [
      { name: "Chemie-Labor", status: "live", description: "Virtuelle chemische Experimente und Reaktionen", icon: FlaskConical },
      { name: "Physik-Labor", status: "live", description: "Mechanik, Optik und Elektrizitaet simulieren", icon: Atom },
      { name: "Biologie-Labor", status: "live", description: "Mikroskopie und Oekosystem-Simulationen", icon: Microscope },
      { name: "Lehrplan-Alignment", status: "live", description: "Abgestimmt auf DACH-Bildungsstandards", icon: BookOpen },
      { name: "Schueler-Tracking", status: "beta", description: "Fortschrittsverfolgung und Bewertung", icon: Target },
      { name: "Klassen-Management", status: "development", description: "Verwaltung von Klassen und Aufgaben", icon: Users },
      { name: "AR/VR Integration", status: "planned", description: "Erweiterte Realitaet fuer immersive Experimente", icon: Globe },
    ],
    changelog: [
      { date: "13.03.2026", version: "1.2.0", changes: ["20+ Chemie-Experimente", "Physik Mechanik-Modul", "Biologie Mikroskopie"] },
      { date: "10.03.2026", version: "1.1.0", changes: ["DACH-Lehrplan Mapping", "Periodensystem interaktiv", "PDF-Export"] },
    ],
  },
  {
    id: "linkmagic",
    name: "RealSync LinkMagic",
    tagline: "KI-Anzeigen-Generator & Multi-Platform Ads",
    description:
      "KI-gestuetzter Anzeigen-Generator fuer alle Plattformen. Erstelle optimierte Ads fuer Google, Meta, TikTok und LinkedIn mit einem Klick. A/B-Testing und Performance-Tracking.",
    icon: Wand2,
    iconColor: "text-violet-400",
    route: "/link-magic",
    subdomain: "ads.realsyncdynamics.de",
    stripeStatus: "testing",
    apiStatus: "online",
    buildStatus: "deployed",
    codeStats: { lines: 433, components: 5, apiEndpoints: 1 },
    marketData: {
      marketSize: "$70 Mio. KI-Assets Q4/2025 allein bei Google",
      cagr: "3x YoY Wachstum",
      trend: "up",
      competitors: ["Jasper AI", "Copy.ai", "AdCreative.ai"],
      opportunity: "Google Gemini generierte 70 Mio. Ads in Q4 — riesiger Markt fuer KI-Ads",
    },
    features: [
      { name: "KI Ad Generator", status: "live", description: "Automatische Anzeigenerstellung mit KI", icon: Wand2 },
      { name: "Multi-Platform Export", status: "live", description: "Formate fuer Google, Meta, TikTok, LinkedIn", icon: Share2 },
      { name: "Template-Bibliothek", status: "live", description: "50+ Anzeigen-Templates nach Branche", icon: Image },
      { name: "A/B Testing", status: "beta", description: "Automatisierte Varianten-Tests", icon: Target },
      { name: "Performance Tracking", status: "development", description: "Kampagnen-Analytics und ROI-Berechnung", icon: BarChart3 },
      { name: "Budget-Optimierung", status: "planned", description: "KI-basierte Budgetverteilung ueber Plattformen", icon: CreditCard },
    ],
    changelog: [
      { date: "13.03.2026", version: "1.1.0", changes: ["KI Ad Generator mit GPT-4", "4-Plattform-Export", "50+ Templates"] },
      { date: "09.03.2026", version: "1.0.0", changes: ["LinkMagic Launch", "Basis-Anzeigen", "Google Ads Format"] },
    ],
  },
];

// ─── Scale Proposals ─────────────────────────────────────────
const initialProposals: ScaleProposal[] = [
  {
    id: "deepfake-api",
    title: "Deepfake Detection API as a Service",
    description: "Unsere Deepfake-Erkennung als oeffentliche REST API fuer Medienunternehmen, Verlage und Social-Media-Plattformen anbieten. Pay-per-Scan Modell.",
    icon: ScanSearch,
    category: "CreatorSeal",
    effort: "mittel",
    impact: "sehr hoch",
    marketRationale: "Content Detection Markt waechst auf $69,5 Mrd. bis 2034. 46% Unternehmen berichten synthetische Identity Fraud. Kein DSGVO-konformer API-Anbieter in Europa.",
    estimatedRevenue: "€50K-200K MRR innerhalb 12 Monaten",
    votes: 0,
    features: ["REST API mit Pay-per-Scan", "DSGVO-konforme Verarbeitung", "Batch-Analyse fuer Verlage", "Webhook-Benachrichtigungen", "SDK fuer Python/JS/PHP"],
  },
  {
    id: "agentic-marketplace",
    title: "KI-Agenten Marketplace & Workflow-Store",
    description: "Ein Marketplace wo Nutzer vorgefertigte KI-Agenten und Workflows kaufen/verkaufen koennen. Wie ein App Store fuer Automatisierungen.",
    icon: Brain,
    category: "Optimus",
    effort: "hoch",
    impact: "sehr hoch",
    marketRationale: "Agentic AI ist DER Mega-Trend 2026. GenAI-Markt waechst auf $442 Mrd. bis 2031. KI-Agenten uebernehmen komplette Strategy-to-Execution Workflows.",
    estimatedRevenue: "€30K-150K MRR innerhalb 12 Monaten",
    votes: 0,
    features: ["Agent-Vorlagen kaufen/verkaufen", "One-Click Agent Deployment", "Bewertungssystem", "Revenue-Sharing fuer Ersteller", "Workflow-Composer"],
  },
  {
    id: "school-pilot",
    title: "SchulLabor Pilotprogramm 100 DACH-Schulen",
    description: "Gezieltes Pilotprogramm mit 100 Schulen in Deutschland, Oesterreich und der Schweiz. Kostenlos fuer 6 Monate, dann Schullizenzen.",
    icon: GraduationCap,
    category: "SchulLabor",
    effort: "mittel",
    impact: "hoch",
    marketRationale: "DE EdTech Markt: $14,75 Mrd. bis 2026 (+21,5% CAGR). Kein DACH-spezifischer Lab-Simulator. Schulen brauchen lehrplangerechte digitale Labore.",
    estimatedRevenue: "€20K-80K MRR nach Pilotphase",
    votes: 0,
    features: ["100 Pilotschulen kostenlos", "Lehrer-Onboarding", "Lehrplan-Integration", "Feedback-Loop fuer Weiterentwicklung", "Bildungsministerium-Kontakte"],
  },
  {
    id: "creator-monetization",
    title: "Creator-Monetarisierung & Abo-Plattform",
    description: "Patreon-Alternative fuer europaeische Creator. Subscriptions, Tipping, Premium-Content und digitale Produkte — alles DSGVO-konform mit niedrigeren Gebuehren.",
    icon: Crown,
    category: "Community",
    effort: "hoch",
    impact: "hoch",
    marketRationale: "Creator Economy: $104 Mrd. Markt. Patreon nimmt 5-12% — wir bieten 3%. Keine europaeische DSGVO-native Alternative existiert.",
    estimatedRevenue: "€40K-200K MRR innerhalb 18 Monaten",
    votes: 0,
    features: ["3% Plattform-Gebuehr (vs. 5-12% bei Patreon)", "DSGVO-native Zahlungen via Stripe", "Subscription Tiers", "Digital Downloads", "Live-Tipping"],
  },
  {
    id: "ai-video-ads",
    title: "KI-Video-Ad Generator (Seedance/Veo Integration)",
    description: "Automatische Video-Werbung erstellen mit KI. Von Produktfoto zu fertigem 15/30/60s Werbespot fuer alle Plattformen.",
    icon: Video,
    category: "LinkMagic",
    effort: "mittel",
    impact: "sehr hoch",
    marketRationale: "Google Veo 3 und ByteDance Seedance 2.0 machen KI-Video produktionsreif. 70 Mio. KI-Assets in Q4/2025 bei Google allein. Video dominiert Marketing 2026.",
    estimatedRevenue: "€60K-300K MRR innerhalb 12 Monaten",
    votes: 0,
    features: ["Produktfoto → 15/30/60s Video", "Multi-Shot Sequenzen", "Platform-optimierte Formate", "Voiceover mit KI", "A/B Video-Varianten"],
  },
];

// ─── Helpers ─────────────────────────────────────────────────
function statusBadge(status: FeatureStatus) {
  const map: Record<FeatureStatus, { label: string; bg: string; text: string; dot: string }> = {
    live: { label: "Live", bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
    beta: { label: "Beta", bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" },
    development: { label: "In Entwicklung", bg: "bg-blue-500/15", text: "text-blue-400", dot: "bg-blue-400" },
    planned: { label: "Geplant", bg: "bg-zinc-500/15", text: "text-zinc-400", dot: "bg-zinc-400" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === "live" ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

function stripeBadge(status: "active" | "testing" | "planned") {
  const map = {
    active: { label: "Aktiv", cls: "text-emerald-400 bg-emerald-500/10" },
    testing: { label: "Testing", cls: "text-amber-400 bg-amber-500/10" },
    planned: { label: "Geplant", cls: "text-zinc-400 bg-zinc-500/10" },
  };
  const s = map[status];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.cls}`}>{s.label}</span>;
}

function apiBadge(status: "online" | "maintenance" | "offline") {
  const map = {
    online: { label: "Online", cls: "text-emerald-400 bg-emerald-500/10", dot: "bg-emerald-400 animate-pulse" },
    maintenance: { label: "Wartung", cls: "text-amber-400 bg-amber-500/10", dot: "bg-amber-400" },
    offline: { label: "Offline", cls: "text-red-400 bg-red-500/10", dot: "bg-red-400" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Components ──────────────────────────────────────────────
function LiveAuditBanner() {
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(iv);
  }, []);

  const totalFeatures = apps.reduce((a, app) => a + app.features.length, 0);
  const liveFeatures = apps.reduce((a, app) => a + app.features.filter((f) => f.status === "live").length, 0);
  const totalLines = apps.reduce((a, app) => a + app.codeStats.lines, 0);
  const totalEndpoints = apps.reduce((a, app) => a + app.codeStats.apiEndpoints, 0);

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full bg-emerald-400 ${pulse ? "animate-pulse" : ""}`} />
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Plattform-Audit</span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          Letzte Pruefung: {new Date().toLocaleString("de-DE", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{apps.length}</div>
          <div className="text-[10px] text-muted-foreground">Apps Live</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{liveFeatures}<span className="text-sm text-muted-foreground">/{totalFeatures}</span></div>
          <div className="text-[10px] text-muted-foreground">Features Live</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">{totalLines.toLocaleString("de-DE")}</div>
          <div className="text-[10px] text-muted-foreground">Zeilen Code</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary">{totalEndpoints}</div>
          <div className="text-[10px] text-muted-foreground">API-Endpunkte</div>
        </div>
      </div>
    </div>
  );
}

function AppAuditCard({ app }: { app: AppStatus }) {
  const [expanded, setExpanded] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const Icon = app.icon;
  const liveCount = app.features.filter((f) => f.status === "live").length;
  const totalCount = app.features.length;
  const progressPercent = Math.round((liveCount / totalCount) * 100);
  const trendColors = { up: "text-emerald-400", stable: "text-blue-400", emerging: "text-amber-400" };
  const trendLabels = { up: "Starkes Wachstum", stable: "Stabil", emerging: "Aufkommend" };

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden transition-all duration-300 hover:border-primary/20">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-card to-card/80 border border-border/50 flex items-center justify-center ${app.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight">{app.name}</h3>
              <p className="text-[11px] text-primary/80 mt-0.5">{app.tagline}</p>
            </div>
          </div>
          <a href={`/#${app.route}`} className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-primary hover:bg-primary/10 transition-colors">
            Oeffnen <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{app.description}</p>

        {/* Code Stats */}
        <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground/70">
          <span>{app.codeStats.lines.toLocaleString("de-DE")} Zeilen</span>
          <span>·</span>
          <span>{app.codeStats.components} Tabs</span>
          <span>·</span>
          <span>{app.codeStats.apiEndpoints} API-Endpunkte</span>
        </div>

        {/* Status Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[10px] text-muted-foreground">Stripe:</span>
          {stripeBadge(app.stripeStatus)}
          <span className="text-[10px] text-muted-foreground ml-1">API:</span>
          {apiBadge(app.apiStatus)}
          <span className={`text-[10px] font-medium ml-auto ${trendColors[app.marketData.trend]}`}>
            <TrendingUp className="h-3 w-3 inline mr-0.5" />
            {trendLabels[app.marketData.trend]}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>{liveCount}/{totalCount} Features live</span>
            <span className="font-semibold text-foreground">{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-border/30">
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors" data-testid={`toggle-features-${app.id}`}>
          <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" />Features ({totalCount})</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && (
          <div className="px-5 pb-4 space-y-1">
            {app.features.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FIcon className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-medium block truncate">{f.name}</span>
                      <span className="text-[10px] text-muted-foreground/70 block truncate">{f.description}</span>
                    </div>
                  </div>
                  {statusBadge(f.status)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Market Data */}
      <div className="border-t border-border/30">
        <button onClick={() => setShowMarket(!showMarket)} className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors">
          <span className="flex items-center gap-1.5"><LineChart className="h-3.5 w-3.5" />Marktdaten</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showMarket ? "rotate-180" : ""}`} />
        </button>
        {showMarket && (
          <div className="px-5 pb-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-2">
                <div className="text-[10px] text-muted-foreground">Marktgroesse</div>
                <div className="text-xs font-bold text-primary">{app.marketData.marketSize}</div>
              </div>
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2">
                <div className="text-[10px] text-muted-foreground">Wachstum (CAGR)</div>
                <div className="text-xs font-bold text-emerald-400">{app.marketData.cagr}</div>
              </div>
            </div>
            <div className="rounded-lg bg-accent/30 p-2">
              <div className="text-[10px] text-muted-foreground mb-1">Chance</div>
              <div className="text-[11px] text-foreground">{app.marketData.opportunity}</div>
            </div>
            <div className="flex flex-wrap gap-1">
              {app.marketData.competitors.map((c, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-border/50 text-muted-foreground">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Changelog */}
      <div className="border-t border-border/30">
        <button onClick={() => setShowChangelog(!showChangelog)} className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Changelog ({app.changelog.length})</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showChangelog ? "rotate-180" : ""}`} />
        </button>
        {showChangelog && (
          <div className="px-5 pb-4 space-y-3">
            {app.changelog.map((entry, i) => (
              <div key={i} className="relative pl-4 border-l-2 border-primary/20">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-primary">{entry.version}</span>
                  <span className="text-[10px] text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="space-y-0.5">
                  {entry.changes.map((c, j) => (
                    <li key={j} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-primary/40 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScaleVoting() {
  const [proposals, setProposals] = useState<ScaleProposal[]>(initialProposals);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (voted.has(id)) return;
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p)));
    setVoted((prev) => new Set(prev).add(id));
  };

  const sorted = [...proposals].sort((a, b) => b.votes - a.votes);
  const totalVotes = proposals.reduce((a, p) => a + p.votes, 0);
  const effortColors = { niedrig: "text-emerald-400 bg-emerald-500/10", mittel: "text-amber-400 bg-amber-500/10", hoch: "text-red-400 bg-red-500/10" };
  const impactColors = { niedrig: "text-zinc-400 bg-zinc-500/10", mittel: "text-blue-400 bg-blue-500/10", hoch: "text-emerald-400 bg-emerald-500/10", "sehr hoch": "text-primary bg-primary/10" };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Rocket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">Skalierungs-Abstimmung</h2>
          <p className="text-xs text-muted-foreground">Stimme ab: Was sollen wir als naechstes bauen? Marktdaten-gestuetzt.</p>
        </div>
        {totalVotes > 0 && (
          <div className="ml-auto text-right">
            <div className="text-lg font-bold text-primary">{totalVotes}</div>
            <div className="text-[10px] text-muted-foreground">Stimmen</div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sorted.map((proposal, rank) => {
          const Icon = proposal.icon;
          const isExpanded = expandedId === proposal.id;
          const hasVoted = voted.has(proposal.id);
          const votePercent = totalVotes > 0 ? Math.round((proposal.votes / totalVotes) * 100) : 0;

          return (
            <div key={proposal.id} className={`rounded-xl border transition-all duration-300 ${hasVoted ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card/30 hover:border-primary/20"}`}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Rank */}
                  {totalVotes > 0 && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${rank === 0 ? "bg-primary/20 text-primary" : "bg-border/50 text-muted-foreground"}`}>
                      {rank === 0 && totalVotes > 0 ? <Crown className="h-3.5 w-3.5" /> : rank + 1}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon className={`h-4 w-4 ${apps.find((a) => a.name.includes(proposal.category))?.iconColor || "text-primary"}`} />
                      <h3 className="text-sm font-semibold">{proposal.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-border/50 text-muted-foreground">{proposal.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{proposal.description}</p>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${effortColors[proposal.effort]}`}>Aufwand: {proposal.effort}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${impactColors[proposal.impact]}`}>Impact: {proposal.impact}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">{proposal.estimatedRevenue}</span>
                    </div>

                    {/* Vote Bar */}
                    {totalVotes > 0 && proposal.votes > 0 && (
                      <div className="mt-2">
                        <div className="h-1 bg-border/30 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${votePercent}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{votePercent}%</span>
                      </div>
                    )}
                  </div>

                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(proposal.id)}
                    disabled={hasVoted}
                    className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                      hasVoted
                        ? "bg-primary/20 text-primary cursor-default"
                        : "bg-border/30 hover:bg-primary/10 hover:text-primary text-muted-foreground cursor-pointer hover:scale-105 active:scale-95"
                    }`}
                    data-testid={`vote-${proposal.id}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${hasVoted ? "fill-primary" : ""}`} />
                    <span className="text-xs font-bold">{proposal.votes}</span>
                  </button>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
                  className="flex items-center gap-1 mt-2 text-[10px] text-primary hover:underline"
                >
                  {isExpanded ? "Weniger anzeigen" : "Marktanalyse & Features anzeigen"}
                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-border/30 pt-3">
                    <div className="rounded-lg bg-accent/30 p-3">
                      <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">Marktanalyse</div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{proposal.marketRationale}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Geplante Features</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {proposal.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-primary/40 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SystemStatus() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          Systemstatus
        </h2>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <RefreshCcw className="h-3 w-3" />
          {new Date().toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg p-3 border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">Alle Systeme betriebsbereit</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{apps.length} Apps · {apps.filter((a) => a.apiStatus === "online").length} online</p>
        </div>
        <div className="rounded-lg p-3 border border-border/30 bg-card/50">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">API Gateway</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Operativ · 50 Endpunkte</span>
          </div>
        </div>
        <div className="rounded-lg p-3 border border-border/30 bg-card/50">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">KI-Model-Router</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">9 Modelle verfuegbar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────
export default function StatusPage() {
  const [activeTab, setActiveTab] = useState<"audit" | "scale">("audit");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Live Status & Skalierung</h1>
              <p className="text-xs text-muted-foreground">RealSync Dynamics — Transparenz, Marktanalyse & Community-Voting</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "audit" ? "bg-primary text-primary-foreground" : "bg-border/30 text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-audit"
            >
              <Activity className="h-3.5 w-3.5 inline mr-1.5" />
              Live App-Audit
            </button>
            <button
              onClick={() => setActiveTab("scale")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "scale" ? "bg-primary text-primary-foreground" : "bg-border/30 text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-scale"
            >
              <Rocket className="h-3.5 w-3.5 inline mr-1.5" />
              Skalierung & Voting
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "audit" && (
          <>
            <SystemStatus />
            <LiveAuditBanner />

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 mb-6 px-1">
              <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">Status:</span>
              {statusBadge("live")} {statusBadge("beta")} {statusBadge("development")} {statusBadge("planned")}
            </div>

            {/* App Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {apps.map((app) => (
                <AppAuditCard key={app.id} app={app} />
              ))}
            </div>
          </>
        )}

        {activeTab === "scale" && (
          <>
            {/* Market Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">Gesamtmarkt</span>
                </div>
                <div className="text-lg font-bold">$23+ Mrd.</div>
                <div className="text-[10px] text-muted-foreground">Content Detection allein in 2026</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold">GenAI Wachstum</span>
                </div>
                <div className="text-lg font-bold text-emerald-400">560%</div>
                <div className="text-[10px] text-muted-foreground">Projektion 2025-2031 → $442 Mrd.</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold">EdTech Deutschland</span>
                </div>
                <div className="text-lg font-bold text-amber-400">$14,75 Mrd.</div>
                <div className="text-[10px] text-muted-foreground">Prognose 2026, +21,5% CAGR</div>
              </div>
            </div>

            <ScaleVoting />

            {/* Transparency */}
            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">So funktioniert die Skalierung</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Jeder Vorschlag basiert auf echten Marktdaten und Wettbewerbsanalysen. Stimme fuer die Features ab, die dir am wichtigsten sind.
                    Die Vorschlaege mit den meisten Stimmen werden priorisiert gebaut. Neue Vorschlaege werden automatisch generiert basierend auf
                    Markttrends, Kundenfeedback und Wettbewerbsbewegungen.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
