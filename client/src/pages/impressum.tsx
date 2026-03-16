import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Building2, Mail, MapPin, FileText, ExternalLink } from "lucide-react";

export default function ImpressumPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <Badge variant="secondary" className="mb-4 px-4 py-1.5">
          <Scale className="h-3.5 w-3.5 mr-2" />
          Rechtliche Informationen
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Impressum</h1>
        <p className="text-muted-foreground">
          Angaben gemäß § 5 TMG
        </p>
      </div>

      <div className="space-y-6">
        {/* Company Info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Building2 className="h-5 w-5" />
              Anbieter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-base">RealSync Dynamics GmbH (i.Gr.)</p>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Thüringen, Deutschland</span>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>kontakt@realsyncdynamics.de</span>
            </div>
          </CardContent>
        </Card>

        {/* Management */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Vertretungsberechtigter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Geschäftsführer:</span> [Wird ergänzt]</p>
            <p><span className="font-medium text-foreground">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</span> [Wird ergänzt]</p>
          </CardContent>
        </Card>

        {/* Registration */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Handelsregister & Steuern</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Handelsregister:</span> [In Bearbeitung]</p>
            <p><span className="font-medium text-foreground">Registergericht:</span> [In Bearbeitung]</p>
            <p><span className="font-medium text-foreground">USt-IdNr.:</span> [In Bearbeitung] (gemäß § 27a Umsatzsteuergesetz)</p>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              Streitschlichtung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            </p>
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
              data-testid="link-odr"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              https://ec.europa.eu/consumers/odr/
            </a>
            <p>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </CardContent>
        </Card>

        {/* Liability for Content */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Haftungsausschluss — Inhalte</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich.
            </p>
            <p>
              Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
              zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
              Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
              bleiben hiervon unberührt.
            </p>
          </CardContent>
        </Card>

        {/* Liability for Links */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Haftungsausschluss — Links</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
              der Seiten verantwortlich.
            </p>
            <p>
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
              Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </CardContent>
        </Card>

        {/* Copyright */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Urheberrecht</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p>
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
              gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden
              die Urheberrechte Dritter beachtet.
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        Stand: März 2026
      </p>
    </div>
  );
}
