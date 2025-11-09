import { Home, Map, Target, Camera, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = 
  | "menu"
  | "map" 
  | "mission" 
  | "ar" 
  | "folders" 
  | "detail" 
  | "permissions";

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const BottomNav = ({ currentView, onNavigate }: BottomNavProps) => {
  // Don't show nav on permissions screen or detail view
  if (currentView === "permissions" || currentView === "detail") {
    return null;
  }

  const navItems = [
    { id: "menu" as ViewMode, icon: Home, label: "Menu" },
    { id: "map" as ViewMode, icon: Map, label: "Map" },
    { id: "mission" as ViewMode, icon: Target, label: "Mission" },
    { id: "ar" as ViewMode, icon: Camera, label: "AR" },
    { id: "folders" as ViewMode, icon: FolderOpen, label: "Folders" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t shadow-lg z-50">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-primary rounded-full" />
              )}
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
