import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Newspaper,
  CircleDot,
  Film,
  Radio,
  Users,
  ShoppingBag,
  UserCircle,
  Send,
  Image,
  Video,
  Loader2,
  Play,
  Eye,
  Clock,
  Lock,
  ShieldCheck,
  CheckCircle,
  Star,
  TrendingUp,
  Sparkles,
  X,
  Volume2,
  Wifi,
  MapPin,
  Tag,
  MoreHorizontal,
  ThumbsUp,
  Zap,
  Award,
  Crown,
  Globe,
  Camera,
  Music,
  Palette,
  Code,
  Megaphone,
  Grid3x3,
  BookmarkCheck,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { CommunityPost, Story, Group, MarketplaceItem } from "@shared/schema";
import { AppInfoSection } from "@/components/AppInfoSection";

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR TABS
   ═══════════════════════════════════════════════════════════════ */
type TabId = "feed" | "stories" | "reels" | "live" | "gruppen" | "marketplace" | "profil";

const sidebarTabs: { id: TabId; label: string; icon: typeof Newspaper }[] = [
  { id: "feed", label: "Feed", icon: Newspaper },
  { id: "stories", label: "Stories", icon: CircleDot },
  { id: "reels", label: "Reels", icon: Film },
  { id: "live", label: "Live", icon: Radio },
  { id: "gruppen", label: "Gruppen", icon: Users },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "profil", label: "Profil", icon: UserCircle },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA — POSTS
   ═══════════════════════════════════════════════════════════════ */
const seedPosts: CommunityPost[] = [
  {
    id: "cp-1",
    userId: "u-1",
    authorName: "Lena Schreiber",
    authorAvatar: null,
    content: "Gerade meinen neuen Podcast mit CreatorSeal geschützt! Die Blockchain-Verifizierung gibt mir ein unglaubliches Sicherheitsgefühl. Kein Content-Diebstahl mehr! 🛡️🎙️ #CreatorSeal #ContentSchutz",
    mediaUrl: null,
    mediaType: "text",
    likes: 234,
    comments: 42,
    shares: 18,
    verified: true,
    trustScore: 94,
    createdAt: "2026-03-15T08:30:00Z",
  },
  {
    id: "cp-2",
    userId: "u-2",
    authorName: "Marco Fischer",
    authorAvatar: null,
    content: "Mein neues Fotografie-Tutorial ist online! 📸 Landschaftsfotografie bei Sonnenuntergang — mit allen Kameraeinstellungen und Nachbearbeitungstipps. Was denkt ihr?",
    mediaUrl: "gradient-photo",
    mediaType: "image",
    likes: 567,
    comments: 89,
    shares: 45,
    verified: true,
    trustScore: 88,
    createdAt: "2026-03-15T07:15:00Z",
  },
  {
    id: "cp-3",
    userId: "u-3",
    authorName: "Sophie Meier",
    authorAvatar: null,
    content: "Update zu meinem App-Projekt: Der Multi-App Builder hat mir Wochen an Arbeit gespart! Die KI-Templates sind der Wahnsinn. Jetzt kann ich mich auf das Design konzentrieren. 💻✨",
    mediaUrl: null,
    mediaType: "text",
    likes: 189,
    comments: 34,
    shares: 12,
    verified: false,
    trustScore: 72,
    createdAt: "2026-03-15T06:00:00Z",
  },
  {
    id: "cp-4",
    userId: "u-4",
    authorName: "Felix Braun",
    authorAvatar: null,
    content: "Die Market Scanner Analyse hat mir gezeigt, dass nachhaltige Tech-Produkte gerade stark im Trend sind. Wer von euch arbeitet in dem Bereich? Lasst uns vernetzen! 🌱📊",
    mediaUrl: "gradient-chart",
    mediaType: "image",
    likes: 312,
    comments: 56,
    shares: 23,
    verified: true,
    trustScore: 91,
    createdAt: "2026-03-14T22:00:00Z",
  },
  {
    id: "cp-5",
    userId: "u-5",
    authorName: "Anna Wagner",
    authorAvatar: null,
    content: "Mein erster Reel hat über 10.000 Views erreicht! 🎉 Danke an die Community für die Unterstützung. Die Creator-Plattform hier ist einfach anders — echte Menschen, echte Interaktion.",
    mediaUrl: "gradient-video",
    mediaType: "video",
    likes: 1023,
    comments: 167,
    shares: 89,
    verified: true,
    trustScore: 96,
    createdAt: "2026-03-14T18:30:00Z",
  },
  {
    id: "cp-6",
    userId: "u-6",
    authorName: "Thomas Hartmann",
    authorAvatar: null,
    content: "Tipp des Tages: Nutzt die C2PA-Zertifikate für eure Bilder. In einer Welt voller KI-generierter Inhalte wird Authentizität immer wichtiger. CreatorSeal macht den Unterschied!",
    mediaUrl: null,
    mediaType: "text",
    likes: 445,
    comments: 73,
    shares: 56,
    verified: true,
    trustScore: 85,
    createdAt: "2026-03-14T15:00:00Z",
  },
  {
    id: "cp-7",
    userId: "u-7",
    authorName: "Julia Krause",
    authorAvatar: null,
    content: "Heute starte ich meinen Live-Stream zu 'Musik produzieren mit KI-Tools'. Kommt vorbei um 20 Uhr! Wir experimentieren mit neuen Sounds und ich zeige meinen Workflow. 🎵🎹",
    mediaUrl: "gradient-music",
    mediaType: "image",
    likes: 278,
    comments: 45,
    shares: 34,
    verified: false,
    trustScore: 78,
    createdAt: "2026-03-14T12:00:00Z",
  },
  {
    id: "cp-8",
    userId: "u-8",
    authorName: "David Richter",
    authorAvatar: null,
    content: "Review: Der Enterprise-Plan von RealSync Dynamics lohnt sich für Teams ab 5 Personen. Dedizierte Infrastruktur, Priority-Support und unlimitierte API-Calls. Unser Team ist begeistert! 🚀",
    mediaUrl: null,
    mediaType: "text",
    likes: 156,
    comments: 28,
    shares: 15,
    verified: true,
    trustScore: 82,
    createdAt: "2026-03-14T09:00:00Z",
  },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA — STORIES
   ═══════════════════════════════════════════════════════════════ */
const seedStories: (Story & { gradient: string })[] = [
  { id: "s-1", userId: "u-1", authorName: "Lena S.", mediaUrl: null, caption: "Morgenroutine als Creator", expiresAt: "2026-03-15T20:00:00Z", views: 1243, gradient: "from-amber-500 to-orange-600" },
  { id: "s-2", userId: "u-2", authorName: "Marco F.", mediaUrl: null, caption: "Neues Equipment!", expiresAt: "2026-03-15T22:00:00Z", views: 876, gradient: "from-blue-500 to-purple-600" },
  { id: "s-3", userId: "u-3", authorName: "Sophie M.", mediaUrl: null, caption: "App-Launch Countdown", expiresAt: "2026-03-15T18:00:00Z", views: 2340, gradient: "from-green-500 to-emerald-600" },
  { id: "s-4", userId: "u-4", authorName: "Felix B.", mediaUrl: null, caption: "Markt-Update Q1", expiresAt: "2026-03-15T21:00:00Z", views: 654, gradient: "from-pink-500 to-rose-600" },
  { id: "s-5", userId: "u-5", authorName: "Anna W.", mediaUrl: null, caption: "Hinter den Kulissen", expiresAt: "2026-03-15T19:00:00Z", views: 3100, gradient: "from-violet-500 to-indigo-600" },
  { id: "s-6", userId: "u-6", authorName: "Thomas H.", mediaUrl: null, caption: "DSGVO-Tipps", expiresAt: "2026-03-15T23:00:00Z", views: 987, gradient: "from-cyan-500 to-teal-600" },
  { id: "s-7", userId: "u-7", authorName: "Julia K.", mediaUrl: null, caption: "Studio-Tour", expiresAt: "2026-03-16T02:00:00Z", views: 1567, gradient: "from-red-500 to-pink-600" },
  { id: "s-8", userId: "u-8", authorName: "David R.", mediaUrl: null, caption: "Team-Meeting Live", expiresAt: "2026-03-16T04:00:00Z", views: 432, gradient: "from-yellow-500 to-amber-600" },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA — REELS
   ═══════════════════════════════════════════════════════════════ */
const seedReels = [
  { id: "r-1", author: "Lena Schreiber", title: "5 Tipps für bessere Podcasts", likes: 4523, comments: 234, gradient: "from-amber-600 via-orange-500 to-red-500", verified: true },
  { id: "r-2", author: "Marco Fischer", title: "Goldene Stunde Fotografie", likes: 8901, comments: 567, gradient: "from-blue-600 via-purple-500 to-pink-500", verified: true },
  { id: "r-3", author: "Sophie Meier", title: "App in 60 Sekunden erklärt", likes: 3456, comments: 189, gradient: "from-green-600 via-teal-500 to-cyan-500", verified: false },
  { id: "r-4", author: "Anna Wagner", title: "Mein Creator-Alltag", likes: 12340, comments: 890, gradient: "from-violet-600 via-purple-500 to-indigo-500", verified: true },
  { id: "r-5", author: "Thomas Hartmann", title: "Content-Schutz Hack", likes: 6789, comments: 345, gradient: "from-rose-600 via-pink-500 to-fuchsia-500", verified: true },
  { id: "r-6", author: "Julia Krause", title: "Beat-Making Tutorial", likes: 5678, comments: 278, gradient: "from-sky-600 via-blue-500 to-indigo-500", verified: false },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA — LIVE STREAMS
   ═══════════════════════════════════════════════════════════════ */
const seedLiveStreams = [
  { id: "l-1", host: "Anna Wagner", title: "Creator Q&A — Frag mich alles!", viewers: 1847, avatar: "AW", gradient: "from-red-500 to-pink-500", category: "Talk" },
  { id: "l-2", host: "Marco Fischer", title: "Live-Bearbeitung: Porträtfotos", viewers: 923, avatar: "MF", gradient: "from-blue-500 to-violet-500", category: "Tutorial" },
  { id: "l-3", host: "Julia Krause", title: "Musik produzieren mit KI-Tools", viewers: 2134, avatar: "JK", gradient: "from-amber-500 to-orange-500", category: "Musik" },
  { id: "l-4", host: "Felix Braun", title: "Marktanalyse Live: Tech-Trends 2026", viewers: 678, avatar: "FB", gradient: "from-green-500 to-emerald-500", category: "Business" },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA — GROUPS
   ═══════════════════════════════════════════════════════════════ */
const seedGroups: (Group & { icon: typeof Camera })[] = [
  { id: "g-1", name: "Fotografie Deutschland", description: "Community für Fotografen — Tipps, Kritik und Inspiration", memberCount: 12450, category: "Fotografie", isPrivate: false, icon: Camera },
  { id: "g-2", name: "Musik & Produktion", description: "Beats, Samples, Mixing — alles rund um Musikproduktion", memberCount: 8900, category: "Musik", isPrivate: false, icon: Music },
  { id: "g-3", name: "Tech Creator Hub", description: "Für Tech-YouTuber, Blogger und Podcaster", memberCount: 6780, category: "Tech", isPrivate: false, icon: Code },
  { id: "g-4", name: "Design & Branding", description: "UI/UX, Grafikdesign und Markenentwicklung", memberCount: 5430, category: "Design", isPrivate: false, icon: Palette },
  { id: "g-5", name: "Video Pro DACH", description: "Professionelle Videoproduktion im deutschsprachigen Raum", memberCount: 4210, category: "Video", isPrivate: true, icon: Film },
  { id: "g-6", name: "Marketing & Growth", description: "Social Media Marketing, SEO und Wachstumsstrategien", memberCount: 9870, category: "Marketing", isPrivate: false, icon: Megaphone },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA — MARKETPLACE
   ═══════════════════════════════════════════════════════════════ */
const seedMarketplace: (MarketplaceItem & { seller: string; verified: boolean; gradient: string })[] = [
  { id: "m-1", userId: "u-2", title: "Lightroom Preset Pack — Golden Hour", description: "15 professionelle Presets für Landschafts- und Porträtfotografie", price: 2900, category: "Presets", status: "active", seller: "Marco Fischer", verified: true, gradient: "from-amber-500/20 to-orange-500/20" },
  { id: "m-2", userId: "u-3", title: "Social Media Template Bundle", description: "50 Canva-kompatible Templates für Instagram, TikTok und X", price: 1900, category: "Templates", status: "active", seller: "Sophie Meier", verified: false, gradient: "from-pink-500/20 to-rose-500/20" },
  { id: "m-3", userId: "u-7", title: "Lo-Fi Beat Pack Vol. 3", description: "20 lizenzfreie Beats für YouTube, Podcasts und Reels", price: 3900, category: "Audio", status: "active", seller: "Julia Krause", verified: true, gradient: "from-violet-500/20 to-purple-500/20" },
  { id: "m-4", userId: "u-6", title: "DSGVO-Checkliste für Creator", description: "Komplette Checkliste mit Vorlagen für Impressum, Datenschutz und Cookies", price: 900, category: "Vorlagen", status: "active", seller: "Thomas Hartmann", verified: true, gradient: "from-blue-500/20 to-cyan-500/20" },
  { id: "m-5", userId: "u-1", title: "Podcast Starter Kit", description: "Equipment-Guide, Editing-Workflow und Monetarisierungs-Strategien", price: 4900, category: "Kurse", status: "active", seller: "Lena Schreiber", verified: true, gradient: "from-green-500/20 to-emerald-500/20" },
  { id: "m-6", userId: "u-5", title: "Creator Brand Identity Kit", description: "Logo-Templates, Farbpaletten und Style-Guide für deine Marke", price: 5900, category: "Design", status: "active", seller: "Anna Wagner", verified: true, gradient: "from-red-500/20 to-pink-500/20" },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA — PROFILE
   ═══════════════════════════════════════════════════════════════ */
const mockProfile = {
  displayName: "Max Mustermann",
  username: "@maxcreator",
  bio: "Content Creator | Fotograf | Tech-Enthusiast 📸💻 — Ich teile meine Reise als Creator und helfe anderen beim Aufbau ihrer digitalen Präsenz. RealSync Dynamics Botschafter.",
  followers: 12450,
  following: 342,
  posts: 287,
  likes: 45600,
  trustScore: 92,
  verified: true,
  plan: "Pro",
  joinDate: "September 2025",
  location: "Berlin, Deutschland",
  website: "maxcreator.de",
};

const profilePosts = [
  { id: "pp-1", gradient: "from-amber-500/30 to-orange-500/30", likes: 234 },
  { id: "pp-2", gradient: "from-blue-500/30 to-purple-500/30", likes: 567 },
  { id: "pp-3", gradient: "from-green-500/30 to-emerald-500/30", likes: 189 },
  { id: "pp-4", gradient: "from-pink-500/30 to-rose-500/30", likes: 345 },
  { id: "pp-5", gradient: "from-violet-500/30 to-indigo-500/30", likes: 678 },
  { id: "pp-6", gradient: "from-cyan-500/30 to-teal-500/30", likes: 123 },
  { id: "pp-7", gradient: "from-red-500/30 to-pink-500/30", likes: 456 },
  { id: "pp-8", gradient: "from-yellow-500/30 to-amber-500/30", likes: 890 },
  { id: "pp-9", gradient: "from-indigo-500/30 to-blue-500/30", likes: 321 },
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "gerade eben";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "gerade eben";
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? "en" : ""}`;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function avatarGradient(userId: string | null): string {
  const gradients = [
    "from-amber-400 to-orange-500",
    "from-blue-400 to-purple-500",
    "from-green-400 to-emerald-500",
    "from-pink-400 to-rose-500",
    "from-violet-400 to-indigo-500",
    "from-cyan-400 to-teal-500",
    "from-red-400 to-pink-500",
    "from-yellow-400 to-amber-500",
  ];
  const idx = userId ? parseInt(userId.replace(/\D/g, ""), 10) % gradients.length : 0;
  return gradients[idx];
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — VERIFIED BADGE
   ═══════════════════════════════════════════════════════════════ */
function VerifiedBadge({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="inline-flex items-center" title="CreatorSeal verifiziert">
      <ShieldCheck className={`${className} text-amber-400`} />
    </span>
  );
}

function TrustScoreBadge({ score }: { score: number | null }) {
  if (!score) return null;
  const color = score >= 90 ? "text-green-400 bg-green-500/10 border-green-500/20" : score >= 70 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-red-400 bg-red-500/10 border-red-500/20";
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${color}`}>
      <Star className="h-2.5 w-2.5 mr-0.5" />
      {score}
    </Badge>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT — POST CARD
   ═══════════════════════════════════════════════════════════════ */
function PostCard({ post, onLike }: { post: CommunityPost; onLike: (id: string) => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likeCount = (post.likes ?? 0) + (liked ? 1 : 0);

  return (
    <Card className="border-border/50 hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient(post.userId)} flex items-center justify-center text-white text-sm font-bold ring-2 ring-background`}>
            {getInitials(post.authorName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm truncate">{post.authorName}</span>
              {post.verified && <VerifiedBadge className="h-3.5 w-3.5" />}
              <TrustScoreBadge score={post.trustScore} />
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

        {/* Media placeholder */}
        {post.mediaUrl && (
          <div className={`rounded-xl overflow-hidden mb-3 ${post.mediaType === "video" ? "aspect-video" : "aspect-[4/3]"} bg-gradient-to-br ${
            post.mediaUrl === "gradient-photo" ? "from-amber-500/20 via-orange-500/20 to-red-500/20" :
            post.mediaUrl === "gradient-video" ? "from-blue-500/20 via-purple-500/20 to-pink-500/20" :
            post.mediaUrl === "gradient-chart" ? "from-green-500/20 via-teal-500/20 to-cyan-500/20" :
            "from-violet-500/20 via-purple-500/20 to-indigo-500/20"
          } flex items-center justify-center relative`}>
            {post.mediaType === "video" && (
              <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Play className="h-6 w-6 text-white ml-0.5" />
              </div>
            )}
            {post.mediaType === "image" && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Image className="h-8 w-8 opacity-40" />
                <span className="text-xs opacity-40">Vorschaubild</span>
              </div>
            )}
            {post.verified && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] backdrop-blur-sm">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  CreatorSeal
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Engagement bar */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 gap-1.5 text-xs ${liked ? "text-red-400 hover:text-red-300" : "text-muted-foreground"}`}
              onClick={() => { setLiked(!liked); if (!liked) onLike(post.id); }}
              data-testid={`btn-like-${post.id}`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-400" : ""}`} />
              {formatNumber(likeCount)}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground" data-testid={`btn-comment-${post.id}`}>
              <MessageSquare className="h-4 w-4" />
              {post.comments ?? 0}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground" data-testid={`btn-share-${post.id}`}>
              <Share2 className="h-4 w-4" />
              {post.shares ?? 0}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${saved ? "text-amber-400" : "text-muted-foreground"}`}
            onClick={() => setSaved(!saved)}
            data-testid={`btn-save-${post.id}`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-amber-400" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function CommunityPage() {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("feed");

  /* ── Feed state ── */
  const [postContent, setPostContent] = useState("");
  const [postMediaType, setPostMediaType] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  /* ── Stories state ── */
  const [viewingStory, setViewingStory] = useState<(typeof seedStories)[0] | null>(null);

  /* ── Profile state ── */
  const [profileTab, setProfileTab] = useState<"posts" | "reels" | "saved">("posts");

  /* ── Liked posts state ── */
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  /* ── Data queries ── */
  const { data: apiPosts } = useQuery<CommunityPost[]>({
    queryKey: ["/api/community/posts"],
  });

  const { data: apiStories } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const { data: apiGroups } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const { data: apiMarketplace } = useQuery<MarketplaceItem[]>({
    queryKey: ["/api/marketplace"],
  });

  /* Use API data if available, otherwise seed data */
  const posts = (apiPosts && apiPosts.length > 0) ? apiPosts : seedPosts;
  const stories = (apiStories && apiStories.length > 0)
    ? apiStories.map((s, i) => ({ ...s, gradient: seedStories[i % seedStories.length].gradient }))
    : seedStories;
  const groups = (apiGroups && apiGroups.length > 0)
    ? apiGroups.map((g, i) => ({ ...g, icon: seedGroups[i % seedGroups.length].icon }))
    : seedGroups;
  const marketplace = (apiMarketplace && apiMarketplace.length > 0)
    ? apiMarketplace.map((m, i) => ({ ...m, seller: seedMarketplace[i % seedMarketplace.length].seller, verified: seedMarketplace[i % seedMarketplace.length].verified, gradient: seedMarketplace[i % seedMarketplace.length].gradient }))
    : seedMarketplace;

  /* ── Mutations ── */
  const createPostMutation = useMutation({
    mutationFn: async (params: { content: string; mediaType: string | null }) => {
      const res = await apiRequest("POST", "/api/community/posts", params);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setPostContent("");
      setPostMediaType(null);
      setIsComposing(false);
      toast({ title: "Beitrag veröffentlicht", description: "Dein Beitrag ist jetzt sichtbar." });
    },
    onError: () => {
      toast({ title: "Fehler", description: "Beitrag konnte nicht erstellt werden.", variant: "destructive" });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await apiRequest("POST", `/api/community/posts/${postId}/like`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
    },
  });

  const handleLike = useCallback((postId: string) => {
    setLikedPosts((prev) => new Set(prev).add(postId));
    likePostMutation.mutate(postId);
  }, [likePostMutation]);

  const handleCreatePost = useCallback(() => {
    if (!postContent.trim()) return;
    createPostMutation.mutate({ content: postContent, mediaType: postMediaType });
  }, [postContent, postMediaType, createPostMutation]);

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">RealSync Community</h1>
            <p className="text-muted-foreground text-sm">Verbinde dich mit Creatorn</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ═══════ LEFT SIDEBAR (Desktop) ═══════ */}
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
                      ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}

            {/* Sidebar footer */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>CreatorSeal geschützt</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                <span>DSGVO-konform</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* ═══════ MOBILE TAB BAR ═══════ */}
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
                      ? "bg-amber-500/10 text-amber-400"
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

        {/* ═══════ MAIN CONTENT ═══════ */}
        <div className="flex-1 min-w-0">

          {/* ═══════════════════════════════════════
             TAB 1: FEED
             ═══════════════════════════════════════ */}
          {activeTab === "feed" && (
            <div className="space-y-4">
              {/* Post Composer */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${isAuthenticated ? "from-amber-400 to-orange-500" : "from-gray-400 to-gray-500"} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {isAuthenticated && user ? getInitials(user.displayName || user.username) : "?"}
                    </div>
                    <div className="flex-1">
                      {isComposing ? (
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Was möchtest du teilen?"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-amber-400/50"
                            data-testid="post-composer-textarea"
                          />
                          {postMediaType && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-amber-400 border-amber-500/20 bg-amber-500/10 text-xs">
                                {postMediaType === "image" ? <Image className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                                {postMediaType === "image" ? "Bild" : postMediaType === "video" ? "Video" : "Reel"} angehängt
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setPostMediaType(null)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-amber-400" onClick={() => setPostMediaType("image")} data-testid="btn-add-image">
                                <Image className="h-4 w-4 mr-1" />
                                Bild
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-amber-400" onClick={() => setPostMediaType("video")} data-testid="btn-add-video">
                                <Video className="h-4 w-4 mr-1" />
                                Video
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-amber-400" onClick={() => setPostMediaType("reel")} data-testid="btn-add-reel">
                                <Film className="h-4 w-4 mr-1" />
                                Reel
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setIsComposing(false); setPostContent(""); setPostMediaType(null); }}>
                                Abbrechen
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 bg-amber-500 hover:bg-amber-600 text-black font-medium gap-1.5"
                                disabled={!postContent.trim() || createPostMutation.isPending}
                                onClick={handleCreatePost}
                                data-testid="btn-publish-post"
                              >
                                {createPostMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                Veröffentlichen
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsComposing(true)}
                          className="w-full text-left px-4 py-3 rounded-xl bg-accent/50 hover:bg-accent text-muted-foreground text-sm transition-colors"
                          data-testid="btn-open-composer"
                        >
                          Was möchtest du teilen?
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Story Bar */}
              <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex gap-3 min-w-max py-2">
                  {/* Add Story Button */}
                  <button
                    className="flex flex-col items-center gap-1.5 w-[72px]"
                    data-testid="btn-add-story"
                    onClick={() => toast({ title: "Story erstellen", description: "Story-Erstellung kommt bald!" })}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400/50 flex items-center justify-center hover:border-amber-400 transition-colors">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">Neue Story</span>
                  </button>
                  {stories.map((story) => (
                    <button
                      key={story.id}
                      className="flex flex-col items-center gap-1.5 w-[72px]"
                      onClick={() => setViewingStory(story as typeof seedStories[0])}
                      data-testid={`story-${story.id}`}
                    >
                      <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-amber-400 via-orange-500 to-red-500">
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${(story as typeof seedStories[0]).gradient || "from-gray-500 to-gray-600"} flex items-center justify-center text-white text-xs font-bold ring-2 ring-background`}>
                          {getInitials(story.authorName)}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate w-full text-center">{story.authorName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onLike={handleLike} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center py-4">
                <Button variant="ghost" className="text-amber-400 hover:text-amber-300 gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Weitere Beiträge laden
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
             TAB 2: STORIES
             ═══════════════════════════════════════ */}
          {activeTab === "stories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Stories</h2>
                  <p className="text-sm text-muted-foreground">Flüchtige Einblicke von Creatorn</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-500/20 text-amber-400 hover:bg-amber-500/10" data-testid="btn-create-story">
                  <Sparkles className="h-3.5 w-3.5" />
                  Story erstellen
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {stories.map((story) => {
                  const storyData = story as typeof seedStories[0];
                  return (
                    <button
                      key={story.id}
                      onClick={() => setViewingStory(storyData)}
                      className="group relative rounded-2xl overflow-hidden aspect-[3/4] transition-transform hover:scale-[1.02]"
                      data-testid={`story-card-${story.id}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${storyData.gradient}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Avatar */}
                      <div className="absolute top-3 left-3">
                        <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-amber-400 to-orange-500">
                          <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xs font-bold">
                            {getInitials(story.authorName)}
                          </div>
                        </div>
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="font-semibold text-sm text-white mb-0.5">{story.authorName}</p>
                        <p className="text-xs text-white/70 mb-1.5">{story.caption}</p>
                        <div className="flex items-center gap-3 text-xs text-white/60">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatNumber(story.views ?? 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(story.expiresAt)}
                          </span>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>

              {/* Story Viewer Overlay */}
              {viewingStory && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" data-testid="story-viewer">
                  <div className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${viewingStory.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Progress bar */}
                    <div className="absolute top-3 left-3 right-3">
                      <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-2/3 animate-pulse" />
                      </div>
                    </div>

                    {/* Author */}
                    <div className="absolute top-6 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(viewingStory.authorName)}
                      </div>
                      <span className="text-white text-sm font-medium">{viewingStory.authorName}</span>
                      <span className="text-white/50 text-xs">{timeAgo(viewingStory.expiresAt)}</span>
                    </div>

                    {/* Close */}
                    <button
                      onClick={() => setViewingStory(null)}
                      className="absolute top-6 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      data-testid="btn-close-story"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Caption */}
                    <div className="absolute bottom-8 left-4 right-4">
                      <p className="text-white text-lg font-bold mb-2">{viewingStory.caption}</p>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatNumber(viewingStory.views ?? 0)} Aufrufe
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════
             TAB 3: REELS
             ═══════════════════════════════════════ */}
          {activeTab === "reels" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Reels</h2>
                  <p className="text-sm text-muted-foreground">Kurzvideos von Creatorn</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-500/20 text-amber-400 hover:bg-amber-500/10" data-testid="btn-create-reel">
                  <Film className="h-3.5 w-3.5" />
                  Reel erstellen
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {seedReels.map((reel) => (
                  <button
                    key={reel.id}
                    className="group relative rounded-2xl overflow-hidden aspect-[9/16] transition-transform hover:scale-[1.02]"
                    data-testid={`reel-card-${reel.id}`}
                    onClick={() => toast({ title: "Reel abspielen", description: `"${reel.title}" wird geladen...` })}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <Play className="h-6 w-6 text-white ml-0.5" />
                      </div>
                    </div>

                    {/* Verified badge */}
                    {reel.verified && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] backdrop-blur-sm">
                          <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                          Verifiziert
                        </Badge>
                      </div>
                    )}

                    {/* Sound indicator */}
                    <div className="absolute top-3 left-3">
                      <div className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Volume2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-semibold text-sm text-white">{reel.author}</span>
                        {reel.verified && <VerifiedBadge className="h-3.5 w-3.5" />}
                      </div>
                      <p className="text-xs text-white/80 mb-2">{reel.title}</p>
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {formatNumber(reel.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {formatNumber(reel.comments)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
             TAB 4: LIVE
             ═══════════════════════════════════════ */}
          {activeTab === "live" && (
            <div className="space-y-6">
              {/* Live banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 via-pink-500/10 to-purple-500/10 border border-red-500/20 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-display text-xl font-bold">Aktuell Live</span>
                  </div>
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                    <Wifi className="h-3 w-3 mr-1" />
                    {seedLiveStreams.reduce((a, s) => a + s.viewers, 0).toLocaleString("de-DE")} Zuschauer
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Sieh dir Live-Streams von Creatorn an und interagiere in Echtzeit</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seedLiveStreams.map((stream) => (
                  <Card key={stream.id} className="overflow-hidden border-border/50 hover:border-red-500/30 transition-colors group" data-testid={`live-card-${stream.id}`}>
                    {/* Stream preview */}
                    <div className={`relative aspect-video bg-gradient-to-br ${stream.gradient}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* LIVE badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Badge className="bg-red-600 text-white border-0 font-bold text-[11px] px-2 py-0.5 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-white mr-1" />
                          LIVE
                        </Badge>
                        <Badge variant="outline" className="bg-black/30 text-white border-white/20 text-[10px] backdrop-blur-sm">
                          <Eye className="h-2.5 w-2.5 mr-1" />
                          {stream.viewers.toLocaleString("de-DE")}
                        </Badge>
                      </div>

                      {/* Category */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-black/30 text-white/80 border-white/20 text-[10px] backdrop-blur-sm">
                          {stream.category}
                        </Badge>
                      </div>

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-7 w-7 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stream.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                          {stream.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{stream.title}</h3>
                          <p className="text-xs text-muted-foreground">{stream.host}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white gap-1.5 text-xs shrink-0"
                          onClick={() => toast({ title: "Live-Stream", description: `Du trittst "${stream.title}" bei...` })}
                          data-testid={`btn-watch-${stream.id}`}
                        >
                          <Radio className="h-3.5 w-3.5" />
                          Zuschauen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Go Live CTA */}
              <Card className="border-dashed border-red-500/20 bg-red-500/5">
                <CardContent className="p-6 text-center">
                  <Radio className="h-10 w-10 text-red-400 mx-auto mb-3" />
                  <h3 className="font-display text-lg font-bold mb-1">Starte deinen eigenen Live-Stream</h3>
                  <p className="text-sm text-muted-foreground mb-4">Teile dein Wissen in Echtzeit mit der Community</p>
                  <Button className="bg-red-500 hover:bg-red-600 text-white gap-2" data-testid="btn-go-live">
                    <Wifi className="h-4 w-4" />
                    Live gehen
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════════════════════════════════════
             TAB 5: GRUPPEN
             ═══════════════════════════════════════ */}
          {activeTab === "gruppen" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Gruppen</h2>
                  <p className="text-sm text-muted-foreground">Finde deine Creator-Community</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-500/20 text-amber-400 hover:bg-amber-500/10" data-testid="btn-create-group">
                  <Users className="h-3.5 w-3.5" />
                  Gruppe erstellen
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Input
                  placeholder="Gruppen durchsuchen..."
                  className="bg-background/50 border-border/50 focus:border-amber-400/50 pl-10"
                  data-testid="input-search-groups"
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groups.map((group) => {
                  const GroupIcon = (group as typeof seedGroups[0]).icon || Users;
                  return (
                    <Card key={group.id} className="border-border/50 hover:border-amber-500/20 transition-colors" data-testid={`group-card-${group.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                            <GroupIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">{group.name}</h3>
                              {group.isPrivate && (
                                <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{group.description}</p>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-amber-400 border-amber-500/20 bg-amber-500/10 text-[10px]">
                                <Users className="h-2.5 w-2.5 mr-1" />
                                {formatNumber(group.memberCount ?? 0)} Mitglieder
                              </Badge>
                              <Badge variant="outline" className="text-muted-foreground text-[10px]">
                                <Tag className="h-2.5 w-2.5 mr-1" />
                                {group.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border/30">
                          <Button
                            size="sm"
                            variant={group.isPrivate ? "outline" : "default"}
                            className={`w-full text-xs gap-1.5 ${!group.isPrivate ? "bg-amber-500 hover:bg-amber-600 text-black" : "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"}`}
                            onClick={() => toast({
                              title: group.isPrivate ? "Beitrittsanfrage gesendet" : "Gruppe beigetreten",
                              description: group.isPrivate ? `Deine Anfrage für "${group.name}" wird geprüft.` : `Willkommen in "${group.name}"!`,
                            })}
                            data-testid={`btn-join-${group.id}`}
                          >
                            {group.isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                            {group.isPrivate ? "Beitritt anfragen" : "Beitreten"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
             TAB 6: MARKETPLACE
             ═══════════════════════════════════════ */}
          {activeTab === "marketplace" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Marketplace</h2>
                  <p className="text-sm text-muted-foreground">Digitale Produkte von verifizierten Creatorn</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-500/20 text-amber-400 hover:bg-amber-500/10" data-testid="btn-sell-item">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Verkaufen
                </Button>
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["Alle", "Presets", "Templates", "Audio", "Vorlagen", "Kurse", "Design"].map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="cursor-pointer whitespace-nowrap hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20 transition-colors"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {marketplace.map((item) => {
                  const itemData = item as typeof seedMarketplace[0];
                  return (
                    <Card key={item.id} className="overflow-hidden border-border/50 hover:border-amber-500/20 transition-colors group" data-testid={`marketplace-card-${item.id}`}>
                      {/* Image placeholder */}
                      <div className={`aspect-[4/3] bg-gradient-to-br ${itemData.gradient} relative`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-foreground/20" />
                        </div>
                        {itemData.verified && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] backdrop-blur-sm">
                              <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                              CreatorSeal
                            </Badge>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className="bg-black/30 text-white/80 border-white/20 text-[10px] backdrop-blur-sm">
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">von</span>
                            <span className="text-xs font-medium">{itemData.seller}</span>
                            {itemData.verified && <VerifiedBadge className="h-3 w-3" />}
                          </div>
                          <span className="font-display text-lg font-bold text-amber-400">
                            {((item.price ?? 0) / 100).toFixed(2).replace(".", ",")}€
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-medium text-xs gap-1.5"
                            onClick={() => toast({ title: "In den Warenkorb", description: `"${item.title}" hinzugefügt.` })}
                            data-testid={`btn-buy-${item.id}`}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Kaufen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs gap-1.5 border-border/50"
                            data-testid={`btn-details-${item.id}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
             TAB 7: PROFIL
             ═══════════════════════════════════════ */}
          {activeTab === "profil" && (
            <div className="space-y-6">
              {/* Profile Header */}
              <Card className="border-border/50 overflow-hidden">
                {/* Cover */}
                <div className="h-32 sm:h-40 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50" />
                </div>

                <CardContent className="relative px-6 pb-6">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4 flex items-end gap-4">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-amber-400 via-orange-500 to-red-500">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center text-3xl font-bold text-foreground ring-4 ring-background">
                          {isAuthenticated && user ? getInitials(user.displayName || user.username) : "MM"}
                        </div>
                      </div>
                      {mockProfile.verified && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center ring-4 ring-background">
                          <CheckCircle className="h-4 w-4 text-black" />
                        </div>
                      )}
                    </div>

                    <div className="pb-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-display text-xl font-bold">
                          {isAuthenticated && user ? (user.displayName || user.username) : mockProfile.displayName}
                        </h2>
                        {mockProfile.verified && <VerifiedBadge className="h-5 w-5" />}
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                          <Crown className="h-2.5 w-2.5 mr-1" />
                          {mockProfile.plan}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{mockProfile.username}</p>
                    </div>

                    <Button variant="outline" size="sm" className="text-xs border-amber-500/20 text-amber-400 hover:bg-amber-500/10 shrink-0" data-testid="btn-edit-profile">
                      Profil bearbeiten
                    </Button>
                  </div>

                  {/* Bio */}
                  <p className="text-sm mb-4 leading-relaxed">{mockProfile.bio}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {mockProfile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {mockProfile.website}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Dabei seit {mockProfile.joinDate}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <span className="block font-display text-lg font-bold">{formatNumber(mockProfile.followers)}</span>
                      <span className="text-xs text-muted-foreground">Follower</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-display text-lg font-bold">{formatNumber(mockProfile.following)}</span>
                      <span className="text-xs text-muted-foreground">Folgt</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-display text-lg font-bold">{mockProfile.posts}</span>
                      <span className="text-xs text-muted-foreground">Beiträge</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-display text-lg font-bold">{formatNumber(mockProfile.likes)}</span>
                      <span className="text-xs text-muted-foreground">Likes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Score Card */}
              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Trust Score Ring */}
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-border/30" />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeDasharray={`${mockProfile.trustScore} ${100 - mockProfile.trustScore}`}
                          strokeLinecap="round"
                          className="text-amber-400"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-lg font-bold text-amber-400">{mockProfile.trustScore}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">Trust Score</h3>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                          Ausgezeichnet
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Dein Trust Score basiert auf verifizierten Inhalten, Community-Engagement und Profil-Vollständigkeit.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg bg-background/50">
                          <ShieldCheck className="h-4 w-4 text-amber-400 mx-auto mb-0.5" />
                          <span className="text-[10px] text-muted-foreground">Verifiziert</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-background/50">
                          <Award className="h-4 w-4 text-amber-400 mx-auto mb-0.5" />
                          <span className="text-[10px] text-muted-foreground">Gold</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-background/50">
                          <Zap className="h-4 w-4 text-amber-400 mx-auto mb-0.5" />
                          <span className="text-[10px] text-muted-foreground">Aktiv</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Content Tabs */}
              <div>
                <div className="flex border-b border-border/30 mb-4">
                  {[
                    { id: "posts" as const, label: "Beiträge", icon: Grid3x3 },
                    { id: "reels" as const, label: "Reels", icon: Film },
                    { id: "saved" as const, label: "Gespeichert", icon: BookmarkCheck },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setProfileTab(tab.id)}
                        data-testid={`profile-tab-${tab.id}`}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                          profileTab === tab.id
                            ? "text-amber-400 border-amber-400"
                            : "text-muted-foreground border-transparent hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Post Grid */}
                {profileTab === "posts" && (
                  <div className="grid grid-cols-3 gap-2">
                    {profilePosts.map((pp) => (
                      <button
                        key={pp.id}
                        className={`aspect-square rounded-xl bg-gradient-to-br ${pp.gradient} relative group overflow-hidden`}
                        data-testid={`profile-post-${pp.id}`}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3 text-white text-sm">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {pp.likes}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {profileTab === "reels" && (
                  <div className="grid grid-cols-3 gap-2">
                    {seedReels.slice(0, 6).map((reel) => (
                      <button
                        key={reel.id}
                        className={`aspect-[9/16] rounded-xl bg-gradient-to-br ${reel.gradient} relative group overflow-hidden`}
                        data-testid={`profile-reel-${reel.id}`}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] text-white/80 flex items-center gap-1">
                            <Heart className="h-2.5 w-2.5" />
                            {formatNumber(reel.likes)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {profileTab === "saved" && (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-1">Keine gespeicherten Beiträge</h3>
                    <p className="text-xs text-muted-foreground">Speichere Beiträge, um sie später wiederzufinden.</p>
                  </div>
                )}
              </div>

              {/* CreatorSeal Integration */}
              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">CreatorSeal Verifizierung</h3>
                      <p className="text-xs text-muted-foreground">Dein Profil ist mit CreatorSeal verifiziert. Alle Inhalte sind geschützt.</p>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Gold
                    </Badge>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-500/10">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <span className="block font-display text-lg font-bold text-amber-400">47</span>
                        <span className="text-[10px] text-muted-foreground">Geschützte Inhalte</span>
                      </div>
                      <div>
                        <span className="block font-display text-lg font-bold text-amber-400">12</span>
                        <span className="text-[10px] text-muted-foreground">Zertifikate</span>
                      </div>
                      <div>
                        <span className="block font-display text-lg font-bold text-amber-400">3</span>
                        <span className="text-[10px] text-muted-foreground">Blockchain-Txn</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>

      {/* ── App Info Section ── */}
      <AppInfoSection
        appName="RealSync Community"
        tagline="Das Creator-Netzwerk mit Trust-Score-Integration"
        accentColor="text-rose-400"
        accentBg="bg-rose-500/10"
        description={`RealSync Community ist eine Creator-Plattform, die Social-Networking mit Content-Verifizierung vereint. Anders als herkömmliche Social-Media-Plattformen zeigt jeder Post den Trust Score des Erstellers — basierend auf der CreatorSeal-Verifizierung.

Die Plattform bietet einen vollständigen Social-Media-Stack: Feed mit Rich-Text-Posts und Medien, Stories (24h sichtbar), Reels (Kurzvideos), Live-Streaming, Gruppen für Themen-Communities und einen integrierten Marketplace für digitale Produkte.

Das Besondere: Trust Scores sind direkt in die Social-Interaktion integriert. Posts von verifizierten Creatorn werden hervorgehoben, Gruppen können Mindest-Trust-Scores für Mitglieder setzen, und im Marketplace sind nur verifizierte Verkäufer zugelassen. Das schafft ein Ökosystem, in dem Authentizität belohnt wird.

Für Creator bietet die Community Monetarisierungs-Möglichkeiten: Digitale Produkte im Marketplace verkaufen, Premium-Gruppen mit Abo-Modell, Tipping für Posts und exklusive Inhalte für zahlende Follower.`}
        features={[
          { icon: Newspaper, title: "Social Feed", description: "Rich-Text-Posts mit Bildern, Videos und Dokumenten. Likes, Kommentare und Shares. Algorithmisches und chronologisches Feed." },
          { icon: CircleDot, title: "Stories & Reels", description: "24-Stunden Stories mit Reactions. Kurzvideos (Reels) mit Musik, Effekten und Schnitt-Tools." },
          { icon: ShieldCheck, title: "Trust-Score-Integration", description: "Jeder Post zeigt den CreatorSeal Trust Score. Verifizierte Creator erhalten ein Gold-Badge und höhere Sichtbarkeit." },
          { icon: Users, title: "Gruppen & Spaces", description: "Themen-Communities mit Moderations-Tools. Öffentliche und private Gruppen. Mindest-Trust-Score als Beitrittsvoraussetzung." },
          { icon: ShoppingBag, title: "Marketplace", description: "Digitale Produkte verkaufen: Templates, Presets, E-Books, Kurse. Nur für verifizierte Creator. Integrierte Bezahlung." },
          { icon: Star, title: "Creator-Profile", description: "Portfolio-Seite mit verifizierten Inhalten, Trust Score, Social Links und CreatorSeal-Badges. Öffentlich teilbar." },
        ]}
        techStack={[
          { name: "React + Tailwind CSS", description: "Schnelle, responsive UI mit Dark Mode. Infinite Scroll, Lazy Loading und optimierte Bild-Darstellung." },
          { name: "Express + WebSocket", description: "REST-API für CRUD. WebSocket für Echtzeit-Benachrichtigungen, Live-Chat und Typing-Indikatoren." },
          { name: "TanStack Query v5", description: "Optimistic Updates für Likes/Kommentare. Cache-Invalidierung und Background-Refetching." },
          { name: "Media Pipeline", description: "Automatische Bild-Optimierung, Video-Transcoding und Thumbnail-Generierung. WebP/AVIF-Support." },
          { name: "CreatorSeal API", description: "Direkte Integration mit CreatorSeal für Trust-Score-Abfragen und Verifizierungs-Badges." },
          { name: "Stripe Connect", description: "Marketplace-Zahlungen über Stripe Connect. Automatische Auszahlungen an Verkäufer." },
        ]}
        pricingTiers={[
          { name: "Free", price: "0€" },
          { name: "Starter", price: "9€/Mo", highlight: true },
          { name: "Pro", price: "29€/Mo" },
          { name: "Business", price: "49€/Mo" },
        ]}
        roadmap={[
          { quarter: "Q1 2026", title: "Feed + Stories + Gruppen + Marketplace", description: "Vollständiger Social-Stack mit Posts, Stories, Gruppen und digitalem Marktplatz. Trust-Score-Integration.", status: "done" },
          { quarter: "Q2 2026", title: "Live-Streaming", description: "Live-Video-Streaming mit Chat, Reactions und Tipping. Screen-Sharing für Tutorials und Workshops.", status: "in-progress" },
          { quarter: "Q3 2026", title: "Creator-Monetarisierung", description: "Premium-Abos für Follower. Exklusive Inhalte, Tipping, Paid Communities. Automatische Steuerbelege.", status: "planned" },
          { quarter: "Q4 2026", title: "Reels mit KI-Editing", description: "KI-gestützte Video-Bearbeitung: Auto-Schnitt, Untertitel, Musik-Sync, Effekte. Direkt in der App.", status: "planned" },
          { quarter: "2027", title: "Federated Social (ActivityPub)", description: "Vernetzung mit Mastodon, Bluesky und dem Fediverse. Creator-Inhalte plattformübergreifend sichtbar.", status: "planned" },
        ]}
      />
    </div>
  );
}
