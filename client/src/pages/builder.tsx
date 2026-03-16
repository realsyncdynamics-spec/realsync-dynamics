import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Layers,
  Plus,
  Code2,
  Eye,
  Cpu,
  Sparkles,
  Loader2,
  CheckCircle,
  RefreshCw,
  Globe,
  Layout,
  ShoppingCart,
  Users,
  Wrench,
  Trash2,
  Brain,
  Code,
  Rocket,
  Smartphone,
  Database,
  Zap,
  Package,
  MousePointer,
  ArrowRight,
  Terminal,
  FileCode,
  Boxes,
  Star,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AppProject } from "@shared/schema";

/* ─── Status & Template maps ─── */

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline"; color: string }> = {
  draft: { label: "Entwurf", variant: "secondary", color: "" },
  development: { label: "In Entwicklung", variant: "outline", color: "text-yellow-500 border-yellow-500/20" },
  live: { label: "Live", variant: "default", color: "bg-green-500/10 text-green-500 border-green-500/20" },
};

const templateIcons: Record<string, typeof Layout> = {
  "saas-dashboard": Layout,
  "e-commerce": ShoppingCart,
  "landing-page": Globe,
  "social-app": Users,
  "api-backend": Database,
  "mobile-app": Smartphone,
  custom: Wrench,
};

/* ─── KI-Modelle ─── */

const aiModels = [
  { id: "claude", name: "Claude", provider: "Anthropic", description: "Sicherer, hilfreicher Code mit starkem Reasoning", status: "Verfügbar", color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "gpt4", name: "GPT-4", provider: "OpenAI", description: "Leistungsstarkes Sprachmodell für Code und Text", status: "Verfügbar", color: "text-green-400", bg: "bg-green-500/10" },
  { id: "gemini", name: "Gemini", provider: "Google", description: "Multimodales KI-Modell für kreative Aufgaben", status: "Verfügbar", color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "deepseek", name: "DeepSeek", provider: "DeepSeek AI", description: "Spezialisiertes Open-Source-Modell für Codegenerierung", status: "Verfügbar", color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "mistral", name: "Mistral", provider: "Mistral AI", description: "Effizientes europäisches KI-Modell für schnelle Aufgaben", status: "Verfügbar", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "llama", name: "Llama", provider: "Meta", description: "Open-Source-Modell mit exzellenter Code-Performance", status: "Beta", color: "text-red-400", bg: "bg-red-500/10" },
];

/* ─── Templates ─── */

const templates = [
  { id: "saas-dashboard", name: "SaaS Dashboard", description: "Metriken, Diagramme, Nutzerverwaltung", icon: Layout, gradient: "from-blue-500/20 to-cyan-500/20", tags: ["React", "Charts", "Auth"] },
  { id: "social-app", name: "Social App", description: "Feed, Profile, Messaging, Benachrichtigungen", icon: Users, gradient: "from-green-500/20 to-emerald-500/20", tags: ["Realtime", "Feed", "Chat"] },
  { id: "e-commerce", name: "E-Commerce", description: "Produktkatalog, Warenkorb, Checkout, Stripe", icon: ShoppingCart, gradient: "from-purple-500/20 to-violet-500/20", tags: ["Stripe", "Warenkorb", "CMS"] },
  { id: "landing-page", name: "Landing Page", description: "Hero, Features, Testimonials, CTA-Sektionen", icon: Globe, gradient: "from-orange-500/20 to-amber-500/20", tags: ["SEO", "CTA", "Responsive"] },
  { id: "api-backend", name: "API Backend", description: "REST-API, Auth, Datenbank, Rate-Limiting", icon: Database, gradient: "from-red-500/20 to-rose-500/20", tags: ["REST", "Auth", "PostgreSQL"] },
  { id: "mobile-app", name: "Mobile App", description: "Cross-Platform, Push, Offline-Modus", icon: Smartphone, gradient: "from-teal-500/20 to-emerald-500/20", tags: ["React Native", "Push", "Offline"] },
];

/* ─── Template Code Previews ─── */

const templateCodes: Record<string, { filename: string; code: string }> = {
  "saas-dashboard": {
    filename: "Dashboard.tsx",
    code: `import { useState } from 'react';
import { Card, CardContent } from '@/ui/card';
import { BarChart, LineChart } from 'recharts';

export function Dashboard() {
  const [metrics] = useMetrics();

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold">
            1.247
          </h3>
          <p className="text-muted-foreground">
            Aktive Nutzer
          </p>
          <LineChart data={metrics.users} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold">
            €48.392
          </h3>
          <p className="text-muted-foreground">
            Umsatz (MTD)
          </p>
          <BarChart data={metrics.revenue} />
        </CardContent>
      </Card>
    </div>
  );
}`,
  },
  "social-app": {
    filename: "Feed.tsx",
    code: `import { useInfiniteScroll } from '@/hooks';
import { PostCard } from '@/components/PostCard';
import { CreatePost } from '@/components/CreatePost';

export function Feed() {
  const { posts, loadMore } = useInfiniteScroll(
    '/api/feed'
  );

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <CreatePost onSubmit={handlePost} />
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
    </div>
  );
}`,
  },
  "e-commerce": {
    filename: "ProductGrid.tsx",
    code: `import { useCart } from '@/hooks/useCart';
import { ProductCard } from '@/components/ProductCard';
import { FilterBar } from '@/components/FilterBar';

export function ProductGrid({ products }) {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({});

  const filtered = products.filter(
    (p) => matchFilters(p, filters)
  );

  return (
    <div>
      <FilterBar onChange={setFilters} />
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}`,
  },
  "landing-page": {
    filename: "Hero.tsx",
    code: `import { Button } from '@/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 text-center">
      <Badge className="mb-6">
        <Sparkles className="h-4 w-4 mr-1" />
        Jetzt neu verfügbar
      </Badge>
      <h1 className="text-6xl font-bold mb-4">
        Die Zukunft beginnt hier
      </h1>
      <p className="text-xl text-muted max-w-2xl mx-auto">
        Entdecke unsere Plattform
      </p>
      <Button size="lg" className="mt-8">
        Jetzt starten
        <ArrowRight className="ml-2" />
      </Button>
    </section>
  );
}`,
  },
  "api-backend": {
    filename: "server.ts",
    code: `import express from 'express';
import { db } from './database';
import { authMiddleware } from './auth';
import { rateLimit } from './middleware';

const app = express();

app.use(express.json());
app.use(rateLimit({ max: 100, window: '15m' }));

app.get('/api/users', authMiddleware, async (req, res) => {
  const users = await db.query.users.findMany({
    limit: 20,
    offset: req.query.page * 20,
  });
  res.json({ data: users });
});

app.post('/api/users', authMiddleware, async (req, res) => {
  const user = await db.insert(users).values(req.body);
  res.status(201).json(user);
});

app.listen(3000);`,
  },
  "mobile-app": {
    filename: "App.tsx",
    code: `import { NavigationContainer } from '@react-navigation';
import { createBottomTabNavigator } from '@react-nav/tabs';
import { HomeScreen } from './screens/Home';
import { ProfileScreen } from './screens/Profile';
import { NotificationsScreen } from './screens/Notif';

const Tab = createBottomTabNavigator();

export function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        tabBarStyle: { backgroundColor: '#0a0b14' },
        tabBarActiveTintColor: '#3b82f6',
      }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
        <Tab.Screen name="Alerts" component={NotificationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}`,
  },
};

/* ─── Features ─── */

const builderFeatures = [
  {
    title: "Drag & Drop",
    description: "Visuelle App-Erstellung ohne Code. Ziehe Komponenten per Drag & Drop auf deine Seite und passe sie in Echtzeit an.",
    icon: MousePointer,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Multi-KI",
    description: "Wähle aus 6 KI-Modellen — Claude, GPT-4, Gemini, DeepSeek, Mistral oder Llama. Jedes Modell für seine Stärke.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "One-Click Deploy",
    description: "Vom Code zur Live-App in Sekunden. Automatisches Deployment auf EU-Server mit SSL, CDN und Monitoring.",
    icon: Rocket,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function BuilderPage() {
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude");
  const [selectedTemplate, setSelectedTemplate] = useState("saas-dashboard");
  const [previewTemplate, setPreviewTemplate] = useState("saas-dashboard");

  const { data: projects = [], isLoading } = useQuery<AppProject[]>({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; aiModel: string; template: string }) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      setProjectName("");
      setProjectDesc("");
      setSelectedModel("claude");
      setSelectedTemplate("saas-dashboard");
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Projekt erstellt", description: "Dein neues Projekt ist bereit." });
    },
    onError: () => {
      toast({ title: "Fehler", description: "Projekt konnte nicht erstellt werden.", variant: "destructive" });
    },
  });

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast({ title: "Fehler", description: "Projektname ist erforderlich.", variant: "destructive" });
      return;
    }
    createProjectMutation.mutate({
      name: projectName,
      description: projectDesc,
      aiModel: selectedModel,
      template: selectedTemplate,
    });
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    queryClient.setQueryData<AppProject[]>(["/api/projects"], (old) =>
      old?.filter((p) => p.id !== projectId)
    );
    toast({ title: "Projekt gelöscht", description: `"${projectName}" wurde entfernt.` });
  };

  const currentCode = templateCodes[previewTemplate] || templateCodes["saas-dashboard"];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-background to-blue-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            6 KI-Modelle verfügbar
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Layers className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Multi-App Builder
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-8">
            Baue SaaS-Apps mit KI — alle Modelle, eine Plattform.
            Von der Idee zur fertigen App in Minuten statt Monaten.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 text-base" data-testid="hero-cta-builder" onClick={() => document.getElementById("create-section")?.scrollIntoView({ behavior: "smooth" })}>
              Projekt starten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-base" data-testid="hero-cta-templates" onClick={() => document.getElementById("templates-section")?.scrollIntoView({ behavior: "smooth" })}>
              Templates ansehen
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* KI-Modelle Showcase */}
        <section className="py-16" data-testid="ai-models-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Brain className="h-3.5 w-3.5 mr-2" />
              Künstliche Intelligenz
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">KI-Modelle</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Wähle das perfekte KI-Modell für dein Projekt. Alle führenden Modelle in einer Plattform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModels.map((model) => (
              <Card
                key={model.id}
                className="hover:border-primary/20 transition-all duration-300 group"
                data-testid={`model-${model.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${model.bg} flex items-center justify-center ${model.color} group-hover:scale-110 transition-transform`}>
                      <Brain className="h-5 w-5" />
                    </div>
                    <Badge
                      variant={model.status === "Verfügbar" ? "secondary" : "outline"}
                      className={model.status === "Verfügbar" ? "bg-green-500/10 text-green-500 border-green-500/20" : "text-yellow-500 border-yellow-500/20"}
                    >
                      {model.status === "Verfügbar" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      {model.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <p className="text-xs text-muted-foreground/70">{model.provider}</p>
                  <CardDescription className="text-sm mt-1">{model.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Template Gallery */}
        <section className="py-16" id="templates-section" data-testid="templates-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Package className="h-3.5 w-3.5 mr-2" />
              Vorlagen
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Template-Galerie</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Starte mit einer professionellen Vorlage und passe sie mit KI an deine Anforderungen an.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <Card
                  key={tmpl.id}
                  className={`group cursor-pointer border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden ${selectedTemplate === tmpl.id ? "border-primary/50 ring-1 ring-primary/20" : ""}`}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setPreviewTemplate(tmpl.id);
                  }}
                  data-testid={`template-${tmpl.id}`}
                >
                  <div className={`h-32 bg-gradient-to-br ${tmpl.gradient} flex items-center justify-center relative`}>
                    <Icon className="h-12 w-12 text-foreground/20" />
                    {selectedTemplate === tmpl.id && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ausgewählt
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {tmpl.name}
                    </CardTitle>
                    <CardDescription className="text-sm">{tmpl.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Project List */}
        <section className="py-16" data-testid="projects-section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">Deine Projekte</h2>
              <p className="text-muted-foreground">Verwalte und entwickle deine App-Projekte weiter.</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Boxes className="h-3.5 w-3.5 mr-1.5" />
              {projects.length} Projekte
            </Badge>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12" data-testid="projects-loading">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Projekte werden geladen...</span>
            </div>
          )}

          {!isLoading && projects.length === 0 && (
            <Card className="border-dashed border-2 border-border/50">
              <CardContent className="py-16 text-center">
                <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-lg font-medium mb-1">Noch keine Projekte</p>
                <p className="text-sm text-muted-foreground mb-4">Erstelle dein erstes KI-gestütztes App-Projekt.</p>
                <Button onClick={() => document.getElementById("create-section")?.scrollIntoView({ behavior: "smooth" })} data-testid="btn-empty-create">
                  <Plus className="h-4 w-4 mr-2" />
                  Projekt erstellen
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const status = statusMap[project.status ?? "draft"] || statusMap.draft;
              const TemplateIcon = templateIcons[project.template ?? "custom"] || Wrench;
              return (
                <Card
                  key={project.id}
                  className="hover:border-primary/20 transition-all duration-300 group"
                  data-testid={`project-${project.name?.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                        <TemplateIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant} className={status.color}>
                          {status.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id, project.name ?? "");
                          }}
                          data-testid={`btn-delete-${project.name?.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-base mt-3">{project.name}</CardTitle>
                    <CardDescription className="text-xs">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Cpu className="h-3.5 w-3.5" />
                      <span className="capitalize">{project.aiModel}</span>
                      <span className="text-border">·</span>
                      <span className="capitalize">{project.template?.replace("-", " ")}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Create Project Section */}
        <section className="py-16" id="create-section" data-testid="create-project-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Plus className="h-3.5 w-3.5 mr-2" />
              Neues Projekt
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Projekt erstellen</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Beschreibe dein Projekt und lass KI den Rest erledigen.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-border/50" data-testid="create-project-form">
            <CardContent className="pt-6 space-y-5">
              <div>
                <Label htmlFor="project-name">Projektname *</Label>
                <Input
                  id="project-name"
                  placeholder="z.B. MeineSaaS-App"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  data-testid="input-project-name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="project-desc">Beschreibung</Label>
                <Textarea
                  id="project-desc"
                  placeholder="Beschreibe dein Projekt — die KI nutzt dies als Grundlage..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  data-testid="input-project-desc"
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>KI-Modell</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger data-testid="select-ai-model" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModels.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name} — {m.provider}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Template</Label>
                  <Select value={selectedTemplate} onValueChange={(v) => { setSelectedTemplate(v); setPreviewTemplate(v); }}>
                    <SelectTrigger data-testid="select-template" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
                className="w-full"
                size="lg"
                data-testid="btn-create-project"
              >
                {createProjectMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Projekt erstellen
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="py-16" data-testid="features-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Star className="h-3.5 w-3.5 mr-2" />
              Funktionen
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Warum Multi-App Builder?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Drei Kernfunktionen, die deine App-Entwicklung revolutionieren.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {builderFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={feat.title}
                  className="border-border/50 hover:border-primary/20 transition-all duration-300 group text-center"
                  data-testid={`feature-${feat.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${feat.bg} flex items-center justify-center mb-4 ${feat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-display">{feat.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{feat.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Code Export / Preview Section */}
        <section className="py-16" data-testid="code-preview-section">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Terminal className="h-3.5 w-3.5 mr-2" />
              Code-Vorschau
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">KI-generierter Code</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Sauberer, produktionsreifer Code — generiert von deinem gewählten KI-Modell.
            </p>
          </div>

          {/* Template Tabs */}
          <Tabs value={previewTemplate} onValueChange={setPreviewTemplate} className="max-w-4xl mx-auto">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {templates.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger key={t.id} value={t.id} className="text-xs gap-1.5" data-testid={`tab-preview-${t.id}`}>
                    <Icon className="h-3 w-3" />
                    {t.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {templates.map((t) => (
              <TabsContent key={t.id} value={t.id}>
                <Card className="overflow-hidden border-border/50 mt-4" data-testid={`code-preview-${t.id}`}>
                  {/* IDE Toolbar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 font-mono flex items-center gap-1.5">
                        <FileCode className="h-3 w-3" />
                        {(templateCodes[t.id] || templateCodes["saas-dashboard"]).filename}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Sparkles className="h-3 w-3" />
                      KI generiert
                    </Badge>
                  </div>

                  {/* Code Block */}
                  <div className="p-4 bg-[hsl(222,47%,4%)] max-h-[420px] overflow-auto">
                    <pre className="text-xs font-mono leading-relaxed overflow-x-auto">
                      <code>
                        {(templateCodes[t.id] || templateCodes["saas-dashboard"]).code.split("\n").map((line, i) => (
                          <div key={i} className="flex hover:bg-white/[0.02]">
                            <span className="inline-block w-8 text-right mr-4 text-muted-foreground/30 select-none">{i + 1}</span>
                            <span className="text-foreground/90 whitespace-pre">{line}</span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Code2 className="h-3 w-3" />
                        TypeScript / React
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Produktionsbereit
                      </span>
                    </div>
                    <span>UTF-8 · LF</span>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 pb-24" data-testid="builder-cta-section">
          <Card className="border-primary/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            <CardContent className="relative py-16 text-center">
              <Layers className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Bereit, deine App zu bauen?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Starte jetzt kostenlos mit dem Multi-App Builder. Keine Kreditkarte erforderlich.
                Wähle ein Template, beschreibe deine Idee — die KI macht den Rest.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="px-8" onClick={() => document.getElementById("create-section")?.scrollIntoView({ behavior: "smooth" })} data-testid="cta-builder-start">
                  Jetzt Projekt starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8" onClick={() => document.getElementById("templates-section")?.scrollIntoView({ behavior: "smooth" })} data-testid="cta-builder-templates">
                  Templates erkunden
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
