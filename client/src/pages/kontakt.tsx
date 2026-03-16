import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const subjects = [
  { value: "allgemein", label: "Allgemeine Anfrage" },
  { value: "support", label: "Technischer Support" },
  { value: "enterprise", label: "Enterprise-Anfrage" },
  { value: "partnerschaft", label: "Partnerschaft" },
  { value: "presse", label: "Presse & Medien" },
  { value: "sonstiges", label: "Sonstiges" },
];

const faqs = [
  {
    question: "Wie starte ich mit RealSync Dynamics?",
    answer: "Registriere dich kostenlos und nutze den Free-Plan aller vier Apps sofort. Ein Upgrade ist jederzeit möglich.",
  },
  {
    question: "Welche Zahlungsmethoden werden akzeptiert?",
    answer: "Wir akzeptieren Kreditkarten, SEPA-Lastschrift und PayPal — alles sicher über Stripe abgewickelt.",
  },
  {
    question: "Werden meine Daten in der EU gespeichert?",
    answer: "Ja, alle Daten werden ausschließlich auf Servern in Deutschland gespeichert. Wir nutzen keine Cookies und kein Tracking.",
  },
  {
    question: "Gibt es eine API für Entwickler?",
    answer: "Ab dem Pro-Tarif steht Ihnen unsere REST-API zur Verfügung. Enterprise-Kunden erhalten zudem dedizierte API-Endpunkte.",
  },
  {
    question: "Wie funktioniert der Enterprise-Plan?",
    answer: "Kontaktieren Sie uns über das Formular mit dem Betreff 'Enterprise-Anfrage'. Wir erstellen ein maßgeschneidertes Angebot für Ihr Team.",
  },
];

export default function KontaktPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; subject: string; message: string }) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast({
        title: "Nachricht gesendet!",
        description: "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie Name, E-Mail und Nachricht aus.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate({ name, email, subject, message });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4 px-4 py-1.5">
          <MessageSquare className="h-3.5 w-3.5 mr-2" />
          Kontakt
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Sprechen Sie mit uns</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Haben Sie Fragen zu unserer Plattform? Wir helfen Ihnen gerne weiter.
        </p>
      </div>

      {/* Contact Form + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Form — Left 2/3 */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Nachricht senden</CardTitle>
              <CardDescription>
                Füllen Sie das Formular aus und wir melden uns schnellstmöglich.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-name">Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="Ihr Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">E-Mail *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="ihre@email.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-subject">Betreff</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger data-testid="select-contact-subject">
                      <SelectValue placeholder="Betreff auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact-message">Nachricht *</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Ihre Nachricht an uns..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    data-testid="input-contact-message"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto gap-2"
                  disabled={contactMutation.isPending}
                  data-testid="btn-contact-submit"
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Absenden
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info — Right 1/3 */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Kontaktdaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">E-Mail</p>
                  <p className="text-sm text-muted-foreground">kontakt@realsyncdynamics.de</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Standort</p>
                  <p className="text-sm text-muted-foreground">Thüringen, Deutschland</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Geschäftszeiten</p>
                  <p className="text-sm text-muted-foreground">Mo — Fr: 9:00 — 18:00 Uhr</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Enterprise-Anfragen:</span>{" "}
                Für Unternehmen mit individuellen Anforderungen steht unser Vertriebsteam bereit.
                Wählen Sie im Formular „Enterprise-Anfrage" als Betreff.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Häufige Fragen
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-border/50" data-testid={`faq-${i}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
