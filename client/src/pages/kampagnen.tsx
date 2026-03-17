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
  Megaphone,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  Play,
  Pause,
  PlusCircle,
  Settings,
  Sparkles,
  Clock,
  RefreshCcw,
  Globe,
  Share2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Campaign, AutomationRule } from "@shared/schema";

function CampaignStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    entwurf: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "Entwurf" },
    geplant: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Geplant" },
    aktiv: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Aktiv" },
    pausiert: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pausiert" },
    abgeschlossen: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Abgeschlossen" },
  };
  const c = config[status] || config.entwurf;
  return <Badge className={`${c.color} border text-[10px]`}>{c.label}</Badge>;
}

function PlatformBadge({ platform }: { platform: string | null }) {
  if (!platform) return null;
  const colors: Record<string, string> = {
    instagram: "text-pink-400",
    tiktok: "text-cyan-400",
    linkedin: "text-blue-400",
    google: "text-green-400",
    facebook: "text-blue-500",
    youtube: "text-red-400",
    email: "text-amber-400",
    whatsapp: "text-green-500",
  };
  return (
    <span className={`text-xs font-medium ${colors[platform] || "text-muted-foreground"}`}>
      {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, trend, color }: {
  icon: any; label: string; value: string | number; trend?: string; color?: string;
}) {
  return (
    <Card className="bg-card/50 border-border/30">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <Icon className={`h-4 w-4 ${color || "text-primary"}`} />
          {trend && (
            <span className={`text-[10px] flex items-center gap-0.5 ${trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
              {trend.startsWith("+") ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
              {trend}
            </span>
          )}
        </div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function KampagnenPage() {
  const [activeTab, setActiveTab] = useState("uebersicht");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "social",
    platform: "instagram",
    headline: "",
    bodyText: "",
    ctaText: "",
    budget: 0,
  });

  // Queries
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });
  const { data: stats } = useQuery<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalBudget: number;
    totalSpent: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCtr: string;
  }>({
    queryKey: ["/api/campaigns/stats"],
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/campaigns", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns/stats"] });
      toast({ title: "Kampagne erstellt", description: "Die neue Kampagne wurde erfolgreich angelegt." });
      setShowCreateForm(false);
      setNewCampaign({ name: "", description: "", type: "social", platform: "instagram", headline: "", bodyText: "", ctaText: "", budget: 0 });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/campaigns/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns/stats"] });
    },
  });

  const aiOptimizeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/campaigns/${id}/ai-optimize`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "KI-Optimierung abgeschlossen", description: data.suggestions?.timing || "Verbesserungen angewendet" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/campaigns/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns/stats"] });
      toast({ title: "Kampagne gelöscht" });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              0€ KOSTEN
            </Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              KI-AUTOMATISIERT
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-3">Werbekampagnen & Automatisierung</h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Skaliere deine Werbung auf allen Kanälen — komplett kostenlos mit organischen Strategien. 
            KI-Agenten rotieren automatisch, optimieren Timing und Content, und maximieren deine Reichweite.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <MetricCard icon={Megaphone} label="Kampagnen" value={stats?.totalCampaigns || 0} trend="+3" />
            <MetricCard icon={Eye} label="Impressionen" value={stats?.totalImpressions?.toLocaleString("de-DE") || "0"} trend="+24%" color="text-blue-400" />
            <MetricCard icon={MousePointerClick} label="Klicks" value={stats?.totalClicks?.toLocaleString("de-DE") || "0"} trend="+18%" color="text-green-400" />
            <MetricCard icon={Target} label="Konversionen" value={stats?.totalConversions || 0} trend="+12%" color="text-purple-400" />
          </div>

          {/* Zero Cost Banner */}
          <Card className="mt-6 bg-gradient-to-r from-green-500/5 to-primary/5 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Kostenlose Skalierung — 0€ Werbebudget</p>
                <p className="text-[11px] text-muted-foreground">
                  Alle Kampagnen nutzen organische Reichweite, Community-Wachstum und KI-optimiertes Content-Timing. 
                  Keine bezahlten Ads nötig.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">0€</p>
                <p className="text-[10px] text-muted-foreground">Ausgaben</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 bg-card/50 border border-border/30">
            <TabsTrigger value="uebersicht" className="text-xs">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="kampagnen" className="text-xs">
              <Megaphone className="h-3.5 w-3.5 mr-1.5" />
              Kampagnen
            </TabsTrigger>
            <TabsTrigger value="automatisierung" className="text-xs">
              <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
              Agenten-Rotation
            </TabsTrigger>
            <TabsTrigger value="kanaele" className="text-xs">
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              Kanäle
            </TabsTrigger>
          </TabsList>

          {/* Übersicht */}
          <TabsContent value="uebersicht">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Performance-Übersicht
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Reichweite (organisch)</span>
                          <span className="font-medium">{((stats?.totalImpressions || 0) / 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={Math.min(100, (stats?.totalImpressions || 0) / 100)} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Engagement-Rate</span>
                          <span className="font-medium">{stats?.avgCtr || "0%"}</span>
                        </div>
                        <Progress value={parseFloat(stats?.avgCtr || "0")} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Konversionsrate</span>
                          <span className="font-medium">{stats?.totalClicks ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(1) : "0"}%</span>
                        </div>
                        <Progress value={stats?.totalClicks ? (stats.totalConversions / stats.totalClicks) * 100 : 0} className="h-1.5" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Aktive Kampagnen</span>
                          <span className="font-medium">{stats?.activeCampaigns || 0} / {stats?.totalCampaigns || 0}</span>
                        </div>
                        <Progress value={stats?.totalCampaigns ? ((stats.activeCampaigns / stats.totalCampaigns) * 100) : 0} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Agenten-Effizienz</span>
                          <span className="font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Kanal-Abdeckung</span>
                          <span className="font-medium">7/7 Kanäle</span>
                        </div>
                        <Progress value={100} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    Agenten-Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "Content-Agent", status: "Aktiv", task: "Instagram Post erstellen" },
                    { name: "SEO-Agent", status: "Aktiv", task: "Keywords optimieren" },
                    { name: "Social-Agent", status: "Rotation", task: "LinkedIn → TikTok" },
                    { name: "Analytics-Agent", status: "Monitoring", task: "Performance tracken" },
                    { name: "WhatsApp-Agent", status: "Aktiv", task: "Kundenanfragen" },
                  ].map((agent) => (
                    <div key={agent.name} className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/20">
                      <div className={`w-2 h-2 rounded-full ${agent.status === "Aktiv" ? "bg-green-400 animate-pulse" : agent.status === "Rotation" ? "bg-yellow-400 animate-pulse" : "bg-blue-400"}`} />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground">{agent.task}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px]">{agent.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kampagnen Liste */}
          <TabsContent value="kampagnen">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Alle Kampagnen</h2>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-create-campaign"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                  Neue Kampagne
                </Button>
              </div>

              {showCreateForm && (
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Name *</Label>
                        <Input
                          value={newCampaign.name}
                          onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                          placeholder="Kampagnenname"
                          className="mt-1 text-sm"
                          data-testid="input-campaign-name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Typ</Label>
                        <Select value={newCampaign.type} onValueChange={(v) => setNewCampaign({ ...newCampaign, type: v })}>
                          <SelectTrigger className="mt-1 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="email">E-Mail</SelectItem>
                            <SelectItem value="influencer">Influencer</SelectItem>
                            <SelectItem value="retargeting">Retargeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Plattform</Label>
                        <Select value={newCampaign.platform} onValueChange={(v) => setNewCampaign({ ...newCampaign, platform: v })}>
                          <SelectTrigger className="mt-1 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="email">E-Mail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Überschrift</Label>
                        <Input
                          value={newCampaign.headline}
                          onChange={(e) => setNewCampaign({ ...newCampaign, headline: e.target.value })}
                          placeholder="Kampagnen-Headline"
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Beschreibung / Content</Label>
                      <Textarea
                        value={newCampaign.bodyText}
                        onChange={(e) => setNewCampaign({ ...newCampaign, bodyText: e.target.value })}
                        placeholder="Kampagnen-Text..."
                        className="mt-1 text-sm min-h-[60px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => createMutation.mutate(newCampaign)}
                        disabled={!newCampaign.name || createMutation.isPending}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        {createMutation.isPending ? <Clock className="h-3.5 w-3.5 animate-spin mr-1" /> : <CheckCircle className="h-3.5 w-3.5 mr-1" />}
                        Erstellen
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>Abbrechen</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-card/50 border-border/30 animate-pulse">
                      <CardContent className="p-4 h-24" />
                    </Card>
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <Card className="bg-card/50 border-border/30">
                  <CardContent className="p-8 text-center">
                    <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Noch keine Kampagnen erstellt</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((c) => (
                    <Card key={c.id} className="bg-card/50 border-border/30 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{c.name}</span>
                              <CampaignStatusBadge status={c.status} />
                              <PlatformBadge platform={c.platform} />
                              {c.aiOptimized && (
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                  KI-Optimiert
                                </Badge>
                              )}
                            </div>
                            {c.headline && <p className="text-xs text-foreground/80 mb-1">"{c.headline}"</p>}
                            <p className="text-[11px] text-muted-foreground">{c.description || c.bodyText?.slice(0, 100) || "Keine Beschreibung"}</p>
                            <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground/60">
                              <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> {c.impressions?.toLocaleString("de-DE") || 0}</span>
                              <span className="flex items-center gap-1"><MousePointerClick className="h-2.5 w-2.5" /> {c.clicks?.toLocaleString("de-DE") || 0}</span>
                              <span className="flex items-center gap-1"><Target className="h-2.5 w-2.5" /> {c.conversions || 0}</span>
                              {c.ctr && <span>CTR: {c.ctr}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 ml-3">
                            {c.status === "aktiv" ? (
                              <Button variant="ghost" size="sm" onClick={() => updateStatusMutation.mutate({ id: c.id, status: "pausiert" })} className="h-7 px-2" data-testid={`button-pause-${c.id}`}>
                                <Pause className="h-3 w-3" />
                              </Button>
                            ) : c.status !== "abgeschlossen" ? (
                              <Button variant="ghost" size="sm" onClick={() => updateStatusMutation.mutate({ id: c.id, status: "aktiv" })} className="h-7 px-2" data-testid={`button-play-${c.id}`}>
                                <Play className="h-3 w-3" />
                              </Button>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => aiOptimizeMutation.mutate(c.id)}
                              disabled={aiOptimizeMutation.isPending}
                              className="h-7 px-2"
                              data-testid={`button-ai-optimize-${c.id}`}
                            >
                              <Sparkles className="h-3 w-3 text-primary" />
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

          {/* Agenten-Rotation */}
          <TabsContent value="automatisierung">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 text-primary" />
                    Agenten-Rotationsplan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground mb-3">
                    Agenten wechseln automatisch zwischen Kanälen und Aufgaben, 
                    um maximale Effizienz bei 0€ Kosten zu erreichen.
                  </p>
                  {[
                    { time: "06:00", agent: "SEO-Agent", task: "Keyword-Analyse + Titel-Optimierung", channel: "Google" },
                    { time: "08:00", agent: "Content-Agent", task: "LinkedIn-Artikel veröffentlichen", channel: "LinkedIn" },
                    { time: "10:00", agent: "Social-Agent", task: "Instagram Reel + Story posten", channel: "Instagram" },
                    { time: "12:00", agent: "WhatsApp-Agent", task: "Community-Update senden", channel: "WhatsApp" },
                    { time: "14:00", agent: "Content-Agent", task: "TikTok Video erstellen", channel: "TikTok" },
                    { time: "16:00", agent: "Social-Agent", task: "Facebook Gruppe + Post", channel: "Facebook" },
                    { time: "18:00", agent: "Analytics-Agent", task: "Tagesreport erstellen", channel: "Intern" },
                    { time: "20:00", agent: "Content-Agent", task: "YouTube Shorts hochladen", channel: "YouTube" },
                    { time: "22:00", agent: "SEO-Agent", task: "Nächsten Tag vorbereiten", channel: "Alle" },
                  ].map((slot) => (
                    <div key={slot.time} className="flex items-center gap-3 p-2 rounded bg-background/50 border border-border/20">
                      <span className="text-xs font-mono font-bold text-primary w-10">{slot.time}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{slot.agent}</p>
                        <p className="text-[10px] text-muted-foreground">{slot.task}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px]">{slot.channel}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="bg-card/50 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Automatisierungsregeln
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { rule: "Engagement unter 2%", action: "Kanal wechseln", trigger: "engagement_drop" },
                      { rule: "Post-Performance > 5%", action: "Content duplizieren", trigger: "conversion_spike" },
                      { rule: "Beste Posting-Zeit erreicht", action: "Automatisch posten", trigger: "time_based" },
                      { rule: "Hashtag-Trend erkannt", action: "Content anpassen", trigger: "trend_detected" },
                      { rule: "Follower-Wachstum stagniert", action: "Cross-Promotion starten", trigger: "growth_stall" },
                    ].map((r) => (
                      <div key={r.rule} className="flex items-center gap-2 p-2.5 rounded bg-background/50 border border-border/20">
                        <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium">Wenn: {r.rule}</p>
                          <p className="text-[10px] text-muted-foreground">Dann: {r.action}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      KI-Optimierungstipps
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Beste Zeit für LinkedIn: Dienstag & Donnerstag 10-12 Uhr",
                        "Instagram Reels performen 3x besser als statische Posts",
                        "TikTok-Hashtags: #SaaS #Tech #Creator liefern beste Reichweite",
                        "WhatsApp-Updates morgens zwischen 8-9 Uhr senden",
                        "Cross-Posting zwischen Kanälen erhöht Reichweite um 40%",
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Kanäle */}
          <TabsContent value="kanaele">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Instagram", icon: "📸", status: "Verbunden", posts: 12, reach: "4.2K", color: "from-pink-500/10 to-purple-500/10 border-pink-500/20" },
                { name: "TikTok", icon: "🎵", status: "Bereit", posts: 8, reach: "2.8K", color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20" },
                { name: "LinkedIn", icon: "💼", status: "Verbunden", posts: 15, reach: "6.1K", color: "from-blue-500/10 to-blue-600/10 border-blue-500/20" },
                { name: "Facebook", icon: "👥", status: "Verbinden", posts: 0, reach: "0", color: "from-blue-600/10 to-indigo-500/10 border-blue-600/20" },
                { name: "YouTube", icon: "🎬", status: "Bereit", posts: 3, reach: "1.5K", color: "from-red-500/10 to-orange-500/10 border-red-500/20" },
                { name: "WhatsApp", icon: "💬", status: "Verbinden", posts: 0, reach: "0", color: "from-green-500/10 to-green-600/10 border-green-500/20" },
                { name: "E-Mail", icon: "📧", status: "Aktiv", posts: 5, reach: "1.2K", color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20" },
                { name: "Google", icon: "🔍", status: "SEO aktiv", posts: 0, reach: "8.5K", color: "from-green-400/10 to-blue-400/10 border-green-400/20" },
                { name: "X / Twitter", icon: "🐦", status: "Geplant", posts: 0, reach: "0", color: "from-gray-500/10 to-gray-600/10 border-gray-500/20" },
              ].map((ch) => (
                <Card key={ch.name} className={`bg-gradient-to-br ${ch.color}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ch.icon}</span>
                        <span className="text-sm font-medium">{ch.name}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${ch.status === "Verbunden" || ch.status === "Aktiv" || ch.status === "SEO aktiv" ? "text-green-400 border-green-400/30" : ch.status === "Verbinden" ? "text-yellow-400 border-yellow-400/30" : "text-muted-foreground"}`}>
                        {ch.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-lg font-bold">{ch.posts}</p>
                        <p className="text-[10px] text-muted-foreground">Posts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{ch.reach}</p>
                        <p className="text-[10px] text-muted-foreground">Reichweite</p>
                      </div>
                    </div>
                    {(ch.status === "Verbinden") && (
                      <Button variant="outline" size="sm" className="w-full mt-3 text-xs h-7" data-testid={`button-connect-${ch.name.toLowerCase()}`}>
                        <Share2 className="h-3 w-3 mr-1" />
                        Jetzt verbinden
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
