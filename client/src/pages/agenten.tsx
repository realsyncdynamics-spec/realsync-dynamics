import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Camera,
  Upload,
  Trophy,
  Shield,
  TrendingUp,
  Gift,
  ThumbsUp,
  Eye,
  Zap,
  Users,
  Target,
  ChevronUp,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  Sparkles,
  MessageSquare,
  Phone,
} from "lucide-react";
import type { ScreenshotSubmission, GrowthReward } from "@shared/schema";

const REALSYNC_APPS = [
  "CreatorSeal",
  "Optimus",
  "Builder",
  "Scanner",
  "Community",
  "SchulLabor",
  "Link-Magic",
  "Bildung",
];

const CATEGORIES = [
  { value: "bug", label: "Bug-Report", icon: AlertTriangle },
  { value: "feature", label: "Feature-Wunsch", icon: Sparkles },
  { value: "ux", label: "UX-Verbesserung", icon: Eye },
  { value: "performance", label: "Performance", icon: Zap },
  { value: "wettbewerb", label: "Wettbewerb", icon: Trophy },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    eingereicht: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    analysiert: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    in_bearbeitung: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    implementiert: "bg-green-500/20 text-green-400 border-green-500/30",
    abgelehnt: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels: Record<string, string> = {
    eingereicht: "Eingereicht",
    analysiert: "KI-Analysiert",
    in_bearbeitung: "In Bearbeitung",
    implementiert: "Implementiert",
    abgelehnt: "Abgelehnt",
  };
  return (
    <Badge className={`${colors[status] || "bg-gray-500/20 text-gray-400"} border text-[10px]`}>
      {labels[status] || status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority) return null;
  const colors: Record<string, string> = {
    critical: "bg-red-600/20 text-red-400",
    high: "bg-orange-500/20 text-orange-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-green-500/20 text-green-400",
  };
  return (
    <Badge className={`${colors[priority] || ""} text-[10px]`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const tiers: Record<string, { color: string; icon: typeof Star }> = {
    starter: { color: "text-gray-400", icon: Star },
    bronze: { color: "text-amber-600", icon: Award },
    silver: { color: "text-gray-300", icon: Award },
    gold: { color: "text-yellow-400", icon: Trophy },
    platinum: { color: "text-cyan-400", icon: Trophy },
    all_in_gratis: { color: "text-primary", icon: Gift },
  };
  const t = tiers[tier] || tiers.starter;
  const Icon = t.icon;
  return (
    <span className={`flex items-center gap-1 ${t.color} font-semibold text-xs`}>
      <Icon className="h-3.5 w-3.5" />
      {tier === "all_in_gratis" ? "ALL-IN GRATIS" : tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

export default function AgentenPage() {
  const [activeTab, setActiveTab] = useState("upload");

  // Form state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [category, setCategory] = useState("bug");
  const [appTarget, setAppTarget] = useState("");
  const [description, setDescription] = useState("");
  const [isWettbewerb, setIsWettbewerb] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [dataProcessingAgreed, setDataProcessingAgreed] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Queries
  const { data: screenshots = [], isLoading: screenshotsLoading } = useQuery<ScreenshotSubmission[]>({
    queryKey: ["/api/screenshots"],
  });
  const { data: leaderboard = [] } = useQuery<GrowthReward[]>({
    queryKey: ["/api/growth-rewards/leaderboard"],
  });
  const { data: growthStats } = useQuery<{
    totalUsers: number;
    totalScreenshots: number;
    implementedCount: number;
    gratisUnlocked: number;
    availableGratisSlots: number;
  }>({
    queryKey: ["/api/growth-rewards/stats"],
  });

  // Mutations
  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/screenshots", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/screenshots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/growth-rewards/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/growth-rewards/stats"] });
      toast({ title: "Erfolgreich eingereicht", description: `+${data.pointsAwarded} Punkte! KI-Analyse: ${data.aiPriority}` });
      setDescription("");
    },
    onError: () => {
      toast({ title: "Fehler", description: "Screenshot konnte nicht eingereicht werden", variant: "destructive" });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/screenshots/${id}/upvote`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screenshots"] });
    },
  });

  const handleSubmit = () => {
    if (!userName || !category) {
      toast({ title: "Fehler", description: "Name und Kategorie sind Pflichtfelder", variant: "destructive" });
      return;
    }
    if (!consentGiven || !dataProcessingAgreed) {
      toast({ title: "DSGVO-Einwilligung erforderlich", description: "Bitte stimme der Datenverarbeitung zu", variant: "destructive" });
      return;
    }
    submitMutation.mutate({
      userName,
      userEmail: userEmail || undefined,
      screenshotUrl: `screenshot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      category,
      appTarget: appTarget || undefined,
      description: description || undefined,
      consentGiven: true,
      dataProcessingAgreed: true,
      isWettbewerb,
    });
  };

  const gratisProgress = growthStats ? ((1000 - growthStats.availableGratisSlots) / 1000) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              KOSTENLOS
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-3">Screenshot-Agenten</h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Sende Screenshots deiner App-Nutzung — unsere KI analysiert sie automatisch, 
            erkennt Verbesserungspotenzial und implementiert Fixes. Du sammelst Punkte und 
            die ersten 1.000 Nutzer erhalten das komplette All-in-Paket kostenlos.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
            {[
              { label: "Screenshots", value: growthStats?.totalScreenshots || 0, icon: Camera },
              { label: "Teilnehmer", value: growthStats?.totalUsers || 0, icon: Users },
              { label: "Implementiert", value: growthStats?.implementedCount || 0, icon: CheckCircle },
              { label: "Gratis freigeschaltet", value: growthStats?.gratisUnlocked || 0, icon: Gift },
              { label: "Verfügbare Plätze", value: growthStats?.availableGratisSlots || 1000, icon: Target },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card/50 border-border/30">
                <CardContent className="p-3 text-center">
                  <stat.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gratis Paket Progress */}
          <Card className="mt-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  Gratis All-in-Paket — {1000 - (growthStats?.availableGratisSlots || 1000)} / 1.000
                </span>
                <span className="text-xs text-muted-foreground">{Math.round(gratisProgress)}%</span>
              </div>
              <Progress value={gratisProgress} className="h-2" />
              <p className="text-[10px] text-muted-foreground mt-1.5">
                Noch {growthStats?.availableGratisSlots || 1000} Plätze für das kostenlose Komplett-Paket verfügbar
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 bg-card/50 border border-border/30">
            <TabsTrigger value="upload" className="text-xs">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Einreichen
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="wettbewerb" className="text-xs">
              <Trophy className="h-3.5 w-3.5 mr-1.5" />
              Wettbewerb
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="text-xs">
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Camera className="h-4 w-4 text-primary" />
                    Screenshot einreichen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Name *</Label>
                      <Input
                        placeholder="Dein Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-1 text-sm"
                        data-testid="input-username"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">E-Mail</Label>
                      <Input
                        type="email"
                        placeholder="deine@email.de"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="mt-1 text-sm"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Kategorie *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="mt-1 text-sm" data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">App</Label>
                      <Select value={appTarget} onValueChange={setAppTarget}>
                        <SelectTrigger className="mt-1 text-sm" data-testid="select-app">
                          <SelectValue placeholder="Wähle App" />
                        </SelectTrigger>
                        <SelectContent>
                          {REALSYNC_APPS.map((app) => (
                            <SelectItem key={app} value={app}>{app}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Beschreibung</Label>
                    <Textarea
                      placeholder="Beschreibe was du siehst oder verbesserst sehen möchtest..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 text-sm min-h-[80px]"
                      data-testid="textarea-description"
                    />
                  </div>

                  {/* Screenshot Upload Area */}
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" data-testid="upload-area">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Screenshot hierher ziehen oder klicken</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG, WEBP — max. 10 MB</p>
                  </div>

                  {/* Wettbewerb Toggle */}
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">Am Wettbewerb teilnehmen</span>
                    </div>
                    <Switch checked={isWettbewerb} onCheckedChange={setIsWettbewerb} data-testid="switch-wettbewerb" />
                  </div>

                  {/* DSGVO Consent */}
                  <div className="space-y-2 p-3 bg-card border border-border/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold">DSGVO-Einwilligung</span>
                    </div>
                    <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-0.5 accent-primary"
                        data-testid="checkbox-consent"
                      />
                      Ich stimme der Verarbeitung meines Screenshots zur Plattform-Verbesserung zu. (Art. 6 Abs. 1 lit. a DSGVO)
                    </label>
                    <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dataProcessingAgreed}
                        onChange={(e) => setDataProcessingAgreed(e.target.checked)}
                        className="mt-0.5 accent-primary"
                        data-testid="checkbox-data-processing"
                      />
                      Ich bestätige, dass der Screenshot keine persönlichen Daten Dritter enthält. Daten werden nach 90 Tagen automatisch anonymisiert.
                    </label>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-testid="button-submit"
                  >
                    {submitMutation.isPending ? (
                      <Clock className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    {submitMutation.isPending ? "Wird analysiert..." : "Screenshot einreichen & Punkte sammeln"}
                  </Button>
                </CardContent>
              </Card>

              {/* How it works */}
              <div className="space-y-4">
                <Card className="bg-card/50 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      So funktioniert's
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { step: "1", title: "Screenshot machen", desc: "Mache einen Screenshot von deiner App-Nutzung" },
                      { step: "2", title: "Hochladen & beschreiben", desc: "Lade den Screenshot hoch und beschreibe dein Feedback" },
                      { step: "3", title: "KI analysiert automatisch", desc: "Unsere KI erkennt Probleme, Verbesserungen und Prioritäten" },
                      { step: "4", title: "Punkte sammeln", desc: "Erhalte Punkte für jede Einreichung — Top-Beiträge = Bonus" },
                      { step: "5", title: "Gratis-Paket freischalten", desc: "Die ersten 1.000 aktiven Nutzer bekommen alles kostenlos" },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Belohnungsstufen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { tier: "Starter", points: "0+", perks: "Grundzugang" },
                      { tier: "Bronze", points: "50+", perks: "CreatorSeal Free" },
                      { tier: "Silver", points: "150+", perks: "+Scanner Zugang" },
                      { tier: "Gold", points: "500+", perks: "+Community Pro" },
                      { tier: "Platinum", points: "1000+", perks: "+Builder + Optimus" },
                      { tier: "ALL-IN", points: "2500+", perks: "Alles kostenlos!" },
                    ].map((r) => (
                      <div key={r.tier} className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/20 text-xs">
                        <span className="font-medium">{r.tier}</span>
                        <span className="text-muted-foreground">{r.points} Punkte</span>
                        <Badge variant="outline" className="text-[10px]">{r.perks}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">KI-Analyse Dashboard</h2>
              {screenshotsLoading ? (
                <div className="grid gap-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-card/50 border-border/30 animate-pulse">
                      <CardContent className="p-4 h-20" />
                    </Card>
                  ))}
                </div>
              ) : screenshots.length === 0 ? (
                <Card className="bg-card/50 border-border/30">
                  <CardContent className="p-8 text-center">
                    <Camera className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Noch keine Screenshots eingereicht</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {screenshots.map((s) => (
                    <Card key={s.id} className="bg-card/50 border-border/30 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-sm font-medium">{s.userName}</span>
                              <StatusBadge status={s.status} />
                              <PriorityBadge priority={s.aiPriority} />
                              {s.isWettbewerb && (
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                                  <Trophy className="h-2.5 w-2.5 mr-0.5" />
                                  Wettbewerb
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{s.description || "Keine Beschreibung"}</p>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
                              <span>{s.category}</span>
                              {s.appTarget && <span>• {s.appTarget}</span>}
                              {s.aiCategory && <span>• KI: {s.aiCategory}</span>}
                              {s.aiSuggestion && <span className="text-primary/70">• {s.aiSuggestion}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <span className="text-xs text-primary font-medium">+{s.pointsAwarded}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => upvoteMutation.mutate(s.id)}
                              className="h-8 px-2"
                              data-testid={`button-upvote-${s.id}`}
                            >
                              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">{s.upvotes}</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Wettbewerb Tab */}
          <TabsContent value="wettbewerb">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Leaderboard */}
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Rangliste — Top-Beitragende
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leaderboard.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Noch keine Einträge</p>
                  ) : (
                    leaderboard.map((entry, i) => (
                      <div key={entry.id} className={`flex items-center gap-3 p-2.5 rounded-lg ${i < 3 ? "bg-primary/5 border border-primary/20" : "bg-background/50 border border-border/20"}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-yellow-500/20 text-yellow-400" : i === 1 ? "bg-gray-300/20 text-gray-300" : i === 2 ? "bg-amber-600/20 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{entry.userName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{entry.screenshotsSubmitted} Screenshots</span>
                            <span>•</span>
                            <TierBadge tier={entry.tier} />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{entry.totalPoints}</p>
                          <p className="text-[10px] text-muted-foreground">Punkte</p>
                        </div>
                        {entry.gratisPackageUnlocked && (
                          <Gift className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Wettbewerb Highlights */}
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      Aktive Wettbewerbe
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                        <p className="text-sm font-medium">Screenshot des Monats</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Der beste Screenshot-Beitrag gewinnt 1 Jahr RealSync Pro gratis</p>
                        <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">Läuft noch 14 Tage</Badge>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                        <p className="text-sm font-medium">Bug-Hunter Challenge</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Finde die meisten Bugs — Top 10 erhalten Platinum-Status</p>
                        <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">Permanent aktiv</Badge>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                        <p className="text-sm font-medium">Feature-Vision Wettbewerb</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Reiche den besten Feature-Vorschlag ein — Community voted</p>
                        <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">Nächste Runde: April</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/30">
                  <CardContent className="p-4">
                    <h3 className="text-base font-semibold mb-2">Wettbewerb-Screenshots</h3>
                    {screenshots.filter((s) => s.isWettbewerb).length === 0 ? (
                      <p className="text-sm text-muted-foreground">Noch keine Wettbewerb-Beiträge</p>
                    ) : (
                      <div className="space-y-2">
                        {screenshots
                          .filter((s) => s.isWettbewerb)
                          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
                          .slice(0, 10)
                          .map((s, i) => (
                            <div key={s.id} className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/20">
                              <span className="text-[10px] font-bold text-muted-foreground w-5">#{i + 1}</span>
                              <span className="text-xs flex-1">{s.userName}: {s.description?.slice(0, 60) || s.category}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => upvoteMutation.mutate(s.id)}
                                className="h-6 px-1.5"
                              >
                                <ChevronUp className="h-3 w-3" />
                                <span className="text-[10px] ml-0.5">{s.upvotes}</span>
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    WhatsApp Screenshot-Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sende Screenshots direkt per WhatsApp an unseren KI-Agenten. 
                    Einfach Foto schicken — die KI analysiert automatisch und du sammelst Punkte.
                  </p>
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <p className="text-sm font-medium text-green-400 mb-2">RealSync WhatsApp Bot</p>
                    <p className="text-lg font-mono font-bold">+49 XXX XXXXXXX</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Sende "START" um den Bot zu aktivieren</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Deine WhatsApp-Nummer verknüpfen</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="+49 170 1234567"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="text-sm"
                        data-testid="input-whatsapp"
                      />
                      <Button variant="outline" size="sm" className="shrink-0" data-testid="button-link-whatsapp">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Verknüpfen
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium">So geht's:</p>
                    {[
                      "Speichere unsere Nummer als Kontakt",
                      "Sende 'START' um dich zu registrieren",
                      "Schicke jederzeit Screenshots per Chat",
                      "KI antwortet sofort mit Analyse",
                      "Punkte werden automatisch gutgeschrieben",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                        {step}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Multi-Kanal Agenten-Rotation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Unsere Agenten rotieren automatisch über alle Kanäle — 
                    kostenlos, optimiert, und immer die beste Strategie.
                  </p>
                  {[
                    { channel: "WhatsApp", status: "Aktiv", color: "text-green-400", desc: "Screenshot-Bot + Kundensupport" },
                    { channel: "Instagram", status: "Bereit", color: "text-pink-400", desc: "Story-Posts + Reels" },
                    { channel: "TikTok", status: "Bereit", color: "text-cyan-400", desc: "Kurz-Videos + Challenges" },
                    { channel: "LinkedIn", status: "Bereit", color: "text-blue-400", desc: "B2B-Content + Thought Leadership" },
                    { channel: "YouTube", status: "Geplant", color: "text-red-400", desc: "Tutorials + Demos" },
                    { channel: "Facebook", status: "Bereit", color: "text-blue-500", desc: "Community + Gruppen" },
                    { channel: "E-Mail", status: "Aktiv", color: "text-amber-400", desc: "Newsletter + Drip-Campaigns" },
                  ].map((ch) => (
                    <div key={ch.channel} className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-border/20">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${ch.status === "Aktiv" ? "bg-green-400 animate-pulse" : ch.status === "Bereit" ? "bg-yellow-400" : "bg-gray-500"}`} />
                        <span className={`text-sm font-medium ${ch.color}`}>{ch.channel}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-[10px]">{ch.status}</Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ch.desc}</p>
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mt-4">
                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary" />
                      Kostenlose Skalierung
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Alle Werbe-Agenten arbeiten mit organischen Strategien — keine bezahlten Ads nötig. 
                      Content wird KI-optimiert, Zeiten automatisch gewählt, A/B-Tests laufen kostenlos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
