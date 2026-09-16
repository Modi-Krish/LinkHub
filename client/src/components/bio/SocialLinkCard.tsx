import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSocialLink, deleteSocialLink } from "@/services/bio.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const getIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    default: return <Globe className="w-5 h-5 text-indigo-600" />;
  }
};

interface SocialLinkCardProps {
  link: any;
}

export default function SocialLinkCard({ link }: SocialLinkCardProps) {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState(link.label);
  const [url, setUrl] = useState(link.url);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateSocialLink(link._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bioProfile"] });
    },
    onError: () => {
      toast.error("Failed to update link");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSocialLink(link._id),
    onSuccess: () => {
      toast.success("Link removed");
      queryClient.invalidateQueries({ queryKey: ["bioProfile"] });
    }
  });

  const handleBlur = () => {
    if (label !== link.label || url !== link.url) {
      updateMutation.mutate({ label, url, platform: link.platform });
    }
  };

  return (
    <Card className="mb-3 border group transition-all">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="cursor-grab mt-2 text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted p-2 rounded-md">
              {getIcon(link.platform)}
            </div>
            <Input 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
              onBlur={handleBlur}
              className="font-medium h-9" 
              placeholder="Link Title"
            />
          </div>
          <Input 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            onBlur={handleBlur}
            className="h-9 text-sm text-muted-foreground" 
            placeholder="URL"
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 self-stretch">
          {/* <Switch 
            checked={link.enabled} 
            onCheckedChange={(checked) => updateMutation.mutate({ enabled: checked })} 
          /> */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{link.enabled ? "On" : "Off"}</span>
            <input 
               type="checkbox" 
               checked={link.enabled} 
               onChange={(e) => updateMutation.mutate({ enabled: e.target.checked, platform: link.platform, label, url })} 
            />
          </div>
          
          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate()}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
