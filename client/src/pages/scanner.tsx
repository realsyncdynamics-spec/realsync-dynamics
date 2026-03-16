import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Activity,
  Target,
  Clock,
  Zap,
  Cpu,
  Heart,
  DollarSign,
  GraduationCap,
  Leaf,
  Brain,
  Wrench,
  Loader2,
  Search,
  BarChart3,
  Bell,
  Globe,
  Eye,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  LineChart,
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Star,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { MarketGap } from "@shared/schema";

/* ─── Category Configs ─── */

const categoryIcons: Record<string, typeof Cpu> = {
  Tech: Wrench,
  Health: Heart,
  Finance: DollarSign,
  Education: GraduationCap,
  Green: Leaf,
  AI: Brain,
};

const categoryColors: Record<string, string> = {
  Tech: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Health: "bg-red-500/10 text-red-500 border-red-500/20",
  Finance: "bg-green-500/10 text-green-500 border-green-500/20",
  Education: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  AI: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const statusColors: Record<string, string> = {
  validated: "bg-green-500/10 text-green-500 border-green-500/20",
  detected: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  analyzing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

const statusLabels: Record<string, string> = {
  validated: "Validiert",
  detected: "Erkannt",
  analyzing: "Analyse",
};

/* ─── Live Trend Categories ─── */

const trendCategories = [
  { id: "tech", name: "Tech", icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10", score: 87, trend: "KI-gestützte Automatisierung", opportunity: "Sehr hoch" },
  { id: "health", name: "Health", icon: Heart, color: "text-red-400", bg: "bg-red-500/10", score: 74, trend: "Telemedizin-Plattformen", opportunity: "Hoch" },
  { id: "finance", name: "Finance", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10", score: 69, trend: "DeFi & Krypto-Staking", opportunity: "Mittel" },
  { id: "green", name: "Green", icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-500/10", score: 82, trend: "Carbon-Tracking-Tools", opportunity: "Sehr hoch" },
];

/* ─── KI-Analyse Cards ─── */

const analyseCards = [
  {
    title: "Trend-Erkennung",
    description: "KI analysiert Millionen von Datenpunkten in Echtzeit und erkennt aufkommende Trends, bevor sie den Mainstream erreichen. Früher handeln, mehr profitieren.",
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Wettbewerbsanalyse",
    description: "Automatische Überwachung von Konkurrenten — Preisänderungen, neue Features, Marketingstrategien. Immer einen Schritt voraus.",
    icon: Eye,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Marktprognose",
    description: "Prädiktive Modelle basierend auf historischen Daten und KI. Vorhersagen mit bis zu 94% Genauigkeit für fundierte Geschäftsentscheidungen.",
    icon: LineChart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

/* ─── Alert Types ─── */

const alertTypes = [
  { id: "trends", title: "Neue Trends", description: "Benachrichtigung bei neu erkannten Markttrends in deinen ausgewählten Kategorien.", icon: TrendingUp },
  { id: "prices", title: "Preisänderungen", description: "Alarme bei signifikanten Preisänderungen von Konkurrenten oder relevanten Produkten.", icon: DollarSign },
  { id: "competitors", title: "Wettbewerber-Aktivität", description: "Updates zu neuen Produkten, Features oder Kampagnen deiner Wettbewerber.", icon: Users },
];

/* ─── Scan Insight Generator ─── */

const insightPool = [
  { title: "Unerschlossener Nischenmarkt", description: "KI hat eine Marktlücke im Bereich der personalisierten Gesundheits-Apps für Senioren identifiziert. Wettbewerbsdichte: gering.", score: 91 },
  { title: "Wachsender Trend erkannt", description: "Nachhaltige Verpackungslösungen für D2C-Marken zeigen ein 340%-Wachstum im letzten Quartal.", score: 86 },
  { title: "Preislücke identifiziert", description: "Im mittleren Preissegment für KI-gestützte Buchhaltungssoftware fehlt ein europäisches Angebot mit DSGVO-Fokus.", score: 78 },
  { title: "Cross-Industry-Chance", description: "Die Kombination von Gaming und Bildung für berufliche Weiterbildung zeigt ungenutztes Potenzial.", score: 83 },
  { title: "Lokaler Markt unterversorgt", description: "DACH-Raum hat keinen etablierten Anbieter für KI-basierte Immobilienbewertung im Gewerbebereich.", score: 88 },
  { title: "Technologie-Lücke", description: "Open-Source-Alternativen zu Enterprise-CRM-Systemen mit nativer DSGVO-Unterstützung sind gefragt.", score: 75 },
];

export default function ScannerPage() {
  const { data: gaps = [], isLoading } = useQuery<MarketGap[]>({
    queryKey: ["/api/gaps"],
  });

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});

  // Scan simulator state
  const [scanKeyword, setScanKeyword] = useState("");
  const [scanRunning, setScanRunning] = useState(false);
  const [scanInsights, setScanInsights] = useState<Array<{ title: string; description: string; score: number }>>([]);

  // Alert toggles
  const [alertTrends, setAlertTrends] = useState(true);
  const [alertPrices, setAlertPrices] = useState(false);
  const [alertCompetitors, setAlertCompetitors] = useState(true);
  const alertStates = [alertTrends, alertPrices, alertCompetitors];
  const alertSetters = [setAlertTrends, setAlertPrices, setAlertCompetitors];

  // Animate trend score bars on mount
  useEffect(() => {
    if (gaps.length > 0) {
      const initial: Record<string, number> = {};
      gaps.forEach((g) => { initial[g.id] = 0; });
      setAnimatedScores(initial);

      const timeout = setTimeout(() => {
        const final: Record<string, number> = {};
        gaps.forEach((g) => { final[g.id] = g.trendScore ?? 0; });
        setAnimatedScores(final);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [gaps]);

  const handleStartScan = () => {
    setScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          toast({
            title: "Scan abgeschlossen",
            description: "2 neue Marktlücken erkannt",
          });
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 100);
  };

  const handleSimulateScan = useCallback(() => {
    if (!scanKeyword.trim()) {
      toast({ title: "Fehler", description: "Bitte gib eine Branche oder ein Keyword ein.", variant: "destructive" });
      return;
    }
    setScanRunning(true);
    setScanInsights([]);

    // Simulate 2-second analysis
    setTimeout(() => {
      // Pick 3 random insights
      const shuffled = [...insightPool].sort(() => Math.random() - 0.5);
      setScanInsights(shuffled.slice(0, 3));
      setScanRunning(false);
      toast({ title: "Analyse abgeschlossen", description: `3 Erkenntnisse für „${scanKeyword}" gefunden.` });
    }, 2000);
  }, [scanKeyword]);

  const filteredGaps = categoryFilter === "all"
    ? gaps
    : gaps.filter((g) => g.category === categoryFilter);

  const overallScore = 78;
  const categories = Array.from(new Set(gaps.map((g) => g.category)));

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-background to-amber-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
            <Activity className="h-3.5 w-3.5 mr-2" />
            Echtzeit-Marktanalyse
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Market Scanner
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-8">
            Erkenne Marktlücken automatisch. KI-gestützte Trendanalyse in Echtzeit.
            Datenbasierte Entscheidungen für dein Business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 text-base" onClick={handleStartScan} disabled={scanning} data-testid="hero-cta-scan">
              {scanning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              {scanning ? "Scanne..." : "Neue Analyse starten"}
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-base" data-testid="hero-cta-insights" onClick={() => document.getElementById("scan-simulator")?.scrollIntoView({ behavior: "smooth" })}>
              Markt analysieren
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Scan Progress */}
        {scanning && (
          <Card className="mb-8 border-primary/30" data-testid="scan-progress">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Marktanalyse läuft...</span>
                <span className="text-sm font-mono text-primary">{Math.min(100, Math.round(scanProgress))}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary rounded-full h-2.5 transition-all duration-150"
                  style={{ width: `${Math.min(100, scanProgress)}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Datenquellen werden analysiert
                </span>
                <span className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  KI-Modelle aktiv
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Trend Dashboard */}
        <section className="py-16" data-testid="trend-dashboard-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <BarChart3 className="h-3.5 w-3.5 mr-2" />
              Live-Daten
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Trend-Dashboard</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Echtzeit-Übersicht der wichtigsten Markttrends nach Kategorie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {trendCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.id}
                  className="hover:border-primary/20 transition-all duration-300 group"
                  data-testid={`trend-cat-${cat.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className={cat.score >= 80 ? "text-green-400 border-green-400/20" : cat.score >= 70 ? "text-blue-400 border-blue-400/20" : "text-yellow-400 border-yellow-400/20"}>
                        {cat.opportunity}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{cat.name}</CardTitle>
                    <CardDescription className="text-xs">{cat.trend}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Trend Score</span>
                        <span className="font-mono font-medium text-primary">{cat.score}/100</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all duration-1000 ease-out"
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Opportunity Score + Live Scanner row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Opportunity Score */}
            <Card className="lg:col-span-1" data-testid="opportunity-score">
              <CardHeader className="pb-2">
                <CardDescription>Gesamtbewertung</CardDescription>
                <CardTitle className="text-sm">Opportunity Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                    <circle
                      cx="60" cy="60" r="52"
                      stroke="hsl(217 91% 60%)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallScore / 100) * 327} 327`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-bold">{overallScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Hohe Marktchancen in 3 Kategorien erkannt
                </p>
              </CardContent>
            </Card>

            {/* Live Scanner */}
            <Card className="lg:col-span-2" data-testid="live-scanner">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardDescription>Echtzeit-Analyse</CardDescription>
                    <CardTitle className="text-sm">Live Scanner</CardTitle>
                  </div>
                  <Badge variant="secondary" className="gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Aktiv
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 flex items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => {
                      const angle = (i / 8) * Math.PI * 2;
                      const radius = 60 + (i % 3) * 20;
                      const left = 50 + Math.cos(angle) * radius / 3;
                      const top = 50 + Math.sin(angle) * radius / 3;
                      return (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            animationDelay: `${i * 0.3}s`,
                            opacity: 0.3 + (i % 3) * 0.2,
                          }}
                        />
                      );
                    })}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 rounded-full bg-primary relative">
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40" />
                      </div>
                    </div>
                    {[1, 2, 3].map((r) => (
                      <div
                        key={r}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
                        style={{ width: `${r * 80}px`, height: `${r * 80}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Letzte Analyse: vor 2 Minuten
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" />
                    {gaps.length} Marktlücken erkannt
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Market Gaps Table */}
        <section className="py-16" data-testid="gaps-table-section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">Marktlücken-Übersicht</h2>
              <p className="text-muted-foreground">Alle erkannten Chancen im Überblick — gefiltert und sortiert.</p>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                <SelectValue placeholder="Alle Kategorien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12" data-testid="gaps-loading">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Marktlücken werden geladen...</span>
            </div>
          )}

          {!isLoading && filteredGaps.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-1">Keine Marktlücken gefunden</p>
                <p className="text-sm">Versuche eine andere Kategorie oder starte eine neue Analyse.</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && filteredGaps.length > 0 && (
            <Card className="border-border/50" data-testid="gaps-table">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-3.5 px-4 font-medium text-muted-foreground">Kategorie</th>
                        <th className="text-left py-3.5 px-4 font-medium text-muted-foreground">Titel</th>
                        <th className="text-left py-3.5 px-4 font-medium text-muted-foreground">Trend-Score</th>
                        <th className="text-left py-3.5 px-4 font-medium text-muted-foreground">Chance</th>
                        <th className="text-left py-3.5 px-4 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGaps.map((gap, idx) => {
                        const Icon = categoryIcons[gap.category] || Zap;
                        const animScore = animatedScores[gap.id] ?? 0;
                        return (
                          <tr key={gap.id} className={`border-b border-border/30 hover:bg-muted/30 ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                            <td className="py-3.5 px-4">
                              <Badge variant="outline" className={categoryColors[gap.category]}>
                                <Icon className="h-3 w-3 mr-1" />
                                {gap.category}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4">
                              <div>
                                <p className="font-medium">{gap.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">{gap.description}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-20 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary rounded-full h-2 transition-all duration-1000 ease-out"
                                    style={{ width: `${animScore}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs w-8">{gap.trendScore}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge
                                variant="outline"
                                className={
                                  gap.opportunity === "hoch"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                }
                              >
                                <Target className="h-3 w-3 mr-1" />
                                {gap.opportunity}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge variant="outline" className={statusColors[gap.status ?? "detected"]}>
                                {statusLabels[gap.status ?? "detected"]}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Scan Simulator */}
        <section className="py-16" id="scan-simulator" data-testid="scan-simulator-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Search className="h-3.5 w-3.5 mr-2" />
              Marktanalyse
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Branche analysieren</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Gib eine Branche oder ein Keyword ein und lass die KI Marktchancen identifizieren.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-border/50 mb-8" data-testid="scan-simulator-card">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Input
                  placeholder="z.B. E-Commerce, HealthTech, FinTech, GreenEnergy..."
                  value={scanKeyword}
                  onChange={(e) => setScanKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSimulateScan()}
                  data-testid="input-scan-keyword"
                  className="flex-1"
                />
                <Button
                  onClick={handleSimulateScan}
                  disabled={scanRunning}
                  data-testid="btn-analyze"
                  className="px-6"
                >
                  {scanRunning ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Analysieren
                </Button>
              </div>

              {/* Loading state */}
              {scanRunning && (
                <div className="mt-6 flex flex-col items-center gap-3 py-8">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  </div>
                  <p className="text-sm text-muted-foreground animate-pulse">KI analysiert Marktdaten für „{scanKeyword}"...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scan Insights Results */}
          {scanInsights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto" data-testid="scan-insights">
              {scanInsights.map((insight, i) => (
                <Card
                  key={i}
                  className="border-border/50 hover:border-primary/20 transition-all duration-300 group"
                  data-testid={`insight-${i}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      <Badge variant="outline" className={insight.score >= 85 ? "text-green-400 border-green-400/20" : insight.score >= 75 ? "text-blue-400 border-blue-400/20" : "text-yellow-400 border-yellow-400/20"}>
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {insight.score}/100
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                    <CardDescription className="text-xs">{insight.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary rounded-full h-1.5 transition-all duration-700"
                        style={{ width: `${insight.score}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* KI-Analyse Section */}
        <section className="py-16" data-testid="ki-analyse-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Brain className="h-3.5 w-3.5 mr-2" />
              Intelligenz
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">KI-gestützte Analyse</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Drei Dimensionen der Marktintelligenz, angetrieben von modernster KI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyseCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className="border-border/50 hover:border-primary/20 transition-all duration-300 group text-center"
                  data-testid={`analyse-${card.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${card.bg} flex items-center justify-center mb-4 ${card.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-display">{card.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Alert Setup */}
        <section className="py-16" data-testid="alert-setup-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Bell className="h-3.5 w-3.5 mr-2" />
              Benachrichtigungen
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Benachrichtigungen einrichten</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Werde sofort informiert, wenn sich in deinen Märkten etwas Relevantes tut.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {alertTypes.map((alert, i) => {
              const Icon = alert.icon;
              const isActive = alertStates[i];
              const setActive = alertSetters[i];
              return (
                <Card
                  key={alert.id}
                  className={`border-border/50 transition-all duration-300 ${isActive ? "border-primary/30 bg-primary/[0.02]" : ""}`}
                  data-testid={`alert-${alert.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"} flex items-center justify-center transition-colors`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={setActive}
                        data-testid={`switch-alert-${alert.id}`}
                      />
                    </div>
                    <CardTitle className="text-base">{alert.title}</CardTitle>
                    <CardDescription className="text-sm">{alert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={isActive ? "secondary" : "outline"} className={isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : ""}>
                      {isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aktiv
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Inaktiv
                        </>
                      )}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16" data-testid="statistics-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <BarChart3 className="h-3.5 w-3.5 mr-2" />
              Statistiken
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Unsere Zahlen</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Die Leistung des Market Scanners in Zahlen.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2.847", label: "Analysierte Märkte", icon: Globe, color: "text-blue-400" },
              { value: "12.394", label: "Erkannte Trends", icon: TrendingUp, color: "text-emerald-400" },
              { value: "891", label: "Marktlücken", icon: Target, color: "text-purple-400" },
              { value: "94%", label: "Erfolgsrate", icon: Star, color: "text-orange-400" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={i}
                  className="border-border/50 text-center hover:border-primary/20 transition-all duration-300"
                  data-testid={`stat-${i}`}
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
        </section>

        {/* Bottom CTA */}
        <section className="py-16 pb-24" data-testid="scanner-cta-section">
          <Card className="border-primary/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            <CardContent className="relative py-16 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Bereit, deinen Markt zu analysieren?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Starte jetzt kostenlos mit dem Market Scanner. Erkenne Marktlücken,
                bevor deine Konkurrenten es tun.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="px-8" onClick={handleStartScan} disabled={scanning} data-testid="cta-scanner-start">
                  {scanning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                  Analyse starten
                </Button>
                <Button size="lg" variant="outline" className="px-8" onClick={() => document.getElementById("scan-simulator")?.scrollIntoView({ behavior: "smooth" })} data-testid="cta-scanner-keyword">
                  Keyword analysieren
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
