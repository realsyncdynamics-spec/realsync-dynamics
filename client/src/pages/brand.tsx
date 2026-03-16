import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Palette,
  Type,
  Target,
  Calendar,
  Copy,
  Download,
  ExternalLink,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Github,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
  Layers,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Hash,
  FileText,
  Image as ImageIcon,
  Video,
  Megaphone,
  Star,
  Zap,
  ArrowRight,
  Clock,
  Share2,
} from "lucide-react";
import { AppInfoSection } from "@/components/AppInfoSection";

/* ───── Social Media Accounts ───── */
const socialAccounts = [
  { platform: "Instagram", icon: Instagram, handle: "@realsyncdynamics", url: "https://instagram.com/realsyncdynamics", color: "from-purple-500 to-pink-500", status: "reserviert" },
  { platform: "X (Twitter)", icon: Twitter, handle: "@realsync_de", url: "https://x.com/realsync_de", color: "from-gray-700 to-gray-900", status: "reserviert" },
  { platform: "TikTok", icon: Video, handle: "@realsyncdynamics", url: "https://tiktok.com/@realsyncdynamics", color: "from-pink-500 to-cyan-500", status: "reserviert" },
  { platform: "LinkedIn", icon: Linkedin, handle: "RealSync Dynamics", url: "https://linkedin.com/company/realsyncdynamics", color: "from-blue-600 to-blue-800", status: "reserviert" },
  { platform: "GitHub", icon: Github, handle: "realsyncdynamics", url: "https://github.com/realsyncdynamics", color: "from-gray-800 to-gray-950", status: "reserviert" },
  { platform: "Facebook", icon: Facebook, handle: "RealSync Dynamics", url: "https://facebook.com/realsyncdynamics", color: "from-blue-500 to-blue-700", status: "reserviert" },
  { platform: "YouTube", icon: Youtube, handle: "@RealSyncDynamics", url: "https://youtube.com/@RealSyncDynamics", color: "from-red-500 to-red-700", status: "reserviert" },
  { platform: "Discord", icon: MessageCircle, handle: "RealSync Dynamics", url: "https://discord.gg/realsyncdynamics", color: "from-indigo-500 to-indigo-700", status: "geplant" },
];

/* ───── Brand Colors ───── */
const brandColors = [
  { name: "Gold (Primär)", hex: "#C9A84C", hsl: "42° 52% 54%", usage: "CTA-Buttons, Akzente, Headlines" },
  { name: "Dark BG", hex: "#0A0A0B", hsl: "240° 5% 4%", usage: "Haupt-Hintergrund" },
  { name: "Card BG", hex: "#111113", hsl: "240° 5% 7%", usage: "Karten, Panels" },
  { name: "Border", hex: "#27272A", hsl: "240° 4% 16%", usage: "Rahmen, Trennlinien" },
  { name: "Text Primär", hex: "#FAFAFA", hsl: "0° 0% 98%", usage: "Haupttext, Headlines" },
  { name: "Text Sekundär", hex: "#A1A1AA", hsl: "240° 5% 65%", usage: "Beschreibungen, Labels" },
  { name: "Erfolg", hex: "#22C55E", hsl: "142° 71% 45%", usage: "Erfolgs-States, Verifiziert" },
  { name: "Fehler", hex: "#EF4444", hsl: "0° 84% 60%", usage: "Fehler-States, Warnungen" },
];

/* ───── Content Calendar ───── */
const contentCalendar = [
  { day: "Montag", theme: "Motivation Monday", content: "Inspirierende Quotes + Produkt-Teaser", format: "Karussell / Story", icon: Sparkles },
  { day: "Dienstag", theme: "Tutorial Tuesday", content: "How-To Videos + Feature-Demos", format: "Reel / Video", icon: Video },
  { day: "Mittwoch", theme: "Workflow Wednesday", content: "Use-Cases + Creator-Spotlights", format: "Beitrag + Story", icon: Layers },
  { day: "Donnerstag", theme: "Tech Thursday", content: "Technologie-Einblicke + Behind-the-Scenes", format: "Karussell / Thread", icon: Zap },
  { day: "Freitag", theme: "Feature Friday", content: "Neue Features + Updates ankündigen", format: "Reel + Beitrag", icon: Star },
  { day: "Samstag", theme: "Community Samstag", content: "User-Generated Content + Umfragen", format: "Story + Beitrag", icon: Users },
  { day: "Sonntag", theme: "Sonntags-Recap", content: "Wochenrückblick + Vorschau", format: "Karussell / Story", icon: Calendar },
];

/* ───── Launch Campaign Templates ───── */
const postTemplates = [
  {
    title: "Launch-Ankündigung",
    platform: "Alle Plattformen",
    template: `🚀 RealSync Dynamics ist LIVE!

Die zentrale SaaS-Plattform für alle RealSync Produkte — dein App-Hub für Creator & Content-Schutz.

🛡️ RealSyncCreatorSeal — Content schützen & verifizieren
🤖 RealSyncOptimus — KI-Agenten mit 9 kostenlosen Modellen
💬 RealSyncCommunity — Creator-Netzwerk & Marketplace
🎓 RealSyncSchulLabor — Virtuelle Labor-Simulatoren
✨ RealSyncLinkMagic — KI-Anzeigen-Generator

✅ Jede App einzeln oder im Gesamtpaket
✅ Kostenlos starten – keine Kreditkarte nötig

realsyncdynamics.de

#RealSyncDynamics #ContentSchutz #CreatorEconomy #SaaS #MadeInGermany`,
    category: "Launch",
  },
  {
    title: "CreatorSeal Feature-Post",
    platform: "Instagram / LinkedIn",
    template: `🛡️ Schütze deinen Content in Sekunden.

CreatorSeal von RealSync Dynamics:

1️⃣ Datei hochladen
2️⃣ SHA-256 Hash generieren
3️⃣ Blockchain-Verifizierung starten
4️⃣ Zertifikat & QR-Code erhalten

Dein Content. Dein Beweis. Deine Marke.

Kostenlos testen → realsyncdynamics.de/#/creatorseal

#CreatorSeal #DigitalerSchutz #Blockchain #ContentCreator`,
    category: "Feature",
  },
  {
    title: "Optimus KI-Agent Post",
    platform: "X / LinkedIn",
    template: `🤖 Automatisiere mit KI-Agenten – kostenlos.

RealSync Optimus nutzt 9 kostenlose KI-Modelle:
• Gemma 3 von Google
• Llama 3.3 von Meta
• Qwen 2.5 von Alibaba
• DeepSeek R1

Kein API-Key nötig. Kein Limit.
Einfach Agenten erstellen und Aufgaben delegieren.

→ realsyncdynamics.de/#/optimus

#KI #AIAgents #Automatisierung #RealSyncOptimus`,
    category: "Feature",
  },
  {
    title: "Community-Einladung",
    platform: "Instagram / TikTok",
    template: `💬 Werde Teil der RealSync Creator Community!

Hier treffen sich Creator, Entwickler und Unternehmer:

🎨 Zeige deine Projekte
🤝 Vernetze dich mit anderen Creatorn
🛒 Verkaufe im Marketplace
📈 Wachse gemeinsam

Jetzt kostenlos beitreten: realsyncdynamics.de/#/community

#CreatorCommunity #Netzwerk #RealSync`,
    category: "Community",
  },
  {
    title: "Preis-Vergleich Story",
    platform: "Instagram Story / TikTok",
    template: `💰 Starter: 0€/Monat
→ 5 geschützte Inhalte, 2 KI-Agenten

💰 Creator: 19€/Monat
→ 50 Inhalte, 5 Agenten, Barcode-Studio

💰 Pro: 49€/Monat
→ Unbegrenzt alles + API-Zugang

💰 Enterprise: 149€/Monat
→ White-Label + Priority Support

Was passt zu dir?
→ realsyncdynamics.de/#/preise`,
    category: "Pricing",
  },
  {
    title: "Behind-the-Scenes",
    platform: "Instagram Reel / TikTok",
    template: `🎬 So bauen wir RealSync Dynamics.

Tech-Stack:
⚡ React + Vite für blitzschnelle UI
🔒 SHA-256 + Blockchain für Content-Schutz
🤖 9 kostenlose KI-Modelle
🎨 Dark Theme mit Gold-Akzenten

Made in Germany 🇩🇪

Folge uns für Tech-Updates!

#BehindTheScenes #TechStartup #SaaS #Deutschland`,
    category: "BTS",
  },
];

/* ───── Sidebar Tabs ───── */
const brandTabs = [
  { id: "overview", label: "Übersicht", icon: Target },
  { id: "brandkit", label: "Brand Kit", icon: Palette },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "kalender", label: "Content-Kalender", icon: Calendar },
  { id: "templates", label: "Post-Templates", icon: FileText },
  { id: "strategie", label: "Strategie", icon: TrendingUp },
];

export default function BrandPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert!", description: "Text wurde in die Zwischenablage kopiert." });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Marke & Strategie</h1>
            <p className="text-muted-foreground text-sm">RealSync Dynamics Brand Management</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-20 space-y-1">
            {brandTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`brand-tab-${tab.id}`}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* MOBILE TAB BAR */}
        <div className="lg:hidden overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-1 min-w-max">
            {brandTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`brand-mobile-${tab.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">

          {/* ═══════ ÜBERSICHT ═══════ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Hero */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                        <rect width="40" height="40" rx="8" fill="#C9A84C" />
                        <path d="M10 28V12h6.5c1.8 0 3.2.5 4.1 1.4.9.9 1.4 2.1 1.4 3.6 0 1.1-.3 2-.8 2.8-.5.8-1.3 1.3-2.2 1.6L23 28h-3.5l-3.5-6h-2.5v6H10zm3.5-9h3c.8 0 1.4-.2 1.8-.7.4-.5.7-1.1.7-1.8 0-.7-.2-1.3-.7-1.8-.4-.5-1-.7-1.8-.7h-3v5z" fill="white" />
                        <path d="M25 18.5c0-1.2.4-2.2 1.2-3 .8-.8 1.8-1.2 3-1.2s2.2.4 3 1.2c.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3c-.8.8-1.8 1.2-3 1.2s-2.2-.4-3-1.2c-.8-.8-1.2-1.8-1.2-3z" fill="white" fillOpacity="0.8" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold">RealSync Dynamics</h2>
                      <p className="text-muted-foreground text-sm">Zentrale SaaS-Plattform — Der App-Hub für alle RealSync Produkte</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <p className="text-2xl font-display font-bold text-primary">7+</p>
                      <p className="text-xs text-muted-foreground">Apps</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <p className="text-2xl font-display font-bold text-primary">8</p>
                      <p className="text-xs text-muted-foreground">Social Channels</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <p className="text-2xl font-display font-bold text-primary">9</p>
                      <p className="text-xs text-muted-foreground">KI-Modelle</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <p className="text-2xl font-display font-bold text-primary">0€</p>
                      <p className="text-xs text-muted-foreground">Starter-Plan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Statement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Mission & Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h3 className="font-display font-bold text-sm mb-2">Mission</h3>
                    <p className="text-sm text-muted-foreground">
                      RealSync Dynamics ist die zentrale Plattform, die alle RealSync Produkte unter einem Dach vereint — 
                      wie ein App-Store für Creator-Tools. Jede App (RealSyncCreatorSeal, RealSyncOptimus, RealSyncCommunity, 
                      RealSyncSchulLabor, RealSyncLinkMagic) ist ein eigenständiges Produkt unter der Marke RealSync Dynamics.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h3 className="font-display font-bold text-sm mb-2">Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      Die führende europäische SaaS-Plattform werden, die Creator, Schulen und Unternehmen mit 
                      modernster Technologie versorgt — von Content-Schutz über KI-Agenten bis hin zu Education-Tools. 
                      Jedes Produkt ist einzeln nutzbar, aber zusammen unschlagbar.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h3 className="font-display font-bold text-sm mb-2">Markenarchitektur</h3>
                    <p className="text-sm text-muted-foreground">
                      realsyncdynamics.de ist der zentrale Hub. Alle Produkte tragen den Prefix "RealSync" — 
                      z.B. RealSyncCreatorSeal, RealSyncOptimus. Jede App hat eigene Subdomains 
                      (creatorseal.realsyncdynamics.de), eigene Preise und kann einzeln abonniert werden. 
                      Das RealSync Gesamtpaket bietet alle Apps zum Vorteilspreis.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h3 className="font-display font-bold text-sm mb-2">Tonalität</h3>
                    <p className="text-sm text-muted-foreground">
                      Professionell aber nahbar. Technisch kompetent ohne arrogant zu wirken.
                      Deutsch als Hauptsprache. Klare, direkte Kommunikation. Innovation betonen, aber authentisch bleiben.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setActiveTab("brandkit")} data-testid="quick-brandkit">
                  <Palette className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Brand Kit</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setActiveTab("templates")} data-testid="quick-templates">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Post-Templates</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setActiveTab("social")} data-testid="quick-social">
                  <Share2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Social Media</span>
                </Button>
              </div>
            </div>
          )}

          {/* ═══════ BRAND KIT ═══════ */}
          {activeTab === "brandkit" && (
            <div className="space-y-6">
              {/* Logo */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo</CardTitle>
                  <CardDescription>Offizielle Logo-Varianten von RealSync Dynamics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl bg-[#0A0A0B] border border-border flex flex-col items-center gap-3">
                      <div className="flex items-center gap-3">
                        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                          <rect width="40" height="40" rx="8" fill="#C9A84C" />
                          <path d="M10 28V12h6.5c1.8 0 3.2.5 4.1 1.4.9.9 1.4 2.1 1.4 3.6 0 1.1-.3 2-.8 2.8-.5.8-1.3 1.3-2.2 1.6L23 28h-3.5l-3.5-6h-2.5v6H10zm3.5-9h3c.8 0 1.4-.2 1.8-.7.4-.5.7-1.1.7-1.8 0-.7-.2-1.3-.7-1.8-.4-.5-1-.7-1.8-.7h-3v5z" fill="white" />
                          <path d="M25 18.5c0-1.2.4-2.2 1.2-3 .8-.8 1.8-1.2 3-1.2s2.2.4 3 1.2c.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3c-.8.8-1.8 1.2-3 1.2s-2.2-.4-3-1.2c-.8-.8-1.2-1.8-1.2-3z" fill="white" fillOpacity="0.8" />
                        </svg>
                        <span className="font-display font-bold text-lg text-white">RealSync Dynamics</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">Dunkel (Standard)</Badge>
                    </div>
                    <div className="p-6 rounded-xl bg-white border border-border flex flex-col items-center gap-3">
                      <div className="flex items-center gap-3">
                        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                          <rect width="40" height="40" rx="8" fill="#C9A84C" />
                          <path d="M10 28V12h6.5c1.8 0 3.2.5 4.1 1.4.9.9 1.4 2.1 1.4 3.6 0 1.1-.3 2-.8 2.8-.5.8-1.3 1.3-2.2 1.6L23 28h-3.5l-3.5-6h-2.5v6H10zm3.5-9h3c.8 0 1.4-.2 1.8-.7.4-.5.7-1.1.7-1.8 0-.7-.2-1.3-.7-1.8-.4-.5-1-.7-1.8-.7h-3v5z" fill="white" />
                          <path d="M25 18.5c0-1.2.4-2.2 1.2-3 .8-.8 1.8-1.2 3-1.2s2.2.4 3 1.2c.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3c-.8.8-1.8 1.2-3 1.2s-2.2-.4-3-1.2c-.8-.8-1.2-1.8-1.2-3z" fill="white" fillOpacity="0.8" />
                        </svg>
                        <span className="font-display font-bold text-lg text-[#0A0A0B]">RealSync Dynamics</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">Hell</Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                    <p>Logo-Mindestgröße: 120px Breite. Freiraum: Mindestens halbe Logo-Höhe zu allen Seiten. Nicht verzerren, rotieren oder Farben ändern.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Farbpalette</CardTitle>
                  <CardDescription>Offizielle Markenfarben mit Hex- und HSL-Werten</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {brandColors.map((color) => (
                      <div
                        key={color.name}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors cursor-pointer"
                        onClick={() => copyToClipboard(color.hex)}
                        data-testid={`color-${color.hex}`}
                      >
                        <div className="w-12 h-12 rounded-lg border border-border/50 shrink-0" style={{ backgroundColor: color.hex }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{color.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{color.hex} · {color.hsl}</p>
                          <p className="text-xs text-muted-foreground truncate">{color.usage}</p>
                        </div>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Typography */}
              <Card>
                <CardHeader>
                  <CardTitle>Typografie</CardTitle>
                  <CardDescription>Schriftarten und Textregeln</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-2">Display / Headlines</p>
                      <p className="font-display text-2xl font-bold">Inter (Bold)</p>
                      <p className="text-xs text-muted-foreground mt-2">Verwendet für: Headlines, Zahlen, CTA-Buttons</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-2">Body / Fließtext</p>
                      <p className="text-lg">Inter (Regular / Medium)</p>
                      <p className="text-xs text-muted-foreground mt-2">Verwendet für: Fließtext, Beschreibungen, Labels</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-3">Größen-Hierarchie</p>
                    <div className="space-y-2">
                      <p className="text-3xl font-display font-bold">H1 — 30px Bold</p>
                      <p className="text-2xl font-display font-bold">H2 — 24px Bold</p>
                      <p className="text-xl font-display font-bold">H3 — 20px Bold</p>
                      <p className="text-base font-medium">Body — 16px Medium</p>
                      <p className="text-sm text-muted-foreground">Small — 14px Regular</p>
                      <p className="text-xs text-muted-foreground">Caption — 12px Regular</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════ SOCIAL MEDIA ═══════ */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social-Media-Accounts</CardTitle>
                  <CardDescription>Reservierte Account-Namen auf allen Plattformen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {socialAccounts.map((account) => {
                      const Icon = account.icon;
                      return (
                        <div
                          key={account.platform}
                          className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/20 transition-all group"
                          data-testid={`social-${account.platform.toLowerCase().replace(/[^a-z]/g, "")}`}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${account.color} flex items-center justify-center text-white shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{account.platform}</p>
                            <p className="text-xs text-muted-foreground truncate">{account.handle}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="secondary" className={`text-xs ${account.status === "reserviert" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                              {account.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(account.handle)}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Hashtag Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle>Hashtag-Strategie</CardTitle>
                  <CardDescription>Immer verwenden — angepasst pro Plattform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium mb-2">Kern-Hashtags (immer)</p>
                    <div className="flex flex-wrap gap-2">
                      {["#RealSyncDynamics", "#ContentSchutz", "#CreatorEconomy", "#MadeInGermany", "#SaaS"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20" onClick={() => copyToClipboard(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium mb-2">App-spezifisch</p>
                    <div className="flex flex-wrap gap-2">
                      {["#CreatorSeal", "#RealSyncOptimus", "#Blockchain", "#DigitalerSchutz", "#KIAgenten", "#SchulLabor", "#LinkMagic"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-muted" onClick={() => copyToClipboard(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium mb-2">Community & Engagement</p>
                    <div className="flex flex-wrap gap-2">
                      {["#Creator", "#DigitalCreator", "#ContentCreator", "#Startup", "#Innovation", "#TechGermany", "#Digitalisierung"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-muted" onClick={() => copyToClipboard(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════ CONTENT KALENDER ═══════ */}
          {activeTab === "kalender" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wöchentlicher Content-Kalender</CardTitle>
                  <CardDescription>Themen und Formate für jeden Tag der Woche</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contentCalendar.map((day) => {
                      const Icon = day.icon;
                      return (
                        <div key={day.day} className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/20 transition-all">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold">{day.day}</p>
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">{day.theme}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{day.content}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              {day.format}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Posting Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimale Posting-Zeiten</CardTitle>
                  <CardDescription>Basierend auf deutschem Markt (MEZ/MESZ)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-sm font-medium">Instagram</span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Feed: 11:00 - 13:00 & 18:00 - 20:00</p>
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Stories: 7:00 - 9:00 & 20:00 - 22:00</p>
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Reels: 9:00 - 11:00 & 19:00 - 21:00</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Twitter className="h-4 w-4" />
                        <span className="text-sm font-medium">X (Twitter)</span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Tweets: 8:00 - 10:00 & 12:00 - 13:00</p>
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Threads: 10:00 - 12:00</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Posts: 7:00 - 9:00 & 17:00 - 18:00</p>
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Artikel: Dienstag & Donnerstag</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-pink-500" />
                        <span className="text-sm font-medium">TikTok</span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Videos: 10:00 - 12:00 & 19:00 - 21:00</p>
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> 3-5 Posts pro Woche ideal</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════ POST TEMPLATES ═══════ */}
          {activeTab === "templates" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Launch-Kampagne Post-Templates</CardTitle>
                  <CardDescription>Fertige Texte zum Kopieren — anpassbar pro Plattform</CardDescription>
                </CardHeader>
              </Card>
              {postTemplates.map((tmpl, index) => (
                <Card key={index} className="hover:border-primary/20 transition-all">
                  <CardHeader className="cursor-pointer" onClick={() => setExpandedTemplate(expandedTemplate === index ? null : index)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">{tmpl.category}</Badge>
                        <div>
                          <CardTitle className="text-base">{tmpl.title}</CardTitle>
                          <CardDescription className="text-xs">{tmpl.platform}</CardDescription>
                        </div>
                      </div>
                      {expandedTemplate === index ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </CardHeader>
                  {expandedTemplate === index && (
                    <CardContent className="pt-0">
                      <div className="relative">
                        <pre className="whitespace-pre-wrap text-sm p-4 rounded-lg bg-muted/30 border border-border font-sans">{tmpl.template}</pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(tmpl.template)}
                          data-testid={`copy-template-${index}`}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Kopieren
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* ═══════ STRATEGIE ═══════ */}
          {activeTab === "strategie" && (
            <div className="space-y-6">
              {/* Growth Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle>Wachstumsstrategie (Q1–Q4 2026)</CardTitle>
                  <CardDescription>Meilensteine und Maßnahmen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { quarter: "Q1 2026", title: "Launch & Awareness", goals: ["Soft Launch auf ProductHunt", "500 Beta-User gewinnen", "Content-Serie auf LinkedIn & X starten", "Creator-Partnerschaften aufbauen"], color: "text-blue-400", bg: "bg-blue-500/10" },
                    { quarter: "Q2 2026", title: "Growth & Community", goals: ["2.000 registrierte User", "Creator-Community auf 500+ Mitglieder", "Erste Premium-Conversions", "Kooperationen mit Influencern"], color: "text-green-400", bg: "bg-green-500/10" },
                    { quarter: "Q3 2026", title: "Monetarisierung", goals: ["10.000 User, 500 zahlende Kunden", "Enterprise-Kunden akquirieren", "App Store für Creator-Tools", "Internationale Expansion (DACH)"], color: "text-yellow-400", bg: "bg-yellow-500/10" },
                    { quarter: "Q4 2026", title: "Skalierung", goals: ["25.000 User, 2.000 zahlende Kunden", "API-Marketplace launchen", "White-Label-Lösung für Agenturen", "Series-A Vorbereitung"], color: "text-purple-400", bg: "bg-purple-500/10" },
                  ].map((q) => (
                    <div key={q.quarter} className="flex gap-4 p-4 rounded-xl border border-border">
                      <div className={`w-16 h-16 rounded-xl ${q.bg} flex flex-col items-center justify-center shrink-0`}>
                        <span className={`text-xs font-bold ${q.color}`}>{q.quarter}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-sm mb-2">{q.title}</h3>
                        <ul className="space-y-1">
                          {q.goals.map((goal, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators (KPIs)</CardTitle>
                  <CardDescription>Metriken zur Erfolgsmessung</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Monthly Active Users (MAU)", target: "25.000", timeframe: "bis Q4 2026" },
                      { label: "Conversion Rate (Free → Paid)", target: ">8%", timeframe: "Zielwert" },
                      { label: "Monthly Recurring Revenue", target: "50.000€", timeframe: "bis Q4 2026" },
                      { label: "Social Media Follower", target: "10.000+", timeframe: "alle Plattformen" },
                      { label: "Net Promoter Score", target: ">50", timeframe: "Vierteljährlich" },
                      { label: "Churn Rate", target: "<5%", timeframe: "Monatlich" },
                    ].map((kpi) => (
                      <div key={kpi.label} className="p-3 rounded-lg border border-border">
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <p className="text-xl font-display font-bold text-primary mt-1">{kpi.target}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{kpi.timeframe}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Pillars */}
              <Card>
                <CardHeader>
                  <CardTitle>Content-Säulen</CardTitle>
                  <CardDescription>Die 4 Hauptthemen für alle Social-Media-Inhalte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Edukation", desc: "How-To Tutorials, Feature-Demos, Webinare. Zeige den Mehrwert der Plattform.", icon: "📚", percentage: "40%" },
                      { title: "Inspiration", desc: "Creator-Erfolgsgeschichten, Use-Cases, Vorher/Nachher. Motiviere die Zielgruppe.", icon: "✨", percentage: "25%" },
                      { title: "Community", desc: "User-Generated Content, Umfragen, Q&As, Challenges. Baue Engagement auf.", icon: "🤝", percentage: "20%" },
                      { title: "Produkt", desc: "Feature-Ankündigungen, Updates, Roadmap. Halte die Community informiert.", icon: "🚀", percentage: "15%" },
                    ].map((pillar) => (
                      <div key={pillar.title} className="p-4 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{pillar.icon}</span>
                            <h3 className="font-display font-bold text-sm">{pillar.title}</h3>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{pillar.percentage}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{pillar.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* AppInfoSection */}
      <div className="mt-12">
        <AppInfoSection
          appName="Marke & Strategie"
          appDescription="Das zentrale Brand-Management-Center der RealSync Dynamics Plattform. RealSync Dynamics ist der Hub für alle RealSync Produkte (CreatorSeal, Optimus, Community, SchulLabor, Link-Magic). Hier findest du alles für eine konsistente Markenpräsenz — vom Brand Kit über Social-Media-Strategien bis hin zu fertigen Post-Templates."
          features={[
            { icon: CheckCircle, title: "Brand Kit", description: "Vollständiges Brand Kit mit Logo, Farben und Typografie" },
            { icon: Globe, title: "Social Accounts", description: "Reservierte Social-Media-Accounts auf 8 Plattformen" },
            { icon: Clock, title: "Content-Kalender", description: "Wöchentlicher Content-Kalender mit Themen und Formaten" },
            { icon: Layers, title: "Post-Templates", description: "6 fertige Launch-Kampagne Post-Templates" },
            { icon: Target, title: "Hashtag-Strategie", description: "Hashtag-Strategie mit Kern- und App-spezifischen Tags" },
            { icon: TrendingUp, title: "Wachstum", description: "Wachstumsstrategie Q1-Q4 2026 mit KPIs" },
            { icon: Clock, title: "Posting-Zeiten", description: "Optimale Posting-Zeiten für den deutschen Markt" },
            { icon: Star, title: "Content-Säulen", description: "Content-Säulen mit prozentualer Gewichtung" },
          ]}
          techStack={[
            { name: "React", description: "Frontend-Framework" },
            { name: "Tailwind CSS", description: "Utility-first CSS" },
            { name: "Shadcn/UI", description: "UI-Komponenten" },
            { name: "Lucide Icons", description: "Icon-Bibliothek" },
          ]}
          stripeInfo={{
            plans: [
              { name: "Inklusive", price: "0€", features: ["Im Starter-Plan enthalten", "Voller Zugang zum Brand Kit", "Alle Templates nutzbar"] },
            ],
          }}
          roadmap={[
            { quarter: "Q2 2026", title: "KI-Planung", description: "Automatisierte Social-Media-Planung mit KI", status: "planned" as const },
            { quarter: "Q2 2026", title: "Brand-Analytics", description: "Dashboard mit Engagement-Metriken", status: "planned" as const },
            { quarter: "Q3 2026", title: "Multi-Marken", description: "Multi-Marken-Management für Agenturen", status: "planned" as const },
            { quarter: "Q3 2026", title: "Content-Generator", description: "KI-Texterstellung", status: "planned" as const },
            { quarter: "Q4 2026", title: "A/B-Testing", description: "A/B-Testing für Post-Varianten", status: "planned" as const },
          ]}
        />
      </div>
    </div>
  );
}
