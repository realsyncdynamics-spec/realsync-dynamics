import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import {
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  Globe,
  Layers,
  TrendingUp,
  Home,
  CreditCard,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Lock,
  Award,
  Barcode,
  Link2,
  Droplets,
  UserCircle,
  Share2,
  Mic,
  Monitor,
  Radio,
  ChevronDown,
  ChevronRight,
  Settings,
  Heart,
  MessageCircle,
  GraduationCap,
  Wand2,
  Megaphone,
  Activity,
  Fingerprint,
  ScanSearch,
  BookOpen,
} from "lucide-react";

const creatorSealDropdown = [
  { label: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { label: "Inhalte schützen", icon: Lock, tab: "schutz" },
  { label: "Zertifikate", icon: Award, tab: "zertifikate" },
  { label: "Barcode-Studio", icon: Barcode, tab: "barcode" },
  { label: "Blockchain", icon: Link2, tab: "blockchain" },
  { label: "Wasserzeichen", icon: Droplets, tab: "wasserzeichen" },
  { label: "Creator-Seite", icon: UserCircle, tab: "creator" },
  { label: "Teilen", icon: Share2, tab: "teilen" },
  { label: "Signieren", icon: Fingerprint, tab: "signieren" },
  { label: "Deepfake Check", icon: ScanSearch, tab: "deepfake" },
];

const optimusDropdown = [
  { label: "Voice Control", icon: Mic, tab: "feed" },
  { label: "Desktop Automation", icon: Monitor, tab: "stories" },
  { label: "Stripe Tiers", icon: CreditCard, tab: "reels" },
  { label: "Grok Streaming", icon: Radio, tab: "live" },
  { label: "Browser Control", icon: Globe, tab: "marketplace" },
  { label: "Workflows", icon: Layers, tab: "gruppen" },
];

const pageNames: Record<string, string> = {
  "/": "Home",
  "/creatorseal": "CreatorSeal",
  "/optimus": "Optimus",
  "/builder": "Builder",
  "/scanner": "Scanner",
  "/preise": "Preise",
  "/ueber-uns": "Über uns",
  "/kontakt": "Kontakt",
  "/impressum": "Impressum",
  "/datenschutz": "Datenschutz",
  "/agb": "AGB",
  "/einstellungen": "Einstellungen",
  "/community": "Community",
  "/support": "KI-Support",
  "/schullabor": "SchulLabor",
  "/link-magic": "Link-Magic",
  "/brand": "Marke & Strategie",
  "/status": "Live Status",
  "/bildung": "RealSync Bildung",
  "/agenten": "Screenshot-Agenten",
  "/kampagnen": "Kampagnen",
};

function RealSyncLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#C9A84C" />
      <path
        d="M10 12h8c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4l8 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M24 12l4 4-4 4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
      <circle cx="30" cy="28" r="3" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}

function DropdownMenu({
  items,
  href,
  onClose,
}: {
  items: { label: string; icon: any; tab: string }[];
  href: string;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-border/50 glass shadow-xl py-1.5 z-50 transition-all duration-150"
      onMouseLeave={onClose}
    >
      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
        Navigation
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.tab} href={href}>
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-150"
              onClick={onClose}
            >
              <Icon className="h-3.5 w-3.5 text-primary/70" />
              {item.label}
            </button>
          </Link>
        );
      })}
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hashLocation] = useHashLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleAuth = async () => {
    if (!authUsername || !authPassword) {
      toast({ title: "Fehler", description: "Benutzername und Passwort eingeben.", variant: "destructive" });
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await login(authUsername, authPassword);
        toast({ title: "Willkommen zurück!", description: `Angemeldet als ${authUsername}` });
      } else {
        await register(authUsername, authPassword);
        toast({ title: "Konto erstellt!", description: `Willkommen, ${authUsername}!` });
      }
      setAuthDialogOpen(false);
      setAuthUsername("");
      setAuthPassword("");
    } catch (e: any) {
      toast({ title: "Fehler", description: e.message || "Anmeldung fehlgeschlagen", variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark || true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileAccordion(null);
    setUserMenuOpen(false);
  }, [hashLocation]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  const userInitials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || "??";

  const isActive = (path: string) =>
    hashLocation === path || (path !== "/" && hashLocation.startsWith(path));

  const currentPageName = pageNames[hashLocation] || pageNames[Object.keys(pageNames).find(k => k !== "/" && hashLocation.startsWith(k)) || ""] || "";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation — Compact */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo + Breadcrumb */}
            <div className="flex items-center gap-2">
              <Link href="/" data-testid="nav-logo">
                <div className="flex items-center gap-2 cursor-pointer">
                  <RealSyncLogo className="h-6 w-6" />
                  <div className="hidden sm:block">
                    <span className="font-display text-sm font-bold tracking-tight">
                      RealSync
                    </span>
                    <span className="font-display text-sm font-light tracking-tight text-primary ml-1">
                      Dynamics
                    </span>
                  </div>
                </div>
              </Link>
              {/* Breadcrumb indicator */}
              {hashLocation !== "/" && currentPageName && (
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground ml-1">
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground font-medium">{currentPageName}</span>
                </div>
              )}
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {/* Home */}
              <Link href="/">
                <button
                  data-testid="nav-home"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    hashLocation === "/"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Home
                </button>
              </Link>

              {/* CreatorSeal with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("creatorseal")}
                onMouseLeave={handleDropdownLeave}
              >
                <Link href="/creatorseal">
                  <button
                    data-testid="nav-creatorseal"
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                      isActive("/creatorseal")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    CreatorSeal
                    <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${openDropdown === "creatorseal" ? "rotate-180" : ""}`} />
                  </button>
                </Link>
                {openDropdown === "creatorseal" && (
                  <DropdownMenu
                    items={creatorSealDropdown}
                    href="/creatorseal"
                    onClose={() => setOpenDropdown(null)}
                  />
                )}
              </div>

              {/* Optimus with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("optimus")}
                onMouseLeave={handleDropdownLeave}
              >
                <Link href="/optimus">
                  <button
                    data-testid="nav-optimus"
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                      isActive("/optimus")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    Optimus
                    <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${openDropdown === "optimus" ? "rotate-180" : ""}`} />
                  </button>
                </Link>
                {openDropdown === "optimus" && (
                  <DropdownMenu
                    items={optimusDropdown}
                    href="/optimus"
                    onClose={() => setOpenDropdown(null)}
                  />
                )}
              </div>

              {/* Builder - direct link */}
              <Link href="/builder">
                <button
                  data-testid="nav-builder"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/builder")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Builder
                </button>
              </Link>

              {/* Scanner - direct link */}
              <Link href="/scanner">
                <button
                  data-testid="nav-scanner"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/scanner")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Scanner
                </button>
              </Link>

              {/* Preise - direct link */}
              <Link href="/preise">
                <button
                  data-testid="nav-preise"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/preise")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Preise
                </button>
              </Link>

              {/* Community - direct link */}
              <Link href="/community">
                <button
                  data-testid="nav-community"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/community")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Community
                </button>
              </Link>

              {/* SchulLabor - direct link */}
              <Link href="/schullabor">
                <button
                  data-testid="nav-schullabor"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/schullabor")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  SchulLabor
                </button>
              </Link>

              {/* Link-Magic - direct link */}
              <Link href="/link-magic">
                <button
                  data-testid="nav-linkmagic"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/link-magic")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Link-Magic
                </button>
              </Link>

              {/* KI-Support - direct link */}
              <Link href="/support">
                <button
                  data-testid="nav-support"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/support")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Support
                </button>
              </Link>

              {/* Marke - direct link */}
              <Link href="/brand">
                <button
                  data-testid="nav-brand"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/brand")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Marke
                </button>
              </Link>

              {/* Status - direct link */}
              <Link href="/status">
                <button
                  data-testid="nav-status"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/status")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Status
                </button>
              </Link>

              {/* Bildung - direct link */}
              <Link href="/bildung">
                <button
                  data-testid="nav-bildung"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/bildung")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Bildung
                </button>
              </Link>

              {/* Agenten - direct link */}
              <Link href="/agenten">
                <button
                  data-testid="nav-agenten"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/agenten")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Agenten
                </button>
              </Link>

              {/* Kampagnen - direct link */}
              <Link href="/kampagnen">
                <button
                  data-testid="nav-kampagnen"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive("/kampagnen")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Kampagnen
                </button>
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-1.5">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    data-testid="btn-user-menu"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">
                      {userInitials}
                    </div>
                    <span className="hidden sm:block text-[11px] font-medium max-w-[100px] truncate">
                      {user?.displayName || user?.username}
                    </span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-52 rounded-lg border border-border/50 bg-background shadow-xl py-1 z-50">
                      <div className="px-3 py-2 border-b border-border/30">
                        <p className="text-xs font-medium truncate">{user?.displayName || user?.username}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email || user?.username}</p>
                      </div>
                      <Link href="/creatorseal">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                          data-testid="usermenu-account"
                        >
                          <User className="h-3 w-3" />
                          Mein Konto
                        </button>
                      </Link>
                      <Link href="/einstellungen">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                          data-testid="usermenu-settings"
                        >
                          <Settings className="h-3 w-3" />
                          Einstellungen
                        </button>
                      </Link>
                      <div className="border-t border-border/30 mt-1 pt-1">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                          onClick={async () => {
                            setUserMenuOpen(false);
                            await logout();
                            toast({ title: "Abgemeldet", description: "Bis bald!" });
                          }}
                          data-testid="btn-logout"
                        >
                          <LogOut className="h-3 w-3" />
                          Abmelden
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="btn-login" className="gap-1 h-7 text-[11px] px-2.5">
                      <LogIn className="h-3 w-3" />
                      <span className="hidden sm:inline">Anmelden</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" data-testid="auth-dialog">
                    <DialogHeader>
                      <DialogTitle>{authMode === "login" ? "Anmelden" : "Registrieren"}</DialogTitle>
                      <DialogDescription>
                        {authMode === "login"
                          ? "Melde dich bei deinem RealSync-Konto an."
                          : "Erstelle ein neues RealSync-Konto."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="auth-username">Benutzername</Label>
                        <Input
                          id="auth-username"
                          placeholder="Benutzername"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          data-testid="input-auth-username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="auth-password">Passwort</Label>
                        <Input
                          id="auth-password"
                          type="password"
                          placeholder="Passwort"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                          data-testid="input-auth-password"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleAuth}
                        disabled={authLoading}
                        data-testid="btn-auth-submit"
                      >
                        {authLoading ? "Laden..." : authMode === "login" ? "Anmelden" : "Registrieren"}
                      </Button>
                      <div className="text-center text-sm text-muted-foreground">
                        {authMode === "login" ? (
                          <span>
                            Noch kein Konto?{" "}
                            <button
                              className="text-primary hover:underline"
                              onClick={() => setAuthMode("register")}
                              data-testid="btn-switch-register"
                            >
                              Registrieren
                            </button>
                          </span>
                        ) : (
                          <span>
                            Bereits ein Konto?{" "}
                            <button
                              className="text-primary hover:underline"
                              onClick={() => setAuthMode("login")}
                              data-testid="btn-switch-login"
                            >
                              Anmelden
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                data-testid="theme-toggle"
                className="rounded-lg h-7 w-7"
              >
                {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-lg h-7 w-7"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu — Slide-in from right */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-12 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            {/* Panel */}
            <div className="absolute right-0 top-0 bottom-0 w-72 border-l border-border/50 glass animate-slide-in-right overflow-y-auto">
              <nav className="px-3 py-4 flex flex-col gap-0.5">
                {/* Category: Haupt */}
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                  Haupt
                </div>

                {/* Home */}
                <Link href="/">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      hashLocation === "/"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Home className="h-3.5 w-3.5" />
                    Home
                  </button>
                </Link>

                {/* Category: Produkte */}
                <div className="px-3 py-1.5 mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                  Produkte
                </div>

                {/* CreatorSeal accordion */}
                <div>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/creatorseal")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setMobileAccordion(mobileAccordion === "creatorseal" ? null : "creatorseal")}
                  >
                    <span className="flex items-center gap-2.5">
                      <Shield className="h-3.5 w-3.5" />
                      CreatorSeal
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${mobileAccordion === "creatorseal" ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAccordion === "creatorseal" && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/30 pl-3">
                      {creatorSealDropdown.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.tab} href="/creatorseal">
                            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200">
                              <Icon className="h-3 w-3 text-primary/60" />
                              {item.label}
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Optimus accordion */}
                <div>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/optimus")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setMobileAccordion(mobileAccordion === "optimus" ? null : "optimus")}
                  >
                    <span className="flex items-center gap-2.5">
                      <Globe className="h-3.5 w-3.5" />
                      Optimus
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${mobileAccordion === "optimus" ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAccordion === "optimus" && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/30 pl-3">
                      {optimusDropdown.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.tab} href="/optimus">
                            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200">
                              <Icon className="h-3 w-3 text-primary/60" />
                              {item.label}
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Builder direct */}
                <Link href="/builder">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/builder")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Builder
                  </button>
                </Link>

                {/* Scanner direct */}
                <Link href="/scanner">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/scanner")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Scanner
                  </button>
                </Link>

                {/* Category: Info */}
                <div className="px-3 py-1.5 mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                  Info
                </div>

                {/* Preise direct */}
                <Link href="/preise">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/preise")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Preise
                  </button>
                </Link>

                {/* Community direct */}
                <Link href="/community">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/community")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Community
                  </button>
                </Link>

                {/* SchulLabor direct */}
                <Link href="/schullabor">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/schullabor")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    SchulLabor
                  </button>
                </Link>

                {/* Link-Magic direct */}
                <Link href="/link-magic">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/link-magic")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Link-Magic
                  </button>
                </Link>

                {/* KI-Support direct */}
                <Link href="/support">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/support")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    KI-Support
                  </button>
                </Link>

                {/* Marke & Strategie direct */}
                <Link href="/brand">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/brand")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Megaphone className="h-3.5 w-3.5" />
                    Marke & Strategie
                  </button>
                </Link>

                {/* Live Status direct */}
                <Link href="/status">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/status")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    Live Status
                  </button>
                </Link>

                {/* RealSync Bildung direct */}
                <Link href="/bildung">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/bildung")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    RealSync Bildung
                  </button>
                </Link>

                {/* Screenshot-Agenten */}
                <Link href="/agenten">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/agenten")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <ScanSearch className="h-3.5 w-3.5" />
                    Screenshot-Agenten
                  </button>
                </Link>

                {/* Kampagnen */}
                <Link href="/kampagnen">
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/kampagnen")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Megaphone className="h-3.5 w-3.5" />
                    Kampagnen
                  </button>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer — Compact 3-column */}
      <footer className="border-t border-border/50 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RealSyncLogo className="h-6 w-6" />
                <div>
                  <span className="font-display text-sm font-bold">RealSync</span>
                  <span className="font-display text-sm font-light text-primary ml-1">Dynamics</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                RealSync SaaS Plattform — Die Nr.1 Creator-Plattform
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1">
                Thüringen, Deutschland
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-xs mb-2.5">Produkte</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/creatorseal" className="hover:text-foreground transition-colors">CreatorSeal</Link></li>
                <li><Link href="/optimus" className="hover:text-foreground transition-colors">RealSync Optimus</Link></li>
                <li><Link href="/builder" className="hover:text-foreground transition-colors">Multi-App Builder</Link></li>
                <li><Link href="/scanner" className="hover:text-foreground transition-colors">Market Scanner</Link></li>
                <li><Link href="/preise" className="hover:text-foreground transition-colors">Preise</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link href="/schullabor" className="hover:text-foreground transition-colors">SchulLabor</Link></li>
                <li><Link href="/link-magic" className="hover:text-foreground transition-colors">Link-Magic</Link></li>
                <li><Link href="/support" className="hover:text-foreground transition-colors">KI-Support</Link></li>
                <li><Link href="/brand" className="hover:text-foreground transition-colors">Marke & Strategie</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Live Status</Link></li>
                <li><Link href="/bildung" className="hover:text-foreground transition-colors">RealSync Bildung</Link></li>
                <li><Link href="/agenten" className="hover:text-foreground transition-colors">Screenshot-Agenten</Link></li>
                <li><Link href="/kampagnen" className="hover:text-foreground transition-colors">Kampagnen</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs mb-2.5">Unternehmen & Rechtliches</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/ueber-uns" className="hover:text-foreground transition-colors">Über uns</Link></li>
                <li><Link href="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link></li>
                <li><Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link></li>
                <li><Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link></li>
                <li><Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              © 2026 RealSync Dynamics GmbH. Alle Rechte vorbehalten.
            </p>
            <PerplexityAttribution />
          </div>
        </div>
      </footer>
    </div>
  );
}
