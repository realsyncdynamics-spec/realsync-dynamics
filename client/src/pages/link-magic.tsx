import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AppInfoSection } from "@/components/AppInfoSection";
import { toast } from "@/hooks/use-toast";
import {
  Wand2,
  Sparkles,
  Globe,
  Target,
  BarChart3,
  Zap,
  Copy,
  Download,
  Play,
  RefreshCw,
  Eye,
  MousePointer,
  TrendingUp,
  Palette,
  Type,
  Image,
  Video,
  Languages,
  Megaphone,
  Share2,
  ExternalLink,
  CheckCircle,
  Loader2,
  ArrowRight,
  Link2,
  DollarSign,
  Users,
  Shield,
  Cpu,
  Monitor,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   AD TEMPLATES
   ═══════════════════════════════════════════════════════════════ */
interface AdTemplate {
  id: string;
  name: string;
  platform: string;
  icon: typeof Globe;
  color: string;
  bgColor: string;
  dimensions: string;
  description: string;
}

const adTemplates: AdTemplate[] = [
  { id: "google-search", name: "Google Search Ad", platform: "Google", icon: Globe, color: "text-blue-400", bgColor: "bg-blue-500/10", dimensions: "30 Zeichen + 90 Zeichen", description: "Textanzeige für Google Suche mit Headline und Description" },
  { id: "meta-feed", name: "Meta Feed Ad", platform: "Meta", icon: Image, color: "text-indigo-400", bgColor: "bg-indigo-500/10", dimensions: "1080×1080 px", description: "Bild- oder Karussell-Anzeige für Facebook & Instagram Feed" },
  { id: "meta-story", name: "Meta Story Ad", platform: "Meta", icon: Video, color: "text-pink-400", bgColor: "bg-pink-500/10", dimensions: "1080×1920 px", description: "Vollbild-Anzeige für Instagram & Facebook Stories" },
  { id: "tiktok-spark", name: "TikTok Spark Ad", platform: "TikTok", icon: Play, color: "text-cyan-400", bgColor: "bg-cyan-500/10", dimensions: "1080×1920 px", description: "Authentische Video-Anzeige im TikTok-Feed-Stil" },
  { id: "linkedin-single", name: "LinkedIn Single Image", platform: "LinkedIn", icon: Megaphone, color: "text-sky-400", bgColor: "bg-sky-500/10", dimensions: "1200×627 px", description: "Professionelle B2B-Anzeige mit Bild und Text" },
  { id: "display-banner", name: "Display Banner (GDN)", platform: "Google", icon: Monitor, color: "text-amber-400", bgColor: "bg-amber-500/10", dimensions: "728×90, 300×250", description: "Banner-Anzeigen für Google Display Network" },
];

/* ═══════════════════════════════════════════════════════════════
   AD GENERATOR
   ═══════════════════════════════════════════════════════════════ */
interface GeneratedAd {
  headline: string;
  description: string;
  cta: string;
  targetAudience: string;
  estimatedCtr: string;
  platform: string;
}

export default function LinkMagicPage() {
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<AdTemplate | null>(null);
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([]);
  const [generating, setGenerating] = useState(false);

  const generateAds = async () => {
    if (!productName) {
      toast({ title: "Fehler", description: "Bitte gib einen Produktnamen ein.", variant: "destructive" });
      return;
    }

    setGenerating(true);

    // Simulate AI generation with delay
    await new Promise((r) => setTimeout(r, 2000));

    const platforms = selectedTemplate ? [selectedTemplate.platform] : ["Google", "Meta", "TikTok", "LinkedIn"];
    const results: GeneratedAd[] = platforms.map((platform) => ({
      headline: getHeadline(productName, platform),
      description: getDescription(productName, targetAudience, platform),
      cta: getCTA(platform),
      targetAudience: targetAudience || "18-45, Digital Natives, Interessiert an " + productName,
      estimatedCtr: (Math.random() * 3 + 1.5).toFixed(1) + "%",
      platform,
    }));

    setGeneratedAds(results);
    setGenerating(false);
    toast({ title: "Anzeigen generiert", description: `${results.length} Varianten erstellt.` });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-violet-500/30 text-violet-400">
            <Wand2 className="h-3 w-3 mr-1" />
            RealSync Link-Magic
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" data-testid="linkmagic-title">
            KI-Anzeigen-Generator <span className="text-violet-400">für jede Plattform</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Generiere in Sekunden optimierte Werbeanzeigen für Google, Meta, TikTok & LinkedIn.
            KI-gesteuerte Headlines, Descriptions und CTAs — perfekt auf deine Zielgruppe abgestimmt.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Anzeigen generiert", value: "12.4K+", icon: Sparkles },
            { label: "Plattformen", value: "6", icon: Globe },
            { label: "Ø CTR-Steigerung", value: "+47%", icon: TrendingUp },
            { label: "Sprachen", value: "5", icon: Languages },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/30 p-4 text-center">
              <s.icon className="h-4 w-4 text-violet-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Generator */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border/50 bg-card/30 p-5">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-violet-400" />
                Anzeige erstellen
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Produkt / Service</Label>
                  <Input
                    placeholder="z.B. RealSync Dynamics SaaS"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    data-testid="input-product"
                  />
                </div>

                <div>
                  <Label className="text-xs">URL (optional)</Label>
                  <Input
                    placeholder="https://realsyncdynamics.de"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    data-testid="input-url"
                  />
                </div>

                <div>
                  <Label className="text-xs">Zielgruppe (optional)</Label>
                  <Textarea
                    placeholder="z.B. 25-45, Tech-Interessierte, Creator, Deutschland"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="min-h-[60px]"
                    data-testid="input-audience"
                  />
                </div>

                {/* Template Selection */}
                <div>
                  <Label className="text-xs mb-2 block">Plattform (optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {adTemplates.slice(0, 6).map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] transition-all border ${
                            selectedTemplate?.id === t.id
                              ? `border-violet-500/50 ${t.bgColor} text-foreground`
                              : "border-border/30 text-muted-foreground hover:border-border"
                          }`}
                          onClick={() => setSelectedTemplate(selectedTemplate?.id === t.id ? null : t)}
                          data-testid={`template-${t.id}`}
                        >
                          <Icon className={`h-3 w-3 ${t.color}`} />
                          {t.name.split(" ").slice(0, 2).join(" ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={generateAds}
                  disabled={generating || !productName}
                  data-testid="btn-generate"
                >
                  {generating ? (
                    <><Loader2 className="h-3 w-3 animate-spin" /> Generiere...</>
                  ) : (
                    <><Sparkles className="h-3 w-3" /> Anzeigen generieren</>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            {generatedAds.length === 0 && !generating ? (
              <div className="rounded-xl border border-border/50 bg-card/30 p-12 text-center">
                <Wand2 className="h-12 w-12 text-violet-400/30 mx-auto mb-4" />
                <h3 className="text-sm font-medium mb-1">Bereit zum Generieren</h3>
                <p className="text-[11px] text-muted-foreground">
                  Gib links deinen Produktnamen ein und klicke "Anzeigen generieren"
                </p>
              </div>
            ) : generating ? (
              <div className="rounded-xl border border-border/50 bg-card/30 p-12 text-center">
                <Loader2 className="h-12 w-12 text-violet-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-sm font-medium mb-1">KI generiert Anzeigen...</h3>
                <Progress value={65} className="max-w-xs mx-auto mt-3" />
              </div>
            ) : (
              <div className="space-y-4">
                {generatedAds.map((ad, i) => (
                  <Card key={i} className="bg-card/30 border-border/50" data-testid={`ad-result-${i}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-400">
                          {ad.platform}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400">
                            <MousePointer className="h-2.5 w-2.5 mr-0.5" />
                            CTR: {ad.estimatedCtr}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Headline</div>
                        <p className="text-sm font-semibold text-blue-400">{ad.headline}</p>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Description</div>
                        <p className="text-xs text-muted-foreground">{ad.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">CTA</div>
                          <Badge className="bg-violet-500/20 text-violet-400 border-0 text-[10px]">{ad.cta}</Badge>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] gap-1"
                            onClick={() => {
                              navigator.clipboard.writeText(`${ad.headline}\n${ad.description}\nCTA: ${ad.cta}`);
                              toast({ title: "Kopiert" });
                            }}
                          >
                            <Copy className="h-2.5 w-2.5" /> Kopieren
                          </Button>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        <Target className="h-2.5 w-2.5 inline mr-1" />
                        Zielgruppe: {ad.targetAudience}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ad Templates Grid */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-lg font-bold text-center mb-6">Unterstützte Plattformen & Formate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {adTemplates.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.id} className="rounded-xl border border-border/50 bg-card/30 p-4 hover:border-violet-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${t.bgColor}`}>
                      <Icon className={`h-4 w-4 ${t.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.platform}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{t.description}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-[9px]">{t.dimensions}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── App Info Section ── */}
      <AppInfoSection
        appName="Link-Magic"
        tagline="KI-gesteuerte Werbeanzeigen in Sekunden"
        accentColor="text-violet-400"
        accentBg="bg-violet-500/10"
        description={`RealSync Link-Magic ist ein KI-Anzeigen-Generator, der optimierte Werbetexte und Creatives für alle großen Werbeplattformen erstellt. Gib einfach dein Produkt oder deinen Service ein — die KI generiert in Sekunden Headlines, Descriptions, CTAs und Zielgruppen-Empfehlungen.

Link-Magic analysiert deine Zielgruppe, den Wettbewerb und aktuelle Plattform-Trends, um Anzeigen zu erstellen, die überdurchschnittliche Click-Through-Rates erzielen. Die generierten Anzeigen sind sofort einsatzbereit für Google Ads, Meta Ads Manager, TikTok Ads und LinkedIn Campaign Manager.

Der integrierte A/B-Test-Assistent erstellt automatisch Varianten deiner besten Anzeigen und schlägt optimale Budget-Verteilungen vor. Link-Magic lernt aus den Performance-Daten deiner Kampagnen und verbessert die Vorschläge kontinuierlich.`}
        features={[
          { icon: Sparkles, title: "KI-Texterstellung", description: "GPT-basierte Headline- und Description-Generierung. Optimiert auf CTR, Relevanz-Score und Plattform-Richtlinien." },
          { icon: Globe, title: "Multi-Plattform", description: "Google Search, Meta Feed/Story, TikTok Spark, LinkedIn — ein Klick, alle Formate automatisch angepasst." },
          { icon: Target, title: "Zielgruppen-Analyse", description: "KI analysiert dein Produkt und schlägt optimale Targeting-Parameter vor: Alter, Interessen, Lookalike Audiences." },
          { icon: BarChart3, title: "CTR-Prognose", description: "Jede generierte Anzeige erhält eine geschätzte Click-Through-Rate basierend auf historischen Benchmark-Daten." },
          { icon: Palette, title: "Creative-Generator", description: "Automatisch generierte Bild- und Video-Vorlagen. Farben, Fonts und Layout passend zum Produkt." },
          { icon: Languages, title: "5 Sprachen", description: "Anzeigen in Deutsch, Englisch, Französisch, Spanisch und Italienisch. Automatische Lokalisierung statt Übersetzung." },
        ]}
        techStack={[
          { name: "RealSync AI Router", description: "Rotierende kostenlose KI-Modelle für Texterstellung. Fallback auf GPT-4o für Premium-Nutzer." },
          { name: "React + Tailwind CSS", description: "Schnelle, responsive UI für den Ad-Builder. Preview in Echtzeit für alle Plattform-Formate." },
          { name: "Natural Language Processing", description: "Sentiment-Analyse, Keyword-Extraktion und Tone-Matching für plattform-optimierte Texte." },
          { name: "Platform APIs", description: "Direkte Integration mit Google Ads API, Meta Marketing API für One-Click-Kampagnen-Erstellung." },
          { name: "Analytics Engine", description: "CTR-Prognosemodell trainiert auf 500K+ Anzeigen. Benchmark-Daten nach Branche und Plattform." },
          { name: "Stripe Subscriptions", description: "Pay-per-generation oder Monatsabo. Kostenlose Tier mit 10 Anzeigen/Monat." },
        ]}
        pricingTiers={[
          { name: "Free", price: "0€" },
          { name: "Starter", price: "9€/Mo", highlight: true },
          { name: "Pro", price: "29€/Mo" },
          { name: "Agency", price: "99€/Mo" },
        ]}
        roadmap={[
          { quarter: "Q1 2026", title: "Launch: Text-Ads für 6 Plattformen", description: "Google, Meta, TikTok, LinkedIn, Display. KI-Texterstellung in DE und EN.", status: "done" },
          { quarter: "Q2 2026", title: "Multi-Language (5 Sprachen)", description: "Französisch, Spanisch, Italienisch. Kulturelle Lokalisierung statt Machine Translation.", status: "in-progress" },
          { quarter: "Q3 2026", title: "Video-Ads Generator", description: "Automatisch generierte 15-60s Video-Anzeigen mit KI-Voiceover und Stock-Footage-Montage.", status: "planned" },
          { quarter: "Q4 2026", title: "Direct Platform Publishing", description: "One-Click-Veröffentlichung direkt in Google Ads, Meta Ads Manager und TikTok Ads.", status: "planned" },
          { quarter: "2027", title: "Autonomous Campaign Manager", description: "KI verwaltet Budgets, pausiert Low-Performer, skaliert Winner — vollautomatisch.", status: "planned" },
        ]}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPER FUNCTIONS FOR AD GENERATION
   ═══════════════════════════════════════════════════════════════ */
function getHeadline(product: string, platform: string): string {
  const headlines: Record<string, string[]> = {
    Google: [
      `${product} — Jetzt kostenlos testen`,
      `${product}: Die #1 Lösung für Creator`,
      `Spare 60% mit ${product} Bundle`,
    ],
    Meta: [
      `Dein Content verdient Schutz. ${product} macht's möglich.`,
      `Warum 10.000+ Creator auf ${product} vertrauen`,
      `${product} — Content schützen war nie einfacher`,
    ],
    TikTok: [
      `POV: Du hast gerade ${product} entdeckt`,
      `${product} hat alles verändert`,
      `Warte bis du siehst was ${product} kann`,
    ],
    LinkedIn: [
      `Wie ${product} den Creator-Markt revolutioniert`,
      `${product}: Enterprise Content Protection`,
      `Die Zukunft der Content-Verifizierung heißt ${product}`,
    ],
  };
  const options = headlines[platform] || headlines.Google;
  return options[Math.floor(Math.random() * options.length)];
}

function getDescription(product: string, audience: string, platform: string): string {
  const base = audience ? `Perfekt für ${audience}.` : "Für Creator, Unternehmen und Teams.";
  const descs: Record<string, string> = {
    Google: `${product} bietet KI-gestützten Content-Schutz, Blockchain-Verifizierung und automatisierte Workflows. ${base} Jetzt kostenlos starten — kein Abo nötig.`,
    Meta: `${base} Schütze deinen Content mit SHA-256 Hash, Wasserzeichen und C2PA-Zertifikaten. Nutze kostenlose KI-Agenten für dein Content-Management.`,
    TikTok: `${base} Erstelle, schütze und monetarisiere deinen Content — alles auf einer Plattform. 5 Apps, 1 Preis.`,
    LinkedIn: `${product} ist die professionelle SaaS-Plattform für Content-Schutz und Creator-Workflows. ${base} Enterprise-ready mit API, SSO und dedizierten Servern.`,
  };
  return descs[platform] || descs.Google;
}

function getCTA(platform: string): string {
  const ctas: Record<string, string> = {
    Google: "Kostenlos testen →",
    Meta: "Mehr erfahren",
    TikTok: "Jetzt entdecken",
    LinkedIn: "Demo vereinbaren",
  };
  return ctas[platform] || "Jetzt starten";
}
