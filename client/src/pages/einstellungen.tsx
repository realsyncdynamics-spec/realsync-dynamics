import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  Settings,
  User,
  Shield,
  Key,
  Palette,
  CreditCard,
  Copy,
  RefreshCw,
  Save,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Sun,
  Moon,
  Globe,
  Loader2,
} from "lucide-react";

const planLabels: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  business: "Business",
  enterprise: "Enterprise",
};

const planLimits: Record<string, number> = {
  free: 5,
  starter: 25,
  pro: 100,
  business: 500,
  enterprise: 9999,
};

const planColors: Record<string, string> = {
  free: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  starter: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pro: "bg-primary/10 text-primary border-primary/20",
  business: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  enterprise: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export default function EinstellungenPage() {
  const { user, isAuthenticated, updateProfile } = useAuth();

  // Profile
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // API Key
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyGenerating, setApiKeyGenerating] = useState(false);
  const mockApiKey = "sk_live_rsd_a8f3k29x…m4pz";

  // Appearance
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  const plan = user?.plan || "free";
  const usedContent = 3;
  const limitContent = planLimits[plan] || 5;
  const usagePercent = Math.round((usedContent / limitContent) * 100);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      await updateProfile({ displayName, email, bio });
      toast({ title: "Profil gespeichert", description: "Deine Änderungen wurden übernommen." });
    } catch (e: any) {
      toast({ title: "Fehler", description: e.message || "Profil konnte nicht gespeichert werden.", variant: "destructive" });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) {
      toast({ title: "Fehler", description: "Bitte alle Felder ausfüllen.", variant: "destructive" });
      return;
    }
    if (newPw !== confirmPw) {
      toast({ title: "Fehler", description: "Neue Passwörter stimmen nicht überein.", variant: "destructive" });
      return;
    }
    if (newPw.length < 6) {
      toast({ title: "Fehler", description: "Passwort muss mindestens 6 Zeichen haben.", variant: "destructive" });
      return;
    }
    setPwSaving(true);
    try {
      await apiRequest("POST", "/api/auth/change-password", {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      toast({ title: "Passwort geändert", description: "Dein neues Passwort ist aktiv." });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (e: any) {
      toast({ title: "Fehler", description: e.message || "Passwort konnte nicht geändert werden.", variant: "destructive" });
    } finally {
      setPwSaving(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText(mockApiKey);
    toast({ title: "Kopiert", description: "API-Schlüssel in die Zwischenablage kopiert." });
  };

  const handleRegenerateKey = async () => {
    setApiKeyGenerating(true);
    try {
      await apiRequest("POST", "/api/auth/regenerate-key", {});
      toast({ title: "Neuer Schlüssel", description: "Ein neuer API-Schlüssel wurde generiert." });
    } catch {
      toast({ title: "Fehler", description: "Schlüssel konnte nicht generiert werden.", variant: "destructive" });
    } finally {
      setApiKeyGenerating(false);
    }
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  // ─── Not logged in ───
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <LogIn className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-3">Bitte melden Sie sich an</h1>
        <p className="text-muted-foreground mb-6">
          Um auf die Einstellungen zuzugreifen, müssen Sie sich zuerst anmelden.
        </p>
        <p className="text-sm text-muted-foreground">
          Klicken Sie oben rechts auf &quot;Anmelden&quot;, um fortzufahren.
        </p>
      </div>
    );
  }

  // ─── Settings Page ───
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Einstellungen</h1>
          <p className="text-muted-foreground text-sm">Konto, Sicherheit & Darstellung verwalten</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ═══ Profil ═══ */}
        <Card data-testid="settings-profile">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Profil</CardTitle>
            </div>
            <CardDescription>Deine persönlichen Informationen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settings-displayname">Anzeigename</Label>
                <Input
                  id="settings-displayname"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Dein Name"
                  data-testid="input-settings-displayname"
                />
              </div>
              <div>
                <Label htmlFor="settings-email">E-Mail</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  data-testid="input-settings-email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="settings-bio">Bio</Label>
              <Textarea
                id="settings-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Erzähle etwas über dich..."
                rows={3}
                data-testid="input-settings-bio"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              data-testid="btn-save-profile"
              className="gap-2"
            >
              {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Speichern
            </Button>
          </CardContent>
        </Card>

        {/* ═══ Mein Plan ═══ */}
        <Card data-testid="settings-plan">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Mein Plan</CardTitle>
            </div>
            <CardDescription>Dein aktueller Tarif und Nutzung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={planColors[plan] || planColors.free}>
                {planLabels[plan] || "Free"}
              </Badge>
              <span className="text-sm text-muted-foreground">Aktueller Tarif</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {usedContent} von {limitContent} Inhalten geschützt
                </span>
                <span className="font-medium text-primary">{usagePercent}%</span>
              </div>
              <Progress value={usagePercent} className="h-2" />
            </div>
            <Link href="/preise">
              <Button variant="outline" className="gap-2" data-testid="btn-upgrade-plan">
                Plan upgraden
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* ═══ Sicherheit ═══ */}
        <Card data-testid="settings-security">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Sicherheit</CardTitle>
            </div>
            <CardDescription>Passwort und Zugangsdaten verwalten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="settings-current-pw">Aktuelles Passwort</Label>
              <div className="relative">
                <Input
                  id="settings-current-pw"
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Aktuelles Passwort"
                  data-testid="input-current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                >
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settings-new-pw">Neues Passwort</Label>
                <div className="relative">
                  <Input
                    id="settings-new-pw"
                    type={showNewPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Neues Passwort"
                    data-testid="input-new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPw(!showNewPw)}
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="settings-confirm-pw">Passwort bestätigen</Label>
                <Input
                  id="settings-confirm-pw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Passwort bestätigen"
                  data-testid="input-confirm-password"
                />
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={pwSaving}
              variant="outline"
              className="gap-2"
              data-testid="btn-change-password"
            >
              {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Passwort ändern
            </Button>
          </CardContent>
        </Card>

        {/* ═══ API-Zugang ═══ */}
        <Card data-testid="settings-api">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">API-Zugang</CardTitle>
            </div>
            <CardDescription>Dein API-Schlüssel für externe Integrationen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API-Schlüssel</Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 font-mono text-sm bg-muted/30 border border-border/50 rounded-lg px-3 py-2 truncate">
                  {apiKeyVisible ? mockApiKey : "sk_live_xxxx…xxxx"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  data-testid="btn-toggle-apikey"
                >
                  {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={handleCopyApiKey}
                  data-testid="btn-copy-apikey"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleRegenerateKey}
              disabled={apiKeyGenerating}
              className="gap-2"
              data-testid="btn-regenerate-apikey"
            >
              {apiKeyGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Neuen Schlüssel generieren
            </Button>
          </CardContent>
        </Card>

        {/* ═══ Darstellung ═══ */}
        <Card data-testid="settings-appearance">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Darstellung</CardTitle>
            </div>
            <CardDescription>Design und Spracheinstellungen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Theme</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant={!isDark ? "default" : "outline"}
                  size="sm"
                  onClick={() => { if (isDark) toggleTheme(); }}
                  className="gap-2"
                  data-testid="btn-theme-light"
                >
                  <Sun className="h-4 w-4" />
                  Hell
                </Button>
                <Button
                  variant={isDark ? "default" : "outline"}
                  size="sm"
                  onClick={() => { if (!isDark) toggleTheme(); }}
                  className="gap-2"
                  data-testid="btn-theme-dark"
                >
                  <Moon className="h-4 w-4" />
                  Dunkel
                </Button>
              </div>
            </div>
            <div>
              <Label>Sprache</Label>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Deutsch</span>
                <Badge variant="secondary" className="text-[10px]">Standard</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
