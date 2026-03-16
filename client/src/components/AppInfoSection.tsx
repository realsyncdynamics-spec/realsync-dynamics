import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  CheckCircle,
  Zap,
  ArrowRight,
  Rocket,
  Code,
  Cpu,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Clock,
  Target,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
  icon: typeof CheckCircle;
  title: string;
  description: string;
}

interface RoadmapItem {
  quarter: string;
  title: string;
  description: string;
  status: "done" | "in-progress" | "planned";
}

interface TechItem {
  name: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  highlight?: boolean;
}

interface AppInfoSectionProps {
  appName: string;
  tagline: string;
  description: string;
  features: Feature[];
  techStack: TechItem[];
  roadmap: RoadmapItem[];
  pricingTiers: PricingTier[];
  accentColor?: string;
  accentBg?: string;
}

export function AppInfoSection({
  appName,
  tagline,
  description,
  features,
  techStack,
  roadmap,
  pricingTiers,
  accentColor = "text-primary",
  accentBg = "bg-primary/10",
}: AppInfoSectionProps) {
  return (
    <div className="space-y-12 pb-12">
      {/* ── Description ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-6 md:p-8">
          <Badge variant="outline" className={`mb-3 border-primary/30 ${accentColor}`}>
            <Zap className="h-3 w-3 mr-1" />
            Was ist {appName}?
          </Badge>
          <h2 className="text-xl font-bold mb-2" data-testid={`info-title-${appName.toLowerCase().replace(/\s+/g, "-")}`}>
            {tagline}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section className="max-w-5xl mx-auto px-4">
        <h3 className="text-lg font-bold text-center mb-6">
          Kernfunktionen
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-border/50 bg-card/30 p-5 hover:border-primary/30 transition-all duration-300 group"
                data-testid={`feature-${i}`}
              >
                <div className={`p-2 rounded-lg ${accentBg} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${accentColor}`} />
                </div>
                <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="max-w-4xl mx-auto px-4">
        <h3 className="text-lg font-bold text-center mb-6">
          <Code className="h-4 w-4 inline mr-2 text-primary" />
          Tech-Stack
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/30 bg-card/20 p-4"
            >
              <Cpu className={`h-4 w-4 ${accentColor} mt-0.5 shrink-0`} />
              <div>
                <span className="text-xs font-semibold">{t.name}</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stripe Pricing ── */}
      <section className="max-w-4xl mx-auto px-4">
        <h3 className="text-lg font-bold text-center mb-2">
          Preise & Pakete
        </h3>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Verfügbar als Einzelabo oder im RealSync Gesamtpaket
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {pricingTiers.map((tier, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 text-center transition-all hover:scale-[1.02] ${
                tier.highlight
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border/50 bg-card/30"
              }`}
            >
              <div className="text-xs font-bold tracking-wider mb-1">{tier.name}</div>
              <div className="text-2xl font-bold mb-2">{tier.price}</div>
              {tier.highlight && (
                <Badge className="text-[9px] bg-primary/20 text-primary border-0">Empfohlen</Badge>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href="/preise">
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
              Alle Preise vergleichen
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="max-w-4xl mx-auto px-4">
        <h3 className="text-lg font-bold text-center mb-2">
          <Rocket className="h-4 w-4 inline mr-2 text-primary" />
          Roadmap & Skalierung
        </h3>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Was als nächstes kommt — geplante Erweiterungen
        </p>
        <div className="space-y-3">
          {roadmap.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/30 p-4 hover:border-primary/20 transition-colors"
              data-testid={`roadmap-${i}`}
            >
              <div className="shrink-0">
                <Badge
                  variant="outline"
                  className={`text-[9px] ${
                    item.status === "done"
                      ? "border-emerald-500/30 text-emerald-400"
                      : item.status === "in-progress"
                      ? "border-amber-500/30 text-amber-400"
                      : "border-blue-500/30 text-blue-400"
                  }`}
                >
                  {item.quarter}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold">{item.title}</h4>
                  {item.status === "done" && (
                    <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                  )}
                  {item.status === "in-progress" && (
                    <Clock className="h-3 w-3 text-amber-400 shrink-0 animate-pulse" />
                  )}
                  {item.status === "planned" && (
                    <Target className="h-3 w-3 text-blue-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
