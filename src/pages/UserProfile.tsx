import { useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/userProfile/ProfileHeader";
import Errorpage from "./Errorpage";
import { Lock } from "lucide-react";


function UserProfile() {
  const { userId } = useParams(); // userId aus Adresse bekommen
  if (!userId) { // TODO: Falsche id im Link abfangen - wahrscheinlich einfach ersten Backendaufruf mit id zum Test nutzen
    return <Errorpage />
  }
  const loggedInUserId = "123"; // TODO: Id aus token oder Context holen

  /*
  TODO: Privatsphäre-Einstellungen vom backend 
  (Backend: checken in welcher Beziehung userId und loggedInUserid zu einander stehen)
  */
  const profileVisibility = {
    canViewProfile: false,
    canViewLibrary: false,
    canViewPosts: true,
  };

  // Gar kein Zugriff auf Profil
  if (!profileVisibility.canViewProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <ProfileHeader userId={userId} loggedInUserId={loggedInUserId} />

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>Profil nicht verfügbar</CardTitle>
            <CardDescription>
              Du hast keine Berechtigung, dieses Profil anzusehen.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Basis-Zugriff vorhanden mit evtl. Einschränkungen
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader userId={userId} loggedInUserId={loggedInUserId} />

        {/* Bibliothek */}
        {profileVisibility.canViewLibrary ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Öffentliche Bibliothek</CardTitle>
              <CardDescription>Zuletzt hinzugefügte Bücher</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Noch keine Bücher vorhanden</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-dashed">
            <CardContent className="py-8 text-center">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Die Bibliothek ist privat
              </p>
            </CardContent>
          </Card>
        )}

        {/* Beiträge */}
        {profileVisibility.canViewPosts ? (
          <Card>
            <CardHeader>
              <CardTitle>Letzte Beiträge</CardTitle>
              <CardDescription>Rezensionen und Kommentare</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Noch keine Beiträge vorhanden</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Die Beiträge sind privat
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default UserProfile;