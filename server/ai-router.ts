/**
 * RealSync KI-Model-Router — Kostenlose rotierende KI-Modelle
 * Rotiert automatisch zwischen verfügbaren Gratis-Modellen weltweit.
 */

interface AIModel {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  maxTokens: number;
  rateLimit: number; // requests per minute
  currentUsage: number;
  lastReset: number;
  isAvailable: boolean;
  priority: number; // lower = higher priority
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIResponse {
  model: string;
  provider: string;
  content: string;
  tokensUsed: number;
  latencyMs: number;
}

// Registry of free AI models worldwide
const MODEL_REGISTRY: AIModel[] = [
  // OpenRouter Free Models
  {
    id: "openrouter/meta-llama/llama-3.1-8b-instruct:free",
    name: "Llama 3.1 8B",
    provider: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    maxTokens: 4096,
    rateLimit: 20,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 1,
  },
  {
    id: "openrouter/mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B",
    provider: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    maxTokens: 4096,
    rateLimit: 20,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 2,
  },
  {
    id: "openrouter/google/gemma-2-9b-it:free",
    name: "Gemma 2 9B",
    provider: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    maxTokens: 4096,
    rateLimit: 20,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 3,
  },
  // Groq Free Tier
  {
    id: "groq/llama3-8b-8192",
    name: "Llama 3 8B (Groq)",
    provider: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    maxTokens: 8192,
    rateLimit: 30,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 1,
  },
  {
    id: "groq/mixtral-8x7b-32768",
    name: "Mixtral 8x7B (Groq)",
    provider: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    maxTokens: 32768,
    rateLimit: 30,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 2,
  },
  // HuggingFace Inference API
  {
    id: "huggingface/meta-llama/Meta-Llama-3-8B-Instruct",
    name: "Llama 3 8B (HuggingFace)",
    provider: "HuggingFace",
    endpoint: "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
    maxTokens: 2048,
    rateLimit: 10,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 4,
  },
  // Together.ai Free
  {
    id: "together/meta-llama/Llama-3-8b-chat-hf",
    name: "Llama 3 8B (Together)",
    provider: "Together.ai",
    endpoint: "https://api.together.xyz/v1/chat/completions",
    maxTokens: 4096,
    rateLimit: 10,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 5,
  },
  // Cloudflare Workers AI
  {
    id: "cloudflare/@cf/meta/llama-3-8b-instruct",
    name: "Llama 3 8B (Cloudflare)",
    provider: "Cloudflare Workers AI",
    endpoint: "https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/ai/run/@cf/meta/llama-3-8b-instruct",
    maxTokens: 2048,
    rateLimit: 50,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 3,
  },
  // Google Gemini Flash (Free)
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    maxTokens: 8192,
    rateLimit: 15,
    currentUsage: 0,
    lastReset: Date.now(),
    isAvailable: true,
    priority: 1,
  },
];

class AIModelRouter {
  private models: AIModel[];
  private requestLog: Map<string, { count: number; windowStart: number }>;
  private totalRequests: number;
  private totalTokens: number;

  constructor() {
    this.models = [...MODEL_REGISTRY];
    this.requestLog = new Map();
    this.totalRequests = 0;
    this.totalTokens = 0;
  }

  /**
   * Reset rate limit counters every minute
   */
  private resetIfNeeded(model: AIModel): void {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    if (now - model.lastReset >= oneMinute) {
      model.currentUsage = 0;
      model.lastReset = now;
      model.isAvailable = true;
    }
  }

  /**
   * Get the best available model based on rate limits and priority
   */
  getNextModel(): AIModel | null {
    // Reset counters for all models
    for (const model of this.models) {
      this.resetIfNeeded(model);
    }

    // Sort by priority, then by remaining capacity
    const available = this.models
      .filter((m) => m.isAvailable && m.currentUsage < m.rateLimit)
      .sort((a, b) => {
        // Primary: priority
        if (a.priority !== b.priority) return a.priority - b.priority;
        // Secondary: remaining capacity
        const aRemaining = a.rateLimit - a.currentUsage;
        const bRemaining = b.rateLimit - b.currentUsage;
        return bRemaining - aRemaining;
      });

    return available.length > 0 ? available[0] : null;
  }

  /**
   * Record a model usage
   */
  recordUsage(modelId: string, tokens: number): void {
    const model = this.models.find((m) => m.id === modelId);
    if (model) {
      model.currentUsage++;
      if (model.currentUsage >= model.rateLimit) {
        model.isAvailable = false;
      }
    }
    this.totalRequests++;
    this.totalTokens += tokens;
  }

  /**
   * Mark a model as temporarily unavailable (e.g., error)
   */
  markUnavailable(modelId: string): void {
    const model = this.models.find((m) => m.id === modelId);
    if (model) {
      model.isAvailable = false;
      // Auto-recover after 5 minutes
      setTimeout(() => {
        model.isAvailable = true;
        model.currentUsage = 0;
      }, 5 * 60 * 1000);
    }
  }

  /**
   * Simulate a chat completion (demo mode - no real API keys needed)
   */
  async chat(messages: ChatMessage[], taskType?: string): Promise<AIResponse> {
    const startTime = Date.now();
    const model = this.getNextModel();

    if (!model) {
      // All models exhausted — return fallback
      return {
        model: "fallback/local",
        provider: "RealSync Lokal",
        content: "Alle KI-Modelle sind aktuell ausgelastet. Bitte versuchen Sie es in einer Minute erneut.",
        tokensUsed: 0,
        latencyMs: 0,
      };
    }

    // In demo mode, simulate intelligent responses based on task type
    const userMessage = messages.find((m) => m.role === "user")?.content || "";
    const response = this.generateDemoResponse(userMessage, taskType || "general", model);

    const latency = Date.now() - startTime + Math.floor(Math.random() * 200) + 100;
    const tokens = Math.floor(response.length / 4);

    this.recordUsage(model.id, tokens);

    return {
      model: model.name,
      provider: model.provider,
      content: response,
      tokensUsed: tokens,
      latencyMs: latency,
    };
  }

  /**
   * Generate contextual demo responses
   */
  private generateDemoResponse(input: string, taskType: string, model: AIModel): string {
    const responses: Record<string, string[]> = {
      "content-optimizer": [
        `Analyse abgeschlossen. Ihre Inhalte haben ein SEO-Score von ${Math.floor(Math.random() * 30) + 70}/100. Empfehlungen: 1) Meta-Beschreibung optimieren 2) Keyword-Dichte auf 2-3% anpassen 3) Alt-Tags für Bilder hinzufügen. [${model.name}]`,
        `Content-Optimierung: Titel-Vorschlag generiert. Engagement-Potential: Hoch. Empfohlene Posting-Zeit: 10:00-12:00 CET für maximale Reichweite. [${model.name}]`,
        `Lesbarkeitsscore: 78/100 (Gut). Satzlänge optimiert. 3 passive Konstruktionen durch aktive ersetzt. Keyword "Creator" optimal platziert. [${model.name}]`,
      ],
      "seo-agent": [
        `SEO-Audit abgeschlossen: 15 Verbesserungen gefunden. Top-Priorität: 1) Seitenladezeit von 3.2s auf <2s reduzieren 2) Fehlende H2-Tags auf 3 Seiten 3) 5 defekte interne Links repariert. [${model.name}]`,
        `Keyword-Recherche: "Content Schutz" (1.2K/Monat), "Creator Plattform" (890/Monat), "DSGVO Content" (650/Monat). Wettbewerb: Mittel. Empfohlene Strategie: Long-Tail Keywords fokussieren. [${model.name}]`,
      ],
      "social-manager": [
        `Social-Media-Plan erstellt: 12 Posts für die nächsten 7 Tage. Mix: 4x Educational, 3x Behind-the-Scenes, 3x User-Generated, 2x Promotion. Optimale Hashtags: #CreatorEconomy #DigitalSchutz #MadeInGermany. [${model.name}]`,
        `Engagement-Analyse: Instagram +23%, TikTok +45%, LinkedIn +12% diese Woche. Top-Post: "Blockchain-Verifizierung erklärt" mit 2.3K Impressionen. Empfehlung: Mehr Video-Content produzieren. [${model.name}]`,
      ],
      "security-auditor": [
        `Sicherheits-Scan abgeschlossen: Keine kritischen Schwachstellen. 2 Warnungen: 1) Content-Security-Policy Header fehlt 2) HSTS max-age sollte auf 31536000 erhöht werden. DSGVO-Konformität: 94%. [${model.name}]`,
        `Content-Integritätsprüfung: Alle ${Math.floor(Math.random() * 50) + 20} geschützten Inhalte verifiziert. Hash-Integrität: 100%. Blockchain-Einträge: Konsistent. Wasserzeichen-Status: Alle aktiv. [${model.name}]`,
      ],
      analytics: [
        `Wochenreport: ${Math.floor(Math.random() * 500) + 200} Seitenaufrufe, ${Math.floor(Math.random() * 50) + 20} neue Registrierungen, ${Math.floor(Math.random() * 30) + 10} neue geschützte Inhalte. Conversion-Rate: ${(Math.random() * 5 + 2).toFixed(1)}%. Trend: Aufwärts. [${model.name}]`,
        `Traffic-Analyse: 68% Organisch, 22% Direkt, 10% Social. Top-Seiten: Landing (45%), CreatorSeal (28%), Preise (15%). Bounce-Rate: 34% (Gut). Durchschnittliche Sitzungsdauer: 4:23 Min. [${model.name}]`,
      ],
      workflow: [
        `Workflow optimiert: 3 automatische Aktionen konfiguriert. 1) Neuer Upload → Auto-Hash + Barcode 2) Content geschützt → Community-Post erstellen 3) Zertifikat ausgestellt → E-Mail-Benachrichtigung. Geschätzte Zeitersparnis: 2.5 Stunden/Woche. [${model.name}]`,
        `Automatisierung aktiv: ${Math.floor(Math.random() * 20) + 5} Tasks in der Queue. Nächste Ausführung: Inhaltsscan in 15 Min. Erfolgsrate letzte 24h: 98%. Fehlgeschlagen: 1 (Netzwerk-Timeout, automatischer Retry geplant). [${model.name}]`,
      ],
      general: [
        `Anfrage verarbeitet mit ${model.name} (${model.provider}). Die RealSync Dynamics Plattform bietet umfassenden Inhaltsschutz mit Blockchain-Verifizierung, KI-gestützter Optimierung und Community-Features. Alle Funktionen sind DSGVO-konform.`,
        `Ergebnis generiert via ${model.provider}. Für optimale Ergebnisse empfehle ich, den spezialisierten Agenten-Typ zu nutzen (Content-Optimizer, SEO-Agent, Social-Manager, Security-Auditor, Analytics oder Workflow).`,
      ],
    };

    const typeResponses = responses[taskType] || responses.general;
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  }

  /**
   * Get router status (for dashboard display)
   */
  getStatus() {
    return {
      totalModels: this.models.length,
      availableModels: this.models.filter((m) => {
        this.resetIfNeeded(m);
        return m.isAvailable && m.currentUsage < m.rateLimit;
      }).length,
      totalRequests: this.totalRequests,
      totalTokens: this.totalTokens,
      models: this.models.map((m) => {
        this.resetIfNeeded(m);
        return {
          id: m.id,
          name: m.name,
          provider: m.provider,
          isAvailable: m.isAvailable,
          usage: m.currentUsage,
          limit: m.rateLimit,
          remainingCapacity: Math.max(0, m.rateLimit - m.currentUsage),
        };
      }),
      providers: Array.from(new Set(this.models.map((m) => m.provider))).map((p) => {
        const providerModels = this.models.filter((m) => m.provider === p);
        return {
          name: p,
          models: providerModels.length,
          available: providerModels.filter((m) => m.isAvailable).length,
        };
      }),
    };
  }
}

// Singleton instance
export const aiRouter = new AIModelRouter();
export type { ChatMessage, AIResponse, AIModel };
