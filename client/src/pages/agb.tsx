import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Layers, Globe, TrendingUp } from "lucide-react";

export default function AGBPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <Badge variant="secondary" className="mb-4 px-4 py-1.5">
          <FileText className="h-3.5 w-3.5 mr-2" />
          Allgemeine Geschäftsbedingungen
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">AGB</h1>
        <p className="text-muted-foreground">
          Allgemeine Geschäftsbedingungen der RealSync Dynamics GmbH (i.Gr.)
        </p>
      </div>

      <div className="space-y-8">
        {/* § 1 Geltungsbereich */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§1</span>
            Geltungsbereich
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle
                Geschäftsbeziehungen zwischen der RealSync Dynamics GmbH (i.Gr.), Thüringen,
                Deutschland (nachfolgend „Anbieter") und dem Nutzer (nachfolgend „Kunde") der
                Plattform RealSync Dynamics.
              </p>
              <p>
                Die AGB gelten in ihrer zum Zeitpunkt der Registrierung bzw. Bestellung gültigen
                Fassung. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn,
                der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 2 Leistungsbeschreibung */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§2</span>
            Leistungsbeschreibung
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-4">
              <p>
                Die RealSync Dynamics Plattform umfasst folgende Software-as-a-Service (SaaS) Anwendungen:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">CreatorSeal</p>
                    <p className="text-xs">Content-Schutz und Verifizierung mittels SHA-256 Hashing und Blockchain-Technologie</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <Globe className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">RealSync Optimus</p>
                    <p className="text-xs">KI-Desktop-Agent für Creator-Automation und Workflow-Skalierung</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <Layers className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">Multi-App Builder</p>
                    <p className="text-xs">KI-gestützte App-Entwicklung mit mehreren KI-Modellen</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <TrendingUp className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">Market Scanner</p>
                    <p className="text-xs">KI-basierte Marktanalyse und Trend-Erkennung</p>
                  </div>
                </div>
              </div>
              <p>
                Der genaue Funktionsumfang richtet sich nach dem gewählten Tarif (Free, Starter, Pro, Enterprise).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 3 Registrierung */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§3</span>
            Registrierung und Konto
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. Der Kunde
                ist verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und diese
                aktuell zu halten.
              </p>
              <p>
                Der Kunde ist für die Geheimhaltung seiner Zugangsdaten verantwortlich. Er hat den
                Anbieter unverzüglich zu informieren, wenn er Kenntnis davon erlangt, dass Dritte
                Kenntnis von seinen Zugangsdaten erlangt haben.
              </p>
              <p>
                Der Anbieter behält sich das Recht vor, Konten bei Verstoß gegen diese AGB zu
                sperren oder zu löschen.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 4 Preise und Zahlung */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§4</span>
            Preise und Zahlung
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Die aktuellen Preise sind auf der{" "}
                <Link href="/preise" className="text-primary hover:underline">Preisseite</Link>{" "}
                einsehbar. Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer (19%).
              </p>
              <p>
                Die Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe. Akzeptierte
                Zahlungsmethoden umfassen Kreditkarte, SEPA-Lastschrift und PayPal.
              </p>
              <p>
                Bei jährlicher Zahlungsweise gewährt der Anbieter einen Rabatt von 25% auf den
                monatlichen Preis.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 5 Kostenlose und kostenpflichtige Tarife */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§5</span>
            Kostenlose und kostenpflichtige Tarife
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Jede Anwendung bietet einen kostenlosen Free-Tarif mit eingeschränktem Funktionsumfang.
                Ein Upgrade auf kostenpflichtige Tarife (Starter, Pro, Enterprise) ist jederzeit möglich.
              </p>
              <p>
                Der Anbieter behält sich das Recht vor, den Funktionsumfang kostenloser Tarife
                anzupassen. Bestehende kostenpflichtige Tarife bleiben von solchen Änderungen unberührt.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 6 Kündigung */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§6</span>
            Kündigung und Laufzeit
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Monatliche Tarife können jederzeit zum Ende des laufenden Abrechnungszeitraums
                gekündigt werden.
              </p>
              <p>
                Bei jährlicher Zahlungsweise erfolgt bei vorzeitiger Kündigung eine anteilige
                Erstattung des Restbetrags.
              </p>
              <p>
                Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
              </p>
              <p>
                Nach Kündigung werden personenbezogene Daten gemäß der Datenschutzerklärung gelöscht,
                sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 7 Nutzungsrechte */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§7</span>
            Nutzungsrechte und Lizenzen
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Der Anbieter gewährt dem Kunden für die Dauer des Vertragsverhältnisses ein
                nicht-exklusives, nicht-übertragbares Recht zur Nutzung der Plattform gemäß dem
                gewählten Tarif.
              </p>
              <p>
                Vom Kunden erstellte Inhalte verbleiben im Eigentum des Kunden. Der Anbieter erhält
                lediglich die zur Erbringung der Dienstleistung erforderlichen Nutzungsrechte.
              </p>
              <p>
                Die Software der Plattform ist urheberrechtlich geschützt. Reverse Engineering,
                Dekompilierung oder ähnliche Handlungen sind nicht gestattet.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 8 Haftungsbeschränkung */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§8</span>
            Haftungsbeschränkung
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei
                Verletzung von Leben, Körper und Gesundheit.
              </p>
              <p>
                Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher
                Vertragspflichten (Kardinalpflichten), beschränkt auf den vertragstypischen,
                vorhersehbaren Schaden.
              </p>
              <p>
                Die Haftung für mittelbare Schäden, insbesondere entgangenen Gewinn, ist —
                soweit gesetzlich zulässig — ausgeschlossen.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 9 Datenschutz */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§9</span>
            Datenschutz
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Der Schutz personenbezogener Daten ist uns ein zentrales Anliegen. Einzelheiten zur
                Datenverarbeitung entnehmen Sie bitte unserer{" "}
                <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>.
              </p>
              <p>
                Besonders hervorzuheben: Unsere Plattform verwendet keine Cookies und kein Tracking.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* § 10 Schlussbestimmungen */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">§10</span>
            Schlussbestimmungen
          </h2>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
              <p>
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
                UN-Kaufrechts (CISG).
              </p>
              <p>
                Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis ist —
                soweit gesetzlich zulässig — Deutschland.
              </p>
              <p>
                <span className="font-medium text-foreground">Salvatorische Klausel:</span>{" "}
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so wird die
                Wirksamkeit der übrigen Bestimmungen dadurch nicht berührt. Anstelle der unwirksamen
                Bestimmung tritt eine Regelung, die dem wirtschaftlichen Zweck der unwirksamen
                Bestimmung am nächsten kommt.
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
