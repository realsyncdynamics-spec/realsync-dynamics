import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Server, UserCheck, FileWarning, RefreshCw } from "lucide-react";

export default function DatenschutzPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <Badge variant="secondary" className="mb-4 px-4 py-1.5">
          <Shield className="h-3.5 w-3.5 mr-2" />
          DSGVO-konform
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Datenschutzerklärung</h1>
        <p className="text-muted-foreground">
          Informationen zum Schutz Ihrer personenbezogenen Daten
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Verantwortlicher */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">1</span>
            Verantwortlicher
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">RealSync Dynamics GmbH (i.Gr.)</p>
              <p>Thüringen, Deutschland</p>
              <p>E-Mail: kontakt@realsyncdynamics.de</p>
              <p className="mt-3">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
                gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
                personenbezogenen Daten entscheidet.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 2. Arten der verarbeiteten Daten */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">2</span>
            Arten der verarbeiteten Daten
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
              <p>Im Rahmen der Nutzung unserer Plattform können folgende Daten verarbeitet werden:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-3">
                <li>Bestandsdaten (z.B. Benutzername bei Registrierung)</li>
                <li>Kontaktdaten (z.B. E-Mail-Adresse bei Kontaktanfragen)</li>
                <li>Inhaltsdaten (z.B. hochgeladene Inhalte zur Verifizierung via CreatorSeal)</li>
                <li>Nutzungsdaten (z.B. erstellte Projekte im Multi-App Builder)</li>
                <li>Meta-/Kommunikationsdaten (z.B. IP-Adressen bei Serveranfragen)</li>
                <li>Kryptographische Hashwerte (SHA-256) von Inhalten — keine Klardaten</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 3. Rechtsgrundlagen */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">3</span>
            Rechtsgrundlagen der Verarbeitung
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage folgender Rechtsgrundlagen:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>
                  <span className="font-medium text-foreground">Art. 6 Abs. 1 lit. a DSGVO</span> — Einwilligung:
                  Soweit Sie uns eine Einwilligung erteilt haben.
                </li>
                <li>
                  <span className="font-medium text-foreground">Art. 6 Abs. 1 lit. b DSGVO</span> — Vertragserfüllung:
                  Verarbeitung zur Erfüllung des Nutzungsvertrags (z.B. Bereitstellung der App-Funktionen).
                </li>
                <li>
                  <span className="font-medium text-foreground">Art. 6 Abs. 1 lit. f DSGVO</span> — Berechtigte Interessen:
                  Verarbeitung zur Wahrung unserer berechtigten Interessen (z.B. Sicherheit der Plattform).
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 4. Sicherheitsmaßnahmen */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">4</span>
            Sicherheitsmaßnahmen
          </h2>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Technische und organisatorische Maßnahmen
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Wir setzen umfangreiche technische und organisatorische Sicherheitsmaßnahmen ein,
                um Ihre Daten zu schützen:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><span className="font-medium text-foreground">SHA-256 Hashing:</span> Inhalte werden ausschließlich als kryptographische Hashwerte gespeichert, nicht als Klardaten</li>
                <li><span className="font-medium text-foreground">Ende-zu-Ende-Verschlüsselung:</span> Kommunikation über die Plattform wird verschlüsselt übertragen</li>
                <li><span className="font-medium text-foreground">EU-Hosting:</span> Alle Daten werden auf Servern in Deutschland gespeichert</li>
                <li><span className="font-medium text-foreground">Verschlüsselte Übertragung:</span> TLS/SSL-Verschlüsselung für alle Datenübertragungen</li>
                <li><span className="font-medium text-foreground">Zugriffskontrolle:</span> Strenge Zugriffsbeschränkungen und Berechtigungssysteme</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 5. Cookies und Tracking */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">5</span>
            Cookies und Tracking
          </h2>
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Keine Cookies — Kein Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">
                Unsere Plattform verwendet keine Cookies, kein Tracking und keine Analyse-Tools.
              </p>
              <p>
                Wir verzichten bewusst und vollständig auf:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Cookies jeglicher Art (weder technisch notwendige noch Marketing-Cookies)</li>
                <li>Tracking-Pixel oder Web-Beacons</li>
                <li>Google Analytics oder vergleichbare Analyse-Dienste</li>
                <li>Browser-Speicher (wie Web Storage oder Datenbanken) zur Nutzeridentifikation</li>
                <li>Fingerprinting oder sonstige Identifikationstechniken</li>
                <li>Social-Media-Plugins mit Tracking-Funktionalität</li>
              </ul>
              <p className="mt-2">
                Ihr Nutzungserlebnis funktioniert vollständig ohne clientseitige Datenspeicherung.
                Authentifizierung erfolgt ausschließlich über serverseitige Tokens im Arbeitsspeicher.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 6. Hosting */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">6</span>
            Hosting und CDN
          </h2>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                Server-Standort
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Unsere Plattform wird auf Servern in Deutschland gehostet. Bei jedem Zugriff werden
                automatisch Server-Logdaten erfasst (z.B. IP-Adresse, Zeitpunkt des Zugriffs, angeforderte
                Datei). Diese Daten werden ausschließlich zur Sicherstellung eines störungsfreien Betriebs
                verwendet und nach 7 Tagen automatisch gelöscht.
              </p>
              <p>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
                Sicherheit und Stabilität des Angebots).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 7. Kontaktformular */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">7</span>
            Kontaktformular
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben
                aus dem Formular (Name, E-Mail-Adresse, Betreff, Nachricht) zur Bearbeitung der
                Anfrage und für den Fall von Anschlussfragen bei uns verarbeitet.
              </p>
              <p>
                Die Daten werden nach Erledigung der Anfrage gelöscht, sofern keine gesetzlichen
                Aufbewahrungspflichten bestehen.
              </p>
              <p>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw.
                Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 8. Ihre Rechte */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">8</span>
            Ihre Rechte
          </h2>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Betroffenenrechte nach DSGVO
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>Sie haben jederzeit das Recht auf:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><span className="font-medium text-foreground">Auskunft (Art. 15 DSGVO):</span> Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten</li>
                <li><span className="font-medium text-foreground">Berichtigung (Art. 16 DSGVO):</span> Berichtigung unrichtiger oder unvollständiger Daten</li>
                <li><span className="font-medium text-foreground">Löschung (Art. 17 DSGVO):</span> Löschung Ihrer gespeicherten Daten, soweit keine gesetzlichen Aufbewahrungspflichten bestehen</li>
                <li><span className="font-medium text-foreground">Einschränkung (Art. 18 DSGVO):</span> Einschränkung der Verarbeitung Ihrer Daten</li>
                <li><span className="font-medium text-foreground">Datenübertragbarkeit (Art. 20 DSGVO):</span> Herausgabe Ihrer Daten in einem gängigen, maschinenlesbaren Format</li>
                <li><span className="font-medium text-foreground">Widerspruch (Art. 21 DSGVO):</span> Widerspruch gegen die Verarbeitung Ihrer Daten</li>
                <li><span className="font-medium text-foreground">Beschwerde (Art. 77 DSGVO):</span> Beschwerde bei einer Aufsichtsbehörde</li>
              </ul>
              <p className="mt-3">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: kontakt@realsyncdynamics.de
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 9. Auftragsverarbeitung */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">9</span>
            Auftragsverarbeitung
          </h2>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-primary" />
                Drittanbieter
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Für die Zahlungsabwicklung nutzen wir den Dienst Stripe (Stripe Inc.). Im Rahmen der
                Zahlungsabwicklung werden die für die Transaktion erforderlichen Daten an Stripe
                übermittelt. Stripe ist als Auftragsverarbeiter gemäß Art. 28 DSGVO vertraglich
                gebunden und nach dem EU-US Data Privacy Framework zertifiziert.
              </p>
              <p>
                Mit allen Auftragsverarbeitern haben wir Verträge gemäß Art. 28 DSGVO abgeschlossen.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 10. Änderungen */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">10</span>
            Änderungen der Datenschutzerklärung
          </h2>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                Aktualisierungen
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie stets den aktuellen
                rechtlichen Anforderungen anzupassen oder um Änderungen unserer Leistungen umzusetzen.
                Für Ihren erneuten Besuch gilt dann die jeweils aktuelle Datenschutzerklärung.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        Stand: März 2026
      </p>
    </div>
  );
}
