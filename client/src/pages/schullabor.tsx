import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppInfoSection } from "@/components/AppInfoSection";
import {
  GraduationCap,
  Microscope,
  Atom,
  Beaker,
  Dna,
  Zap,
  FlaskConical,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle,
  BookOpen,
  Monitor,
  Globe,
  Shield,
  Users,
  BarChart3,
  Cpu,
  Layers,
  Target,
  Award,
  Lightbulb,
  Eye,
  Volume2,
  Timer,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   SIMULATIONS
   ═══════════════════════════════════════════════════════════════ */
interface Simulation {
  id: string;
  name: string;
  subject: string;
  icon: typeof Atom;
  color: string;
  bgColor: string;
  difficulty: "Einfach" | "Mittel" | "Fortgeschritten";
  description: string;
  grade: string;
  duration: string;
}

const simulations: Simulation[] = [
  {
    id: "chem-titration",
    name: "Säure-Base-Titration",
    subject: "Chemie",
    icon: Beaker,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    difficulty: "Mittel",
    description: "Titriere eine unbekannte Lösung mit einem Indikator. Beobachte den pH-Wert-Verlauf in Echtzeit.",
    grade: "Klasse 9-12",
    duration: "15 Min",
  },
  {
    id: "phys-pendel",
    name: "Pendel-Schwingung",
    subject: "Physik",
    icon: Atom,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    difficulty: "Einfach",
    description: "Verändere Länge, Masse und Auslenkung eines Pendels. Miss die Schwingungsdauer.",
    grade: "Klasse 7-10",
    duration: "10 Min",
  },
  {
    id: "bio-dna",
    name: "DNA-Replikation",
    subject: "Biologie",
    icon: Dna,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    difficulty: "Fortgeschritten",
    description: "Beobachte die DNA-Replikation Schritt für Schritt. Identifiziere Helikase, Primase und DNA-Polymerase.",
    grade: "Klasse 10-13",
    duration: "20 Min",
  },
  {
    id: "chem-elektrolyse",
    name: "Elektrolyse von Wasser",
    subject: "Chemie",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    difficulty: "Mittel",
    description: "Zerlege Wasser in Wasserstoff und Sauerstoff. Verändere Spannung und Elektrolyt-Konzentration.",
    grade: "Klasse 8-11",
    duration: "12 Min",
  },
  {
    id: "phys-optik",
    name: "Lichtbrechung & Linsen",
    subject: "Physik",
    icon: Eye,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    difficulty: "Mittel",
    description: "Experimentiere mit Konvex- und Konkavlinsen. Visualisiere Brennpunkt, Bild und Strahlengang.",
    grade: "Klasse 8-11",
    duration: "15 Min",
  },
  {
    id: "bio-photosynthese",
    name: "Photosynthese-Messung",
    subject: "Biologie",
    icon: Lightbulb,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    difficulty: "Einfach",
    description: "Miss die Sauerstoffproduktion einer Wasserpflanze unter verschiedenen Lichtbedingungen.",
    grade: "Klasse 7-10",
    duration: "10 Min",
  },
];

/* ═══════════════════════════════════════════════════════════════
   ACTIVE SIMULATION
   ═══════════════════════════════════════════════════════════════ */
function SimulationRunner({ sim, onBack }: { sim: Simulation; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [value, setValue] = useState(50);
  const Icon = sim.icon;

  const steps = [
    "Material vorbereiten",
    "Experiment aufbauen",
    "Messung durchführen",
    "Ergebnisse auswerten",
    "Protokoll erstellen",
  ];

  const handleRun = () => {
    setRunning(true);
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-4 gap-1 text-xs" onClick={onBack}>
        <RotateCcw className="h-3 w-3" /> Zurück zur Übersicht
      </Button>

      <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
        {/* Header */}
        <div className={`p-6 border-b border-border/30 ${sim.bgColor}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-background/80`}>
              <Icon className={`h-6 w-6 ${sim.color}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{sim.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{sim.subject}</Badge>
                <Badge variant="outline" className="text-[10px]">{sim.grade}</Badge>
                <Badge variant="outline" className="text-[10px]">
                  <Timer className="h-2.5 w-2.5 mr-0.5" />{sim.duration}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Area */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-6">{sim.description}</p>

          {/* Visual Simulation Placeholder */}
          <div className="rounded-xl bg-background/50 border border-border/30 p-8 mb-6 text-center min-h-[200px] flex flex-col items-center justify-center">
            <Icon className={`h-16 w-16 ${sim.color} mb-4 ${running ? "animate-pulse" : ""}`} />
            <p className="text-xs text-muted-foreground">
              {running ? "Simulation läuft..." : step >= steps.length - 1 ? "Simulation abgeschlossen" : "Simulation bereit"}
            </p>

            {/* Value slider visual */}
            <div className="mt-4 w-full max-w-sm">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Wert: {value}%</span>
                <span>{sim.subject === "Chemie" ? "pH " + (value / 7.14).toFixed(1) : sim.subject === "Physik" ? (value * 0.05).toFixed(1) + " m/s" : (value * 0.4).toFixed(0) + " µmol/L"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Steps Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
              <span>Fortschritt</span>
              <span>{step + 1} / {steps.length}</span>
            </div>
            <Progress value={((step + 1) / steps.length) * 100} className="h-2" />
            <div className="mt-3 space-y-1.5">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {i <= step ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-border/50 shrink-0" />
                  )}
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleRun}
              disabled={running || step >= steps.length - 1}
              className="gap-1"
              size="sm"
              data-testid="btn-run-sim"
            >
              <Play className="h-3 w-3" />
              {running ? "Läuft..." : step >= steps.length - 1 ? "Abgeschlossen" : "Starten"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setStep(0); setRunning(false); }}
              className="gap-1"
              data-testid="btn-reset-sim"
            >
              <RotateCcw className="h-3 w-3" /> Zurücksetzen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function SchulLaborPage() {
  const [activeSim, setActiveSim] = useState<Simulation | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const subjects = ["all", "Chemie", "Physik", "Biologie"];
  const filtered = filterSubject === "all" ? simulations : simulations.filter((s) => s.subject === filterSubject);

  if (activeSim) {
    return (
      <div className="min-h-screen py-8 px-4">
        <SimulationRunner sim={activeSim} onBack={() => setActiveSim(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            <GraduationCap className="h-3 w-3 mr-1" />
            RealSync SchulLabor
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" data-testid="schullabor-title">
            Virtuelle Labor-Simulatoren <span className="text-cyan-400">für den Unterricht</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Interaktive Experimente in Chemie, Physik und Biologie — direkt im Browser.
            Kein Labor nötig, keine Chemikalien, keine Gefahr. Perfekt für Schulen, Universitäten und Selbstlerner.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Simulationen", value: "24+", icon: FlaskConical },
            { label: "Fächer", value: "3", icon: BookOpen },
            { label: "Klassen", value: "7-13", icon: GraduationCap },
            { label: "Schulen nutzen es", value: "150+", icon: Users },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/30 p-4 text-center">
              <s.icon className="h-4 w-4 text-cyan-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter */}
      <section className="pb-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 justify-center">
          {subjects.map((s) => (
            <button
              key={s}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterSubject === s ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-accent/50 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setFilterSubject(s)}
              data-testid={`filter-${s.toLowerCase()}`}
            >
              {s === "all" ? "Alle Fächer" : s}
            </button>
          ))}
        </div>
      </section>

      {/* Simulations Grid */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sim) => {
            const Icon = sim.icon;
            return (
              <Card
                key={sim.id}
                className="bg-card/30 border-border/50 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveSim(sim)}
                data-testid={`sim-${sim.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${sim.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-4 w-4 ${sim.color}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[9px] ${
                        sim.difficulty === "Einfach" ? "border-emerald-500/30 text-emerald-400" :
                        sim.difficulty === "Mittel" ? "border-amber-500/30 text-amber-400" :
                        "border-red-500/30 text-red-400"
                      }`}
                    >
                      {sim.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm mt-2">{sim.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[11px] text-muted-foreground mb-3">{sim.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px]">{sim.subject}</Badge>
                    <Badge variant="outline" className="text-[9px]">{sim.grade}</Badge>
                    <Badge variant="outline" className="text-[9px]">
                      <Timer className="h-2 w-2 mr-0.5" />{sim.duration}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── App Info Section ── */}
      <AppInfoSection
        appName="SchulLabor"
        tagline="Das virtuelle Labor für Schulen & Universitäten"
        accentColor="text-cyan-400"
        accentBg="bg-cyan-500/10"
        description={`RealSync SchulLabor ist eine EdTech-Plattform, die naturwissenschaftliche Experimente als interaktive Browser-Simulationen bereitstellt. Schüler und Studierende können Chemie-, Physik- und Biologie-Experimente durchführen — ohne physisches Labor, ohne Chemikalien, ohne Risiko.

Jede Simulation basiert auf realen wissenschaftlichen Modellen und ist an die Lehrpläne der deutschen Bundesländer angepasst. Lehrkräfte können den Fortschritt ihrer Klassen in Echtzeit verfolgen, Experimente zuweisen und Ergebnisse auswerten.

Die Plattform ist DSGVO-konform, läuft auf allen Endgeräten (Desktop, Tablet, Smartphone) und benötigt keine Installation. Schulen können SchulLabor direkt über ihren Browser nutzen — ideal für den hybriden Unterricht und Homeschooling.`}
        features={[
          { icon: FlaskConical, title: "Interaktive Simulationen", description: "24+ Experimente in Chemie, Physik und Biologie. Veränderbare Parameter, Echtzeit-Messdaten und visuelle Darstellungen." },
          { icon: GraduationCap, title: "Lehrplan-konform", description: "Alle Simulationen sind an die Lehrpläne der 16 Bundesländer angepasst. Klasse 7-13 abgedeckt." },
          { icon: BarChart3, title: "Lehrer-Dashboard", description: "Lehrkräfte verfolgen den Fortschritt der Klasse, weisen Experimente zu und exportieren Ergebnisse als PDF." },
          { icon: Shield, title: "DSGVO-konform", description: "Keine personenbezogenen Daten ohne Einwilligung. Hosting auf deutschen Servern. Schüler-Accounts anonym möglich." },
          { icon: Monitor, title: "Cross-Platform", description: "Läuft auf jedem Gerät mit Browser — Desktop, Tablet, Smartphone. Keine Installation erforderlich." },
          { icon: Sparkles, title: "KI-Tutor", description: "Der integrierte KI-Assistent erklärt Konzepte, gibt Hinweise bei Fehlern und erstellt individuelle Übungsaufgaben." },
        ]}
        techStack={[
          { name: "React + Three.js", description: "3D-Visualisierungen und interaktive UI-Komponenten für immersive Simulationen." },
          { name: "WebGL / Canvas 2D", description: "Hardware-beschleunigte Grafiken für flüssige Animationen auch auf älteren Geräten." },
          { name: "PhysicsJS + ChemDoodle", description: "Physik-Engine für realistische Simulationen. ChemDoodle für Molekül-Rendering." },
          { name: "Express + PostgreSQL", description: "Backend für Benutzer-Verwaltung, Fortschritts-Tracking und Klassen-Management." },
          { name: "RealSync AI Router", description: "Kostenlose KI-Modelle für den integrierten Tutor und Aufgaben-Generator." },
          { name: "Stripe Subscriptions", description: "Schullizenzen und Einzelabos über Stripe. Monats- und Jahresmodelle." },
        ]}
        pricingTiers={[
          { name: "Schüler", price: "0€" },
          { name: "Lehrer", price: "9€/Mo", highlight: true },
          { name: "Schule", price: "49€/Mo" },
          { name: "Bundesland", price: "Auf Anfrage" },
        ]}
        roadmap={[
          { quarter: "Q1 2026", title: "Launch mit 24 Simulationen", description: "Chemie, Physik, Biologie — Klasse 7-13. Web-basiert, alle Bundesländer.", status: "done" },
          { quarter: "Q2 2026", title: "VR-Integration (Meta Quest)", description: "Immersive VR-Labore für Meta Quest 3. Virtuelle Chemie-Labore zum Anfassen.", status: "in-progress" },
          { quarter: "Q3 2026", title: "Bundesland-Lizenzen", description: "Institutionelle Lizenzpakete für Schulträger. Bulk-Pricing, SSO, Admin-Dashboard.", status: "planned" },
          { quarter: "Q4 2026", title: "Mathematik-Simulationen", description: "Geometrie-Visualizer, Funktions-Plotter, Stochastik-Simulationen.", status: "planned" },
          { quarter: "2027", title: "AR Mobile Lab", description: "Augmented Reality auf Smartphone — Experimente im echten Klassenzimmer überlagern.", status: "planned" },
        ]}
      />
    </div>
  );
}
