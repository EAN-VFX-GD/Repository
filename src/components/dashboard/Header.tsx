import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-64 pl-8 bg-background"
          />
        </div>
      </div>
      <Button variant="outline" size="icon" className="md:hidden">
        <Search className="h-4 w-4" />
      </Button>
      <Button className="hidden md:flex gap-2">
        <Plus className="h-4 w-4" />
        <span>New Project</span>
      </Button>
      <Button variant="ghost" size="icon" className="ml-auto">
        <Bell className="h-5 w-5" />
      </Button>
      <Avatar>
        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </header>
  );
}
