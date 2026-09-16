import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/authStore";
import { LayoutDashboard, Link as LinkIcon, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Links", href: "/dashboard/links", icon: LinkIcon },
  { label: "Bio Studio", href: "/dashboard/bio", icon: User },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col
        transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0">
          <Link to="/" className="text-xl font-bold tracking-tight gradient-text">
            LinkHub
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item, i) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 group animate-slide-left opacity-0
                    ${isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
                >
                  <item.icon className={`w-[18px] h-[18px] transition-transform group-hover:scale-110 ${isActive ? "text-white" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-3 border-t shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-500 font-semibold text-sm shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-sm font-medium truncate">{user?.name || "User"}</span>
              <span className="text-[11px] text-muted-foreground truncate">{user?.email || ""}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm h-9"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card/80 backdrop-blur-sm flex items-center px-4 md:px-6 shrink-0 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Breadcrumb-style page title */}
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            {navItems.find(
              (item) =>
                location.pathname === item.href ||
                (item.href !== "/dashboard" && location.pathname.startsWith(item.href))
            )?.label || "Dashboard"}
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/* Future: search, notifications, theme toggle */}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
