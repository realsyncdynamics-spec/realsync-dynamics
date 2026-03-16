import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  School,
  Shield,
  Users,
  BookOpen,
  Clock,
  MapPin,
  CreditCard,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wifi,
  Calendar,
  FileText,
  BarChart3,
  Smartphone,
  QrCode,
  Key,
  Building2,
  Globe,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  ClipboardList,
  UserCheck,
  Database,
  Server,
  ExternalLink,
  Plus,
  Search,
  Printer,
  Eye,
  Trash2,
  Download,
  Upload,
  Settings,
  Activity,
} from "lucide-react";

// ── Seed Data ──────────────────────────────────────────────

const BUNDESLAENDER = [
  { name: "Bayern", kuerzel: "BY", schulcloud: "BayernCloud / Mebis", schulen: 62, vidis: true, digitalpakt: "aktiv", color: "bg-blue-500" },
  { name: "Baden-Württemberg", kuerzel: "BW", schulcloud: "Moodle / BelWü", schulen: 58, vidis: true, digitalpakt: "aktiv", color: "bg-emerald-500" },
  { name: "Berlin", kuerzel: "BE", schulcloud: "Lernraum Berlin", schulen: 45, vidis: true, digitalpakt: "aktiv", color: "bg-red-500" },
  { name: "Brandenburg", kuerzel: "BB", schulcloud: "Schulcloud Brandenburg", schulen: 28, vidis: true, digitalpakt: "genehmigt", color: "bg-orange-500" },
  { name: "Bremen", kuerzel: "HB", schulcloud: "itslearning", schulen: 12, vidis: false, digitalpakt: "genehmigt", color: "bg-teal-500" },
  { name: "Hamburg", kuerzel: "HH", schulcloud: "LMS Hamburg", schulen: 34, vidis: true, digitalpakt: "aktiv", color: "bg-cyan-500" },
  { name: "Hessen", kuerzel: "HE", schulcloud: "Schulportal Hessen", schulen: 41, vidis: true, digitalpakt: "aktiv", color: "bg-violet-500" },
  { name: "Mecklenburg-Vorpommern", kuerzel: "MV", schulcloud: "itslearning", schulen: 18, vidis: false, digitalpakt: "beantragt", color: "bg-sky-500" },
  { name: "Niedersachsen", kuerzel: "NI", schulcloud: "IServ / NBB", schulen: 52, vidis: true, digitalpakt: "aktiv", color: "bg-lime-500" },
  { name: "Nordrhein-Westfalen", kuerzel: "NW", schulcloud: "LOGINEO NRW", schulen: 78, vidis: true, digitalpakt: "aktiv", color: "bg-amber-500" },
  { name: "Rheinland-Pfalz", kuerzel: "RP", schulcloud: "Schulcampus RLP", schulen: 31, vidis: true, digitalpakt: "genehmigt", color: "bg-rose-500" },
  { name: "Saarland", kuerzel: "SL", schulcloud: "OSS / Moodle", schulen: 9, vidis: false, digitalpakt: "beantragt", color: "bg-fuchsia-500" },
  { name: "Sachsen", kuerzel: "SN", schulcloud: "LernSax", schulen: 38, vidis: true, digitalpakt: "aktiv", color: "bg-yellow-500" },
  { name: "Sachsen-Anhalt", kuerzel: "ST", schulcloud: "emuCLOUD", schulen: 22, vidis: false, digitalpakt: "genehmigt", color: "bg-indigo-500" },
  { name: "Schleswig-Holstein", kuerzel: "SH", schulcloud: "IServ / SchulcommSy", schulen: 26, vidis: true, digitalpakt: "aktiv", color: "bg-pink-500" },
  { name: "Thüringen", kuerzel: "TH", schulcloud: "Schulcloud Thüringen", schulen: 21, vidis: true, digitalpakt: "aktiv", color: "bg-purple-500" },
];

const ACCESS_POINTS = [
  { id: "ap1", name: "Haupteingang", status: "aktiv", scans: 189, lastScan: "vor 2 Min." },
  { id: "ap2", name: "Chemielabor", status: "aktiv", scans: 34, lastScan: "vor 8 Min." },
  { id: "ap3", name: "Bibliothek", status: "aktiv", scans: 67, lastScan: "vor 1 Min." },
  { id: "ap4", name: "Sporthalle", status: "wartung", scans: 0, lastScan: "vor 3 Std." },
  { id: "ap5", name: "Informatikraum", status: "aktiv", scans: 28, lastScan: "vor 12 Min." },
  { id: "ap6", name: "Musiksaal", status: "aktiv", scans: 19, lastScan: "vor 22 Min." },
];

const ACCESS_LOG = [
  { id: "l1", student: "Schüler #A7F2", point: "Haupteingang", result: "granted", time: "08:02", method: "nfc" },
  { id: "l2", student: "Schüler #B3D1", point: "Chemielabor", result: "granted", time: "08:14", method: "nfc" },
  { id: "l3", student: "Schüler #C9E5", point: "Bibliothek", result: "granted", time: "08:17", method: "qr" },
  { id: "l4", student: "Schüler #D2F8", point: "Sporthalle", result: "denied", time: "08:21", method: "nfc" },
  { id: "l5", student: "Schüler #E1A4", point: "Haupteingang", result: "granted", time: "08:23", method: "nfc" },
  { id: "l6", student: "Schüler #F6B9", point: "Informatikraum", result: "granted", time: "08:30", method: "pin" },
  { id: "l7", student: "Lehrkraft #L12", point: "Chemielabor", result: "granted", time: "08:31", method: "nfc" },
  { id: "l8", student: "Schüler #G4C2", point: "Haupteingang", result: "denied", time: "08:35", method: "nfc" },
  { id: "l9", student: "Schüler #H8D7", point: "Bibliothek", result: "granted", time: "08:38", method: "qr" },
  { id: "l10", student: "Schüler #I5E3", point: "Musiksaal", result: "granted", time: "08:41", method: "nfc" },
];

const COURSES = [
  { id: "c1", title: "Algebra Grundlagen", fach: "Mathematik", klasse: "7a", teacher: "Hr. Müller", module: 12, schueler: 28, konform: true, status: "aktiv" },
  { id: "c2", title: "Literaturepoche Aufklärung", fach: "Deutsch", klasse: "10b", teacher: "Fr. Schmidt", module: 8, schueler: 24, konform: true, status: "aktiv" },
  { id: "c3", title: "Photosynthese verstehen", fach: "Biologie", klasse: "8c", teacher: "Fr. Weber", module: 6, schueler: 30, konform: true, status: "aktiv" },
  { id: "c4", title: "Python Programmierung", fach: "Informatik", klasse: "9a", teacher: "Hr. Fischer", module: 15, schueler: 22, konform: true, status: "aktiv" },
  { id: "c5", title: "Englisch B1 Konversation", fach: "Englisch", klasse: "8a", teacher: "Fr. Johnson", module: 10, schueler: 26, konform: true, status: "aktiv" },
  { id: "c6", title: "Grundlagen der Mechanik", fach: "Physik", klasse: "10a", teacher: "Hr. Braun", module: 9, schueler: 25, konform: true, status: "entwurf" },
  { id: "c7", title: "Chemische Reaktionen", fach: "Chemie", klasse: "9b", teacher: "Fr. Klein", module: 7, schueler: 27, konform: true, status: "aktiv" },
  { id: "c8", title: "Weimarer Republik", fach: "Geschichte", klasse: "10c", teacher: "Hr. Wagner", module: 11, schueler: 29, konform: false, status: "entwurf" },
  { id: "c9", title: "Aquarellmalerei", fach: "Kunst", klasse: "6b", teacher: "Fr. Richter", module: 5, schueler: 20, konform: true, status: "aktiv" },
  { id: "c10", title: "Musiktheorie Basics", fach: "Musik", klasse: "5a", teacher: "Hr. Becker", module: 8, schueler: 31, konform: true, status: "aktiv" },
];

const FAECHER = ["Alle", "Mathematik", "Deutsch", "Englisch", "Physik", "Chemie", "Biologie", "Informatik", "Geschichte", "Kunst", "Musik", "Sport"];

const TIMETABLE_CLASSES = ["5a", "6b", "7a", "7b", "8a", "8c", "9a", "9b", "10a", "10b", "10c"];

const TIMETABLE: Record<string, { fach: string; raum: string; lehrer: string; color: string }[][]> = {
  "7a": [
    // Mo, Di, Mi, Do, Fr — je 8 Stunden
    [
      { fach: "Mathematik", raum: "R201", lehrer: "Hr. Müller", color: "bg-blue-900/60 border-blue-500/40" },
      { fach: "Deutsch", raum: "R105", lehrer: "Fr. Schmidt", color: "bg-emerald-900/60 border-emerald-500/40" },
      { fach: "Englisch", raum: "R108", lehrer: "Fr. Johnson", color: "bg-violet-900/60 border-violet-500/40" },
      { fach: "Biologie", raum: "R302", lehrer: "Fr. Weber", color: "bg-green-900/60 border-green-500/40" },
      { fach: "Sport", raum: "Halle", lehrer: "Hr. Lang", color: "bg-orange-900/60 border-orange-500/40" },
      { fach: "Sport", raum: "Halle", lehrer: "Hr. Lang", color: "bg-orange-900/60 border-orange-500/40" },
      { fach: "", raum: "", lehrer: "", color: "" },
      { fach: "", raum: "", lehrer: "", color: "" },
    ],
    [
      { fach: "Physik", raum: "R303", lehrer: "Hr. Braun", color: "bg-cyan-900/60 border-cyan-500/40" },
      { fach: "Physik", raum: "R303", lehrer: "Hr. Braun", color: "bg-cyan-900/60 border-cyan-500/40" },
      { fach: "Mathematik", raum: "R201", lehrer: "Hr. Müller", color: "bg-blue-900/60 border-blue-500/40" },
      { fach: "Geschichte", raum: "R110", lehrer: "Hr. Wagner", color: "bg-amber-900/60 border-amber-500/40" },
      { fach: "Kunst", raum: "R401", lehrer: "Fr. Richter", color: "bg-pink-900/60 border-pink-500/40" },
      { fach: "Kunst", raum: "R401", lehrer: "Fr. Richter", color: "bg-pink-900/60 border-pink-500/40" },
      { fach: "Informatik", raum: "PC1", lehrer: "Hr. Fischer", color: "bg-indigo-900/60 border-indigo-500/40" },
      { fach: "", raum: "", lehrer: "", color: "" },
    ],
    [
      { fach: "Deutsch", raum: "R105", lehrer: "Fr. Schmidt", color: "bg-emerald-900/60 border-emerald-500/40" },
      { fach: "Englisch", raum: "R108", lehrer: "Fr. Johnson", color: "bg-violet-900/60 border-violet-500/40" },
      { fach: "Chemie", raum: "R304", lehrer: "Fr. Klein", color: "bg-rose-900/60 border-rose-500/40" },
      { fach: "Mathematik", raum: "R201", lehrer: "Hr. Müller", color: "bg-blue-900/60 border-blue-500/40" },
      { fach: "Musik", raum: "Aula", lehrer: "Hr. Becker", color: "bg-fuchsia-900/60 border-fuchsia-500/40" },
      { fach: "Musik", raum: "Aula", lehrer: "Hr. Becker", color: "bg-fuchsia-900/60 border-fuchsia-500/40" },
      { fach: "", raum: "", lehrer: "", color: "" },
      { fach: "", raum: "", lehrer: "", color: "" },
    ],
    [
      { fach: "Englisch", raum: "R108", lehrer: "Fr. Johnson", color: "bg-violet-900/60 border-violet-500/40" },
      { fach: "Biologie", raum: "R302", lehrer: "Fr. Weber", color: "bg-green-900/60 border-green-500/40" },
      { fach: "Deutsch", raum: "R105", lehrer: "Fr. Schmidt", color: "bg-emerald-900/60 border-emerald-500/40" },
      { fach: "Informatik", raum: "PC1", lehrer: "Hr. Fischer", color: "bg-indigo-900/60 border-indigo-500/40" },
      { fach: "Informatik", raum: "PC1", lehrer: "Hr. Fischer", color: "bg-indigo-900/60 border-indigo-500/40" },
      { fach: "Geschichte", raum: "R110", lehrer: "Hr. Wagner", color: "bg-amber-900/60 border-amber-500/40" },
      { fach: "", raum: "", lehrer: "", color: "" },
      { fach: "", raum: "", lehrer: "", color: "" },
    ],
    [
      { fach: "Mathematik", raum: "R201", lehrer: "Hr. Müller", color: "bg-blue-900/60 border-blue-500/40" },
      { fach: "Deutsch", raum: "R105", lehrer: "Fr. Schmidt", color: "bg-emerald-900/60 border-emerald-500/40" },
      { fach: "Physik", raum: "R303", lehrer: "Hr. Braun", color: "bg-cyan-900/60 border-cyan-500/40" },
      { fach: "Englisch", raum: "R108", lehrer: "Fr. Johnson", color: "bg-violet-900/60 border-violet-500/40" },
      { fach: "Chemie", raum: "R304", lehrer: "Fr. Klein", color: "bg-rose-900/60 border-rose-500/40" },
      { fach: "", raum: "", lehrer: "", color: "" },
      { fach: "", raum: "", lehrer: "", color: "" },
      { fach: "", raum: "", lehrer: "", color: "" },
    ],
  ],
};

const ATTENDANCE_STUDENTS = [
  { id: "s1", pseudo: "Schüler #A7F2", klasse: "7a", status: "anwesend", methode: "nfc", zeit: "07:58" },
  { id: "s2", pseudo: "Schüler #B3D1", klasse: "7a", status: "anwesend", methode: "nfc", zeit: "08:02" },
  { id: "s3", pseudo: "Schüler #C9E5", klasse: "7a", status: "anwesend", methode: "qr", zeit: "08:05" },
  { id: "s4", pseudo: "Schüler #D2F8", klasse: "7a", status: "verspaetet", methode: "nfc", zeit: "08:22" },
  { id: "s5", pseudo: "Schüler #E1A4", klasse: "7a", status: "anwesend", methode: "nfc", zeit: "07:55" },
  { id: "s6", pseudo: "Schüler #F6B9", klasse: "7a", status: "entschuldigt", methode: "manuell", zeit: "-" },
  { id: "s7", pseudo: "Schüler #G4C2", klasse: "7a", status: "abwesend", methode: "-", zeit: "-" },
  { id: "s8", pseudo: "Schüler #H8D7", klasse: "7a", status: "anwesend", methode: "nfc", zeit: "08:01" },
  { id: "s9", pseudo: "Schüler #I5E3", klasse: "7a", status: "anwesend", methode: "nfc", zeit: "07:59" },
  { id: "s10", pseudo: "Schüler #J2K8", klasse: "7a", status: "anwesend", methode: "qr", zeit: "08:07" },
  { id: "s11", pseudo: "Schüler #K7L3", klasse: "7a", status: "anwesend", methode: "nfc", zeit: "07:56" },
  { id: "s12", pseudo: "Schüler #L1M6", klasse: "7a", status: "anwesend", methode: "nfc", zeit: "08:00" },
];

const DSGVO_CHECKLIST = [
  { label: "Auftragsverarbeitungsvertrag (AVV)", done: true, detail: "Aktiv seit 01.01.2026" },
  { label: "Technische & Organisatorische Maßnahmen (TOMs)", done: true, detail: "Letzte Prüfung: 01.03.2026" },
  { label: "Verarbeitungsverzeichnis (Art. 30)", done: true, detail: "42 Verarbeitungstätigkeiten dokumentiert" },
  { label: "Löschkonzept nach DSGVO Art. 17", done: true, detail: "Automatisierte Löschfristen aktiv" },
  { label: "Einwilligungserklärungen", done: true, detail: "1.247 aktive Einwilligungen" },
  { label: "Datenschutzbeauftragter benannt", done: true, detail: "Dr. Maria Schulz, TÜV-zertifiziert" },
  { label: "Datenschutz-Folgenabschätzung (DSFA)", done: true, detail: "Abgeschlossen: NFC-Zugang, Lernplattform" },
  { label: "Regelmäßige Mitarbeiterschulungen", done: true, detail: "Nächste Schulung: 15.04.2026" },
];

const AUDIT_LOG = [
  { aktion: "Datenzugriff", betroffener: "Klasse 7a Noten", details: "Lehrkraft #L12 Routineabfrage", zeit: "vor 5 Min." },
  { aktion: "Export", betroffener: "Anwesenheitsliste März", details: "Schulleitung — verschlüsselt", zeit: "vor 22 Min." },
  { aktion: "Einwilligung", betroffener: "Schüler #N3P7", details: "Eltern-Einwilligung NFC erneuert", zeit: "vor 1 Std." },
  { aktion: "Löschung", betroffener: "Schüler #X9Z2", details: "Automatische Löschung nach Schulabgang", zeit: "vor 3 Std." },
  { aktion: "AVV erstellt", betroffener: "Cloud-Provider", details: "AVV mit BayernCloud verlängert", zeit: "vor 1 Tag" },
  { aktion: "Datenzugriff", betroffener: "NFC-Zugangslogs", details: "Datenschutzbeauftragte — Audit", zeit: "vor 1 Tag" },
];

const DASHBOARD_ACTIVITY = [
  { icon: Key, text: "NFC-Zugang: 342 Zutritte heute erfasst", time: "vor 2 Min.", color: "text-[#C9A84C]" },
  { icon: BookOpen, text: "Kurs 'Python Programmierung' — 3 neue Abgaben", time: "vor 15 Min.", color: "text-blue-400" },
  { icon: UserCheck, text: "Anwesenheit 7a: 26/28 Schüler anwesend", time: "vor 30 Min.", color: "text-emerald-400" },
  { icon: Award, text: "VIDIS-SSO Verbindung erfolgreich synchronisiert", time: "vor 1 Std.", color: "text-violet-400" },
  { icon: Shield, text: "DSGVO-Audit: Alle Prüfungen bestanden", time: "vor 2 Std.", color: "text-green-400" },
  { icon: GraduationCap, text: "Neuer Kurs 'Weimarer Republik' erstellt", time: "vor 3 Std.", color: "text-amber-400" },
  { icon: Smartphone, text: "5 neue NFC-Tags für Klasse 9a registriert", time: "vor 5 Std.", color: "text-cyan-400" },
];

// ── Helpers ────────────────────────────────────────────────

function dpStatusBadge(status: string) {
  switch (status) {
    case "aktiv": return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Aktiv</Badge>;
    case "genehmigt": return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Genehmigt</Badge>;
    case "beantragt": return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Beantragt</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

function attendanceStatusBadge(status: string) {
  switch (status) {
    case "anwesend": return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Anwesend</Badge>;
    case "abwesend": return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Abwesend</Badge>;
    case "entschuldigt": return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Entschuldigt</Badge>;
    case "verspaetet": return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Verspätet</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

// ── Main Component ──────────────────────────────────────────

export default function BildungPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bundeslandFilter, setBundeslandFilter] = useState("alle");
  const [fachFilter, setFachFilter] = useState("Alle");
  const [courseSearch, setCourseSearch] = useState("");
  const [timetableClass, setTimetableClass] = useState("7a");
  const [attendanceKlasse, setAttendanceKlasse] = useState("7a");
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseFach, setNewCourseFach] = useState("Mathematik");

  const totalSchulen = BUNDESLAENDER.reduce((s, b) => s + b.schulen, 0);

  const filteredCourses = COURSES.filter((c) => {
    if (fachFilter !== "Alle" && c.fach !== fachFilter) return false;
    if (courseSearch && !c.title.toLowerCase().includes(courseSearch.toLowerCase())) return false;
    return true;
  });

  const filteredBundeslaender = bundeslandFilter === "alle"
    ? BUNDESLAENDER
    : BUNDESLAENDER.filter((b) => b.digitalpakt === bundeslandFilter);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-100">
      {/* ── Hero Banner ──────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[#C9A84C]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/10 via-transparent to-[#C9A84C]/5" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/30">
              <GraduationCap className="h-7 w-7 text-[#C9A84C]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              RealSync <span className="text-[#C9A84C]">Bildung</span>
            </h1>
          </div>
          <p className="text-lg text-gray-400 mb-6 max-w-2xl">
            Die bundeslandübergreifende Schul-Plattform — sicher, DSGVO-konform und DigitalPakt-förderfähig.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 text-xs">DSGVO-konform</Badge>
            <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 text-xs">VIDIS-SSO</Badge>
            <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 text-xs">DigitalPakt 2.0</Badge>
            <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 text-xs">NFC-Zugang</Badge>
            <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 text-xs">16 Bundesländer</Badge>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="hero-stats">
            <Card className="bg-[#12121A] border-[#C9A84C]/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C9A84C]/15"><Globe className="h-5 w-5 text-[#C9A84C]" /></div>
                <div>
                  <p className="text-2xl font-bold text-[#C9A84C]">16</p>
                  <p className="text-xs text-gray-400">Bundesländer</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#12121A] border-[#C9A84C]/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C9A84C]/15"><School className="h-5 w-5 text-[#C9A84C]" /></div>
                <div>
                  <p className="text-2xl font-bold text-[#C9A84C]">{totalSchulen}+</p>
                  <p className="text-xs text-gray-400">Schulen</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#12121A] border-[#C9A84C]/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/15"><Shield className="h-5 w-5 text-emerald-400" /></div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">100%</p>
                  <p className="text-xs text-gray-400">DSGVO §</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#12121A] border-[#C9A84C]/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/15"><Zap className="h-5 w-5 text-violet-400" /></div>
                <div>
                  <p className="text-2xl font-bold text-violet-400">2.0</p>
                  <p className="text-xs text-gray-400">DigitalPakt</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#12121A] border border-gray-800 flex flex-wrap h-auto gap-1 p-1 mb-6" data-testid="tabs-list">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-dashboard">
              <BarChart3 className="h-4 w-4 mr-1.5" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="bundeslaender" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-bundeslaender">
              <MapPin className="h-4 w-4 mr-1.5" />Bundesländer
            </TabsTrigger>
            <TabsTrigger value="nfc" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-nfc">
              <Smartphone className="h-4 w-4 mr-1.5" />NFC & Zugang
            </TabsTrigger>
            <TabsTrigger value="kurse" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-kurse">
              <BookOpen className="h-4 w-4 mr-1.5" />Kurse
            </TabsTrigger>
            <TabsTrigger value="stundenplan" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-stundenplan">
              <Calendar className="h-4 w-4 mr-1.5" />Stundenplan
            </TabsTrigger>
            <TabsTrigger value="anwesenheit" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-anwesenheit">
              <UserCheck className="h-4 w-4 mr-1.5" />Anwesenheit
            </TabsTrigger>
            <TabsTrigger value="dsgvo" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-dsgvo">
              <Lock className="h-4 w-4 mr-1.5" />DSGVO
            </TabsTrigger>
            <TabsTrigger value="preise" className="data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]" data-testid="tab-preise">
              <CreditCard className="h-4 w-4 mr-1.5" />Preise
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 1: Dashboard                               */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="dashboard" data-testid="content-dashboard">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-[#C9A84C]" />
                    <Badge className="bg-emerald-500/15 text-emerald-400 text-[10px]">+12%</Badge>
                  </div>
                  <p className="text-2xl font-bold">1.247</p>
                  <p className="text-xs text-gray-500">Schüler gesamt</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <GraduationCap className="h-5 w-5 text-violet-400" />
                    <Badge className="bg-violet-500/15 text-violet-400 text-[10px]">+3</Badge>
                  </div>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-xs text-gray-500">Lehrkräfte</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <Badge className="bg-blue-500/15 text-blue-400 text-[10px]">Aktiv</Badge>
                  </div>
                  <p className="text-2xl font-bold">34</p>
                  <p className="text-xs text-gray-500">Kurse aktiv</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <UserCheck className="h-5 w-5 text-emerald-400" />
                    <Badge className="bg-emerald-500/15 text-emerald-400 text-[10px]">Heute</Badge>
                  </div>
                  <p className="text-2xl font-bold">94,2%</p>
                  <p className="text-xs text-gray-500">Anwesenheit heute</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Meine Schule */}
              <Card className="bg-[#12121A] border-gray-800 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#C9A84C]" />
                    Meine Schule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#C9A84C]/5 border border-[#C9A84C]/15">
                    <p className="font-semibold text-[#C9A84C]">Friedrich-Schiller-Gymnasium</p>
                    <p className="text-xs text-gray-400 mt-1">Erfurt, Thüringen</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Schultyp</span><span>Gymnasium</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Bundesland</span><span>Thüringen</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">VIDIS-SSO</span><Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Aktiv</Badge></div>
                    <div className="flex justify-between"><span className="text-gray-400">Schulcloud</span><span className="text-xs">Schulcloud TH</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">DigitalPakt</span>{dpStatusBadge("aktiv")}</div>
                    <div className="flex justify-between"><span className="text-gray-400">Plan</span><Badge className="bg-[#C9A84C]/20 text-[#C9A84C] text-[10px]">Premium</Badge></div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity feed */}
              <Card className="bg-[#12121A] border-gray-800 lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#C9A84C]" />
                    Letzte Aktivitäten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {DASHBOARD_ACTIVITY.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <a.icon className={`h-4 w-4 mt-0.5 ${a.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{a.text}</p>
                          <p className="text-xs text-gray-500">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <Button variant="outline" className="bg-[#12121A] border-gray-700 hover:border-[#C9A84C]/50 h-auto py-3 flex-col gap-1.5" data-testid="action-add-student">
                <Users className="h-5 w-5 text-[#C9A84C]" />
                <span className="text-xs">Schüler hinzufügen</span>
              </Button>
              <Button variant="outline" className="bg-[#12121A] border-gray-700 hover:border-[#C9A84C]/50 h-auto py-3 flex-col gap-1.5" data-testid="action-create-course">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span className="text-xs">Kurs erstellen</span>
              </Button>
              <Button variant="outline" className="bg-[#12121A] border-gray-700 hover:border-[#C9A84C]/50 h-auto py-3 flex-col gap-1.5" data-testid="action-manage-nfc">
                <Key className="h-5 w-5 text-emerald-400" />
                <span className="text-xs">NFC verwalten</span>
              </Button>
              <Button variant="outline" className="bg-[#12121A] border-gray-700 hover:border-[#C9A84C]/50 h-auto py-3 flex-col gap-1.5" data-testid="action-timetable">
                <Calendar className="h-5 w-5 text-violet-400" />
                <span className="text-xs">Stundenplan</span>
              </Button>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 2: Bundesländer                            */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="bundeslaender" data-testid="content-bundeslaender">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <p className="text-sm text-gray-400 mr-2">Filter DigitalPakt:</p>
              {["alle", "aktiv", "genehmigt", "beantragt"].map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={bundeslandFilter === f ? "default" : "outline"}
                  className={bundeslandFilter === f ? "bg-[#C9A84C] text-black hover:bg-[#C9A84C]/80" : "bg-[#12121A] border-gray-700"}
                  onClick={() => setBundeslandFilter(f)}
                  data-testid={`filter-dp-${f}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBundeslaender.map((b) => (
                <Card key={b.kuerzel} className="bg-[#12121A] border-gray-800 hover:border-[#C9A84C]/30 transition-colors" data-testid={`bl-${b.kuerzel}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${b.color}/20 flex items-center justify-center`}>
                          <span className="text-xs font-bold text-white">{b.kuerzel}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm leading-tight">{b.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Schulcloud</span>
                        <span className="text-gray-300 text-right max-w-[120px] truncate">{b.schulcloud}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Schulen</span>
                        <span className="text-white font-medium">{b.schulen}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-400">
                        <span>VIDIS</span>
                        {b.vidis
                          ? <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px] border-emerald-500/30">Aktiv</Badge>
                          : <Badge className="bg-gray-500/20 text-gray-400 text-[10px] border-gray-500/30">Ausstehend</Badge>}
                      </div>
                      <div className="flex justify-between items-center text-gray-400">
                        <span>DigitalPakt</span>
                        {dpStatusBadge(b.digitalpakt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#12121A] border-gray-800 mt-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#C9A84C]">{totalSchulen}</p>
                    <p className="text-xs text-gray-400">Schulen verbunden</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{BUNDESLAENDER.filter((b) => b.vidis).length}</p>
                    <p className="text-xs text-gray-400">VIDIS-aktiv</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-violet-400">{BUNDESLAENDER.filter((b) => b.digitalpakt === "aktiv").length}</p>
                    <p className="text-xs text-gray-400">DigitalPakt aktiv</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 3: NFC & Zugang                            */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="nfc" data-testid="content-nfc">
            {/* NFC Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Key className="h-5 w-5 text-[#C9A84C] mx-auto mb-2" />
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-xs text-gray-500">Zutritte heute</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4 text-center">
                  <XCircle className="h-5 w-5 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-gray-500">Abgewiesen</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Smartphone className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">1.189</p>
                  <p className="text-xs text-gray-500">Aktive Tags</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Access points */}
              <Card className="bg-[#12121A] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-[#C9A84C]" />
                    Zugangspunkte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ACCESS_POINTS.map((ap) => (
                      <div key={ap.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-gray-800" data-testid={`ap-${ap.id}`}>
                        <div className="flex items-center gap-3">
                          {ap.status === "aktiv"
                            ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                            : <AlertTriangle className="h-4 w-4 text-amber-400" />}
                          <div>
                            <p className="text-sm font-medium">{ap.name}</p>
                            <p className="text-xs text-gray-500">Letzte Erfassung: {ap.lastScan}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{ap.scans}</p>
                          <p className="text-[10px] text-gray-500">Scans</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live access log */}
              <Card className="bg-[#12121A] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#C9A84C]" />
                    Live Zugangsprotokolle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                    {ACCESS_LOG.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm" data-testid={`log-${log.id}`}>
                        {log.result === "granted"
                          ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          : <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />}
                        <span className="text-gray-400 font-mono text-xs w-12">{log.time}</span>
                        <span className="truncate">{log.student}</span>
                        <ChevronRight className="h-3 w-3 text-gray-600 shrink-0" />
                        <span className="text-gray-400 truncate">{log.point}</span>
                        <Badge className="ml-auto text-[10px] bg-gray-800 border-gray-700 shrink-0">{log.method.toUpperCase()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* NFC management & QR fallback */}
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <Card className="bg-[#12121A] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-[#C9A84C]" />
                    NFC-Tag Verwaltung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#C9A84C]/5 border border-[#C9A84C]/15">
                    <div>
                      <p className="text-sm font-medium">Aktive Tags</p>
                      <p className="text-xs text-gray-400">NFC-kompatible Schülerausweise</p>
                    </div>
                    <p className="text-xl font-bold text-[#C9A84C]">1.189</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-[#12121A] border-gray-700 text-sm" data-testid="btn-register-tag">
                      <Plus className="h-4 w-4 mr-1.5" />Tag registrieren
                    </Button>
                    <Button variant="outline" className="bg-[#12121A] border-gray-700 text-sm" data-testid="btn-deactivate-tag">
                      <XCircle className="h-4 w-4 mr-1.5" />Tag deaktivieren
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 p-2 bg-white/5 rounded-lg">
                    Unterstützte Standards: NTAG213, NTAG215, NTAG216, Mifare Classic, Mifare DESFire EV2
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#12121A] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-[#C9A84C]" />
                    QR-Code Fallback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-400">
                    Für Schüler ohne NFC-Ausweis: Temporärer QR-Code-Zugang gültig für 24 Stunden.
                  </p>
                  <div className="p-6 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-32 h-32 bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] bg-[length:8px_8px] rounded" />
                  </div>
                  <Button className="w-full bg-[#C9A84C] text-black hover:bg-[#C9A84C]/80" data-testid="btn-generate-qr">
                    <QrCode className="h-4 w-4 mr-1.5" />QR-Code generieren
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 4: Kurse & Lernmodule                      */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="kurse" data-testid="content-kurse">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Kurs suchen..."
                  className="bg-[#12121A] border-gray-700 pl-9"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  data-testid="input-course-search"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {FAECHER.map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={fachFilter === f ? "default" : "outline"}
                    className={fachFilter === f ? "bg-[#C9A84C] text-black hover:bg-[#C9A84C]/80 text-xs" : "bg-[#12121A] border-gray-700 text-xs"}
                    onClick={() => setFachFilter(f)}
                    data-testid={`filter-fach-${f}`}
                  >
                    {f}
                  </Button>
                ))}
              </div>
              <Button
                className="bg-[#C9A84C] text-black hover:bg-[#C9A84C]/80 ml-auto"
                onClick={() => setShowNewCourse(!showNewCourse)}
                data-testid="btn-new-course"
              >
                <Plus className="h-4 w-4 mr-1.5" />Neuen Kurs erstellen
              </Button>
            </div>

            {showNewCourse && (
              <Card className="bg-[#12121A] border-[#C9A84C]/30 mb-6" data-testid="new-course-form">
                <CardContent className="p-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Input
                      placeholder="Kurstitel..."
                      className="bg-[#0A0A0F] border-gray-700"
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                      data-testid="input-new-course-title"
                    />
                    <select
                      className="bg-[#0A0A0F] border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100"
                      value={newCourseFach}
                      onChange={(e) => setNewCourseFach(e.target.value)}
                      data-testid="select-new-course-fach"
                    >
                      {FAECHER.filter((f) => f !== "Alle").map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <Button className="bg-[#C9A84C] text-black hover:bg-[#C9A84C]/80" data-testid="btn-save-course">
                      Kurs speichern
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((c) => (
                <Card key={c.id} className="bg-[#12121A] border-gray-800 hover:border-[#C9A84C]/20 transition-colors" data-testid={`course-${c.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-sm">{c.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.teacher} · Klasse {c.klasse}</p>
                      </div>
                      {c.konform
                        ? <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px] border-emerald-500/30 shrink-0">Lehrplankonform</Badge>
                        : <Badge className="bg-amber-500/20 text-amber-300 text-[10px] border-amber-500/30 shrink-0">Entwurf</Badge>}
                    </div>
                    <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 text-[10px] mb-3">{c.fach}</Badge>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-sm font-bold">{c.module}</p>
                        <p className="text-[10px] text-gray-500">Module</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-sm font-bold">{c.schueler}</p>
                        <p className="text-[10px] text-gray-500">Schüler</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-sm font-bold capitalize">{c.status}</p>
                        <p className="text-[10px] text-gray-500">Status</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>Keine Kurse gefunden.</p>
              </div>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 5: Stundenplan                             */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="stundenplan" data-testid="content-stundenplan">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#C9A84C]" />
                <span className="text-sm text-gray-400">Klasse:</span>
                <select
                  className="bg-[#12121A] border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-100"
                  value={timetableClass}
                  onChange={(e) => setTimetableClass(e.target.value)}
                  data-testid="select-timetable-class"
                >
                  {TIMETABLE_CLASSES.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30">KW 12 / 2026</Badge>
              <Button variant="outline" size="sm" className="bg-[#12121A] border-gray-700 ml-auto" data-testid="btn-print-timetable">
                <Printer className="h-4 w-4 mr-1.5" />Drucken / Export
              </Button>
            </div>

            {TIMETABLE[timetableClass] ? (
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Header */}
                  <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-1 mb-1">
                    <div className="p-2 text-xs text-gray-500 text-center">Std.</div>
                    {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map((d) => (
                      <div key={d} className="p-2 bg-[#12121A] border border-gray-800 rounded-lg text-center text-sm font-semibold text-[#C9A84C]">{d}</div>
                    ))}
                  </div>
                  {/* Rows */}
                  {Array.from({ length: 8 }, (_, stunde) => (
                    <div key={stunde} className="grid grid-cols-[60px_repeat(5,1fr)] gap-1 mb-1">
                      <div className="p-2 text-xs text-gray-500 text-center flex flex-col justify-center">
                        <span className="font-medium">{stunde + 1}.</span>
                        <span className="text-[10px]">{`${8 + Math.floor(stunde * 0.75)}:${(stunde * 45) % 60 < 10 ? "0" : ""}${(stunde * 45) % 60}`}</span>
                      </div>
                      {[0, 1, 2, 3, 4].map((tag) => {
                        const slot = TIMETABLE[timetableClass]?.[tag]?.[stunde];
                        if (!slot || !slot.fach) {
                          return <div key={tag} className="p-2 bg-[#0A0A0F] border border-gray-800/50 rounded-lg" />;
                        }
                        return (
                          <div key={tag} className={`p-2 rounded-lg border ${slot.color} transition-colors`}>
                            <p className="text-xs font-semibold">{slot.fach}</p>
                            <p className="text-[10px] text-gray-400">{slot.raum} · {slot.lehrer}</p>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-8 text-center text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>Kein Stundenplan für Klasse {timetableClass} hinterlegt.</p>
                  <p className="text-xs mt-1">Bitte wählen Sie Klasse 7a für eine Demo-Ansicht.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 6: Anwesenheit                             */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="anwesenheit" data-testid="content-anwesenheit">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#C9A84C]" />
                <span className="text-sm text-gray-400">Klasse:</span>
                <select
                  className="bg-[#12121A] border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-100"
                  value={attendanceKlasse}
                  onChange={(e) => setAttendanceKlasse(e.target.value)}
                  data-testid="select-attendance-class"
                >
                  {TIMETABLE_CLASSES.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30">16. März 2026</Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Pie chart visual */}
              <Card className="bg-[#12121A] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tagesübersicht</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1a1a2e" strokeWidth="3" />
                        {/* Anwesend 94.2% */}
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="3"
                          strokeDasharray="94.2 5.8" strokeDashoffset="0" />
                        {/* Entschuldigt 3.1% */}
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f59e0b" strokeWidth="3"
                          strokeDasharray="3.1 96.9" strokeDashoffset="-94.2" />
                        {/* Abwesend 1.8% */}
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#ef4444" strokeWidth="3"
                          strokeDasharray="1.8 98.2" strokeDashoffset="-97.3" />
                        {/* Verspätet 0.9% */}
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f97316" strokeWidth="3"
                          strokeDasharray="0.9 99.1" strokeDashoffset="-99.1" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-2xl font-bold text-emerald-400">94,2%</p>
                        <p className="text-[10px] text-gray-500">Anwesend</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-gray-400 flex-1">Anwesend</span>
                      <span className="font-medium">94,2%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-gray-400 flex-1">Entschuldigt</span>
                      <span className="font-medium">3,1%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-gray-400 flex-1">Abwesend</span>
                      <span className="font-medium">1,8%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-gray-400 flex-1">Verspätet</span>
                      <span className="font-medium">0,9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student list */}
              <Card className="bg-[#12121A] border-gray-800 lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-[#C9A84C]" />
                    Schülerliste — Klasse {attendanceKlasse}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-[1fr_100px_80px_70px] gap-2 px-3 py-2 text-xs text-gray-500 border-b border-gray-800">
                      <span>Pseudonym</span>
                      <span>Status</span>
                      <span>Methode</span>
                      <span>Zeit</span>
                    </div>
                    {ATTENDANCE_STUDENTS.map((s) => (
                      <div key={s.id} className="grid grid-cols-[1fr_100px_80px_70px] gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors items-center" data-testid={`student-${s.id}`}>
                        <span className="text-sm font-mono">{s.pseudo}</span>
                        {attendanceStatusBadge(s.status)}
                        <span className="text-xs text-gray-400">{s.methode === "-" ? "-" : s.methode.toUpperCase()}</span>
                        <span className="text-xs text-gray-400 font-mono">{s.zeit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 7: DSGVO & Compliance                      */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="dsgvo" data-testid="content-dsgvo">
            {/* Status row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-[#12121A] border-emerald-500/20">
                <CardContent className="p-4 text-center">
                  <Shield className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-emerald-400">100%</p>
                  <p className="text-xs text-gray-500">DSGVO-konform</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Lock className="h-5 w-5 text-[#C9A84C] mx-auto mb-2" />
                  <p className="text-lg font-bold">AES-256</p>
                  <p className="text-xs text-gray-500">Verschlüsselung</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Server className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-bold">TLS 1.3</p>
                  <p className="text-xs text-gray-500">Transportlayer</p>
                </CardContent>
              </Card>
              <Card className="bg-[#12121A] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Globe className="h-5 w-5 text-violet-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-violet-400">FFM</p>
                  <p className="text-xs text-gray-500">EU-Cloud Standort</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Compliance checklist */}
              <Card className="bg-[#12121A] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Compliance-Checkliste
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {DSGVO_CHECKLIST.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-gray-800" data-testid={`dsgvo-check-${i}`}>
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit log + actions */}
              <div className="space-y-6">
                <Card className="bg-[#12121A] border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#C9A84C]" />
                      DSGVO Audit-Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {AUDIT_LOG.map((log, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors" data-testid={`audit-${i}`}>
                          <Database className="h-3.5 w-3.5 mt-0.5 text-gray-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-gray-800 border-gray-700 text-[10px]">{log.aktion}</Badge>
                              <span className="text-xs text-gray-500">{log.zeit}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{log.betroffener} — {log.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#12121A] border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Datenschutz-Aktionen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full bg-[#12121A] border-gray-700 justify-start" data-testid="btn-data-export">
                      <Download className="h-4 w-4 mr-2 text-blue-400" />
                      Daten exportieren (Art. 20 DSGVO)
                    </Button>
                    <Button variant="outline" className="w-full bg-[#12121A] border-gray-700 justify-start" data-testid="btn-data-delete">
                      <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                      Daten löschen (Art. 17 DSGVO)
                    </Button>
                    <Button variant="outline" className="w-full bg-[#12121A] border-gray-700 justify-start" data-testid="btn-avv-create">
                      <FileText className="h-4 w-4 mr-2 text-[#C9A84C]" />
                      Neuen AVV erstellen
                    </Button>
                    <Button variant="outline" className="w-full bg-[#12121A] border-gray-700 justify-start" data-testid="btn-einwilligung">
                      <ClipboardList className="h-4 w-4 mr-2 text-emerald-400" />
                      Einwilligungen verwalten
                    </Button>
                  </CardContent>
                </Card>

                {/* Privacy rules */}
                <Card className="bg-[#12121A] border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-[#C9A84C]" />
                      <p className="text-sm font-semibold">Datenschutzregeln</p>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Schülerdaten pseudonymisiert (kein Klarname)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>NFC-Logs nach 90 Tagen automatisch gelöscht</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>IP-Adressen gehasht gespeichert</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Hosting: EU-Cloud Frankfurt am Main (ISO 27001)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Keine Datenübermittlung in Drittländer</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* TAB 8: Preise & DigitalPakt                    */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value="preise" data-testid="content-preise">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Basis */}
              <Card className="bg-[#12121A] border-gray-800" data-testid="plan-basis">
                <CardHeader className="pb-3">
                  <Badge className="w-fit bg-gray-500/20 text-gray-300 border-gray-500/30 mb-2">Basis</Badge>
                  <CardTitle className="text-2xl">0€</CardTitle>
                  <p className="text-xs text-gray-500">kostenlos</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["1 Schule", "Bis 50 Schüler", "Grundfunktionen", "E-Mail Support", "Community Forum"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span className="text-gray-400">{f}</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4 border-gray-700" data-testid="btn-plan-basis">
                    Kostenlos starten
                  </Button>
                </CardContent>
              </Card>

              {/* Standard */}
              <Card className="bg-[#12121A] border-gray-800" data-testid="plan-standard">
                <CardHeader className="pb-3">
                  <Badge className="w-fit bg-blue-500/20 text-blue-300 border-blue-500/30 mb-2">Standard</Badge>
                  <CardTitle className="text-2xl">4,99€</CardTitle>
                  <p className="text-xs text-gray-500">pro Schüler / Monat</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Bis 500 Schüler", "NFC-Zugang", "Kurse & Lernmodule", "Anwesenheit", "Stundenplan", "E-Mail + Chat Support"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </div>
                  ))}
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" data-testid="btn-plan-standard">
                    Standard wählen
                  </Button>
                </CardContent>
              </Card>

              {/* Premium — highlighted */}
              <Card className="bg-[#12121A] border-[#C9A84C]/40 ring-1 ring-[#C9A84C]/20 relative" data-testid="plan-premium">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#C9A84C] text-black border-[#C9A84C]">Empfohlen</Badge>
                </div>
                <CardHeader className="pb-3 pt-6">
                  <Badge className="w-fit bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30 mb-2">Premium</Badge>
                  <CardTitle className="text-2xl text-[#C9A84C]">9,99€</CardTitle>
                  <p className="text-xs text-gray-500">pro Schüler / Monat</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Unbegrenzte Schüler", "Alle Standard-Features", "VIDIS-SSO Integration", "API-Zugang", "DSGVO-Audit Dashboard", "DigitalPakt-Antragshilfe", "Prioritäts-Support"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-[#C9A84C] shrink-0" />
                      <span className="text-gray-200">{f}</span>
                    </div>
                  ))}
                  <Button className="w-full mt-4 bg-[#C9A84C] text-black hover:bg-[#C9A84C]/80" data-testid="btn-plan-premium">
                    Premium wählen
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="bg-[#12121A] border-gray-800" data-testid="plan-enterprise">
                <CardHeader className="pb-3">
                  <Badge className="w-fit bg-violet-500/20 text-violet-300 border-violet-500/30 mb-2">Enterprise</Badge>
                  <CardTitle className="text-2xl">Auf Anfrage</CardTitle>
                  <p className="text-xs text-gray-500">Individuelles Angebot</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Multi-Schulträger", "White-Label Option", "Alle Premium-Features", "Dedizierte Instanz", "SLA 99,9%", "24/7 Support", "Persönlicher Berater"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4 border-violet-500/30 text-violet-300 hover:bg-violet-500/10" data-testid="btn-plan-enterprise">
                    Kontakt aufnehmen
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* DigitalPakt section */}
            <Card className="bg-[#12121A] border-[#C9A84C]/20 mb-6" data-testid="digitalpakt-section">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#C9A84C]" />
                  DigitalPakt 2.0 — Förderfähig
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <p className="text-sm font-semibold">Förderfähig</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      RealSync Bildung ist als Lernmanagementsystem nach DigitalPakt 2.0 förderfähig. Schulen können bis zu 90% der Lizenzkosten erstattet bekommen.
                    </p>
                  </div>
                  <div className="p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <p className="text-sm font-semibold">Antragshilfe</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Wir unterstützen Schulträger beim Förderantrag: Vorlage für Medienkonzept, technisches Lastenheft und Kostenplanung inklusive.
                    </p>
                  </div>
                  <div className="p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="h-4 w-4 text-violet-400" />
                      <p className="text-sm font-semibold">Medienkonzept-Vorlage</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Vorgefertigte Medienkonzept-Vorlage für alle 16 Bundesländer. Anpassbar an lokale Anforderungen und Lehrpläne.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue projection */}
            <Card className="bg-[#12121A] border-gray-800" data-testid="revenue-section">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#C9A84C]" />
                  Potenzialrechner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Schulen in DE</p>
                    <p className="text-xl font-bold">32.577</p>
                    <p className="text-[10px] text-gray-500">allgemeinbildend</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Schüler gesamt</p>
                    <p className="text-xl font-bold">8,4 Mio.</p>
                    <p className="text-[10px] text-gray-500">Schuljahr 2025/26</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">DigitalPakt Budget</p>
                    <p className="text-xl font-bold text-[#C9A84C]">5,5 Mrd. €</p>
                    <p className="text-[10px] text-gray-500">2019–2030 gesamt</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Marktpotenzial</p>
                    <p className="text-xl font-bold text-emerald-400">840 Mio. €</p>
                    <p className="text-[10px] text-gray-500">LMS-Segment p.a.</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-24">Marktanteil</span>
                    <Progress value={2} className="flex-1 h-2" />
                    <span className="text-xs font-medium w-12 text-right">2,0%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-24">Ziel 2027</span>
                    <Progress value={5} className="flex-1 h-2" />
                    <span className="text-xs font-medium w-12 text-right">5,0%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-24">Ziel 2030</span>
                    <Progress value={12} className="flex-1 h-2" />
                    <span className="text-xs font-medium w-12 text-right">12,0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
