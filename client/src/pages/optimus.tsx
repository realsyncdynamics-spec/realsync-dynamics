import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Bot,
  Plus,
  Play,
  Pause,
  Trash2,
  Send,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  BarChart3,
  Workflow,
  Activity,
  Cpu,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Radio,
  Brain,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { AppInfoSection } from "@/components/AppInfoSection";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  isAvailable: boolean;
  usage: number;
  limit: number;
  remainingCapacity: number;
}

interface AIStatus {
  totalModels: number;
  availableModels: number;
  totalRequests: number;
  totalTokens: number;
  models: AIModel[];
  providers: { name: string; models: number; available: number }[];
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string | null;
  performance: number;
  tasksCompleted: number;
  lastActive: string | null;
}

interface AgentTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  result: string | null;
  createdAt: string;
}

const AGENT_TYPES = [
  { value: "content-optimizer", label: "Content-Optimierer", icon: Sparkles, color: "text-purple-400", desc: "SEO, Lesbarkeit, Engagement" },
  { value: "seo-agent", label: "SEO-Agent", icon: TrendingUp, color: "text-emerald-400", desc: "Keywords, Rankings, Backlinks" },
  { value: "social-manager", label: "Social-Manager", icon: Globe, color: "text-blue-400", desc: "Posts, Hashtags, Timing" },
  { value: "security-auditor", label: "Security-Auditor", icon: Shield, color: "text-amber-400", desc: "DSGVO, Schwachstellen, Compliance" },
  { value: "analytics", label: "Analytics-Agent", icon: BarChart3, color: "text-rose-400", desc: "Traffic, Conversions, Reports" },
  { value: "workflow", label: "Workflow-Agent", icon: Workflow, color: "text-cyan-400", desc: "Automatisierung, Pipelines" },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Activity }> = {
  idle: { label: "Bereit", color: "text-muted-foreground", icon: Clock },
  running: { label: "Aktiv", color: "text-emerald-400", icon: Activity },
  paused: { label: "Pausiert", color: "text-amber-400", icon: Pause },
  error: { label: "Fehler", color: "text-red-400", icon: AlertCircle },
  completed: { label: "Fertig", color: "text-blue-400", icon: CheckCircle2 },
};

export default function OptimusPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", type: "content-optimizer", description: "" });
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string; model?: string }[]>([]);

  // Fetch AI Status
  const { data: aiStatus } = useQuery<AIStatus>({
    queryKey: ["/api/ai/status"],
    refetchInterval: 10000,
  });

  // Fetch agents
  const { data: agents = [], isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
    enabled: isAuthenticated,
  });

  // Fetch tasks for selected agent
  const { data: agentTasks = [] } = useQuery<AgentTask[]>({
    queryKey: ["/api/agents", selectedAgent, "tasks"],
    enabled: !!selectedAgent && isAuthenticated,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agents/${selectedAgent}/tasks`);
      return res.json();
    },
  });

  // Create agent
  const createAgent = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/agents", {
        name: newAgent.name,
        type: newAgent.type,
        description: newAgent.description || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      setShowCreate(false);
      setNewAgent({ name: "", type: "content-optimizer", description: "" });
      toast({ title: "Agent erstellt", description: "Neuer KI-Agent ist bereit." });
    },
  });

  // Run agent task with AI
  const runTask = useMutation({
    mutationFn: async ({ agentId, taskDescription, taskType }: { agentId: string; taskDescription: string; taskType: string }) => {
      const res = await apiRequest("POST", "/api/ai/agent-task", {
        agentId,
        taskDescription,
        taskType,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents", selectedAgent, "tasks"] });
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.ai.content, model: `${data.ai.model} (${data.ai.provider})` },
      ]);
      toast({ title: "Task abgeschlossen", description: `Verarbeitet mit ${data.ai.model}` });
    },
    onError: (error: any) => {
      const msg = error?.message || "Task fehlgeschlagen";
      setChatMessages((prev) => [...prev, { role: "assistant", content: `Fehler: ${msg}` }]);
      toast({ title: "Fehler", description: msg, variant: "destructive" });
    },
  });

  // Delete agent
  const deleteAgent = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/agents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      if (selectedAgent) setSelectedAgent(null);
      toast({ title: "Gelöscht", description: "Agent wurde entfernt." });
    },
  });

  // Quick chat (no agent needed)
  const sendChat = async () => {
    if (!taskInput.trim()) return;
    const userMsg = taskInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setTaskInput("");

    if (selectedAgent && isAuthenticated) {
      const agent = agents.find((a) => a.id === selectedAgent);
      runTask.mutate({
        agentId: selectedAgent,
        taskDescription: userMsg,
        taskType: agent?.type || "general",
      });
    } else {
      // Direct AI chat (no auth needed)
      try {
        const res = await apiRequest("POST", "/api/ai/chat", {
          messages: [
            { role: "system", content: "Du bist RealSync Optimus, ein KI-Assistent für die RealSync Dynamics Plattform. Antworte auf Deutsch." },
            { role: "user", content: userMsg },
          ],
          taskType: "general",
        });
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content, model: `${data.model} (${data.provider})` },
        ]);
      } catch {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "Verbindungsfehler. Bitte erneut versuchen." }]);
      }
    }
  };

  const selectedAgentData = agents.find((a) => a.id === selectedAgent);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-10 pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" data-testid="optimus-title">
                RealSync Optimus
              </h1>
              <p className="text-xs text-muted-foreground">
                KI-Agent Manager — Kostenlose rotierende KI-Modelle weltweit
              </p>
            </div>
          </div>

          {/* AI Model Status Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="rounded-lg border border-border/50 bg-card/50 p-3" data-testid="stat-models">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">KI-Modelle</span>
              </div>
              <div className="text-xl font-bold">
                {aiStatus?.availableModels || 0}
                <span className="text-xs font-normal text-muted-foreground">/{aiStatus?.totalModels || 0}</span>
              </div>
              <div className="text-[10px] text-emerald-400">Verfügbar</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-3" data-testid="stat-providers">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Provider</span>
              </div>
              <div className="text-xl font-bold">{aiStatus?.providers?.length || 0}</div>
              <div className="text-[10px] text-blue-400">Weltweit</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-3" data-testid="stat-requests">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Anfragen</span>
              </div>
              <div className="text-xl font-bold">{aiStatus?.totalRequests || 0}</div>
              <div className="text-[10px] text-amber-400">Gesamt</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-3" data-testid="stat-tokens">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tokens</span>
              </div>
              <div className="text-xl font-bold">{((aiStatus?.totalTokens || 0) / 1000).toFixed(1)}K</div>
              <div className="text-[10px] text-purple-400">Verarbeitet</div>
            </div>
          </div>

          {/* Provider Status */}
          <div className="rounded-lg border border-border/50 bg-card/30 p-4 mb-6" data-testid="provider-status">
            <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-primary" />
              Kostenlose KI-Provider — Live-Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(aiStatus?.providers || [
                { name: "OpenRouter", models: 3, available: 3 },
                { name: "Groq", models: 2, available: 2 },
                { name: "HuggingFace", models: 1, available: 1 },
                { name: "Together.ai", models: 1, available: 1 },
                { name: "Cloudflare", models: 1, available: 1 },
                { name: "Google Gemini", models: 1, available: 1 },
              ]).map((p) => (
                <div
                  key={p.name}
                  className={`rounded-lg border p-2.5 text-center transition-all ${
                    p.available > 0 ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className={`text-[10px] font-medium ${p.available > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {p.available > 0 ? "Online" : "Limit"}
                  </div>
                  <div className="text-xs font-bold mt-0.5 truncate">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {p.available}/{p.models} Modelle
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Agent List */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
              <div className="p-3 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-xs font-bold">Meine Agenten</h3>
                {isAuthenticated && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] gap-1"
                    onClick={() => setShowCreate(true)}
                    data-testid="btn-create-agent"
                  >
                    <Plus className="h-3 w-3" /> Neu
                  </Button>
                )}
              </div>

              {/* Create Agent Form */}
              {showCreate && (
                <div className="p-3 border-b border-border/30 bg-accent/30 space-y-2">
                  <Input
                    placeholder="Agent-Name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    className="h-7 text-xs"
                    data-testid="input-agent-name"
                  />
                  <select
                    className="w-full h-7 text-xs rounded-md border border-border bg-background px-2"
                    value={newAgent.type}
                    onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })}
                    data-testid="select-agent-type"
                  >
                    {AGENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} — {t.desc}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      className="h-6 text-[10px] flex-1"
                      onClick={() => createAgent.mutate()}
                      disabled={!newAgent.name || createAgent.isPending}
                      data-testid="btn-save-agent"
                    >
                      Erstellen
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setShowCreate(false)}>
                      Abbrechen
                    </Button>
                  </div>
                </div>
              )}

              {/* Agent List */}
              {!isAuthenticated ? (
                <div className="p-6 text-center">
                  <Bot className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Melde dich an, um Agenten zu erstellen</p>
                  <p className="text-[10px] text-muted-foreground/60">
                    Du kannst trotzdem den KI-Chat unten nutzen
                  </p>
                </div>
              ) : agentsLoading ? (
                <div className="p-4 text-center text-xs text-muted-foreground">Laden...</div>
              ) : agents.length === 0 ? (
                <div className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Noch keine Agenten erstellt</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30 max-h-[400px] overflow-y-auto">
                  {agents.map((agent) => {
                    const typeInfo = AGENT_TYPES.find((t) => t.value === agent.type);
                    const TypeIcon = typeInfo?.icon || Bot;
                    const statusInfo = STATUS_MAP[agent.status] || STATUS_MAP.idle;
                    const StatusIcon = statusInfo.icon;
                    const isSelected = selectedAgent === agent.id;

                    return (
                      <button
                        key={agent.id}
                        className={`w-full p-3 text-left hover:bg-accent/30 transition-all ${
                          isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""
                        }`}
                        onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                        data-testid={`agent-${agent.id}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-3.5 w-3.5 ${typeInfo?.color || "text-muted-foreground"}`} />
                            <span className="text-xs font-medium truncate max-w-[140px]">{agent.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <StatusIcon className={`h-3 w-3 ${statusInfo.color}`} />
                            <span className={`text-[10px] ${statusInfo.color}`}>{statusInfo.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{typeInfo?.label}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">{agent.performance}%</span>
                            <Progress value={agent.performance} className="w-12 h-1" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Models */}
            <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden mt-4" data-testid="model-list">
              <div className="p-3 border-b border-border/30">
                <h3 className="text-xs font-bold flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 text-primary" />
                  Rotierende Modelle
                </h3>
              </div>
              <div className="divide-y divide-border/20 max-h-[300px] overflow-y-auto">
                {(aiStatus?.models || []).slice(0, 9).map((model) => (
                  <div key={model.id} className="px-3 py-2 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-medium">{model.name}</div>
                      <div className="text-[10px] text-muted-foreground">{model.provider}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${model.isAvailable ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span className="text-[10px] text-muted-foreground">
                        {model.remainingCapacity}/{model.limit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Chat & Tasks */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="p-3 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-xs font-bold">
                    {selectedAgentData ? `${selectedAgentData.name} — KI-Chat` : "RealSync Optimus — Freier KI-Chat"}
                  </h3>
                  {selectedAgentData && (
                    <Badge variant="outline" className="text-[10px]">
                      {AGENT_TYPES.find((t) => t.value === selectedAgentData.type)?.label}
                    </Badge>
                  )}
                </div>
                {selectedAgentData && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] text-red-400 hover:text-red-300"
                    onClick={() => deleteAgent.mutate(selectedAgentData.id)}
                    data-testid="btn-delete-agent"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[500px]" data-testid="chat-container">
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <Brain className="h-12 w-12 text-muted-foreground/20 mb-4" />
                    <p className="text-sm font-medium text-muted-foreground/60 mb-1">
                      Starte einen KI-Chat
                    </p>
                    <p className="text-[10px] text-muted-foreground/40 text-center max-w-xs">
                      Alle Anfragen werden kostenlos über rotierende KI-Modelle verarbeitet.
                      {isAuthenticated ? " Wähle einen Agenten für spezialisierte Antworten." : " Melde dich an für spezialisierte Agenten."}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                      {["Analysiere meine Website", "Erstelle Social-Media-Plan", "SEO optimieren", "Sicherheits-Check"].map((q) => (
                        <button
                          key={q}
                          className="px-2.5 py-1 rounded-full border border-border/50 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                          onClick={() => {
                            setTaskInput(q);
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-xs ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-accent/50 border border-border/30 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                      {msg.model && (
                        <div className="mt-1.5 text-[9px] opacity-60 flex items-center gap-1">
                          <Cpu className="h-2.5 w-2.5" />
                          {msg.model}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {runTask.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-accent/50 border border-border/30 rounded-lg rounded-bl-sm p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        KI verarbeitet...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border/30">
                <div className="flex gap-2">
                  <Textarea
                    placeholder={selectedAgentData ? `Aufgabe für ${selectedAgentData.name}...` : "Frage an RealSync Optimus..."}
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    className="min-h-[40px] max-h-[100px] text-xs resize-none"
                    data-testid="input-task"
                  />
                  <Button
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={sendChat}
                    disabled={!taskInput.trim() || runTask.isPending}
                    data-testid="btn-send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">
                    Kostenlos via {aiStatus?.providers?.length || 6} Provider &middot; {aiStatus?.availableModels || 9} Modelle verfügbar
                  </span>
                  <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400">
                    100% Kostenlos
                  </Badge>
                </div>
              </div>

              {/* Recent Tasks */}
              {selectedAgent && agentTasks.length > 0 && (
                <div className="border-t border-border/30 p-3">
                  <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Letzte Tasks
                  </h4>
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                    {agentTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between text-[10px]">
                        <span className="truncate max-w-[70%]">{task.title}</span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${
                            task.status === "completed" ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"
                          }`}
                        >
                          {task.status === "completed" ? "Fertig" : "Offen"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── App Info Section ── */}
      <AppInfoSection
        appName="RealSync Optimus"
        tagline="Dein KI-Agent-Manager mit rotierenden Gratis-Modellen"
        accentColor="text-blue-400"
        accentBg="bg-blue-500/10"
        description={`RealSync Optimus ist ein intelligenter KI-Agent-Manager, der dir ermöglicht, spezialisierte KI-Agenten zu erstellen, zu konfigurieren und Aufgaben zuzuweisen — komplett kostenlos im Starter-Plan.

Das Kernstück ist der RealSync AI Model Router: Ein intelligentes Routing-System, das Anfragen automatisch an das beste verfügbare kostenlose KI-Modell weiterleitet. Aktuell rotiert der Router zwischen 9 Modellen von 6 Anbietern — darunter Llama 3.3, Gemma 2, Qwen 2.5, Mistral und DeepSeek. Wenn ein Modell sein Rate-Limit erreicht, wechselt der Router nahtlos zum nächsten verfügbaren Modell.

6 Agent-Typen stehen zur Verfügung: Content-Optimierer (SEO, Lesbarkeit), SEO-Agent (Keywords, Rankings), Social-Manager (Posts, Timing), Security-Auditor (Schwachstellen, Compliance), Analytics-Agent (Daten, Reports) und Workflow-Agent (Automatisierung). Jeder Agent kann individuelle Aufgaben erhalten und liefert KI-generierte Ergebnisse.

Die Desktop-Automation ermöglicht es Agenten, wiederkehrende Aufgaben automatisch auszuführen — von Content-Analyse über Social-Media-Planung bis zur Sicherheitsüberprüfung.`}
        features={[
          { icon: Brain, title: "KI Model Router", description: "9 kostenlose Modelle, 6 Provider. Automatisches Failover bei Rate-Limits. Llama 3.3, Gemma 2, Qwen 2.5, Mistral, DeepSeek, Phi-3." },
          { icon: Bot, title: "6 Agent-Typen", description: "Content-Optimierer, SEO-Agent, Social-Manager, Security-Auditor, Analytics und Workflow. Jeder spezialisiert auf sein Gebiet." },
          { icon: Zap, title: "Task-Management", description: "Weise Agenten Aufgaben zu, verfolge den Fortschritt und erhalte KI-generierte Ergebnisse. Priorisierung und Batch-Processing." },
          { icon: Activity, title: "Performance-Tracking", description: "Echtzeit-Dashboard mit Agent-Performance, Token-Verbrauch, Erfolgsrate und Response-Zeiten. Pro Agent und gesamt." },
          { icon: Cpu, title: "Desktop-Automation", description: "Agenten führen wiederkehrende Aufgaben automatisch aus. Zeitgesteuerte Tasks, Trigger-basierte Workflows." },
          { icon: Radio, title: "Grok Streaming", description: "Echtzeit-Streaming von KI-Antworten. Token-für-Token Ausgabe für schnellere Interaktion und bessere UX." },
        ]}
        techStack={[
          { name: "RealSync AI Router", description: "Custom Model-Router mit Failover-Logik. OpenRouter, Groq, HuggingFace, Cloudflare Workers AI, Google Gemini." },
          { name: "Express + WebSocket", description: "RESTful API für Agent-CRUD. WebSocket für Echtzeit-Streaming und Live-Status-Updates." },
          { name: "React + TanStack Query", description: "Optimistic Updates, Cache-Invalidierung und Echtzeit-Daten für responsive Agent-Verwaltung." },
          { name: "Drizzle ORM + SQLite", description: "Type-safe Datenbank für Agents, Tasks, Ergebnisse und User-Limits." },
          { name: "Rate Limiter + Queue", description: "Intelligentes Queueing-System mit Token-Bucket-Algorithmus. Respektiert Provider-Rate-Limits." },
          { name: "Stripe Usage Billing", description: "Nutzungsbasierte Abrechnung für Pro/Enterprise. Starter kostenlos mit 5 Tasks/Tag." },
        ]}
        pricingTiers={[
          { name: "Starter", price: "0€" },
          { name: "Creator", price: "9€/Mo", highlight: true },
          { name: "Pro", price: "49€/Mo" },
          { name: "Enterprise", price: "149€/Mo" },
        ]}
        roadmap={[
          { quarter: "Q1 2026", title: "6 Agenten + Model Router", description: "Launch mit 9 Gratis-Modellen, 6 Agent-Typen, Task-Management und Performance-Tracking.", status: "done" },
          { quarter: "Q2 2026", title: "Autonome Workflow-Ketten", description: "Agenten verketten: Output von Agent A wird Input für Agent B. Multi-Step-Automatisierung ohne manuelles Eingreifen.", status: "in-progress" },
          { quarter: "Q3 2026", title: "Multi-Agent-Orchestrierung", description: "Mehrere Agenten arbeiten parallel an einer Aufgabe. Consensus-Mechanismus für qualitativ hochwertigere Ergebnisse.", status: "planned" },
          { quarter: "Q4 2026", title: "Voice-Steuerung", description: "Agenten per Sprache steuern. Wake-Word-Erkennung, natürliche Sprachbefehle, Audio-Feedback.", status: "planned" },
          { quarter: "2027", title: "Agent Marketplace", description: "Community-erstellte Agenten teilen und verkaufen. Templates, vorgefertigte Workflows, Bewertungssystem.", status: "planned" },
        ]}
      />
    </div>
  );
}
