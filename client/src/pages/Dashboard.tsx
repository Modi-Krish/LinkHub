import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/stores/authStore";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link, MousePointerClick, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const res = await api.get("/analytics/summary");
      return res.data.data;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(" ")[0]}!</h2>
        <p className="text-muted-foreground mt-1">Here is a quick overview of your LinkHub.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalLinks || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalClicks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bio Profile Views</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.bioViews || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 border-muted">
          <CardHeader>
            <CardTitle>Create something new</CardTitle>
            <CardDescription>Shorten a link or update your bio profile.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <RouterLink to="/dashboard/links">
              <Button>Shorten Link</Button>
            </RouterLink>
            <RouterLink to="/dashboard/bio">
              <Button variant="outline">Edit Bio Profile</Button>
            </RouterLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
