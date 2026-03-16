import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lightbulb,
  Lock,
  Award,
  ArrowRight,
  Cpu,
  Link2,
  Fingerprint,
  Users,
  Rocket,
  Building2,
  Target,
} from "lucide-react";

const values = [
  {
    title: "Vertrauen",
    description: "Blockchain-basierte Verifizierung schafft digitales Vertrauen, das nicht gefälscht werden kann.",
    icon: Shield,
    color: "text-blue-400",
  },
  {
    title: "Innovation",
    description: "KI-gestützte Technologie, die Creatorn und Unternehmen neue Möglichkeiten eröffnet.",
    icon: Lightbulb,
    color: "text-yellow-400",
  },
  {
    title: "Datenschutz",
    description: "DSGVO-konform von der ersten Zeile Code. Keine Cookies, kein Tracking — by Design.",
    icon: Lock,
    color: "text-green-400",
  },
  {
    title: "Qualität",
    description: "German Engineering trifft auf moderne Softwareentwicklung. Zuverlässig und skalierbar.",
    icon: Award,
    color: "text-purple-400",
  },
];

const team = [
  { name: "M. Schneider", role: "Gründer & CEO", initials: "MS", color: "bg-blue-500/20 text-blue-400" },
  { name: "L. Weber", role: "CTO", initials: "LW", color: "bg-green-500/20 text-green-400" },
  { name: "A. Fischer", role: "Head of Product", initials: "AF", color: "bg-purple-500/20 text-purple-400" },
  { name: "K. Müller", role: "Lead Designer", initials: "KM", color: "bg-orange-500/20 text-orange-400" },
];

const milestones = [
  { year: "2025", title: "Gründung", description: "Idee und Gründung von RealSync Dynamics in Thüringen", icon: Building2 },
  { year: "2026", title: "Plattform Launch", description: "Launch aller 4 Apps: CreatorSeal, Optimus, Builder, Scanner", icon: Rocket },
  { year: "Zukunft", title: "Enterprise & Global", description: "Internationalisierung und Enterprise-Partnerschaften", icon: Target },
];

export default function UeberUnsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Users className="h-3.5 w-3.5 mr-2" />
            Über uns
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Wir bauen <span className="text-gradient">Vertrauen</span> für das
            <br />digitale Zeitalter
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            German-engineered digital trust. Wir entwickeln Technologie, die Creator schützt,
            Authentizität beweist und die digitale Welt sicherer macht.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-primary">Unsere Vision</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                In einer Welt voller Deepfakes, KI-generierter Inhalte und digitaler Manipulation
                wird Vertrauen zur wertvollsten Ressource.
              </p>
              <p>
                RealSync Dynamics entstand aus der Überzeugung, dass Creator und Unternehmen
                Werkzeuge verdienen, die ihre digitale Identität schützen — transparent,
                nachprüfbar und DSGVO-konform. Unsere Plattform vereint kryptographische
                Verifizierung, KI-Innovation und kompromisslosen Datenschutz in einem Ökosystem,
                das in Deutschland entwickelt und gehostet wird.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-10 text-center">Unsere Werte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="border-border/50 hover:border-primary/20 transition-all duration-300"
                  data-testid={`value-${value.title.toLowerCase()}`}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 ${value.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Unser Team</h2>
            <p className="text-muted-foreground">Die Menschen hinter RealSync Dynamics</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card
                key={member.name}
                className="border-border/50 text-center"
                data-testid={`team-${member.initials.toLowerCase()}`}
              >
                <CardContent className="pt-8 pb-6">
                  <div className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 text-2xl font-display font-bold`}>
                    {member.initials}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Unsere Technologie</h2>
            <p className="text-muted-foreground">Modernste Technik für maximale Sicherheit</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <Link2 className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">Blockchain</h3>
                <p className="text-xs text-muted-foreground">Polygon-basierte Verifizierung für unveränderliche Nachweise</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <Cpu className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">KI-Modelle</h3>
                <p className="text-xs text-muted-foreground">GPT, Gemini, Claude & DeepSeek in einer Plattform</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <Fingerprint className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">SHA-256</h3>
                <p className="text-xs text-muted-foreground">Kryptographisches Hashing für sichere Content-Verifizierung</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <Lock className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">DSGVO-konform</h3>
                <p className="text-xs text-muted-foreground">Keine Cookies, kein Tracking — EU-Hosting in Deutschland</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-10 text-center">Meilensteine</h2>
          <div className="space-y-6">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={m.year} className="flex gap-4 items-start" data-testid={`milestone-${i}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="w-0.5 h-8 bg-border/50 mt-2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <Badge variant="secondary" className="mb-2">{m.year}</Badge>
                    <h3 className="font-semibold">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 p-12 sm:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                Werde Teil der Zukunft
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Starte kostenlos und entdecke, wie RealSync Dynamics dein digitales Business transformiert.
              </p>
              <Link href="/creatorseal">
                <Button size="lg" className="px-8" data-testid="about-cta-start">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
