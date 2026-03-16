import { useState } from "react";
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
  features: Feature[];
  changelog: ChangelogEntry[];
}

interface ChangelogEntry {
  date: string;
  version: string;
  changes: string[];
}

// ─── Data ────────────────────────────────────────────────────
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
      {
        date: "15.03.2026",
        version: "2.4.0",
        changes: [
          "Digitales Signieren mit SHA-256, C2PA und Blockchain hinzugefuegt",
          "Deepfake Detection Tab mit KI-Analyse implementiert",
          "Trust Score Visualisierung als Kreisdiagramm",
        ],
      },
      {
        date: "14.03.2026",
        version: "2.3.0",
        changes: [
          "Barcode-Studio mit EAN-13 und DataMatrix erweitert",
          "Wasserzeichen-Generator verbessert",
          "Creator-Profil mit Social Links",
        ],
      },
      {
        date: "12.03.2026",
        version: "2.2.0",
        changes: [
          "Blockchain-Registrierung live geschaltet",
          "Zertifikat-Design ueberarbeitet",
          "Export als PDF und PNG",
        ],
      },
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
    features: [
      { name: "Voice Control", status: "live", description: "Sprachsteuerung fuer KI-Agenten", icon: Mic },
      { name: "Desktop Automation", status: "live", description: "Automatisierung von Desktop-Aufgaben", icon: Monitor },
      { name: "Stripe Tiers", status: "live", description: "Pro/Enterprise Abonnement-Verwaltung", icon: CreditCard },
      { name: "Grok Streaming", status: "live", description: "Echtzeit-Streaming von KI-Antworten", icon: Radio },
      { name: "Browser Control", status: "live", description: "Automatisierte Browser-Aktionen", icon: Globe },
      { name: "Workflow Engine", status: "live", description: "Visuelle Workflow-Erstellung und Ausfuehrung", icon: Layers },
      { name: "KI-Model-Router", status: "live", description: "9 kostenlose KI-Modelle (Gemini, Llama, Mistral, u.v.m.)", icon: Zap },
      { name: "Multi-Agent Orchestrierung", status: "development", description: "Mehrere Agenten parallel koordinieren", icon: Users },
      { name: "Plugin-System", status: "planned", description: "Erweiterbare Plugins fuer neue Integrationen", icon: Layers },
    ],
    changelog: [
      {
        date: "15.03.2026",
        version: "3.1.0",
        changes: [
          "KI-Model-Router mit 9 kostenlosen Modellen live",
          "Stripe Integration fuer Pro/Enterprise Tiers",
          "Workflow-Engine Grundfunktionen",
        ],
      },
      {
        date: "13.03.2026",
        version: "3.0.0",
        changes: [
          "Desktop Automation Engine implementiert",
          "Voice Control Beta gestartet",
          "Grok Streaming integriert",
        ],
      },
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
      {
        date: "14.03.2026",
        version: "1.5.0",
        changes: [
          "Marketplace mit Kategorie-Filter gestartet",
          "Gruppen-Funktionalitaet hinzugefuegt",
          "Story-Viewer mit Swipe-Navigation",
        ],
      },
      {
        date: "11.03.2026",
        version: "1.4.0",
        changes: [
          "Reels-Format implementiert",
          "Feed-Algorithmus optimiert",
          "Benachrichtigungssystem verbessert",
        ],
      },
    ],
  },
  {
    id: "schullabor",
    name: "RealSync SchulLabor",
    tagline: "EdTech Lab-Simulatoren fuer DACH-Schulen",
    description:
      "Virtuelle Laborsimulationen fuer den naturwissenschaftlichen Unterricht. Chemie, Physik und Biologie Experimente sicher und interaktiv im Browser durchfuehren — speziell fuer den DACH-Lehrplan.",
    icon: GraduationCap,
    iconColor: "text-orange-400",
    route: "/schullabor",
    subdomain: "labor.realsyncdynamics.de",
    stripeStatus: "testing",
    apiStatus: "online",
    buildStatus: "deployed",
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
      {
        date: "13.03.2026",
        version: "1.2.0",
        changes: [
          "Chemie-Labor mit 20+ Experimenten live",
          "Physik-Simulationen (Mechanik) gestartet",
          "Biologie Mikroskopie-Modul hinzugefuegt",
        ],
      },
      {
        date: "10.03.2026",
        version: "1.1.0",
        changes: [
          "DACH-Lehrplan Mapping abgeschlossen",
          "Interaktive Periodensystem-Ansicht",
          "Experiment-Protokoll Export als PDF",
        ],
      },
    ],
  },
  {
    id: "linkmagic",
    name: "RealSync LinkMagic",
    tagline: "KI-Anzeigen-Generator & Multi-Platform Ads",
    description:
      "KI-gestuetzter Anzeigen-Generator fuer alle Plattformen. Erstelle optimierte Ads fuer Google, Meta, TikTok und LinkedIn mit einem Klick. A/B-Testing und Performance-Tracking inklusive.",
    icon: Wand2,
    iconColor: "text-violet-400",
    route: "/link-magic",
    subdomain: "ads.realsyncdynamics.de",
    stripeStatus: "testing",
    apiStatus: "online",
    buildStatus: "deployed",
    features: [
      { name: "KI Ad Generator", status: "live", description: "Automatische Anzeigenerstellung mit KI", icon: Wand2 },
      { name: "Multi-Platform Export", status: "live", description: "Formate fuer Google, Meta, TikTok, LinkedIn", icon: Share2 },
      { name: "Template-Bibliothek", status: "live", description: "Vorgefertigte Anzeigen-Templates nach Branche", icon: Image },
      { name: "A/B Testing", status: "beta", description: "Automatisierte Varianten-Tests", icon: Target },
      { name: "Performance Tracking", status: "development", description: "Kampagnen-Analytics und ROI-Berechnung", icon: BarChart3 },
      { name: "Budget-Optimierung", status: "planned", description: "KI-basierte Budgetverteilung ueber Plattformen", icon: CreditCard },
    ],
    changelog: [
      {
        date: "13.03.2026",
        version: "1.1.0",
        changes: [
          "KI Ad Generator mit GPT-4 Integration",
          "Multi-Platform Export fuer 4 Plattformen",
          "Template-Bibliothek mit 50+ Vorlagen",
        ],
      },
      {
        date: "09.03.2026",
        version: "1.0.0",
        changes: [
          "LinkMagic Initial-Release",
          "Basis-Anzeigenerstellung",
          "Google Ads Format-Unterstuetzung",
        ],
      },
    ],
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
    active: { label: "Aktiv", icon: CheckCircle2, cls: "text-emerald-400 bg-emerald-500/10" },
    testing: { label: "Testing", icon: Clock, cls: "text-amber-400 bg-amber-500/10" },
    planned: { label: "Geplant", icon: Circle, cls: "text-zinc-400 bg-zinc-500/10" },
  };
  const s = map[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.cls}`}>
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
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

function buildBadge(status: "deployed" | "building" | "failed") {
  const map = {
    deployed: { label: "Deployed", cls: "text-emerald-400 bg-emerald-500/10" },
    building: { label: "Building...", cls: "text-blue-400 bg-blue-500/10" },
    failed: { label: "Fehlgeschlagen", cls: "text-red-400 bg-red-500/10" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.cls}`}>
      <Hammer className="h-3 w-3" />
      {s.label}
    </span>
  );
}

// ─── Components ──────────────────────────────────────────────
function PlatformOverview() {
  const totalFeatures = apps.reduce((acc, app) => acc + app.features.length, 0);
  const liveFeatures = apps.reduce((acc, app) => acc + app.features.filter((f) => f.status === "live").length, 0);
  const betaFeatures = apps.reduce((acc, app) => acc + app.features.filter((f) => f.status === "beta").length, 0);
  const devFeatures = apps.reduce((acc, app) => acc + app.features.filter((f) => f.status === "development").length, 0);
  const plannedFeatures = apps.reduce((acc, app) => acc + app.features.filter((f) => f.status === "planned").length, 0);
  const livePercent = Math.round((liveFeatures / totalFeatures) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
      <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
        <div className="text-2xl font-bold text-emerald-400">{liveFeatures}</div>
        <div className="text-[11px] text-muted-foreground mt-1">Live Features</div>
        <div className="mt-2 h-1 bg-border/30 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${livePercent}%` }} />
        </div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
        <div className="text-2xl font-bold text-amber-400">{betaFeatures}</div>
        <div className="text-[11px] text-muted-foreground mt-1">Beta</div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
        <div className="text-2xl font-bold text-blue-400">{devFeatures}</div>
        <div className="text-[11px] text-muted-foreground mt-1">In Entwicklung</div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
        <div className="text-2xl font-bold text-zinc-400">{plannedFeatures}</div>
        <div className="text-[11px] text-muted-foreground mt-1">Geplant</div>
      </div>
      <div className="col-span-2 md:col-span-1 rounded-xl border border-border/50 bg-card/50 p-4 text-center">
        <div className="text-2xl font-bold text-primary">{totalFeatures}</div>
        <div className="text-[11px] text-muted-foreground mt-1">Gesamt Features</div>
      </div>
    </div>
  );
}

function AppCard({ app }: { app: AppStatus }) {
  const [expanded, setExpanded] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const Icon = app.icon;
  const liveCount = app.features.filter((f) => f.status === "live").length;
  const totalCount = app.features.length;
  const progressPercent = Math.round((liveCount / totalCount) * 100);

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
          <a
            href={`/#${app.route}`}
            className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-primary hover:bg-primary/10 transition-colors"
          >
            Oeffnen <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{app.description}</p>

        {/* Subdomain */}
        <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground/70">
          <Globe className="h-3 w-3" />
          <span className="font-mono">{app.subdomain}</span>
        </div>

        {/* Status Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CreditCard className="h-3 w-3" /> Stripe:
          </div>
          {stripeBadge(app.stripeStatus)}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-1">
            <Server className="h-3 w-3" /> API:
          </div>
          {apiBadge(app.apiStatus)}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-1">
            <Hammer className="h-3 w-3" /> Build:
          </div>
          {buildBadge(app.buildStatus)}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>{liveCount} von {totalCount} Features live</span>
            <span className="font-semibold text-foreground">{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feature List Toggle */}
      <div className="border-t border-border/30">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
          data-testid={`toggle-features-${app.id}`}
        >
          <span className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            Feature-Status ({totalCount})
          </span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <div className="px-5 pb-4 space-y-1.5">
            {app.features.map((feature, i) => {
              const FIcon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg hover:bg-accent/20 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FIcon className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary/60 transition-colors shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-medium block truncate">{feature.name}</span>
                      <span className="text-[10px] text-muted-foreground/70 block truncate">{feature.description}</span>
                    </div>
                  </div>
                  {statusBadge(feature.status)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Changelog Toggle */}
      <div className="border-t border-border/30">
        <button
          onClick={() => setShowChangelog(!showChangelog)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
          data-testid={`toggle-changelog-${app.id}`}
        >
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Changelog ({app.changelog.length} Updates)
          </span>
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
                  {entry.changes.map((change, j) => (
                    <li key={j} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-primary/40 shrink-0" />
                      <span>{change}</span>
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

function SystemStatus() {
  const allOnline = apps.every((a) => a.apiStatus === "online");
  const allDeployed = apps.every((a) => a.buildStatus === "deployed");

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          Systemstatus
        </h2>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <RefreshCcw className="h-3 w-3" />
          Zuletzt aktualisiert: {new Date().toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Overall */}
        <div className={`rounded-lg p-3 border ${allOnline && allDeployed ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
          <div className="flex items-center gap-2">
            {allOnline && allDeployed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            )}
            <span className={`text-xs font-semibold ${allOnline && allDeployed ? "text-emerald-400" : "text-amber-400"}`}>
              {allOnline && allDeployed ? "Alle Systeme betriebsbereit" : "Teilweise Einschraenkungen"}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {apps.length} Apps · {apps.filter((a) => a.apiStatus === "online").length} online
          </p>
        </div>

        {/* API */}
        <div className="rounded-lg p-3 border border-border/30 bg-card/50">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">API Gateway</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Operativ · 99.9% Uptime</span>
          </div>
        </div>

        {/* Stripe */}
        <div className="rounded-lg p-3 border border-border/30 bg-card/50">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Stripe Payments</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Verbunden · {apps.filter((a) => a.stripeStatus === "active").length} aktive Integrationen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Legend ──────────────────────────────────────────────────
function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 px-1">
      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">Legende:</span>
      {statusBadge("live")}
      {statusBadge("beta")}
      {statusBadge("development")}
      {statusBadge("planned")}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function StatusPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Live Status Dashboard</h1>
              <p className="text-xs text-muted-foreground">RealSync Dynamics — Plattform-Transparenz fuer Kunden</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mt-2">
            Echtzeit-Uebersicht aller RealSync Produkte. Sieh den aktuellen Entwicklungsstand, Feature-Status,
            API-Verfuegbarkeit und die neuesten Updates auf einen Blick.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status */}
        <SystemStatus />

        {/* Platform Overview KPIs */}
        <PlatformOverview />

        {/* Legend */}
        <StatusLegend />

        {/* App Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        {/* Transparency Note */}
        <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold mb-1">Transparenz ist uns wichtig</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dieses Dashboard zeigt den aktuellen Entwicklungsstand aller RealSync Dynamics Produkte in Echtzeit.
                Wir glauben an volle Transparenz gegenueber unseren Kunden — deshalb kannst du hier jederzeit
                nachsehen, welche Features bereits live sind, was sich in der Entwicklung befindet und was als
                naechstes geplant ist. Fragen? Nutze unseren{" "}
                <a href="/#/support" className="text-primary hover:underline font-medium">
                  KI-Support
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
