import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  Package,
  ShieldCheck,
  Stethoscope,
  Truck,
} from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import branding from "@/lib/branding";

const { getBrandConfig } = branding as {
  getBrandConfig: (brand: string) => {
    key: string;
    name: string;
    tagline: string;
    apiLabel: string;
  };
};

const brand = getBrandConfig("aasc");

const summaryCards = [
  {
    title: "Matériels suivis",
    value: "2 418",
    description: "+62 équipements cette semaine",
    trend: "98% de disponibilité",
    icon: Package,
  },
  {
    title: "Véhicules opérationnels",
    value: "46 / 52",
    description: "6 ambulances en maintenance",
    trend: "Temps moyen d'arrêt 2j",
    icon: Truck,
  },
  {
    title: "Contrôles conformité",
    value: "312",
    description: "Derniers 30 jours",
    trend: "100% des contrôles planifiés",
    icon: ShieldCheck,
  },
  {
    title: "Interventions à risque",
    value: "12",
    description: "Alertes critiques",
    trend: "-18% par rapport au mois dernier",
    icon: AlertTriangle,
  },
];

const alerts = [
  {
    title: "Rupture consommables",
    detail: "Gants nitrile taille M",
    location: "Agence Nord",
    status: "Urgent",
  },
  {
    title: "Équipement périmé",
    detail: "Masques FFP2",
    location: "Site central",
    status: "À renouveler",
  },
  {
    title: "Maintenance urgente",
    detail: "Ventilateur transport",
    location: "Ambulance A-17",
    status: "À planifier",
  },
];

const maintenances = [
  {
    equipment: "Moniteur multiparamétrique",
    schedule: "Demain · 08:30",
    owner: "Équipe B",
  },
  {
    equipment: "Brancard électrique",
    schedule: "Jeu. · 14:00",
    owner: "Agence Sud",
  },
  {
    equipment: "Oxygénothérapie",
    schedule: "Ven. · 09:00",
    owner: "AASC Marseille",
  },
];

const activities = [
  {
    title: "Commande validée",
    detail: "Lot de pansements hémostatiques",
    time: "Il y a 18 min",
  },
  {
    title: "Retour véhicule",
    detail: "Ambulance A-04 · Nettoyage OK",
    time: "Il y a 2h",
  },
  {
    title: "Synchronisation API DRF",
    detail: "Sync complète des stocks",
    time: "Il y a 3h",
  },
];

const locations = [
  { label: "Agence Nord", usage: 82, status: "Stable" },
  { label: "AASC Lyon", usage: 64, status: "Sous contrôle" },
  { label: "Agence Sud", usage: 91, status: "Tension" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">{brand.name}</p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Pilotage matériel & conformité
            </h1>
            <p className="text-sm text-muted-foreground">{brand.tagline}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <div className="flex-1 sm:min-w-[260px]">
              <Input
                placeholder="Rechercher un équipement, un véhicule, une agence..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Exporter</Button>
              <Button>
                Nouvelle commande
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            <Avatar>
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-10">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Alertes critiques
                <Badge variant="warning">3 à traiter</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.title}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-border/70 bg-background p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {alert.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {alert.detail} · {alert.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{alert.status}</Badge>
                    <Button size="sm" variant="ghost">
                      Assigner
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{brand.apiLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    API principale
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dernière synchronisation : 14:22
                  </p>
                </div>
                <Badge variant="success">Actif</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Stocks synchronisés</span>
                  <span className="font-semibold">99%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[99%] rounded-full bg-primary" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Prochaine sync programmée</span>
                  <span>16:00</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Forcer une synchronisation
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Maintenances à venir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {maintenances.map((item) => (
                <div
                  key={item.equipment}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2 text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.equipment}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.schedule} · {item.owner}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Détails
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dernières activités</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.title}
                  className="rounded-2xl border border-border/70 bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2 text-muted-foreground">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.detail}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Répartition par agence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {locations.map((location) => (
                <div key={location.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {location.label}
                    </span>
                    <span className="text-muted-foreground">
                      {location.usage}% utilisé · {location.status}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${location.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                Nouvelle fiche équipement
                <ClipboardList className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Lancer un contrôle terrain
                <Stethoscope className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Suivi des véhicules
                <Truck className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
