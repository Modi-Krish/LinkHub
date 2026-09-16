import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLink } from "@/services/link.service";

const linkSchema = z.object({
  destinationUrl: z.string().url("Must be a valid URL"),
  customSlug: z.string().max(50, "Maximum 50 characters").regex(/^[a-zA-Z0-9-_]*$/, "Alphanumeric, dash, underscore only").optional(),
});

type LinkFormValues = z.infer<typeof linkSchema>;

export default function CreateLinkDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      destinationUrl: "",
      customSlug: "",
    }
  });

  const mutation = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      toast.success("Link created successfully!");
      queryClient.invalidateQueries({ queryKey: ["links"] });
      setOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || "Failed to create link");
    }
  });

  const onSubmit = (data: LinkFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
          <DialogDescription>
            Enter a destination URL to create a new short link. You can also specify a custom vanity slug.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination URL <span className="text-destructive">*</span></label>
            <Input 
              placeholder="https://example.com/very-long-url-path" 
              {...register("destinationUrl")} 
            />
            {errors.destinationUrl && <p className="text-sm text-destructive">{errors.destinationUrl.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Slug <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground sm:text-sm">
                {(import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "").replace(/^https?:\/\//, "")}/r/
              </span>
              <Input 
                className="rounded-l-none" 
                placeholder="summer-sale" 
                {...register("customSlug")} 
              />
            </div>
            {errors.customSlug && <p className="text-sm text-destructive">{errors.customSlug.message}</p>}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
