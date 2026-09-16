import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBioProfile, updateBioProfile, addSocialLink } from "@/services/bio.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Plus, LayoutTemplate, Palette, Share2 } from "lucide-react";
import SocialLinkCard from "@/components/bio/SocialLinkCard";

export default function BioStudio() {
  const queryClient = useQueryClient();
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["bioProfile"],
    queryFn: getBioProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateBioProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["bioProfile"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to update profile")
  });

  const addLinkMutation = useMutation({
    mutationFn: addSocialLink,
    onSuccess: () => {
      toast.success("Link added");
      setNewPlatform("");
      setNewUrl("");
      setNewLabel("");
      queryClient.invalidateQueries({ queryKey: ["bioProfile"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || "Failed to add link")
  });

  if (isLoading) return <div className="p-8">Loading Bio Studio...</div>;

  const { profile, links } = data || {};
  const publicUrl = `${import.meta.env.VITE_CLIENT_URL || window.location.origin}/bio/${profile?.username}`;

  const handleProfileUpdate = (field: string, value: string) => {
    updateProfileMutation.mutate({ [field]: value });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform || !newUrl || !newLabel) return toast.error("Fill all fields");
    addLinkMutation.mutate({ platform: newPlatform, url: newUrl, label: newLabel });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto h-full">
      {/* Editor Section */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Bio Studio</h2>
            <p className="text-muted-foreground mt-1">Customize your public link-in-bio page.</p>
          </div>
          <Button variant="outline" onClick={() => {
            navigator.clipboard.writeText(publicUrl);
            toast.success("Copied to clipboard!");
          }}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>

        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links"><LayoutTemplate className="w-4 h-4 mr-2" /> Links</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="w-4 h-4 mr-2" /> Appearance</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Link</CardTitle>
                <CardDescription>Add social profiles, portfolios, or external links.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row gap-3">
                  <Input placeholder="Platform (e.g. github)" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="w-full sm:w-1/4" />
                  <Input placeholder="Title (e.g. My GitHub)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full sm:w-1/3" />
                  <Input placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-1" />
                  <Button type="submit" disabled={addLinkMutation.isPending}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-1">
              <h3 className="text-sm font-medium mb-3">Your Links ({links?.length || 0})</h3>
              {links?.length === 0 ? (
                <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                  No links added yet. Add one above!
                </div>
              ) : (
                links?.map((link: any) => (
                  <SocialLinkCard key={link._id} link={link} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Themes</CardTitle>
                <CardDescription>Select a theme for your public bio page.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "minimal-light", name: "Minimal Light", bg: "bg-white border", text: "text-slate-900" },
                    { id: "dark-slate", name: "Dark Slate", bg: "bg-slate-900", text: "text-slate-100" },
                    { id: "gradient", name: "Sunset Gradient", bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400", text: "text-white" },
                  ].map((theme) => (
                    <div 
                      key={theme.id}
                      onClick={() => handleProfileUpdate("theme", theme.id)}
                      className={`
                        cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-2 h-32 transition-all
                        ${theme.bg} ${theme.text}
                        ${profile?.theme === theme.id ? "ring-2 ring-primary ring-offset-2 scale-[1.02]" : "hover:scale-[1.02] opacity-80 hover:opacity-100"}
                      `}
                    >
                      <div className="font-medium">{theme.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input 
                    defaultValue={profile?.displayName} 
                    onBlur={(e) => {
                      if (e.target.value !== profile?.displayName) handleProfileUpdate("displayName", e.target.value);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={profile?.bio || ""} 
                    placeholder="Tell them a little about yourself"
                    onBlur={(e) => {
                      if (e.target.value !== profile?.bio) handleProfileUpdate("bio", e.target.value);
                    }} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Avatar URL</label>
                  <Input 
                    defaultValue={profile?.avatar || ""} 
                    placeholder="https://example.com/avatar.png"
                    onBlur={(e) => {
                      if (e.target.value !== profile?.avatar) handleProfileUpdate("avatar", e.target.value);
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Section - Sticky on Desktop */}
      <div className="lg:w-[400px] shrink-0 border-l pl-8 py-4 hidden lg:block h-[calc(100vh-8rem)] sticky top-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">Live Preview</h3>
          <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-primary flex items-center hover:underline">
            View <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
        
        {/* Mock Phone Container */}
        <div className="w-[320px] h-[650px] mx-auto border-[8px] border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative bg-background">
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl w-40 mx-auto z-10"></div>
          
          <iframe 
            key={dataUpdatedAt || "preview"}
            src={`/bio/${profile?.username}?preview=true&t=${dataUpdatedAt || ''}`} 
            className="w-full h-full border-0" 
            title="Bio Preview"
          />
        </div>
      </div>
    </div>
  );
}
