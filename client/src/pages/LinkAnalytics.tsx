import { useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLinkAnalytics } from "@/services/analytics.service";
import { getLink } from "@/services/link.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MousePointerClick, Smartphone, Globe } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function LinkAnalytics() {
  const { id } = useParams<{ id: string }>();
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  const { data: link, isLoading: linkLoading } = useQuery({
    queryKey: ["link", id],
    queryFn: () => getLink(id as string),
    enabled: !!id,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", id, range],
    queryFn: () => getLinkAnalytics(id as string, range),
    enabled: !!id,
  });

  if (linkLoading || analyticsLoading) {
    return <div className="flex h-[400px] items-center justify-center">Loading analytics...</div>;
  }

  const { summary, clicksOverTime, topReferrers, deviceDistribution } = analytics || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <RouterLink to="/dashboard/links">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </RouterLink>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics for /{link?.shortCode}</h2>
          <p className="text-muted-foreground text-sm truncate max-w-xl">{link?.destinationUrl}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto flex-1 md:mr-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalClicks || 0}</div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="30d" value={range} onValueChange={(v) => setRange(v as any)} className="w-[400px] flex justify-end">
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
          <CardDescription>Number of clicks in the selected time range.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {clicksOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clicksOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="clicks" stroke="#8884d8" fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Top Referrers</CardTitle>
            <CardDescription>Where your traffic is coming from.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {topReferrers?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topReferrers} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="referrer" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Devices</CardTitle>
            <CardDescription>What devices your audience uses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {deviceDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="device"
                    label
                  >
                    {deviceDistribution.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
