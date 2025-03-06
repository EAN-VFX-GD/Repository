import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Plus, Search, Moon, Sun, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { t } from "@/locales";
import { useToast } from "@/components/ui/use-toast";

export default function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects } = useProjects();
  const { signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 2) {
      const results = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.client.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query),
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleNewProject = () => {
    navigate("/projects/new");
  };

  const handleNotifications = () => {
    navigate("/notifications");
  };

  const handleProfileClick = (path: string) => {
    navigate(path);
  };

  const handleSearchResultClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);

    toast({
      title: newMode ? "تم تفعيل الوضع الداكن" : "تم تفعيل الوضع الفاتح",
      description: "تم تغيير سمة التطبيق بنجاح",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4">
        <div className="relative">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="w-64 pr-8 bg-background"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && searchQuery.length > 2 && (
            <div className="absolute top-full right-0 w-full mt-1 bg-background border rounded-md shadow-lg z-50">
              {searchResults.map((project) => (
                <div
                  key={project.id}
                  className="p-2 hover:bg-secondary cursor-pointer"
                  onClick={() => handleSearchResultClick(project.id)}
                >
                  <div className="font-medium">{project.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {project.client}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button variant="outline" size="icon" className="md:hidden">
        <Search className="h-4 w-4" />
      </Button>
      <Button
        className="hidden md:flex gap-2 bg-[hsl(var(--vodafone-red))] hover:bg-[hsl(var(--vodafone-red-dark))]"
        onClick={handleNewProject}
      >
        <Plus className="h-4 w-4" />
        <span>{t("newProject")}</span>
      </Button>
      <div className="flex items-center gap-2 mr-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleNotifications}>
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>حسابي</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleProfileClick("/settings")}>
            إعدادات الملف الشخصي
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleProfileClick("/settings")}>
            التفضيلات
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 ml-2" />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
