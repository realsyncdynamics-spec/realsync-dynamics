import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  X,
  Shield,
  Bot,
  Layers,
  TrendingUp,
  Users,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Star,
  Package,
  GraduationCap,
  Wand2,
  ChevronDown,
  Globe,
} from "lucide-react";

// ─── RealSync Gesamtpakete (Bundles) ───
const bundlePlans = [
  {
    name: "STARTER",
    price: 0,
    interval: "Kostenlos",
    badge: null,
    description: "Alle Apps im Basic-Zugang testen",
    features: [
      "Alle 5 Apps — Basic-Zugang",
      "Community Read-Only",
      "5 Agent-Tasks / Tag",
      "CreatorSeal Bronze",
      "SHA-256 Hash-Schutz",
      "3 Inhalte / Monat",
      "1 Builder-Projekt",
      "3 Scanner-Analysen / Monat",
    ],
    notIncluded: ["API-Zugang", "Priority Support", "Custom Domain", "Team-Accounts"],
    cta: "Kostenlos starten",
    highlight: false,
  },
  {
    name: "CREATOR",
    price: 19,
    interval: "/Monat",
    badge: "Beliebt",
    description: "Für professionelle Content-Creator",
    features: [
      "CreatorSeal Silver + Barcode",
      "Community Full Access",
      "50 Agent-Tasks / Tag",
      "Optimus KI-Agenten (5)",
      "Builder — 5 Projekte",
      "Scanner — 25 Analysen / Monat",
      "Link-Magic Basic",
      "C2PA Basis-Zertifikat",
      "E-Mail Support",
    ],
    notIncluded: ["API-Zugang", "Team-Accounts"],
    cta: "Creator werden",
    highlight: true,
  },
  {
    name: "PRO",
    price: 49,
    interval: "/Monat",
    badge: "Empfohlen",
    description: "Alle Apps Premium — unbegrenzt",
    features: [
      "Alle Apps Premium-Zugang",
      "Unbegrenzte Agent-Tasks",
      "Unbegrenzte Agenten",
      "API-Zugang (alle Apps)",
      "Priority Support",
      "CreatorSeal Gold + Blockchain",
      "Wasserzeichen + C2PA Voll",
      "Builder — 20 Projekte",
      "Scanner — Echtzeit-Daten",
      "Custom Creator-Seite",
      "3 Team-User",
    ],
    notIncluded: ["White-Label"],
    cta: "Pro upgraden",
    highlight: false,
  },
  {
    name: "ENTERPRISE",
    price: 149,
    interval: "/Monat",
    badge: null,
    description: "White-Label + Team + Dedicated",
    features: [
      "Alles aus Pro",
      "White-Label Branding",
      "Unbegrenzte Team-Accounts",
      "Custom Integration",
      "Dedicated Support & SLA 99.9%",
      "Dedizierte Infrastruktur",
      "Custom KI-Modelle",
      "Persönlicher Account Manager",
      "Onboarding & Schulung",
    ],
    notIncluded: [],
    cta: "Kontakt aufnehmen",
    highlight: false,
  },
];

// ─── Einzelne App-Preise ───
const appPricing = [
  {
    app: "RealSyncCreatorSeal",
    icon: Shield,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    description: "Content-Schutz & Verifizierung",
    subdomain: "creatorseal.realsyncdynamics.de",
    route: "/creatorseal",
    tiers: [
      { name: "Free", price: 0, features: ["3 Inhalte/Monat", "SHA-256 Hash", "Barcode", "Bronze-Verifizierung"] },
      { name: "Starter", price: 9, features: ["25 Inhalte/Monat", "QR-Code", "C2PA Basis", "E-Mail Support"] },
      { name: "Pro", price: 29, features: ["100 Inhalte/Monat", "Blockchain", "Wasserzeichen", "API-Zugang", "3 Team-User"] },
      { name: "Business", price: 79, features: ["Unbegrenzt", "Custom Domain", "10 Team-User", "Prioritäts-Support"] },
    ],
  },
  {
    app: "RealSyncOptimus",
    icon: Bot,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    description: "KI-Agent Manager & Automatisierung",
    subdomain: "optimus.realsyncdynamics.de",
    route: "/optimus",
    tiers: [
      { name: "Free", price: 0, features: ["2 Agenten", "5 Tasks/Tag", "Basis-KI", "Community Support"] },
      { name: "Starter", price: 9, features: ["5 Agenten", "50 Tasks/Tag", "Alle KI-Modelle", "E-Mail Support"] },
      { name: "Pro", price: 49, features: ["Unbegrenzt", "Unlimited Tasks", "API-Zugang", "Priority Support"] },
      { name: "Business", price: 149, features: ["Alles + Custom KI", "Team-Workflows", "Dedizierter Support"] },
    ],
  },
  {
    app: "RealSyncBuilder",
    icon: Layers,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    description: "Multi-App Builder mit KI",
    subdomain: "builder.realsyncdynamics.de",
    route: "/builder",
    tiers: [
      { name: "Free", price: 0, features: ["1 Projekt", "1 KI-Modell", "3 Templates"] },
      { name: "Starter", price: 19, features: ["5 Projekte", "3 KI-Modelle", "Alle Templates"] },
      { name: "Pro", price: 49, features: ["20 Projekte", "Alle KI-Modelle", "Custom Templates", "Custom Domain"] },
      { name: "Business", price: 99, features: ["Unbegrenzt", "Team-User", "Prioritäts-Support"] },
    ],
  },
  {
    app: "RealSyncScanner",
    icon: TrendingUp,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    description: "KI-Marktanalyse & Trends",
    subdomain: "scanner.realsyncdynamics.de",
    route: "/scanner",
    tiers: [
      { name: "Free", price: 0, features: ["3 Analysen/Monat", "Basis-Trends"] },
      { name: "Starter", price: 19, features: ["25 Analysen/Monat", "CSV Export", "3 Alerts"] },
      { name: "Pro", price: 49, features: ["100 Analysen", "Echtzeit-Daten", "PDF Export", "10 Alerts"] },
      { name: "Business", price: 99, features: ["Unbegrenzt", "API Export", "Unlimited Alerts"] },
    ],
  },
  {
    app: "RealSyncCommunity",
    icon: Users,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    description: "Creator-Netzwerk & Marketplace",
    subdomain: "community.realsyncdynamics.de",
    route: "/community",
    tiers: [
      { name: "Free", price: 0, features: ["Read-Only", "Profil erstellen"] },
      { name: "Starter", price: 9, features: ["Full Access", "Posten & Kommentieren", "5 Gruppen"] },
      { name: "Pro", price: 29, features: ["Marketplace Verkaufen", "Unbegrenzte Gruppen", "Analytics"] },
      { name: "Business", price: 49, features: ["Marketplace Featured", "Live-Streaming", "Enterprise Analytics"] },
    ],
  },
  {
    app: "RealSyncSchulLabor",
    icon: GraduationCap,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    description: "Virtuelle Labor-Simulatoren für Schulen",
    subdomain: "schullabor.realsyncdynamics.de",
    route: "/schullabor",
    tiers: [
      { name: "Schüler", price: 0, features: ["3 Simulationen", "Basis-Experimente"] },
      { name: "Lehrer", price: 9, features: ["Alle Simulationen", "Klassen-Dashboard", "PDF-Export"] },
      { name: "Schule", price: 49, features: ["Unbegrenzte Schüler", "Admin-Panel", "SSO"] },
      { name: "Bundesland", price: 299, features: ["Alle Schulen", "Custom Lehrplan", "Dedicated Support"] },
    ],
  },
  {
    app: "RealSyncLinkMagic",
    icon: Wand2,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    description: "KI-Anzeigen-Generator für alle Plattformen",
    subdomain: "linkmagic.realsyncdynamics.de",
    route: "/link-magic",
    tiers: [
      { name: "Free", price: 0, features: ["10 Anzeigen/Monat", "2 Plattformen"] },
      { name: "Starter", price: 9, features: ["100 Anzeigen/Monat", "Alle Plattformen", "5 Sprachen"] },
      { name: "Pro", price: 29, features: ["Unbegrenzt", "Video-Ads", "A/B-Tests", "Analytics"] },
      { name: "Agency", price: 99, features: ["Multi-Client", "API", "White-Label", "Direct Publishing"] },
    ],
  },
];

// ─── Feature-Vergleichstabelle ───
const comparisonFeatures = [
  { category: "CreatorSeal", features: [
    { name: "Geschützte Inhalte", starter: "3/Monat", creator: "25/Monat", pro: "Unbegrenzt", enterprise: "Unbegrenzt" },
    { name: "SHA-256 Hash", starter: "✓", creator: "✓", pro: "✓", enterprise: "✓" },
    { name: "Barcode & QR-Code", starter: "✓", creator: "✓", pro: "✓", enterprise: "✓" },
    { name: "C2PA Zertifikat", starter: "—", creator: "Basis", pro: "Voll", enterprise: "Voll" },
    { name: "Blockchain-Verankerung", starter: "—", creator: "—", pro: "✓", enterprise: "✓" },
    { name: "Wasserzeichen", starter: "—", creator: "—", pro: "✓", enterprise: "✓" },
    { name: "Deepfake Detection", starter: "—", creator: "—", pro: "✓", enterprise: "✓" },
  ]},
  { category: "Optimus KI-Agenten", features: [
    { name: "KI-Agenten", starter: "2", creator: "5", pro: "Unbegrenzt", enterprise: "Unbegrenzt" },
    { name: "Tasks / Tag", starter: "5", creator: "50", pro: "Unbegrenzt", enterprise: "Unbegrenzt" },
    { name: "KI-Modelle", starter: "Basis", creator: "Alle Gratis", pro: "Alle + Premium", enterprise: "Custom" },
    { name: "Workflow-Ketten", starter: "—", creator: "3", pro: "Unbegrenzt", enterprise: "Unbegrenzt" },
    { name: "Desktop-Automation", starter: "—", creator: "—", pro: "✓", enterprise: "✓" },
  ]},
  { category: "Community", features: [
    { name: "Feed & Posts", starter: "Read-Only", creator: "Full Access", pro: "Full Access", enterprise: "Full Access" },
    { name: "Gruppen", starter: "—", creator: "5", pro: "Unbegrenzt", enterprise: "Unbegrenzt" },
    { name: "Marketplace Verkauf", starter: "—", creator: "—", pro: "✓", enterprise: "Featured" },
    { name: "Live-Streaming", starter: "—", creator: "—", pro: "—", enterprise: "✓" },
  ]},
  { category: "Builder & Scanner", features: [
    { name: "Builder-Projekte", starter: "1", creator: "5", pro: "20", enterprise: "Unbegrenzt" },
    { name: "Scanner-Analysen", starter: "3/Monat", creator: "25/Monat", pro: "Echtzeit", enterprise: "Unbegrenzt" },
    { name: "CSV/PDF Export", starter: "—", creator: "✓", pro: "✓", enterprise: "✓" },
  ]},
  { category: "SchulLabor", features: [
    { name: "Simulationen", starter: "3", creator: "Alle", pro: "Alle", enterprise: "Alle + Custom" },
    { name: "KI-Tutor", starter: "—", creator: "✓", pro: "✓", enterprise: "✓" },
    { name: "Klassen-Dashboard", starter: "—", creator: "✓", pro: "✓", enterprise: "✓" },
  ]},
  { category: "Link-Magic", features: [
    { name: "Anzeigen / Monat", starter: "10", creator: "100", pro: "Unbegrenzt", enterprise: "Unbegrenzt" },
    { name: "Plattformen", starter: "2", creator: "Alle", pro: "Alle", enterprise: "Alle" },
    { name: "Video-Ads", starter: "—", creator: "—", pro: "✓", enterprise: "✓" },
  ]},
  { category: "Support & Extras", features: [
    { name: "Support", starter: "Community", creator: "E-Mail", pro: "Priority", enterprise: "Dedicated" },
    { name: "API-Zugang", starter: "—", creator: "—", pro: "✓", enterprise: "✓" },
    { name: "Team-Accounts", starter: "—", creator: "—", pro: "3", enterprise: "Unbegrenzt" },
    { name: "Custom Domain", starter: "—", creator: "—", pro: "✓", enterprise: "✓" },
    { name: "White-Label", starter: "—", creator: "—", pro: "—", enterprise: "✓" },
    { name: "SLA", starter: "—", creator: "—", pro: "99%", enterprise: "99.9%" },
  ]},
];

export default function PreisePage() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeTab, setActiveTab] = useState<"bundle" | "apps">("bundle");
  const { toast } = useToast();

  const handleCheckout = async (appName: string, tierName: string) => {
    try {
      const res = await apiRequest("POST", "/api/checkout", {
        appName,
        tierName,
        interval: isYearly ? "yearly" : "monthly",
      });
      const data = await res.json();
      if (data.type === "free") {
        toast({ title: "Aktiviert", description: "Kostenloser Plan ist aktiv." });
      } else if (data.type === "contact") {
        toast({ title: "Enterprise", description: "Wir kontaktieren Sie für ein individuelles Angebot." });
      } else if (data.type === "checkout") {
        toast({
          title: "Stripe Checkout",
          description: `Weiterleitung zu ${data.priceFormatted}/${isYearly ? "Jahr" : "Monat"} Checkout...`,
        });
        // In production: window.location.href = data.checkoutUrl;
      }
    } catch {
      toast({ title: "Fehler", description: "Checkout konnte nicht gestartet werden.", variant: "destructive" });
    }
  };

  const getPrice = (price: number) => {
    if (price === 0) return "0";
    if (isYearly) {
      const yearly = Math.round(price * 12 * 0.8);
      return (yearly / 12).toFixed(0);
    }
    return price.toString();
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary" data-testid="badge-pricing">
            <Package className="h-3 w-3 mr-1" />
            Preise & Pakete
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" data-testid="pricing-title">
            Ein Hub. <span className="text-primary">Alle RealSync Apps.</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-6">
            RealSync Dynamics ist dein zentraler App-Hub. Wähle das Gesamtpaket für alle Produkte oder abonniere einzelne Apps mit eigener Subdomain und individuellen Preisen.
          </p>

          {/* Toggle: Bundle vs. Einzel-Apps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "bundle" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("bundle")}
              data-testid="tab-bundle"
            >
              <Package className="h-3 w-3 inline mr-1" />
              RealSync Gesamtpaket
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "apps" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("apps")}
              data-testid="tab-apps"
            >
              <Sparkles className="h-3 w-3 inline mr-1" />
              Einzel-Apps
            </button>
          </div>

          {/* Yearly Toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-xs ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>Monatlich</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} data-testid="toggle-yearly" />
            <span className={`text-xs ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Jährlich
              <Badge variant="outline" className="ml-1.5 text-[10px] border-emerald-500/30 text-emerald-400">-20%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Bundle Plans */}
      {activeTab === "bundle" && (
        <section className="pb-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bundlePlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 transition-all duration-300 hover:scale-[1.02] ${
                  plan.highlight
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/50 bg-card/50"
                }`}
                data-testid={`plan-${plan.name.toLowerCase()}`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[10px]">
                    <Star className="h-2.5 w-2.5 mr-0.5" />
                    {plan.badge}
                  </Badge>
                )}
                <div className="mb-4">
                  <h3 className="text-sm font-bold tracking-wider">{plan.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">{plan.description}</p>
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-bold">{getPrice(plan.price)}€</span>
                  <span className="text-xs text-muted-foreground ml-1">{plan.price > 0 ? plan.interval : ""}</span>
                  {isYearly && plan.price > 0 && (
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      Spare {Math.round(plan.price * 12 * 0.2)}€ / Jahr
                    </div>
                  )}
                </div>
                <Button
                  className={`w-full mb-4 text-xs h-8 ${plan.highlight ? "" : "variant-outline"}`}
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handleCheckout("realsync", plan.name.toLowerCase())}
                  data-testid={`btn-checkout-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[11px]">
                      <Check className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[11px] text-muted-foreground/50">
                      <X className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Individual App Pricing */}
      {activeTab === "apps" && (
        <section className="pb-16 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {appPricing.map((app) => {
              const Icon = app.icon;
              return (
                <div key={app.app} className="rounded-xl border border-border/50 bg-card/30 overflow-hidden" data-testid={`app-pricing-${app.app.toLowerCase()}`}>
                  {/* App Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${app.bgColor}`}>
                        <Icon className={`h-4 w-4 ${app.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">{app.app}</h3>
                        <p className="text-[11px] text-muted-foreground">{app.description}</p>
                      </div>
                    </div>
                    {(app as any).subdomain && (
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary/70 hidden sm:flex items-center gap-1">
                        <Globe className="h-2.5 w-2.5" />
                        {(app as any).subdomain}
                      </Badge>
                    )}
                  </div>
                  {/* Tiers Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/30">
                    {app.tiers.map((tier) => (
                      <div key={tier.name} className="p-4 hover:bg-accent/30 transition-colors">
                        <div className="text-xs font-medium mb-1">{tier.name}</div>
                        <div className="text-xl font-bold mb-2">
                          {getPrice(tier.price)}€
                          {tier.price > 0 && <span className="text-[10px] text-muted-foreground font-normal">/Mo</span>}
                        </div>
                        <ul className="space-y-1 mb-3">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                              <Check className="h-2.5 w-2.5 text-primary mt-0.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-[10px]"
                          onClick={() => handleCheckout(app.app.toLowerCase(), tier.name.toLowerCase())}
                          data-testid={`btn-${app.app.toLowerCase()}-${tier.name.toLowerCase()}`}
                        >
                          {tier.price === 0 ? "Kostenlos" : "Auswählen"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Feature-Vergleichstabelle ─── */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-2" data-testid="comparison-title">Detaillierter Feature-Vergleich</h2>
          <p className="text-xs text-muted-foreground text-center mb-8">
            Was ist in jedem Paket für jede App enthalten?
          </p>

          <div className="rounded-xl border border-border/50 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-card/50 border-b border-border/30">
              <div className="p-3 text-xs font-medium text-muted-foreground">Feature</div>
              <div className="p-3 text-xs font-bold text-center">STARTER<div className="text-[10px] font-normal text-muted-foreground">0€</div></div>
              <div className="p-3 text-xs font-bold text-center text-primary">CREATOR<div className="text-[10px] font-normal">19€/Mo</div></div>
              <div className="p-3 text-xs font-bold text-center">PRO<div className="text-[10px] font-normal text-muted-foreground">49€/Mo</div></div>
              <div className="p-3 text-xs font-bold text-center">ENTERPRISE<div className="text-[10px] font-normal text-muted-foreground">149€/Mo</div></div>
            </div>

            {comparisonFeatures.map((cat) => (
              <div key={cat.category}>
                {/* Category Header */}
                <div className="grid grid-cols-5 bg-accent/30 border-b border-border/20">
                  <div className="col-span-5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {cat.category}
                  </div>
                </div>
                {/* Rows */}
                {cat.features.map((feat, fi) => (
                  <div key={fi} className="grid grid-cols-5 border-b border-border/10 hover:bg-accent/10 transition-colors">
                    <div className="p-2.5 text-[11px] text-muted-foreground">{feat.name}</div>
                    <div className={`p-2.5 text-[11px] text-center ${feat.starter === "✓" ? "text-emerald-400" : feat.starter === "—" ? "text-muted-foreground/30" : ""}`}>{feat.starter}</div>
                    <div className={`p-2.5 text-[11px] text-center font-medium ${feat.creator === "✓" ? "text-emerald-400" : feat.creator === "—" ? "text-muted-foreground/30" : ""}`}>{feat.creator}</div>
                    <div className={`p-2.5 text-[11px] text-center ${feat.pro === "✓" ? "text-emerald-400" : feat.pro === "—" ? "text-muted-foreground/30" : ""}`}>{feat.pro}</div>
                    <div className={`p-2.5 text-[11px] text-center ${feat.enterprise === "✓" ? "text-emerald-400" : feat.enterprise === "—" ? "text-muted-foreground/30" : ""}`}>{feat.enterprise}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Savings Banner */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
            <Crown className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">
              RealSync Gesamtpaket — Spare bis zu 60%
            </h3>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto mb-4">
              Statt alle 5 Apps einzeln zu buchen (ab 66€/Mo), bekomme alles im RealSync Pro-Paket für nur 49€/Mo.
              Das ist ein Ersparnis von über 200€ pro Jahr.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                <Shield className="h-2.5 w-2.5 mr-1" /> CreatorSeal
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Bot className="h-2.5 w-2.5 mr-1" /> Optimus
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Layers className="h-2.5 w-2.5 mr-1" /> Builder
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <TrendingUp className="h-2.5 w-2.5 mr-1" /> Scanner
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Users className="h-2.5 w-2.5 mr-1" /> Community
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <GraduationCap className="h-2.5 w-2.5 mr-1" /> SchulLabor
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Wand2 className="h-2.5 w-2.5 mr-1" /> Link-Magic
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-center mb-6">Häufige Fragen</h2>
          <div className="space-y-3">
            {[
              { q: "Kann ich jederzeit kündigen?", a: "Ja, alle Pläne sind monatlich kündbar. Bei Jahreszahlung erhalten Sie 20% Rabatt und können zum Ende der Laufzeit kündigen." },
              { q: "Was passiert mit meinen Daten beim Downgrade?", a: "Ihre Daten bleiben erhalten. Bei einem Downgrade werden Premium-Features deaktiviert, aber alle Inhalte bleiben geschützt." },
              { q: "Gibt es eine Testphase?", a: "Ja, der Starter-Plan ist dauerhaft kostenlos. Zudem bieten wir 14 Tage Geld-zurück-Garantie auf alle bezahlten Pläne." },
              { q: "Funktionieren die KI-Agenten wirklich kostenlos?", a: "Ja. Unser KI-Model-Router nutzt rotierende kostenlose Modelle von OpenRouter, Groq, HuggingFace, Cloudflare und Google Gemini. Im Starter-Plan sind 5 Tasks pro Tag inklusive." },
              { q: "Was ist der Unterschied zwischen Einzel-Apps und Gesamtpaket?", a: "Im Gesamtpaket erhalten Sie alle 5 Apps zu einem reduzierten Preis. Einzeln buchbar sind die Apps teurer, bieten aber Flexibilität für spezifische Bedürfnisse." },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-border/50 rounded-lg">
                <summary className="flex items-center justify-between px-4 py-3 text-xs font-medium cursor-pointer hover:bg-accent/30 transition-colors">
                  {q}
                  <Zap className="h-3 w-3 text-muted-foreground group-open:rotate-45 transition-transform" />
                </summary>
                <div className="px-4 pb-3 text-[11px] text-muted-foreground">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
