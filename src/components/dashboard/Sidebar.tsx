import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  DollarSign,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { t } from "@/locales";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const routes = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: t("dashboard"),
      href: "/",
      active: pathname === "/",
    },
    {
      icon: <FolderKanban className="h-5 w-5" />,
      label: t("projects"),
      href: "/projects",
      active: pathname.startsWith("/projects"),
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: t("finances"),
      href: "/finances",
      active: pathname.startsWith("/finances"),
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: t("analytics"),
      href: "/analytics",
      active: pathname.startsWith("/analytics"),
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: t("notifications"),
      href: "/notifications",
      active: pathname.startsWith("/notifications"),
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: t("settings"),
      href: "/settings",
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-1 min-h-0 border-r bg-card">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
          <h1 className="text-xl font-semibold">متتبع المشاريع</h1>
        </div>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-3 space-y-1">
            {routes.map((route) => (
              <NavItem
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
                active={route.active}
              />
            ))}
          </nav>
          <div className="px-3 mt-auto">
            <NavItem
              icon={<LogOut className="h-5 w-5" />}
              label={t("logout")}
              href="/logout"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
