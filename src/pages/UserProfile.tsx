import { useParams } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Errorpage from "./Errorpage";
import ProfileHeader from "@/components/userProfile/ProfileHeader";
import ProfileLibrary from "@/components/userProfile/ProfileLibrary";
import ProfileFeed from "@/components/userProfile/ProfileFeed";
import { Library, MessagesSquare } from "lucide-react";

function UserProfile() {
  const { userId } = useParams(); // userId aus Adresse bekommen
  if (!userId) { // TODO: Falsche id im Link abfangen
    return <Errorpage />
  }

  return (
    <div className="container mx-auto  p-4">
      <div className=" mx-auto">

        <Tabs defaultValue="posts" className="mt-6">
          <div>
            <ProfileHeader userId={userId} />
            <TabsList className="grid w-full grid-cols-2 mt-6">
              <TabsTrigger value="posts">
                <MessagesSquare />
                Beiträge</TabsTrigger>
              <TabsTrigger value="library">
                <Library className="w-4 h-4" />
                Bibliothek</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="posts" className="mt-6">
            <ProfileFeed userId={userId}></ProfileFeed>
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <ProfileLibrary userId={userId}></ProfileLibrary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserProfile;