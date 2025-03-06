import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Plus, Search } from "lucide-react";
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
import { t } from "@/locales";

export default function Header() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4">
        <div className="relative">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="w-64 pr-8 bg-background text-right"
            value={searchQuery}
            onChange={handleSearch}
            dir="rtl"
          />
          {searchResults.length > 0 && searchQuery.length > 2 && (
            <div className="absolute top-full right-0 w-full mt-1 bg-background border rounded-md shadow-lg z-50">
              {searchResults.map((project) => (
                <div
                  key={project.id}
                  className="p-2 hover:bg-secondary cursor-pointer text-right"
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
      <Button className="hidden md:flex gap-2" onClick={handleNewProject}>
        <Plus className="h-4 w-4" />
        <span>{t("newProject")}</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="mr-auto"
        onClick={handleNotifications}
      >
        <Bell className="h-5 w-5" />
      </Button>
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
          <DropdownMenuItem onClick={() => handleProfileClick("/logout")}>
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
