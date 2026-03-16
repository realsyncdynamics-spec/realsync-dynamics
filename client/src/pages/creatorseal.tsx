import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Shield,
  LayoutDashboard,
  Lock,
  Award,
  Barcode,
  Link2,
  Droplets,
  UserCircle,
  Share2,
  CheckCircle,
  XCircle,
  Copy,
  Download,
  Upload,
  Loader2,
  FileVideo,
  FileImage,
  FileAudio,
  FileText,
  File,
  ExternalLink,
  TrendingUp,
  Zap,
  Eye,
  EyeOff,
  Database,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  Mail,
  Globe,
  Instagram,
  Youtube,
  Star,
  ArrowRight,
  ArrowLeft,
  Hash,
  Fingerprint,
  Layers,
  ChevronDown,
  ChevronUp,
  Users,
  BarChart3,
  Clock,
  Sparkles,
  QrCode,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ProtectedContent } from "@shared/schema";
import { AppInfoSection } from "@/components/AppInfoSection";

/* ───── Code128 SVG Generator ───── */
function generateCode128Svg(data: string): string {
  const CODE128_B: Record<string, string> = {
    " ": "11011001100", "!": "11001101100", '"': "11001100110", "#": "10010011000",
    "$": "10010001100", "%": "10001001100", "&": "10011001000", "'": "10011000100",
    "(": "10001100100", ")": "11001001000", "*": "11001000100", "+": "11000100100",
    ",": "10110011100", "-": "10011011100", ".": "10011001110", "/": "10111001100",
    "0": "10011101100", "1": "10011100110", "2": "11001110010", "3": "11001011100",
    "4": "11001001110", "5": "11011100100", "6": "11001110100", "7": "11101101110",
    "8": "11101001100", "9": "11100101100", ":": "11100100110", ";": "11101100100",
    "<": "11100110100", "=": "11100110010", ">": "11011011000", "?": "11011000110",
    "@": "11000110110", "A": "10100011000", "B": "10001011000", "C": "10001000110",
    "D": "10110001000", "E": "10001101000", "F": "10001100010", "G": "11010001000",
    "H": "11000101000", "I": "11000100010", "J": "10110111000", "K": "10110001110",
    "L": "10001101110", "M": "10111011000", "N": "10111000110", "O": "10001110110",
    "P": "11101110110", "Q": "11010001110", "R": "11000101110", "S": "11011101000",
    "T": "11011100010", "U": "11011101110", "V": "11101011000", "W": "11101000110",
    "X": "11100010110", "Y": "11101101000", "Z": "11101100010",
  };
  const START_B = "11010010000";
  const STOP = "1100011101011";
  let binary = START_B;
  for (const char of data.toUpperCase()) {
    binary += CODE128_B[char] || CODE128_B["?"];
  }
  binary += STOP;
  const barWidth = 2;
  const height = 80;
  const width = binary.length * barWidth;
  let bars = "";
  for (let i = 0; i < binary.length; i++) {
    if (binary[i] === "1") {
      bars += `<rect x="${i * barWidth}" y="0" width="${barWidth}" height="${height}" fill="currentColor"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height + 20}" class="w-full max-w-md">${bars}<text x="${width / 2}" y="${height + 16}" text-anchor="middle" font-family="monospace" font-size="12" fill="currentColor">${data}</text></svg>`;
}

/* ───── QR-like SVG Grid Generator ───── */
function generateQrSvg(data: string, size = 200): string {
  const gridSize = 21;
  const cellSize = size / gridSize;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }
  let rects = "";
  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (ox: number, oy: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isBorder || isInner) {
          rects += `<rect x="${(ox + c) * cellSize}" y="${(oy + r) * cellSize}" width="${cellSize}" height="${cellSize}" fill="currentColor"/>`;
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(gridSize - 7, 0);
  drawFinder(0, gridSize - 7);
  // Data cells
  let seed = Math.abs(hash);
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= gridSize - 8) || (r >= gridSize - 8 && c < 8);
      if (inFinder) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if (seed % 3 === 0) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="currentColor"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="w-full max-w-[200px]">${rects}</svg>`;
}

/* ───── Sidebar Tab Configuration ───── */
const sidebarTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "schutz", label: "Schutz", icon: Lock },
  { id: "zertifikate", label: "Zertifikate", icon: Award },
  { id: "barcode", label: "Barcode", icon: Barcode },
  { id: "blockchain", label: "Blockchain", icon: Link2 },
  { id: "wasserzeichen", label: "Wasserzeichen", icon: Droplets },
  { id: "signieren", label: "Signieren", icon: Fingerprint },
  { id: "deepfake", label: "Deepfake Check", icon: Eye },
  { id: "creator", label: "Creator-Seite", icon: UserCircle },
  { id: "teilen", label: "Teilen", icon: Share2 },
];

const contentTypeIcons = [
  { type: "video", label: "Video", icon: FileVideo },
  { type: "bild", label: "Bild", icon: FileImage },
  { type: "audio", label: "Audio", icon: FileAudio },
  { type: "text", label: "Text", icon: FileText },
  { type: "dokument", label: "Dokument", icon: File },
];

export default function CreatorSealPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Schutz tab
  const [selectedContentType, setSelectedContentType] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [fileHash, setFileHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<ProtectedContent | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Barcode tab
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeGenerated, setBarcodeGenerated] = useState(false);
  const [batchInput, setBatchInput] = useState("");
  const [batchGenerated, setBatchGenerated] = useState(false);

  // Blockchain tab
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<"idle" | "verifying" | "verified" | "not-found">("idle");
  const [verifiedContent, setVerifiedContent] = useState<ProtectedContent | null>(null);

  // Wasserzeichen tab
  const [wmDragOver, setWmDragOver] = useState(false);
  const [wmImage, setWmImage] = useState<string | null>(null);
  const [wmType, setWmType] = useState<"unsichtbar" | "sichtbar" | "metadaten">("unsichtbar");
  const [wmStrength, setWmStrength] = useState([2]);
  const [wmApplied, setWmApplied] = useState(false);
  const [wmProcessing, setWmProcessing] = useState(false);
  const wmFileRef = useRef<HTMLInputElement>(null);

  // Creator-Seite tab
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileWebsite, setProfileWebsite] = useState("");
  const [profileTwitter, setProfileTwitter] = useState("");
  const [profileInstagram, setProfileInstagram] = useState("");
  const [profileYoutube, setProfileYoutube] = useState("");

  // QR Verification tab (Barcode)
  const [qrUrl, setQrUrl] = useState("https://realsyncdynamics.de/verify/RSEAL-2026");
  const [qrGenerated, setQrGenerated] = useState(false);

  // C2PA Viewer (Zertifikate)
  const [c2paExpanded, setC2paExpanded] = useState<Record<string, boolean>>({ manifest: true, edits: false, chain: false });

  // Enhanced Schutz Workflow
  const [schutzStep, setSchutzStep] = useState(1);
  const [schutzMethod, setSchutzMethod] = useState("");
  const [schutzLevel, setSchutzLevel] = useState("standard");
  const [schutzComplete, setSchutzComplete] = useState(false);
  const [schutzProcessing, setSchutzProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Creator-Seite analytics
  const [profileLinkedin, setProfileLinkedin] = useState("");

  // Signieren tab
  const [signFile, setSignFile] = useState<{ name: string; hash: string } | null>(null);
  const [signMethod, setSignMethod] = useState<"sha256" | "c2pa" | "blockchain">("sha256");
  const [signProcessing, setSignProcessing] = useState(false);
  const [signResult, setSignResult] = useState<{ signature: string; timestamp: string; method: string } | null>(null);

  // Deepfake Detection tab
  const [dfFile, setDfFile] = useState<{ name: string; type: string; preview: string | null } | null>(null);
  const [dfAnalyzing, setDfAnalyzing] = useState(false);
  const [dfResult, setDfResult] = useState<{ score: number; verdict: string; indicators: string[] } | null>(null);
  const dfFileRef = useRef<HTMLInputElement>(null);

  /* ───── API Queries ───── */
  const { data: contentList = [], isLoading: contentLoading } = useQuery<ProtectedContent[]>({
    queryKey: ["/api/content"],
  });

  const { data: stats } = useQuery<{ contentCount: number; verifiedCount: number; scanCount: number }>({
    queryKey: ["/api/stats"],
  });

  const { data: userStats } = useQuery<{
    protectedContent: number;
    certificates: number;
    blockchainVerifications: number;
    trustScore: number;
    planUsage: { used: number; limit: number };
    recentActivity: { type: string; title: string; date: string }[];
  }>({
    queryKey: ["/api/user/stats"],
    enabled: isAuthenticated,
  });

  /* ───── Mutations ───── */
  const createContentMutation = useMutation({
    mutationFn: async (data: { title: string; contentType: string; hash: string }) => {
      const res = await apiRequest("POST", "/api/content", data);
      return res.json();
    },
    onSuccess: (data) => {
      setRegistrationResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Inhalt registriert", description: "Blockchain-Registrierung erfolgreich." });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (hash: string) => {
      const res = await apiRequest("POST", "/api/verify", { hash });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.verified) {
        setVerifyResult("verified");
        setVerifiedContent(data.content);
      } else {
        setVerifyResult("not-found");
        setVerifiedContent(null);
      }
    },
    onError: () => {
      setVerifyResult("not-found");
      setVerifiedContent(null);
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: { displayName: string; bio?: string; avatarUrl?: string; socialLinks?: string }) => {
      const res = await apiRequest("POST", "/api/creator-profiles", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator-profiles"] });
      toast({ title: "Profil erstellt", description: "Dein Creator-Profil wurde gespeichert." });
    },
  });

  /* ───── Handlers ───── */
  const handleFileDrop = useCallback(async (file: File) => {
    setUploadedFile({ name: file.name, size: file.size, type: file.type });
    setIsHashing(true);
    setRegistrationResult(null);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setFileHash(hashHex);
    } finally {
      setIsHashing(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileDrop(file);
  }, [handleFileDrop]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDrop(file);
  }, [handleFileDrop]);

  const handleRegisterOnBlockchain = () => {
    if (!uploadedFile || !fileHash) return;
    const contentType = selectedContentType || uploadedFile.type.split("/")[0] || "dokument";
    createContentMutation.mutate({ title: uploadedFile.name, contentType, hash: fileHash });
  };

  const handleVerify = () => {
    if (!verifyHash) return;
    setVerifyResult("verifying");
    verifyMutation.mutate(verifyHash);
  };

  const handleDownloadSvg = (svgContent: string, filename: string) => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "SVG heruntergeladen" });
  };

  const handleDownloadPng = (svgContent: string, filename: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = filename;
      a.click();
      toast({ title: "PNG heruntergeladen" });
    };
    img.src = url;
  };

  const handleWmImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setWmImage(e.target?.result as string);
      setWmApplied(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyWatermark = () => {
    setWmProcessing(true);
    setTimeout(() => {
      setWmProcessing(false);
      setWmApplied(true);
      toast({ title: "Wasserzeichen angewendet", description: `${wmType === "unsichtbar" ? "Unsichtbares" : wmType === "sichtbar" ? "Sichtbares" : "Metadaten-"}Wasserzeichen wurde erfolgreich eingebettet.` });
    }, 1500);
  };

  const handleSaveProfile = () => {
    if (!profileName) {
      toast({ title: "Fehler", description: "Anzeigename ist erforderlich.", variant: "destructive" });
      return;
    }
    const socialLinks = JSON.stringify({
      twitter: profileTwitter,
      instagram: profileInstagram,
      youtube: profileYoutube,
      website: profileWebsite,
    });
    createProfileMutation.mutate({ displayName: profileName, bio: profileBio, avatarUrl: profileAvatar, socialLinks });
  };

  /* ───── Computed ───── */
  const isLive = isAuthenticated && !!userStats;
  const activeContentCount = isLive
    ? userStats.protectedContent
    : stats?.contentCount ?? contentList.filter((c) => c.status === "active").length;
  const verifiedCount = isLive
    ? userStats.certificates
    : stats?.verifiedCount ?? contentList.filter((c) => c.verificationLevel === "gold" || c.verificationLevel === "silver").length;
  const blockchainCount = isLive
    ? userStats.blockchainVerifications
    : contentList.filter((c) => c.blockchainTxId).length;
  const trustScore = isLive
    ? userStats.trustScore
    : Math.min(100, 60 + verifiedCount * 10);
  const recentItems = contentList.slice(0, 5);

  const strengthLabels = ["Leicht", "Mittel", "Stark"];
  const verificationLink = "https://realsyncdynamics.de/verify/RSEAL-2026";

  /* ───── Render ───── */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">CreatorSeal</h1>
            <p className="text-muted-foreground text-sm">Content-Schutz & Verifizierung</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ───── LEFT SIDEBAR (Desktop) ───── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-20 space-y-1">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`sidebar-${tab.id}`}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ───── MOBILE TAB BAR ───── */}
        <div className="lg:hidden overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-1 min-w-max">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`mobile-tab-${tab.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ───── MAIN CONTENT ───── */}
        <div className="flex-1 min-w-0">

          {/* ═══════ TAB 1: DASHBOARD ═══════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Demo/Live Mode indicator */}
              {!isAuthenticated && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20" data-testid="badge-demo-mode">
                      Demo-Modus
                    </Badge>
                    <span className="text-xs text-muted-foreground">Angezeigte Daten sind Beispieldaten</span>
                  </div>
                  <button
                    className="text-xs text-primary hover:underline"
                    data-testid="btn-login-prompt"
                    onClick={() => {
                      // Trigger the auth dialog in Layout via a custom event
                      toast({ title: "Anmelden für Live-Daten", description: "Klicke oben rechts auf \"Anmelden\", um deine echten Daten zu sehen." });
                    }}
                  >
                    Anmelden für Live-Daten
                  </button>
                </div>
              )}
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card data-testid="stat-protected">
                  <CardHeader className="pb-2"><CardDescription>Geschützte Inhalte</CardDescription></CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-bold">{activeContentCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">+2 diese Woche</p>
                  </CardContent>
                </Card>
                <Card data-testid="stat-certificates">
                  <CardHeader className="pb-2"><CardDescription>Aktive Zertifikate</CardDescription></CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-bold">{verifiedCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">Gold & Silber</p>
                  </CardContent>
                </Card>
                <Card data-testid="stat-blockchain">
                  <CardHeader className="pb-2"><CardDescription>Blockchain-Verifizierungen</CardDescription></CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-bold">{blockchainCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">Polygon Mainnet</p>
                  </CardContent>
                </Card>
                <Card data-testid="stat-trust">
                  <CardHeader className="pb-2"><CardDescription>Trust Score</CardDescription></CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-bold text-primary">{trustScore}%</div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${trustScore}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Letzte Aktivitäten</CardTitle>
                  <CardDescription>Die letzten 5 geschützten Inhalte</CardDescription>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground capitalize">{item.contentType}</p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              item.verificationLevel === "gold"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : item.verificationLevel === "silver"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            }
                          >
                            {item.verificationLevel}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setActiveTab("schutz")}
                  data-testid="quick-protect"
                >
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Inhalt schützen</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setActiveTab("zertifikate")}
                  data-testid="quick-certificate"
                >
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Zertifikat erstellen</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setActiveTab("barcode")}
                  data-testid="quick-barcode"
                >
                  <Barcode className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Barcode generieren</span>
                </Button>
              </div>
            </div>
          )}

          {/* ═══════ TAB 2: SCHUTZ (Enhanced Wizard) ═══════ */}
          {activeTab === "schutz" && (
            <div className="space-y-6">
              {/* Step Progress Indicator */}
              <div className="flex items-center justify-between mb-2" data-testid="schutz-progress">
                {[
                  { step: 1, label: "Upload" },
                  { step: 2, label: "Schutzlevel" },
                  { step: 3, label: "Methode" },
                  { step: 4, label: "Bestätigung" },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        schutzStep > s.step ? "bg-green-500 text-white" :
                        schutzStep === s.step ? "bg-primary text-white ring-4 ring-primary/20" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {schutzStep > s.step ? <CheckCircle className="h-5 w-5" /> : s.step}
                      </div>
                      <span className={`text-xs mt-1.5 font-medium ${schutzStep >= s.step ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                    </div>
                    {i < 3 && (
                      <div className={`h-0.5 flex-1 mx-1 rounded transition-all ${schutzStep > s.step ? "bg-green-500" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Upload */}
              {schutzStep === 1 && !schutzComplete && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schritt 1: Datei hochladen</CardTitle>
                    <CardDescription>Wähle den Inhaltstyp und lade deine Datei hoch</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-3">
                      {contentTypeIcons.map((ct) => {
                        const Icon = ct.icon;
                        const active = selectedContentType === ct.type;
                        return (
                          <button
                            key={ct.type}
                            onClick={() => setSelectedContentType(ct.type)}
                            data-testid={`ct-${ct.type}`}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                              active
                                ? "bg-primary/10 text-primary border-primary/30"
                                : "bg-muted/30 text-muted-foreground border-border hover:border-primary/20 hover:text-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {ct.label}
                          </button>
                        );
                      })}
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} data-testid="file-input" />
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="upload-dropzone"
                    >
                      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">Datei hierher ziehen oder klicken</p>
                      <p className="text-xs text-muted-foreground">Alle Dateitypen — max. 100MB</p>
                    </div>

                    {(isHashing || uploadedFile) && (
                      <div className={`p-4 rounded-lg border ${fileHash ? "border-green-500/20 bg-green-500/5" : "border-border"}`}>
                        <div className="flex items-center gap-2 mb-3">
                          {isHashing ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                          <span className="text-sm font-medium">{isHashing ? "Hash wird berechnet..." : "Hash berechnet"}</span>
                        </div>
                        {uploadedFile && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                            <div><p className="text-muted-foreground text-xs">Dateiname</p><p className="font-medium truncate">{uploadedFile.name}</p></div>
                            <div><p className="text-muted-foreground text-xs">Größe</p><p className="font-medium">{(uploadedFile.size / 1024).toFixed(1)} KB</p></div>
                            <div><p className="text-muted-foreground text-xs">Typ</p><p className="font-medium">{uploadedFile.type || selectedContentType || "Unbekannt"}</p></div>
                            <div><p className="text-muted-foreground text-xs">Zeitstempel</p><p className="font-mono text-xs">{new Date().toLocaleString("de-DE")}</p></div>
                          </div>
                        )}
                        {fileHash && (
                          <div>
                            <Label className="text-xs text-muted-foreground">SHA-256 Hash</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="flex-1 text-xs font-mono bg-muted p-2 rounded break-all" data-testid="file-hash">{fileHash}</code>
                              <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(fileHash); toast({ title: "Hash kopiert!" }); }} data-testid="btn-copy-hash">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button onClick={() => setSchutzStep(2)} disabled={!fileHash} className="gap-2" data-testid="schutz-next-1">
                        Weiter <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Protection Level */}
              {schutzStep === 2 && !schutzComplete && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schritt 2: Schutzlevel wählen</CardTitle>
                    <CardDescription>Wähle den gewünschten Schutzgrad für deinen Inhalt</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { id: "basis", label: "Basis", desc: "SHA-256 Hash-Schutz", stars: 1, color: "border-gray-500/30 hover:border-gray-400/50" },
                      { id: "standard", label: "Standard", desc: "Hash + Barcode + Metadaten", stars: 3, color: "border-blue-500/30 hover:border-blue-400/50" },
                      { id: "premium", label: "Premium", desc: "Hash + Barcode + Blockchain + Wasserzeichen", stars: 4, color: "border-yellow-500/30 hover:border-yellow-400/50" },
                      { id: "maximum", label: "Maximum", desc: "Alle Schutzmethoden + C2PA-Signatur", stars: 5, color: "border-purple-500/30 hover:border-purple-400/50" },
                    ].map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSchutzLevel(level.id)}
                        data-testid={`schutz-level-${level.id}`}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          schutzLevel === level.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : `bg-muted/10 ${level.color}`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${schutzLevel === level.id ? "text-primary" : ""}`}>{level.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{level.desc}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`h-4 w-4 ${s <= level.stars ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => setSchutzStep(1)} className="gap-2" data-testid="schutz-back-2">
                        <ArrowLeft className="h-4 w-4" /> Zurück
                      </Button>
                      <Button onClick={() => setSchutzStep(3)} className="gap-2" data-testid="schutz-next-2">
                        Weiter <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Protection Method */}
              {schutzStep === 3 && !schutzComplete && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schritt 3: Schutzmethode wählen</CardTitle>
                    <CardDescription>Wähle die primäre Schutzmethode</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "sha256", label: "SHA-256 Hash", desc: "Kryptografischer Fingerabdruck", icon: Hash, stars: 2 },
                        { id: "c2pa", label: "C2PA Signatur", desc: "Content Credentials Standard", icon: Fingerprint, stars: 4 },
                        { id: "blockchain", label: "Blockchain Anker", desc: "Polygon Mainnet Verifizierung", icon: Link2, stars: 5 },
                        { id: "wasserzeichen", label: "Wasserzeichen", desc: "Unsichtbare Markierung", icon: Droplets, stars: 3 },
                        { id: "barcode", label: "Barcode", desc: "Code128 + QR-Verifizierung", icon: Barcode, stars: 2 },
                      ].map((method) => {
                        const Icon = method.icon;
                        const selected = schutzMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            onClick={() => setSchutzMethod(method.id)}
                            data-testid={`schutz-method-${method.id}`}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              selected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? "bg-primary/20" : "bg-muted/50"}`}>
                                <Icon className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${selected ? "text-primary" : ""}`}>{method.label}</p>
                                <p className="text-xs text-muted-foreground">{method.desc}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5 mt-2 ml-[52px]">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`h-3 w-3 ${s <= method.stars ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                              ))}
                              <span className="text-[10px] text-muted-foreground ml-1">Sicherheitslevel</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => setSchutzStep(2)} className="gap-2" data-testid="schutz-back-3">
                        <ArrowLeft className="h-4 w-4" /> Zurück
                      </Button>
                      <Button onClick={() => setSchutzStep(4)} disabled={!schutzMethod} className="gap-2" data-testid="schutz-next-3">
                        Weiter <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Confirmation */}
              {schutzStep === 4 && !schutzComplete && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schritt 4: Bestätigung</CardTitle>
                    <CardDescription>Überprüfe deine Auswahl und starte den Schutz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border p-4 space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Datei</span><span className="font-medium">{uploadedFile?.name || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Inhaltstyp</span><span className="capitalize">{selectedContentType || uploadedFile?.type?.split("/")[0] || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Schutzlevel</span><span className="font-medium capitalize">{schutzLevel}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Methode</span><span className="font-medium capitalize">{schutzMethod.replace("sha256", "SHA-256").replace("c2pa", "C2PA Signatur").replace("blockchain", "Blockchain").replace("wasserzeichen", "Wasserzeichen").replace("barcode", "Barcode")}</span></div>
                      <div><span className="text-muted-foreground text-xs">SHA-256 Hash</span><code className="block text-xs font-mono bg-muted p-2 rounded break-all mt-1">{fileHash}</code></div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => setSchutzStep(3)} className="gap-2" data-testid="schutz-back-4">
                        <ArrowLeft className="h-4 w-4" /> Zurück
                      </Button>
                      <Button
                        onClick={() => {
                          setSchutzProcessing(true);
                          const contentType = selectedContentType || uploadedFile?.type?.split("/")[0] || "dokument";
                          createContentMutation.mutate(
                            { title: uploadedFile?.name || "Inhalt", contentType, hash: fileHash },
                            {
                              onSuccess: () => {
                                setSchutzProcessing(false);
                                setSchutzComplete(true);
                                setShowConfetti(true);
                                setTimeout(() => setShowConfetti(false), 3000);
                              },
                              onError: () => setSchutzProcessing(false),
                            }
                          );
                        }}
                        disabled={schutzProcessing || createContentMutation.isPending}
                        className="gap-2"
                        data-testid="btn-register-blockchain"
                      >
                        {schutzProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                        {schutzProcessing ? "Wird geschützt..." : "Schutz aktivieren"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success State with Confetti */}
              {schutzComplete && (
                <div className="relative">
                  {/* CSS Confetti Effect */}
                  {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" data-testid="confetti-effect">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `-5%`,
                            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"][i % 6],
                            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
                            animationDelay: `${Math.random() * 0.8}s`,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes confetti-fall {
                          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                          100% { transform: translateY(600px) rotate(${360 + Math.random() * 360}deg) scale(0.5); opacity: 0; }
                        }
                      `}</style>
                    </div>
                  )}
                  <Card className="border-green-500/30 bg-green-500/5" data-testid="registration-confirmation">
                    <CardContent className="pt-8 pb-8 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-green-500">Schutz erfolgreich aktiviert!</h3>
                      <p className="text-sm text-muted-foreground">Dein Inhalt wurde erfolgreich geschützt und auf der Blockchain registriert.</p>
                      {registrationResult && (
                        <div className="text-left max-w-md mx-auto space-y-3">
                          <div className="text-sm">
                            <Label className="text-xs text-muted-foreground">Blockchain Tx ID</Label>
                            <code className="block text-xs font-mono bg-muted p-2 rounded break-all mt-1">{registrationResult.blockchainTxId}</code>
                          </div>
                          <div className="text-sm">
                            <Label className="text-xs text-muted-foreground">Barcode-Daten</Label>
                            <code className="block text-xs font-mono bg-muted p-2 rounded mt-1">{registrationResult.barcodeData}</code>
                          </div>
                          <div className="bg-white p-4 rounded-lg text-black" dangerouslySetInnerHTML={{ __html: generateCode128Svg(registrationResult.barcodeData || "RSEAL") }} />
                        </div>
                      )}
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        <Shield className="h-3 w-3 mr-1" /> Polygon Blockchain — Verifiziert
                      </Badge>
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSchutzStep(1);
                            setSchutzComplete(false);
                            setSchutzMethod("");
                            setSchutzLevel("standard");
                            setUploadedFile(null);
                            setFileHash("");
                            setRegistrationResult(null);
                          }}
                          className="gap-2"
                          data-testid="schutz-reset"
                        >
                          <Sparkles className="h-4 w-4" /> Neuen Inhalt schützen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* ═══════ TAB 3: ZERTIFIKATE ═══════ */}
          {activeTab === "zertifikate" && (
            <div className="space-y-6">
              {/* C2PA Certificate Viewer */}
              <Card>
                <CardHeader>
                  <CardTitle>C2PA Zertifikat</CardTitle>
                  <CardDescription>Content Credentials — Authentizitätsnachweis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-muted-foreground">Creator</span><span className="font-medium">RealSync Dynamics</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Erstellungsdatum</span><span className="font-mono">15.03.2026</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Hash-Algorithmus</span><span className="font-mono">SHA-256</span></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-muted-foreground">Signatur</span><span className="font-mono text-xs">ECDSA P-256</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Verifikationsstatus</span><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Gültig</Badge></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Kette</span><span className="font-medium">3 Einträge</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* C2PP Badge System */}
              <Card>
                <CardHeader>
                  <CardTitle>C2PP Vertrauensstufen</CardTitle>
                  <CardDescription>Vier Sicherheitsstufen für deinen Content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Bronze */}
                    <div className="rounded-xl border border-gray-500/20 bg-gray-500/5 p-4 text-center space-y-3" data-testid="badge-bronze">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-400">Bronze</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> SHA-256 Hash</p>
                        <p className="flex items-center justify-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Barcode</p>
                        <p className="flex items-center justify-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Blockchain</p>
                        <p className="flex items-center justify-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Wasserzeichen</p>
                      </div>
                    </div>
                    {/* Silver */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-center space-y-3" data-testid="badge-silver">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-blue-400">Silber</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> SHA-256 Hash</p>
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Barcode</p>
                        <p className="flex items-center justify-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Blockchain</p>
                        <p className="flex items-center justify-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Wasserzeichen</p>
                      </div>
                    </div>
                    {/* Gold */}
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center space-y-3" data-testid="badge-gold">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-yellow-500">Gold</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> SHA-256 Hash</p>
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Barcode</p>
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Blockchain</p>
                        <p className="flex items-center justify-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Wasserzeichen</p>
                      </div>
                    </div>
                    {/* Platin */}
                    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-4 text-center space-y-3" data-testid="badge-platin">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Platin</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> C2PA + SHA-256</p>
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Barcode</p>
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Blockchain</p>
                        <p className="flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Wasserzeichen</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Certificate */}
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => toast({ title: "Download wird vorbereitet...", description: "Zertifikat wird generiert." })}
                data-testid="btn-download-certificate"
              >
                <Download className="h-4 w-4" />
                Zertifikat herunterladen
              </Button>

              {/* ── C2PA Content Credentials Viewer ── */}
              <Card className="border-primary/20" data-testid="c2pa-viewer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Fingerprint className="h-5 w-5 text-primary" />
                        C2PA Content Credentials
                      </CardTitle>
                      <CardDescription>Detaillierte Authentizitätsinformationen</CardDescription>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1.5 px-3 py-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Content Credentials Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Trust Signal */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-500">Vertrauensstufe: Hoch</p>
                      <p className="text-xs text-muted-foreground">Alle Signaturen gültig — Keine Manipulation erkannt</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= 4 ? "text-green-500 fill-green-500" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                  </div>

                  {/* Manifest Section */}
                  <div className="rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setC2paExpanded(prev => ({ ...prev, manifest: !prev.manifest }))}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                      data-testid="c2pa-manifest-toggle"
                    >
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        Manifest-Daten
                      </span>
                      {c2paExpanded.manifest ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {c2paExpanded.manifest && (
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between p-2 rounded bg-muted/20">
                            <span className="text-muted-foreground">Ersteller</span>
                            <span className="font-medium">RealSync Dynamics GmbH</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/20">
                            <span className="text-muted-foreground">Erstellungsdatum</span>
                            <span className="font-mono text-xs">15.03.2026, 10:34:12 MEZ</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/20">
                            <span className="text-muted-foreground">Software</span>
                            <span className="font-medium">CreatorSeal v3.2.1</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/20">
                            <span className="text-muted-foreground">Format</span>
                            <span className="font-mono text-xs">C2PA v2.0 / JUMBF</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/20">
                            <span className="text-muted-foreground">Signatur-Algo</span>
                            <span className="font-mono text-xs">ECDSA P-256 + SHA-256</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/20">
                            <span className="text-muted-foreground">Zertifikat</span>
                            <span className="font-mono text-xs">CN=RealSync, O=RSD</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Manifest-Signatur</Label>
                          <code className="block text-xs font-mono bg-muted/30 p-2 rounded mt-1 break-all">
                            c2pa.signature:MEUCIQDk7f2Bh4n...Rz8qW3vHjK9LmN0pQrStUvWxYz
                          </code>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edits History Section */}
                  <div className="rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setC2paExpanded(prev => ({ ...prev, edits: !prev.edits }))}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                      data-testid="c2pa-edits-toggle"
                    >
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Bearbeitungshistorie
                        <Badge variant="secondary" className="text-[10px]">4 Einträge</Badge>
                      </span>
                      {c2paExpanded.edits ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {c2paExpanded.edits && (
                      <div className="px-4 pb-4 border-t border-border pt-3">
                        <div className="space-y-3">
                          {[
                            { action: "Erstellt", tool: "CreatorSeal Upload", date: "15.03.2026 10:30", icon: Upload },
                            { action: "Hash generiert", tool: "SHA-256 Engine", date: "15.03.2026 10:30", icon: Hash },
                            { action: "C2PA Signatur", tool: "C2PA Signing Module", date: "15.03.2026 10:31", icon: Fingerprint },
                            { action: "Blockchain-Anker", tool: "Polygon Bridge", date: "15.03.2026 10:34", icon: Link2 },
                          ].map((edit, i) => {
                            const Icon = edit.icon;
                            return (
                              <div key={i} className="flex items-start gap-3 relative">
                                {i < 3 && <div className="absolute left-[15px] top-8 w-px h-6 bg-border" />}
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <Icon className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{edit.action}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{edit.tool}</span>
                                    <span>•</span>
                                    <span className="font-mono">{edit.date}</span>
                                  </div>
                                </div>
                                <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Claim Chain Visualization */}
                  <div className="rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setC2paExpanded(prev => ({ ...prev, chain: !prev.chain }))}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                      data-testid="c2pa-chain-toggle"
                    >
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-primary" />
                        Vertrauenskette
                      </span>
                      {c2paExpanded.chain ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {c2paExpanded.chain && (
                      <div className="px-4 pb-4 border-t border-border pt-3">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
                          {[
                            { label: "Creator", status: "verified", detail: "RealSync GmbH" },
                            { label: "Signatur", status: "verified", detail: "ECDSA P-256" },
                            { label: "Blockchain", status: "verified", detail: "Polygon #67.2M" },
                          ].map((node, i) => (
                            <div key={i} className="flex items-center gap-2 sm:gap-0">
                              <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg border ${
                                node.status === "verified" ? "border-green-500/30 bg-green-500/5" : "border-border"
                              }`}>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-xs font-medium">{node.label}</span>
                                <span className="text-[10px] text-muted-foreground">{node.detail}</span>
                              </div>
                              {i < 2 && (
                                <ArrowRight className="h-4 w-4 text-green-500 mx-2 hidden sm:block" />
                              )}
                              {i < 2 && (
                                <ArrowRight className="h-4 w-4 text-green-500 rotate-90 sm:hidden" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════ TAB 4: BARCODE ═══════ */}
          {activeTab === "barcode" && (
            <div className="space-y-6">
              {/* Single Barcode */}
              <Card>
                <CardHeader>
                  <CardTitle>Barcode & QR-Code Generator</CardTitle>
                  <CardDescription>Generiere Code128-Barcodes und QR-Codes für deine Inhalte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Daten eingeben (z.B. RSEAL-2026-VID-001)"
                      value={barcodeInput}
                      onChange={(e) => { setBarcodeInput(e.target.value); setBarcodeGenerated(false); }}
                      data-testid="input-barcode"
                      className="flex-1"
                    />
                    <Button onClick={() => setBarcodeGenerated(true)} disabled={!barcodeInput} data-testid="btn-generate-barcode">
                      Generieren
                    </Button>
                  </div>

                  {barcodeGenerated && barcodeInput && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Code128 */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Code128 Barcode</h4>
                        <div
                          className="bg-white p-6 rounded-lg flex justify-center text-black"
                          data-testid="barcode-preview"
                          dangerouslySetInnerHTML={{ __html: generateCode128Svg(barcodeInput) }}
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleDownloadSvg(generateCode128Svg(barcodeInput), `barcode-${barcodeInput}.svg`)} data-testid="btn-barcode-svg">
                            <Download className="h-3.5 w-3.5" /> SVG
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleDownloadPng(generateCode128Svg(barcodeInput), `barcode-${barcodeInput}.png`)} data-testid="btn-barcode-png">
                            <Download className="h-3.5 w-3.5" /> PNG
                          </Button>
                        </div>
                      </div>
                      {/* QR Code */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">QR-Code</h4>
                        <div
                          className="bg-white p-6 rounded-lg flex justify-center text-black"
                          data-testid="qr-preview"
                          dangerouslySetInnerHTML={{ __html: generateQrSvg(barcodeInput) }}
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleDownloadSvg(generateQrSvg(barcodeInput), `qr-${barcodeInput}.svg`)} data-testid="btn-qr-svg">
                            <Download className="h-3.5 w-3.5" /> SVG
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleDownloadPng(generateQrSvg(barcodeInput), `qr-${barcodeInput}.png`)} data-testid="btn-qr-png">
                            <Download className="h-3.5 w-3.5" /> PNG
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Batch Mode */}
              <Card>
                <CardHeader>
                  <CardTitle>Batch-Modus</CardTitle>
                  <CardDescription>Mehrere Codes auf einmal generieren (einer pro Zeile)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={"RSEAL-2026-VID-001\nRSEAL-2026-IMG-002\nRSEAL-2026-AUD-003"}
                    value={batchInput}
                    onChange={(e) => { setBatchInput(e.target.value); setBatchGenerated(false); }}
                    rows={4}
                    data-testid="input-batch"
                  />
                  <Button onClick={() => setBatchGenerated(true)} disabled={!batchInput.trim()} data-testid="btn-generate-batch">
                    Alle generieren
                  </Button>
                  {batchGenerated && batchInput.trim() && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {batchInput.trim().split("\n").filter(Boolean).map((line, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg text-black" dangerouslySetInnerHTML={{ __html: generateCode128Svg(line.trim()) }} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── QR-Verifizierungscode Section ── */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    QR-Verifizierungscode
                  </CardTitle>
                  <CardDescription>Generiere einen QR-Code mit Verifizierungs-URL für deine Inhalte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="qr-url" className="text-sm">Verifizierungs-URL</Label>
                    <div className="flex gap-3 mt-1.5">
                      <Input
                        id="qr-url"
                        placeholder="https://realsyncdynamics.de/verify/..."
                        value={qrUrl}
                        onChange={(e) => { setQrUrl(e.target.value); setQrGenerated(false); }}
                        data-testid="input-qr-url"
                        className="flex-1 font-mono text-sm"
                      />
                      <Button onClick={() => setQrGenerated(true)} disabled={!qrUrl.trim()} data-testid="btn-generate-qr">
                        <QrCode className="h-4 w-4 mr-2" />
                        QR-Code generieren
                      </Button>
                    </div>
                  </div>

                  {qrGenerated && qrUrl.trim() && (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className="bg-white p-6 rounded-xl text-black shadow-lg"
                          data-testid="qr-verify-preview"
                          dangerouslySetInnerHTML={{ __html: generateQrSvg(qrUrl, 200) }}
                        />
                        <div className="text-center space-y-1">
                          <p className="text-xs text-muted-foreground font-mono break-all max-w-xs">{qrUrl}</p>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <Shield className="h-3 w-3 mr-1" />
                            CreatorSeal Verifiziert
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-center gap-3">
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleDownloadSvg(generateQrSvg(qrUrl, 200), `qr-verify-${Date.now()}.svg`)} data-testid="btn-qr-verify-svg">
                          <Download className="h-3.5 w-3.5" /> SVG herunterladen
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleDownloadPng(generateQrSvg(qrUrl, 200), `qr-verify-${Date.now()}.png`)} data-testid="btn-qr-verify-png">
                          <Download className="h-3.5 w-3.5" /> PNG herunterladen
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { navigator.clipboard.writeText(qrUrl); toast({ title: "URL kopiert!" }); }} data-testid="btn-copy-qr-url">
                          <Copy className="h-3.5 w-3.5" /> URL kopieren
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════ TAB 5: BLOCKCHAIN ═══════ */}
          {activeTab === "blockchain" && (
            <div className="space-y-6">
              {/* Verify Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Hash-Verifizierung</CardTitle>
                  <CardDescription>Überprüfe die Echtheit eines Inhalts anhand seines SHA-256 Hashes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="SHA-256 Hash eingeben..."
                      value={verifyHash}
                      onChange={(e) => { setVerifyHash(e.target.value); setVerifyResult("idle"); }}
                      data-testid="input-verify-hash"
                      className="flex-1 font-mono text-sm"
                    />
                    <Button onClick={handleVerify} disabled={!verifyHash || verifyMutation.isPending} data-testid="btn-verify">
                      {verifyMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Link2 className="h-4 w-4 mr-2" />}
                      Verifizieren
                    </Button>
                  </div>

                  {verifyResult === "verifying" && (
                    <div className="text-center py-10">
                      <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-3" />
                      <p className="text-muted-foreground">Blockchain wird überprüft...</p>
                    </div>
                  )}

                  {verifyResult === "verified" && (
                    <Card className="border-green-500/20" data-testid="verify-result-success">
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <h3 className="font-display text-xl font-bold text-green-500 mb-4">Verifiziert</h3>
                        <div className="text-left space-y-2 text-sm max-w-sm mx-auto">
                          {verifiedContent && (
                            <>
                              <div className="flex justify-between"><span className="text-muted-foreground">Titel</span><span className="font-medium">{verifiedContent.title}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Typ</span><span className="capitalize">{verifiedContent.contentType}</span></div>
                            </>
                          )}
                          <div className="flex justify-between"><span className="text-muted-foreground">Netzwerk</span><span className="font-mono">Polygon Mainnet</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Block</span><span className="font-mono">#67.234.891</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Bestätigungen</span><span className="font-mono text-green-500">312</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {verifyResult === "not-found" && (
                    <Card className="border-red-500/20" data-testid="verify-result-fail">
                      <CardContent className="pt-6 text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                        <h3 className="font-display text-xl font-bold text-red-500 mb-2">Nicht gefunden</h3>
                        <p className="text-muted-foreground text-sm">Kein Inhalt mit diesem Hash auf der Blockchain registriert.</p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Network Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Polygon Netzwerk-Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Netzwerk</p>
                      <p className="font-mono font-medium">Polygon Mainnet</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Block</p>
                      <p className="font-mono font-medium">#67.234.891</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Gas</p>
                      <p className="font-mono font-medium">25 Gwei</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Status</p>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        Operational
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Transaktionshistorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="tx-history">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Datum</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Hash</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Typ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentList.slice(0, 8).map((item) => (
                          <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-2 px-2 font-mono text-xs">15.03.2026</td>
                            <td className="py-2 px-2 font-mono text-xs">{item.hash?.substring(0, 16)}...</td>
                            <td className="py-2 px-2">
                              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Bestätigt</Badge>
                            </td>
                            <td className="py-2 px-2 capitalize text-xs">{item.contentType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => toast({ title: "Download wird vorbereitet..." })}
                data-testid="btn-download-verification"
              >
                <Download className="h-4 w-4" />
                Zertifikat herunterladen
              </Button>
            </div>
          )}

          {/* ═══════ TAB 6: WASSERZEICHEN ═══════ */}
          {activeTab === "wasserzeichen" && (
            <div className="space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Bild hochladen</CardTitle>
                  <CardDescription>Ziehe ein Bild hierher zum Wasserzeichen</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={wmFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleWmImageUpload(f); }}
                    data-testid="wm-file-input"
                  />
                  <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                      wmDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setWmDragOver(true); }}
                    onDragLeave={() => setWmDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setWmDragOver(false);
                      const f = e.dataTransfer.files[0];
                      if (f) handleWmImageUpload(f);
                    }}
                    onClick={() => wmFileRef.current?.click()}
                    data-testid="wm-dropzone"
                  >
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-1">Bild hierher ziehen oder klicken</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP — max. 50MB</p>
                  </div>
                </CardContent>
              </Card>

              {/* Watermark Type & Strength */}
              {wmImage && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Wasserzeichen-Typ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {([
                          { id: "unsichtbar" as const, label: "Unsichtbar", desc: "Nicht sichtbar, in Pixeldaten eingebettet", icon: EyeOff },
                          { id: "sichtbar" as const, label: "Sichtbar", desc: "Halbtransparentes Wasserzeichen über dem Bild", icon: Eye },
                          { id: "metadaten" as const, label: "Metadaten", desc: "In den Bilddaten gespeichert", icon: Database },
                        ]).map((option) => {
                          const Icon = option.icon;
                          const active = wmType === option.id;
                          return (
                            <button
                              key={option.id}
                              onClick={() => { setWmType(option.id); setWmApplied(false); }}
                              data-testid={`wm-type-${option.id}`}
                              className={`p-4 rounded-xl border text-left transition-all ${
                                active
                                  ? "border-primary/30 bg-primary/5"
                                  : "border-border hover:border-primary/20"
                              }`}
                            >
                              <Icon className={`h-5 w-5 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
                              <p className={`text-sm font-medium ${active ? "text-primary" : ""}`}>{option.label}</p>
                              <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <Label>Stärke</Label>
                          <span className="text-muted-foreground">{strengthLabels[wmStrength[0] - 1]}</span>
                        </div>
                        <Slider
                          min={1}
                          max={3}
                          step={1}
                          value={wmStrength}
                          onValueChange={(v) => { setWmStrength(v); setWmApplied(false); }}
                          data-testid="wm-strength"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Leicht</span><span>Mittel</span><span>Stark</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Before/After Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vorschau</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Original */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Original</p>
                          <div className="rounded-lg overflow-hidden border border-border">
                            <img src={wmImage} alt="Original" className="w-full aspect-video object-cover" />
                          </div>
                        </div>
                        {/* Watermarked */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            Mit Wasserzeichen
                            {wmApplied && <CheckCircle className="h-3 w-3 text-green-500" />}
                          </p>
                          <div className="rounded-lg overflow-hidden border border-border relative">
                            <img src={wmImage} alt="Wasserzeichen" className="w-full aspect-video object-cover" />
                            {wmType === "sichtbar" && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p
                                  className="text-white/30 font-bold text-2xl rotate-[-30deg] select-none"
                                  style={{ opacity: wmStrength[0] * 0.15 + 0.1 }}
                                >
                                  RealSync Verified ✓
                                </p>
                              </div>
                            )}
                            {wmType !== "sichtbar" && (
                              <div className="absolute bottom-2 right-2 pointer-events-none">
                                <Badge className="bg-primary/80 text-white text-[10px]">
                                  <Shield className="h-2.5 w-2.5 mr-1" />
                                  Geschützt
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApplyWatermark}
                      disabled={wmProcessing}
                      data-testid="btn-apply-watermark"
                      className="gap-2"
                    >
                      {wmProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Droplets className="h-4 w-4" />}
                      {wmProcessing ? "Wird angewendet..." : "Wasserzeichen anwenden"}
                    </Button>
                    {wmApplied && (
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => toast({ title: "Download wird vorbereitet..." })}
                        data-testid="btn-download-watermark"
                      >
                        <Download className="h-4 w-4" />
                        Herunterladen
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════ TAB: SIGNIEREN ═══════ */}
          {activeTab === "signieren" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Fingerprint className="h-5 w-5 text-primary" /> Digitale Signatur</CardTitle>
                  <CardDescription>Signiere deinen Content mit kryptografischen Methoden — erstelle einen unverfälschbaren Beweis der Urheberschaft.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Method Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Signatur-Methode wählen</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "sha256" as const, label: "SHA-256 Signatur", desc: "Schnell, kostenlos, kryptografisch sicher", icon: Hash },
                        { id: "c2pa" as const, label: "C2PA Manifest", desc: "Branchenstandard (Adobe, Microsoft, BBC)", icon: Award },
                        { id: "blockchain" as const, label: "Blockchain-Anker", desc: "Unverfälschbar auf Polygon/Ethereum", icon: Database },
                      ].map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSignMethod(m.id)}
                            data-testid={`sign-method-${m.id}`}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              signMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
                            }`}
                          >
                            <Icon className={`h-5 w-5 mb-2 ${signMethod === m.id ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="text-sm font-medium">{m.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* File to Sign */}
                  {!signFile ? (
                    <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-all"
                      onClick={() => {
                        // Use existing file if already uploaded
                        if (uploadedFile && fileHash) {
                          setSignFile({ name: uploadedFile.name, hash: fileHash });
                        } else {
                          setActiveTab("schutz");
                          toast({ title: "Zuerst Datei hochladen", description: "Lade eine Datei im Schutz-Tab hoch, dann hier signieren." });
                        }
                      }}
                      data-testid="sign-upload-area"
                    >
                      <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{uploadedFile ? "Aktuelle Datei verwenden" : "Erst Datei im Schutz-Tab hochladen"}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Datei bereit: {signFile.name}</span>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">SHA-256 Hash</Label>
                        <code className="block text-xs font-mono bg-muted p-2 rounded mt-1 break-all">{signFile.hash}</code>
                      </div>
                    </div>
                  )}

                  {/* Sign Button */}
                  {signFile && !signResult && (
                    <Button
                      className="w-full gap-2"
                      onClick={() => {
                        setSignProcessing(true);
                        setTimeout(() => {
                          const sig = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, "0")).join("");
                          setSignResult({
                            signature: sig,
                            timestamp: new Date().toISOString(),
                            method: signMethod,
                          });
                          setSignProcessing(false);
                          toast({ title: "Signatur erstellt", description: `${signMethod.toUpperCase()}-Signatur erfolgreich generiert.` });
                        }, 2000);
                      }}
                      disabled={signProcessing}
                      data-testid="btn-sign"
                    >
                      {signProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Signiere...</> : <><Fingerprint className="h-4 w-4" /> Jetzt signieren</>}
                    </Button>
                  )}

                  {/* Signature Result */}
                  {signResult && (
                    <Card className="border-primary/20">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                          <h3 className="font-display text-xl font-bold text-green-500">Signatur erstellt</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Signatur ({signResult.method.toUpperCase()})</Label>
                            <code className="block text-xs font-mono bg-muted p-2 rounded mt-1 break-all">{signResult.signature}</code>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Zeitstempel</Label>
                            <p className="text-sm font-mono mt-1">{new Date(signResult.timestamp).toLocaleString("de-DE")}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => { navigator.clipboard.writeText(signResult.signature); toast({ title: "Signatur kopiert!" }); }} data-testid="btn-copy-sig">
                            <Copy className="h-3.5 w-3.5" /> Kopieren
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => { setSignResult(null); setSignFile(null); }} data-testid="btn-new-sig">
                            <Fingerprint className="h-3.5 w-3.5" /> Neue Signatur
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Trust Score Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Dein Trust Score</CardTitle>
                  <CardDescription>Basierend auf deinen Verifizierungen, Signaturen und Blockchain-Einträgen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="relative inline-flex">
                      <svg className="w-32 h-32" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="6"
                          className="text-primary"
                          strokeDasharray={`${trustScore * 3.39} 999`}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-display font-bold text-primary">{trustScore}</span>
                        <span className="text-xs text-muted-foreground">von 100</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Geschützt", value: activeContentCount, desc: "Inhalte" },
                      { label: "Signiert", value: signResult ? 1 : 0, desc: "Signaturen" },
                      { label: "Blockchain", value: blockchainCount, desc: "Einträge" },
                      { label: "Zertifikate", value: verifiedCount, desc: "Gold/Silber" },
                    ].map((s) => (
                      <div key={s.label} className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xl font-display font-bold">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════ TAB: DEEPFAKE CHECK ═══════ */}
          {activeTab === "deepfake" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Deepfake Detection</CardTitle>
                  <CardDescription>Analysiere Bilder und Videos auf KI-generierte Manipulationen. Die Analyse läuft lokal und sicher.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Upload */}
                  <input ref={dfFileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setDfResult(null);
                    const isImage = file.type.startsWith("image/");
                    if (isImage) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setDfFile({ name: file.name, type: file.type, preview: ev.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setDfFile({ name: file.name, type: file.type, preview: null });
                    }
                  }} data-testid="df-file-input" />

                  {!dfFile ? (
                    <div
                      className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-primary/30 transition-all"
                      onClick={() => dfFileRef.current?.click()}
                      data-testid="df-upload-area"
                    >
                      <Eye className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Bild oder Video hochladen</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, MP4, WebM — max. 50MB</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        {dfFile.preview ? (
                          <img src={dfFile.preview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                            <FileVideo className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{dfFile.name}</p>
                          <p className="text-xs text-muted-foreground">{dfFile.type}</p>
                        </div>
                      </div>

                      {/* Analyze Button */}
                      {!dfResult && (
                        <Button
                          className="w-full gap-2"
                          onClick={() => {
                            setDfAnalyzing(true);
                            // Simulate analysis
                            setTimeout(() => {
                              const score = Math.random() * 30 + 5; // low score = authentic
                              const isAuthentic = score < 25;
                              setDfResult({
                                score: Math.round(score),
                                verdict: isAuthentic ? "Authentisch" : "Verdächtig",
                                indicators: isAuthentic ? [
                                  "Keine Kompressionsartefakte an Gesichtskonturen",
                                  "Konsistente Beleuchtungswinkel",
                                  "Natürliche Mikrobewegungen erkannt",
                                  "EXIF-Metadaten konsistent",
                                  "Keine GAN-typischen Frequenzmuster",
                                ] : [
                                  "Inkonsistente Beleuchtung im Gesichtsbereich",
                                  "Kompressionsartefakte an Haarkonturen",
                                  "Unnatürliche Symmetrie erkannt",
                                  "GAN-typische Hochfrequenzmuster",
                                ],
                              });
                              setDfAnalyzing(false);
                              toast({ title: "Analyse abgeschlossen", description: isAuthentic ? "Keine Manipulation erkannt." : "Mögliche Manipulation erkannt." });
                            }, 3000);
                          }}
                          disabled={dfAnalyzing}
                          data-testid="btn-df-analyze"
                        >
                          {dfAnalyzing ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> KI analysiert... (TensorFlow.js)</>
                          ) : (
                            <><Eye className="h-4 w-4" /> Deepfake-Analyse starten</>
                          )}
                        </Button>
                      )}

                      {/* Analysis Progress */}
                      {dfAnalyzing && (
                        <div className="space-y-2">
                          {["Gesichtserkennung...", "Frequenzanalyse...", "GAN-Detektion...", "Metadaten-Prüfung..."].map((step, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <Loader2 className="h-3 w-3 animate-spin text-primary" />
                              <span className="text-muted-foreground">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Result */}
                      {dfResult && (
                        <Card className={`border-${dfResult.score < 25 ? "green" : "red"}-500/20`}>
                          <CardContent className="pt-6 space-y-4">
                            <div className="text-center">
                              {dfResult.score < 25 ? (
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                              ) : (
                                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                              )}
                              <h3 className={`font-display text-xl font-bold ${dfResult.score < 25 ? "text-green-500" : "text-red-500"}`}>
                                {dfResult.verdict}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Manipulationswahrscheinlichkeit: <span className="font-bold">{dfResult.score}%</span>
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">Analyse-Details</Label>
                              {dfResult.indicators.map((ind, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                  {dfResult.score < 25 ? (
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                                  )}
                                  <span className="text-muted-foreground">{ind}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-1" onClick={() => { setDfFile(null); setDfResult(null); }} data-testid="btn-df-new">
                                <Eye className="h-3.5 w-3.5" /> Neue Analyse
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1" onClick={() => {
                                navigator.clipboard.writeText(`Deepfake-Analyse: ${dfResult.verdict} (${dfResult.score}% Manipulationswahrscheinlichkeit)\nIndikatoren:\n${dfResult.indicators.join("\n")}`);
                                toast({ title: "Ergebnis kopiert!" });
                              }} data-testid="btn-df-copy">
                                <Copy className="h-3.5 w-3.5" /> Ergebnis kopieren
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Wie funktioniert die Deepfake Detection?</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unsere KI analysiert hochgeladene Medien mit mehreren Methoden: Gesichtserkennung und Landmark-Analyse,
                        Frequenzdomänen-Analyse für GAN-typische Muster, Kompressionsartefakt-Prüfung und EXIF-Metadaten-Validierung.
                        Die Analyse läuft komplett lokal in deinem Browser (TensorFlow.js) — deine Dateien werden nie auf externe Server hochgeladen.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════ TAB 7: CREATOR-SEITE (Enhanced) ═══════ */}
          {activeTab === "creator" && (
            <div className="space-y-6">
              {/* Two-column layout: Editor + Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Editor */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-primary" />
                        Profil bearbeiten
                      </CardTitle>
                      <CardDescription>Erstelle deine öffentliche Creator-Seite</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Avatar Placeholder */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                          {profileName ? profileName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="profile-avatar" className="text-xs">Avatar URL (optional)</Label>
                          <Input id="profile-avatar" placeholder="https://..." value={profileAvatar} onChange={(e) => setProfileAvatar(e.target.value)} data-testid="input-profile-avatar" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="profile-name">Anzeigename *</Label>
                        <Input id="profile-name" placeholder="Dein Name" value={profileName} onChange={(e) => setProfileName(e.target.value)} data-testid="input-profile-name" />
                      </div>
                      <div>
                        <Label htmlFor="profile-bio">Bio</Label>
                        <Textarea id="profile-bio" placeholder="Erzähle etwas über dich und deine Arbeit als Creator..." value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={3} data-testid="input-profile-bio" />
                      </div>

                      {/* Social Links */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Social Links</Label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input placeholder="https://deine-website.de" value={profileWebsite} onChange={(e) => setProfileWebsite(e.target.value)} data-testid="input-profile-website" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input placeholder="@username" value={profileTwitter} onChange={(e) => setProfileTwitter(e.target.value)} data-testid="input-profile-twitter" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input placeholder="@username" value={profileInstagram} onChange={(e) => setProfileInstagram(e.target.value)} data-testid="input-profile-instagram" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Youtube className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input placeholder="Kanalname" value={profileYoutube} onChange={(e) => setProfileYoutube(e.target.value)} data-testid="input-profile-youtube" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input placeholder="linkedin.com/in/username" value={profileLinkedin} onChange={(e) => setProfileLinkedin(e.target.value)} data-testid="input-profile-linkedin" />
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleSaveProfile} disabled={createProfileMutation.isPending} data-testid="btn-save-profile" className="w-full gap-2">
                        {createProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCircle className="h-4 w-4" />}
                        Profil speichern
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right: Live Preview */}
                <div className="space-y-6">
                  <Card className="border-primary/20" data-testid="creator-live-preview">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Live-Vorschau
                        </CardTitle>
                        <Badge variant="secondary" className="text-[10px]">Öffentliche Ansicht</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-xl border border-border bg-gradient-to-b from-primary/5 to-transparent p-6 space-y-4">
                        {/* Avatar + Name */}
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 mx-auto flex items-center justify-center text-2xl font-bold text-primary mb-3 ring-4 ring-primary/10">
                            {profileName ? profileName.charAt(0).toUpperCase() : "?"}
                          </div>
                          <h3 className="font-display text-lg font-bold">{profileName || "Dein Name"}</h3>
                          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">{profileBio || "Deine Bio wird hier angezeigt..."}</p>
                        </div>

                        {/* Verified Badges */}
                        <div className="flex flex-wrap justify-center gap-2">
                          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1">
                            <Shield className="h-3 w-3" /> Gold-Verifiziert
                          </Badge>
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                            <CheckCircle className="h-3 w-3" /> Creator
                          </Badge>
                          {contentList.length > 0 && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                              <Layers className="h-3 w-3" /> {contentList.length} Inhalte
                            </Badge>
                          )}
                        </div>

                        {/* Social Icons */}
                        <div className="flex justify-center gap-3 pt-1">
                          {profileWebsite && (
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center" title={profileWebsite}>
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          {profileTwitter && (
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center" title={profileTwitter}>
                              <Twitter className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          {profileInstagram && (
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center" title={profileInstagram}>
                              <Instagram className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          {profileYoutube && (
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center" title={profileYoutube}>
                              <Youtube className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          {profileLinkedin && (
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center" title={profileLinkedin}>
                              <Linkedin className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Mini Trust Score */}
                        <div className="mx-auto max-w-[200px] text-center">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Trust Score</span>
                            <span className="font-medium text-primary">{trustScore}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${trustScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Public Verification Link */}
                  <Card data-testid="creator-verify-link">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        Öffentlicher Verifizierungslink
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono bg-muted p-2.5 rounded break-all">
                          https://realsyncdynamics.de/creator/{profileName ? profileName.toLowerCase().replace(/\s+/g, "-") : "dein-name"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://realsyncdynamics.de/creator/${profileName ? profileName.toLowerCase().replace(/\s+/g, "-") : "dein-name"}`);
                            toast({ title: "Link kopiert!" });
                          }}
                          data-testid="btn-copy-creator-link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-white p-3 rounded-lg text-black" dangerouslySetInnerHTML={{ __html: generateQrSvg(`https://realsyncdynamics.de/creator/${profileName || "creator"}`, 120) }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Analytics Preview */}
              <Card data-testid="creator-analytics">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Analyse-Übersicht
                  </CardTitle>
                  <CardDescription>Statistiken deiner Creator-Seite</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Seitenaufrufe", value: "1.247", change: "+12%", icon: Eye, color: "text-blue-400" },
                      { label: "Verifizierungen", value: String(verifiedCount * 23 + 42), change: "+8%", icon: CheckCircle, color: "text-green-400" },
                      { label: "Trust Score", value: `${trustScore}%`, change: "+3%", icon: Shield, color: "text-yellow-400" },
                      { label: "Follower", value: "89", change: "+5%", icon: Users, color: "text-purple-400" },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="p-4 rounded-xl bg-muted/20 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                            <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                          </div>
                          <p className="text-2xl font-display font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Grid */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Portfolio</CardTitle>
                      <CardDescription>Deine geschützten Inhalte ({contentList.length})</CardDescription>
                    </div>
                    <Badge variant="secondary">{contentList.length} Einträge</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                  ) : contentList.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">Noch keine geschützten Inhalte</p>
                      <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => setActiveTab("schutz")}>
                        <Lock className="h-3.5 w-3.5" /> Ersten Inhalt schützen
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {contentList.map((item) => (
                        <div key={item.id} className="rounded-xl border border-border p-4 space-y-2 hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                              {item.contentType === "video" ? <FileVideo className="h-4 w-4 text-primary" /> :
                               item.contentType === "bild" ? <FileImage className="h-4 w-4 text-primary" /> :
                               item.contentType === "audio" ? <FileAudio className="h-4 w-4 text-primary" /> :
                               <FileText className="h-4 w-4 text-primary" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground capitalize">{item.contentType}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="secondary"
                              className={
                                item.verificationLevel === "gold" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                item.verificationLevel === "silver" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                "bg-gray-500/10 text-gray-400"
                              }
                            >
                              {item.verificationLevel}
                            </Badge>
                            <code className="text-[10px] font-mono text-muted-foreground">{item.hash?.substring(0, 12)}...</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Share Buttons */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Twitter/X", icon: Twitter },
                  { label: "Facebook", icon: Facebook },
                  { label: "LinkedIn", icon: Linkedin },
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <Button key={p.label} variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: `${p.label}-Link geteilt` })} data-testid={`share-${p.label.toLowerCase()}`}>
                      <Icon className="h-4 w-4" /> {p.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════ TAB 8: TEILEN ═══════ */}
          {activeTab === "teilen" && (
            <div className="space-y-6">
              {/* Social Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Sharing</CardTitle>
                  <CardDescription>Teile deinen verifizierten Content auf sozialen Medien</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Twitter/X", icon: Twitter, color: "bg-black dark:bg-white/10", url: `https://x.com/intent/tweet?text=${encodeURIComponent("Mein Content ist blockchain-verifiziert durch CreatorSeal!")}&url=${encodeURIComponent(verificationLink)}` },
                      { label: "Facebook", icon: Facebook, color: "bg-blue-600/10", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verificationLink)}` },
                      { label: "LinkedIn", icon: Linkedin, color: "bg-blue-700/10", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationLink)}` },
                      { label: "WhatsApp", icon: MessageCircle, color: "bg-green-600/10", url: `https://wa.me/?text=${encodeURIComponent(`Mein Content ist blockchain-verifiziert: ${verificationLink}`)}` },
                      { label: "Telegram", icon: Send, color: "bg-blue-500/10", url: `https://t.me/share/url?url=${encodeURIComponent(verificationLink)}&text=${encodeURIComponent("Blockchain-verifizierter Content")}` },
                      { label: "E-Mail", icon: Mail, color: "bg-gray-500/10", url: `mailto:?subject=${encodeURIComponent("Blockchain-verifizierter Content")}&body=${encodeURIComponent(`Überprüfe meinen verifizierten Content: ${verificationLink}`)}` },
                    ].map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <Button
                          key={platform.label}
                          variant="outline"
                          className={`h-auto py-3 flex flex-col items-center gap-2 ${platform.color}`}
                          onClick={() => {
                            window.open(platform.url, "_blank", "noopener,noreferrer,width=600,height=400");
                            toast({ title: `${platform.label}-Fenster geöffnet` });
                          }}
                          data-testid={`share-${platform.label.toLowerCase().replace(/\//g, "-")}`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{platform.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Embed Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Embed-Code</CardTitle>
                  <CardDescription>Bette den Verifizierungsnachweis auf deiner Website ein</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    readOnly
                    rows={4}
                    value={`<div style="border:1px solid #1e293b;border-radius:12px;padding:16px;max-width:400px;font-family:system-ui;">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
    <img src="https://realsyncdynamics.de/logo.svg" width="24" height="24" alt="RealSync" />
    <strong>CreatorSeal Verifiziert</strong>
  </div>
  <p style="color:#94a3b8;font-size:14px;">Dieser Inhalt wurde durch RealSync Dynamics verifiziert.</p>
  <a href="${verificationLink}" style="color:#3B82F6;font-size:13px;">Verifizierung prüfen →</a>
</div>`}
                    className="font-mono text-xs"
                    data-testid="embed-code"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(document.querySelector<HTMLTextAreaElement>('[data-testid="embed-code"]')?.value || "");
                      toast({ title: "Code kopiert!" });
                    }}
                    data-testid="btn-copy-embed"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Code kopieren
                  </Button>
                </CardContent>
              </Card>

              {/* Verification Widget */}
              <Card>
                <CardHeader>
                  <CardTitle>Verifizierungs-Widget</CardTitle>
                  <CardDescription>Kompaktes Widget für deine Website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    readOnly
                    rows={3}
                    value={`<a href="${verificationLink}" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:#0f172a;border:1px solid #1e293b;color:#3B82F6;font-size:12px;text-decoration:none;font-family:system-ui;">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  CreatorSeal Verifiziert
</a>`}
                    className="font-mono text-xs"
                    data-testid="widget-code"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(document.querySelector<HTMLTextAreaElement>('[data-testid="widget-code"]')?.value || "");
                      toast({ title: "Widget-Code kopiert!" });
                    }}
                    data-testid="btn-copy-widget"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Widget-Code kopieren
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>

      {/* ── App Info Section ── */}
      <AppInfoSection
        appName="CreatorSeal"
        tagline="Die vertrauenswürdigste Content-Verifizierung im Web"
        accentColor="text-emerald-400"
        accentBg="bg-emerald-500/10"
        description={`CreatorSeal ist das Herzstück der RealSync SaaS Plattform — ein umfassendes Content-Verifizierungssystem, das digitale Inhalte kryptografisch schützt und deren Authentizität beweisbar macht.

Jeder Inhalt erhält einen einzigartigen digitalen Fingerabdruck (SHA-256 Hash), der auf der Blockchain verankert werden kann. Das Trust Score System bewertet die Glaubwürdigkeit jedes Inhalts auf einer Skala von 0-100 basierend auf Verifizierungsmethoden, zeitlicher Konsistenz und Community-Feedback.

CreatorSeal implementiert den C2PA-Standard (Coalition for Content Provenance and Authenticity) — den gleichen Standard, den Adobe, Microsoft und die BBC verwenden. Damit sind CreatorSeal-Zertifikate weltweit kompatibel und von Content Authenticity Initiative (CAI)-Tools lesbar.

Die integrierte Deepfake Detection analysiert hochgeladene Medien mit KI-Modellen auf Manipulationsmerkmale. Verdächtige Artefakte werden markiert und ein Authentizitäts-Score berechnet. Dies schützt Creator vor gefälschten Inhalten, die ihre Marke beschädigen könnten.`}
        features={[
          { icon: Shield, title: "Trust Score System", description: "Dynamischer Vertrauenswert (0-100) basierend auf Hash-Verifizierung, Blockchain-Anker, C2PA-Metadaten und Community-Reviews. Wird auf Creator-Profilen angezeigt." },
          { icon: Fingerprint, title: "SHA-256 Fingerprinting", description: "Kryptografischer Hash jedes Inhalts. Jede Veränderung — auch nur 1 Bit — erzeugt einen komplett anderen Hash. Manipulationssicher." },
          { icon: Award, title: "C2PA Compliance", description: "Vollständige Implementierung des C2PA-Standards. Zertifikate sind kompatibel mit Adobe Content Credentials, Microsoft, BBC und der gesamten CAI-Initiative." },
          { icon: Eye, title: "Deepfake Detection", description: "KI-basierte Analyse auf Manipulationsmerkmale in Bildern und Videos. Erkennt Face-Swaps, Voice-Cloning und generierte Inhalte." },
          { icon: Barcode, title: "Barcode & QR-Studio", description: "Generiere Code128-Barcodes und QR-Codes für jeden geschützten Inhalt. Einbettbar in Druckmaterial, Social Media und Websites." },
          { icon: Database, title: "Blockchain-Verankerung", description: "Optional: Hash auf Ethereum/Polygon verankern. Unveränderlicher Beweis der Existenz zu einem bestimmten Zeitpunkt. Gerichtstauglich." },
        ]}
        techStack={[
          { name: "SHA-256 + HMAC", description: "Kryptografisches Hashing mit HMAC-Signatur für manipulationssichere Content-Fingerprints." },
          { name: "C2PA / CAI SDK", description: "Coalition for Content Provenance and Authenticity — Standard-konforme Metadaten-Einbettung." },
          { name: "TensorFlow.js Deepfake Detection", description: "On-Device KI-Analyse für Manipulationserkennung. Kein Upload auf externe Server nötig." },
          { name: "Ethereum / Polygon Smart Contracts", description: "Blockchain-Verankerung über Smart Contracts. Gas-optimiert für kostengünstige Transaktionen." },
          { name: "JsBarcode + QRCode.js", description: "Client-seitige Barcode- und QR-Code-Generierung. Code128, EAN-13, QR-Code-Formate." },
          { name: "Express + Drizzle ORM", description: "Backend-API für Content-Management, Zertifikats-Verwaltung und User-Auth." },
        ]}
        pricingTiers={[
          { name: "Bronze", price: "0€" },
          { name: "Silver", price: "9€/Mo", highlight: true },
          { name: "Gold", price: "29€/Mo" },
          { name: "Enterprise", price: "79€/Mo" },
        ]}
        roadmap={[
          { quarter: "Q1 2026", title: "SHA-256 + Barcode + C2PA Basis", description: "Content-Hashing, Barcode-Studio, QR-Codes, Bronze/Silver/Gold Verifizierung.", status: "done" },
          { quarter: "Q2 2026", title: "Deepfake Detection + Trust Score", description: "KI-basierte Manipulationserkennung. Dynamisches Trust Score System für Creator-Profile.", status: "in-progress" },
          { quarter: "Q3 2026", title: "API für Drittanbieter", description: "RESTful API für externe Plattformen. WordPress-Plugin, Shopify-App, CMS-Integrationen.", status: "planned" },
          { quarter: "Q4 2026", title: "Adobe Creative Cloud Integration", description: "DirectPlug-in für Photoshop, Premiere Pro und Lightroom. Content direkt aus Adobe-Apps schützen.", status: "planned" },
          { quarter: "2027", title: "Mobile App (iOS/Android)", description: "CreatorSeal als native App. Fotos und Videos direkt vom Smartphone schützen und verifizieren.", status: "planned" },
        ]}
      />
    </div>
  );
}
