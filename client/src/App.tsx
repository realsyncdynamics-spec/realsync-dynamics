import { useEffect } from "react";
import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Layout } from "@/components/Layout";
import LandingPage from "@/pages/landing";
import CreatorSealPage from "@/pages/creatorseal";
import OptimusPage from "@/pages/optimus";
import BuilderPage from "@/pages/builder";
import ScannerPage from "@/pages/scanner";
import PreisePage from "@/pages/preise";
import ImpressumPage from "@/pages/impressum";
import DatenschutzPage from "@/pages/datenschutz";
import AGBPage from "@/pages/agb";
import UeberUnsPage from "@/pages/ueber-uns";
import KontaktPage from "@/pages/kontakt";
import EinstellungenPage from "@/pages/einstellungen";
import CommunityPage from "@/pages/community";
import SupportPage from "@/pages/support";
import SchulLaborPage from "@/pages/schullabor";
import LinkMagicPage from "@/pages/link-magic";
import BrandPage from "@/pages/brand";
import StatusPage from "@/pages/status";
import BildungPage from "@/pages/bildung";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const [location] = useHashLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "RealSync Dynamics — SaaS Plattform für Creator & Content-Schutz",
      "/creatorseal": "CreatorSeal — Content-Schutz & Verifizierung | RealSync SaaS Plattform",
      "/optimus": "RealSync Optimus — Kostenlose KI-Agenten mit Model-Router | RealSync SaaS Plattform",
      "/builder": "Multi-App Builder — KI-gestützte App-Entwicklung | RealSync SaaS Plattform",
      "/scanner": "Market Scanner — KI-Marktanalyse | RealSync SaaS Plattform",
      "/preise": "Preise & Pakete — Einzel-Apps + Gesamtpaket | RealSync SaaS Plattform",
      "/einstellungen": "Einstellungen | RealSync SaaS Plattform",
      "/ueber-uns": "Über uns | RealSync SaaS Plattform",
      "/kontakt": "Kontakt | RealSync SaaS Plattform",
      "/impressum": "Impressum | RealSync SaaS Plattform",
      "/datenschutz": "Datenschutz | RealSync SaaS Plattform",
      "/agb": "AGB | RealSync SaaS Plattform",
      "/community": "RealSync Community — Creator-Netzwerk | RealSync SaaS Plattform",
      "/support": "KI-Support — Intelligente Hilfe | RealSync SaaS Plattform",
      "/schullabor": "SchulLabor — Virtuelle Labor-Simulatoren | RealSync SaaS Plattform",
      "/link-magic": "Link-Magic — KI-Anzeigen-Generator | RealSync SaaS Plattform",
      "/brand": "Marke & Strategie — Brand Management | RealSync Dynamics",
      "/status": "Live Status Dashboard — Plattform-Transparenz | RealSync Dynamics",
      "/bildung": "RealSync Bildung — Bundeslandübergreifende Schul- & Bildungsplattform | RealSync Dynamics",
    };
    document.title = titles[location] || "RealSync Dynamics";
  }, [location]);

  return (
    <Layout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/creatorseal" component={CreatorSealPage} />
        <Route path="/optimus" component={OptimusPage} />
        <Route path="/builder" component={BuilderPage} />
        <Route path="/scanner" component={ScannerPage} />
        <Route path="/preise" component={PreisePage} />
        <Route path="/impressum" component={ImpressumPage} />
        <Route path="/datenschutz" component={DatenschutzPage} />
        <Route path="/agb" component={AGBPage} />
        <Route path="/ueber-uns" component={UeberUnsPage} />
        <Route path="/kontakt" component={KontaktPage} />
        <Route path="/einstellungen" component={EinstellungenPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/support" component={SupportPage} />
        <Route path="/schullabor" component={SchulLaborPage} />
        <Route path="/link-magic" component={LinkMagicPage} />
        <Route path="/brand" component={BrandPage} />
        <Route path="/status" component={StatusPage} />
        <Route path="/bildung" component={BildungPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
