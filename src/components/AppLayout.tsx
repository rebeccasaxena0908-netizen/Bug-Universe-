import { ReactNode } from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Bug, LayoutDashboard, List, Code, LogIn, ChevronLeft, ChevronRight } from "lucide-react";
import { ParticleField } from "./ParticleField";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/bugs", icon: Bug, label: "Bug List" },
  { to: "/review", icon: Code, label: "Code Review" },
  { to: "/login", icon: LogIn, label: "Login" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full gradient-bg">
      <ParticleField />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 flex flex-col border-r border-glass-border transition-all duration-300",
          collapsed ? "w-16" : "w-56"
        )}
        style={{ background: "hsla(240, 10%, 5%, 0.85)", backdropFilter: "blur(20px)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-16 border-b border-glass-border">
          <Bug className="text-neon-pink shrink-0" size={24} />
          {!collapsed && (
            <span className="font-bold text-lg gradient-text whitespace-nowrap">Bug Universe</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  active
                    ? "bg-primary/15 text-primary neon-glow-pink"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </RouterNavLink>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-glass-border text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      {/* Main */}
      <main
        className={cn(
          "flex-1 relative z-10 transition-all duration-300",
          collapsed ? "ml-16" : "ml-56"
        )}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
