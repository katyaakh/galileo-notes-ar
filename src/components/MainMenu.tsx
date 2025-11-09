import { Map, Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import geoTaggerLogo from "@/assets/geotagger-logo.png";

interface MainMenuProps {
  onOpenMap: () => void;
  onStartMission: () => void;
  onCollectNotes: () => void;
}

export const MainMenu = ({ onOpenMap, onStartMission, onCollectNotes }: MainMenuProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <img 
            src={geoTaggerLogo} 
            alt="GeoTagger" 
            className="h-24 w-24 mx-auto rounded-2xl shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">GeoTagger</h1>
            <p className="text-muted-foreground">
              Location intelligence powered by satellite data
            </p>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="space-y-4">
          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-card to-primary/5 border-primary/20"
            onClick={onOpenMap}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Open Map with Data</h3>
                <p className="text-sm text-muted-foreground">
                  View all field notes, location folders, and satellite overlays on an interactive map
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-card to-accent/5 border-accent/20"
            onClick={onStartMission}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Start Mission Gameplay</h3>
                <p className="text-sm text-muted-foreground">
                  Complete guided objectives, collect data, and earn achievements
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-card to-secondary/5 border-secondary/20"
            onClick={onCollectNotes}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Plus className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Start to Collect Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Capture location-based observations with AR and satellite data
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Track • Document • Analyze • Optimize</p>
        </div>
      </div>
    </div>
  );
};
