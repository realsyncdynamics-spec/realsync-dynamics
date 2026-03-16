import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Globe,
  Layers,
  TrendingUp,
  Server,
  Lock,
  Link2,
  Cpu,
  Zap,
  CreditCard,
  ArrowRight,
  Sparkles,
  Star,
  Flag,
  Brain,
  Fingerprint,
  Quote,
  Upload,
  Share2,
  Check,
  X,
  Users,
  FileCheck,
  Activity,
  Award,
} from "lucide-react";

/* ── Typing text effect for hero headline ── */
function TypingText() {
  const phrases = [
    "der digitalen Innovation",
    "des Content-Schutzes",
    "der Creator-Economy",
    "des europäischen Internets",
  ];
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState(phrases[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Wait 2.5s before starting the animation so the first phrase is fully visible on load
    if (!started) {
      const init = setTimeout(() => {
        setStarted(true);
        setIsDeleting(true);
      }, 2500);
      return () => clearTimeout(init);
    }

    const phrase = phrases[currentPhrase];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(phrase.substring(0, displayText.length + 1));
          if (displayText.length === phrase.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayText(phrase.substring(0, displayText.length - 1));
          if (displayText.length === 0) {
            setIsDeleting(false);
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? 30 : 80,
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhrase, started]);

  return (
    <>
      {displayText}
      <span className="animate-blink text-primary">|</span>
    </>
  );
}

/* ── Count-up animation for stat numbers ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <>
      {count}
      {suffix}
    </>
  );
}

/* ── Static data ── */
const apps = [
  {
    name: "CreatorSeal",
    description: "Schütze deine Inhalte. Barcodes, Blockchain, unsichtbare Wasserzeichen.",
    icon: Shield,
    href: "/creatorseal",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-400",
  },
  {
    name: "RealSync Optimus",
    badge: "KOSTENLOS",
    description: "KI-Agenten mit kostenlosem Model-Router — 9 Modelle, 6 Provider weltweit.",
    icon: Globe,
    href: "/optimus",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    name: "Multi-App Builder",
    description: "Baue SaaS-Apps mit KI. Alle Modelle, eine Plattform.",
    icon: Layers,
    href: "/builder",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400",
  },
  {
    name: "Market Scanner",
    description: "Erkenne Marktlücken automatisch. KI-gestützte Trendanalyse.",
    icon: TrendingUp,
    href: "/scanner",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
  },
  {
    name: "Community",
    description: "Creator-Netzwerk, Marketplace, Gruppen & verifizierte Profile.",
    icon: Users,
    href: "/community",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
];

const features = [
  {
    title: "EU-Hosted",
    description: "Alle Daten auf deutschen Servern. Frankfurt am Main.",
    icon: Server,
  },
  {
    title: "DSGVO-konform",
    description: "Von Grund auf für europäischen Datenschutz konzipiert.",
    icon: Lock,
  },
  {
    title: "Blockchain",
    description: "Polygon-basierte Verifizierung für maximale Transparenz.",
    icon: Link2,
  },
  {
    title: "KI-Powered",
    description: "GPT, Gemini, Claude & DeepSeek in einer Plattform.",
    icon: Cpu,
  },
  {
    title: "Automatisierung",
    description: "Workflows die 24/7 für dich arbeiten.",
    icon: Zap,
  },
  {
    title: "Stripe-Ready",
    description: "Monetarisierung ab Tag 1. Sofort startklar.",
    icon: CreditCard,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Inhalt hochladen",
    description: "Lade deinen Content hoch — Bilder, Videos, Audio, Dokumente oder Text. Drag & Drop oder manuell.",
    icon: Upload,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    step: 2,
    title: "Automatisch schützen",
    description: "SHA-256 Hashing, Blockchain-Registrierung und unsichtbare Wasserzeichen — alles automatisch in Sekunden.",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    step: 3,
    title: "Verifiziert teilen",
    description: "Teile deine Inhalte mit nachweisbarer Authentizität. Jeder kann die Echtheit überprüfen.",
    icon: Share2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const comparisonFeatures = [
  { feature: "SHA-256 Hashing", realsync: true, others: "Teilweise" },
  { feature: "C2PA Zertifikate", realsync: true, others: false },
  { feature: "Blockchain-Verifizierung", realsync: true, others: false },
  { feature: "Unsichtbare Wasserzeichen", realsync: true, others: false },
  { feature: "Creator-Profil", realsync: true, others: "Teilweise" },
  { feature: "DSGVO-konform", realsync: true, others: false },
  { feature: "EU-Server", realsync: true, others: false },
  { feature: "All-in-One Plattform", realsync: true, others: false },
];

const trustBadges = [
  { label: "DSGVO Konform", icon: Lock, description: "Europäischer Datenschutz" },
  { label: "ISO 27001", icon: Award, description: "Informationssicherheit" },
  { label: "EU Cloud Code", icon: Server, description: "EU Cloud-Standards" },
  { label: "Made in Germany", icon: Flag, description: "Deutsche Qualität" },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section — Upgraded with typing effect, grid pattern, floating elements */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 animate-gradient" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-[10%] w-3 h-3 rounded-full bg-primary/30 animate-float" />
        <div className="absolute top-40 right-[15%] w-2 h-2 rounded-sm bg-purple-400/30 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 rounded-full bg-cyan-400/20 animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Plattform v2.0 — Jetzt verfügbar
          </Badge>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up stagger-1">
            <span className="text-gradient">Die Zukunft</span>
            <br />
            <span className="h-[1.2em] inline-block">
              <TypingText />
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 animate-fade-in-up stagger-2">
            RealSync Dynamics vereint Content-Schutz, Social Media, App-Entwicklung und Marktanalyse
            in einer einzigen, KI-gestützten Plattform — made in Germany.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
            <Link href="/creatorseal">
              <Button size="lg" className="px-7 py-2.5 text-sm animate-pulse-glow" data-testid="hero-cta-start">
                Jetzt starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/preise">
              <Button size="lg" variant="outline" className="px-7 py-2.5 text-sm" data-testid="hero-cta-pricing">
                Preise ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar — with CountUp animation */}
      <section className="border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-center">
            <div className="animate-fade-in-up">
              <span className="text-2xl sm:text-3xl font-display font-bold text-primary">
                <CountUp target={5} />
              </span>
              <span className="text-2xl sm:text-3xl font-display font-bold ml-1.5">Apps</span>
            </div>
            <div className="hidden sm:block text-xl text-muted-foreground">|</div>
            <div className="animate-fade-in-up stagger-1">
              <span className="text-2xl sm:text-3xl font-display font-bold text-primary">1</span>
              <span className="text-2xl sm:text-3xl font-display font-bold ml-1.5">Plattform</span>
            </div>
            <div className="hidden sm:block text-xl text-muted-foreground">|</div>
            <div className="animate-fade-in-up stagger-2">
              <span className="text-2xl sm:text-3xl font-display font-bold text-primary">∞</span>
              <span className="text-2xl sm:text-3xl font-display font-bold ml-1.5">Möglichkeiten</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wie es funktioniert — 3-Step Process */}
      <section className="py-16 sm:py-24" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Zap className="h-3.5 w-3.5 mr-2" />
              So einfach geht's
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Wie es funktioniert
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              In drei einfachen Schritten sind deine Inhalte geschützt und verifizierbar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`relative text-center group animate-fade-in-up stagger-${index + 1}`}
                  data-testid={`how-step-${item.step}`}
                >
                  {/* Connector line between steps (desktop only) */}
                  {item.step < 3 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                  <div className={`w-20 h-20 mx-auto rounded-2xl ${item.bg} flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-9 w-9" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-base max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* App Cards Grid — with staggered scale-in */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Unsere Produkte
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vier leistungsstarke Apps, die zusammen ein komplettes digitales Ökosystem bilden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app, index) => {
              const Icon = app.icon;
              return (
                <Link key={app.name} href={app.href}>
                  <Card
                    className={`group cursor-pointer border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden h-full animate-scale-in stagger-${index + 1}`}
                    data-testid={`app-card-${app.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <CardHeader className="relative">
                      <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ${app.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-display flex items-center gap-2">
                        {app.name}
                        {(app as any).badge && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-500/50 text-green-400 font-mono">
                            {(app as any).badge}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-base">{app.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Button variant="ghost" className="group-hover:text-primary transition-colors p-0">
                        Starten
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warum RealSync? — Highlight Cards with animations */}
      <section className="py-16 sm:py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Star className="h-3.5 w-3.5 mr-2" />
              Unsere Stärken
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Warum RealSync?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Drei Säulen, die uns von allen anderen unterscheiden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="border-border/50 hover:border-primary/20 transition-all duration-300 group animate-fade-in-up stagger-1"
              data-testid="highlight-made-in-germany"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 text-red-400 group-hover:scale-110 transition-transform">
                  <Flag className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-display">Made in Germany</CardTitle>
                <CardDescription className="text-base">
                  Entwickelt in Thüringen, gehostet in Frankfurt. Alle Daten bleiben in Deutschland — garantiert durch deutsche Serverinfrastruktur und strenge DSGVO-Konformität.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="border-border/50 hover:border-primary/20 transition-all duration-300 group animate-fade-in-up stagger-2"
              data-testid="highlight-ki-gestuetzt"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-display">KI-gestützt</CardTitle>
                <CardDescription className="text-base">
                  GPT-4, Gemini, Claude und DeepSeek — alle führenden KI-Modelle in einer einzigen Plattform. Automatisierte Workflows, die rund um die Uhr für dich arbeiten.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="border-border/50 hover:border-primary/20 transition-all duration-300 group animate-fade-in-up stagger-3"
              data-testid="highlight-blockchain-verifiziert"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-display">Blockchain-verifiziert</CardTitle>
                <CardDescription className="text-base">
                  Polygon-basierte Verifizierung, unsichtbare Wasserzeichen und SHA-256-Hashing schützen deine Inhalte — transparent, fälschungssicher und dezentral.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Weltweit vertrauenswürdig — Stats + Comparison */}
      <section className="py-16 sm:py-24" data-testid="trust-stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Globe className="h-3.5 w-3.5 mr-2" />
              Globales Vertrauen
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Weltweit vertrauenswürdig
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Creator auf der ganzen Welt verlassen sich auf RealSync Dynamics zum Schutz ihrer digitalen Inhalte.
            </p>
          </div>

          {/* Stats Grid — with staggered animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: "50.000+", label: "Creator", icon: Users, color: "text-amber-400" },
              { value: "1M+", label: "Geschützte Inhalte", icon: FileCheck, color: "text-emerald-400" },
              { value: "99,9%", label: "Verfügbarkeit", icon: Activity, color: "text-purple-400" },
              { value: "100%", label: "DSGVO-konform", icon: Shield, color: "text-orange-400" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={i}
                  className={`border-border/50 text-center hover:border-primary/20 transition-all duration-300 animate-scale-in stagger-${i + 1}`}
                  data-testid={`trust-stat-${i}`}
                >
                  <CardHeader className="pb-2">
                    <div className={`w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-3 ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-primary">{stat.value}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Table — with border animation */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-xl font-bold text-center mb-6">
              RealSync vs. Andere Plattformen
            </h3>
            <div className="rounded-xl border border-border/50 overflow-hidden animate-border-gradient" data-testid="comparison-table">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-card/80">
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Feature</th>
                      <th className="text-center px-6 py-4 text-sm font-bold text-primary">RealSync</th>
                      <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Andere</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-t border-border/30 ${i % 2 === 0 ? "bg-card/30" : ""}`}
                      >
                        <td className="px-6 py-3.5 text-sm">{row.feature}</td>
                        <td className="px-6 py-3.5 text-center">
                          <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          {row.others === true ? (
                            <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                          ) : row.others === false ? (
                            <X className="h-5 w-5 text-red-400 mx-auto" />
                          ) : (
                            <span className="text-sm text-yellow-400">{row.others}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof — with staggered animations */}
      <section className="py-16 sm:py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Quote className="h-3.5 w-3.5 mr-2" />
              Stimmen unserer Nutzer
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Was Creator sagen
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tausende digitale Schöpfer vertrauen bereits auf RealSync Dynamics.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Vertraut von <span className="text-primary font-bold">50.000+</span> Creatorn
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                role: "YouTuberin & Fotografin",
                quote:
                  "Seit ich CreatorSeal nutze, wurde keins meiner Bilder mehr ohne Genehmigung verwendet. Die Blockchain-Verifizierung gibt mir endlich Sicherheit.",
                stars: 5,
              },
              {
                name: "Thomas K.",
                role: "SaaS-Gründer",
                quote:
                  "Mit dem Multi-App Builder habe ich meinen MVP in zwei Wochen statt drei Monaten gebaut. Die KI-Unterstützung ist ein absoluter Game-Changer.",
                stars: 5,
              },
              {
                name: "Lisa W.",
                role: "Marketing-Beraterin",
                quote:
                  "Der Market Scanner hat mir Marktlücken aufgezeigt, die ich alleine nie gefunden hätte. Mein Umsatz ist seitdem um 40% gestiegen.",
                stars: 5,
              },
            ].map((testimonial, i) => (
              <Card
                key={i}
                className={`border-border/50 hover:border-primary/20 transition-all duration-300 animate-fade-in-up stagger-${i + 1}`}
                data-testid={`testimonial-${i}`}
              >
                <CardHeader>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.stars }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    „{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {testimonial.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-y border-border/50" data-testid="trust-badges-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center group animate-fade-in-up stagger-${i + 1}`}
                  data-testid={`trust-badge-${i}`}
                >
                  <div className="w-16 h-16 rounded-2xl border border-border/50 bg-card/50 flex items-center justify-center mb-3 text-primary group-hover:border-primary/30 transition-all duration-300 group-hover:scale-105">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="font-display font-bold text-sm">{badge.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner — with animated border */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-2xl border-2 border-transparent bg-gradient-to-br from-primary/10 to-purple-500/10 p-10 sm:p-14 overflow-hidden animate-border-gradient border-gradient-enterprise">
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Bereit für die Zukunft?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Schließe dich tausenden Creatorn an, die ihre digitalen Inhalte bereits mit RealSync Dynamics schützen und monetarisieren.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/creatorseal">
                  <Button size="lg" className="px-7 py-2.5 text-sm animate-pulse-glow" data-testid="banner-cta-start">
                    Kostenlos starten
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button size="lg" variant="outline" className="px-7 py-2.5 text-sm" data-testid="banner-cta-demo">
                    Demo anfordern
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Warum RealSync Dynamics?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Gebaut auf den Grundlagen von Vertrauen, Datenschutz und Innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={`border-border/50 hover:border-primary/20 transition-all duration-300 animate-scale-in stagger-${Math.min(index + 1, 5)}`}
                  data-testid={`feature-${feature.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA — Content Protection with floating shield */}
      <section className="py-16 sm:py-24" data-testid="final-cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-2xl border-2 border-transparent bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-10 sm:p-14 overflow-hidden animate-border-gradient border-gradient-enterprise">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="animate-float">
                <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Bereit, Ihren Content zu schützen?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Starte jetzt kostenlos und entdecke, wie RealSync Dynamics dein digitales Business transformiert.
                SHA-256 Hashing, Blockchain-Verifizierung und unsichtbare Wasserzeichen — alles in einer Plattform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/creatorseal">
                  <Button size="lg" className="px-7 py-2.5 text-sm animate-pulse-glow" data-testid="cta-start">
                    Kostenlos starten
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/preise">
                  <Button size="lg" variant="outline" className="px-7 py-2.5 text-sm" data-testid="cta-pricing">
                    Alle Preise ansehen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
