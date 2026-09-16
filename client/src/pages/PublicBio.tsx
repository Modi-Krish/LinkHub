import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicBio } from "@/services/bio.service";
import { getIcon } from "@/components/bio/SocialLinkCard";

export default function PublicBio() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicBio", username, isPreview],
    queryFn: () => getPublicBio(username as string, isPreview),
    enabled: !!username,
    retry: false
  });

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (isError || !data) return <div className="h-screen w-full flex items-center justify-center">Profile not found.</div>;

  const { profile, links } = data;

  // Theme logic
  let themeClasses = "bg-white text-slate-900"; // minimal-light default
  let buttonClasses = "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200 shadow-sm";
  let avatarClasses = "ring-slate-100";

  if (profile.theme === "dark-slate") {
    themeClasses = "bg-slate-900 text-slate-100";
    buttonClasses = "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 shadow-sm";
    avatarClasses = "ring-slate-800";
  } else if (profile.theme === "gradient") {
    themeClasses = "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white";
    buttonClasses = "bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/20 shadow-lg shadow-black/10";
    avatarClasses = "ring-white/30";
  }

  return (
    <div className={`min-h-screen w-full flex flex-col items-center py-16 px-4 sm:px-6 transition-colors duration-500 ${themeClasses}`}>
      <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Avatar */}
        <div className={`w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ${avatarClasses} shadow-xl`}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
              {profile.displayName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <h1 className="text-2xl font-bold text-center mb-1">{profile.displayName}</h1>
        {profile.bio && (
          <p className="text-center opacity-80 text-sm mb-8 leading-relaxed px-4">{profile.bio}</p>
        )}

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links?.map((link: any) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`
                flex items-center p-4 rounded-xl transition-all duration-300 w-full group relative overflow-hidden
                ${buttonClasses}
                hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                {getIcon(link.platform)}
              </div>
              <span className="font-semibold text-center absolute left-0 right-0 pointer-events-none px-12">
                {link.label}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 pb-8">
          <a href="https://linkhub.com" className="text-xs font-semibold opacity-40 hover:opacity-100 transition-opacity tracking-widest uppercase">
            Powered by LinkHub
          </a>
        </div>
      </div>
    </div>
  );
}
