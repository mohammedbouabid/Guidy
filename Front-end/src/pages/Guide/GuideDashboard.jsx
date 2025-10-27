import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Package, 
  Calendar, 
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';
import { fetchGuidePlacesForGuide } from '@/store/slices/guidePlaceSlice';

const GuideDashboard = () => {
  const dispatch = useDispatch();
  const { placesForGuide } = useSelector((state) => state.guidePlace);
  const user = useSelector((state) => state.Auth);

  useEffect(() => {
    dispatch(fetchGuidePlacesForGuide());
  }, [dispatch]);

  const stats = [
    {
      title: "Mes Lieux",
      value: placesForGuide?.length || 0,
      icon: MapPin,
      description: "Lieux touristiques ajoutés",
      link: "/guide/places",
      color: "text-blue-600"
    },
    {
      title: "Mes Packs",
      value: "0",
      icon: Package,
      description: "Packs créés",
      link: "/guide/PacksGuide",
      color: "text-green-600"
    },
    {
      title: "Réservations",
      value: "0",
      icon: Calendar,
      description: "Réservations en cours",
      link: "/guide/bookingsGuide",
      color: "text-orange-600"
    },
    {
      title: "Performance",
      value: "0%",
      icon: TrendingUp,
      description: "Taux de satisfaction",
      link: "#",
      color: "text-purple-600"
    }
  ];

  const quickActions = [
    {
      title: "Ajouter un lieu",
      description: "Créer un nouveau lieu touristique",
      link: "/guide/places/add",
      icon: MapPin,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Créer un pack",
      description: "Composer un nouveau pack touristique",
      link: "/guide/packs/add",
      icon: Package,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Voir les réservations",
      description: "Gérer vos réservations",
      link: "/guide/bookingsGuide",
      icon: Calendar,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenue, {user?.name || 'Guide'} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos lieux, packs et réservations depuis votre tableau de bord
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <Link to={stat.link}>
                  <Button variant="link" className="px-0 mt-2 h-auto">
                    Voir plus <Eye className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={action.link}>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Commencer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Derniers lieux ajoutés */}
      {placesForGuide && placesForGuide.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Derniers lieux ajoutés</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {placesForGuide.slice(0, 5).map((place) => (
                  <div key={place._id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{place.name}</p>
                        <p className="text-sm text-muted-foreground">{place.city}</p>
                      </div>
                    </div>
                    <Link to={`/guide/places/edit/${place._id}`}>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;
