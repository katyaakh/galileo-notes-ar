import { MapPin, Plus, Calendar, FolderOpen, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllFolders, type LocationFolder } from "@/lib/geolocation";
import { useState, useEffect } from "react";
import geoTaggerLogo from "@/assets/geotagger-logo.png";

interface LocationFoldersProps {
  onViewInAR: () => void;
  onSelectFolder: (folder: LocationFolder) => void;
}

export const LocationFolders = ({ onViewInAR, onSelectFolder }: LocationFoldersProps) => {
  const [folders, setFolders] = useState<LocationFolder[]>([]);

  useEffect(() => {
    setFolders(getAllFolders());
  }, []);

  const refreshFolders = () => {
    setFolders(getAllFolders());
  };

  // Auto-refresh when component gains focus
  useEffect(() => {
    const handleFocus = () => refreshFolders();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={geoTaggerLogo} alt="GeoTagger" className="h-12 w-12 rounded-lg" />
            <h1 className="text-2xl font-bold">Location Folders</h1>
          </div>
          <Button onClick={onViewInAR} variant="outline" className="gap-2">
            <Navigation2 className="h-4 w-4" />
            AR View
          </Button>
        </div>

        {folders.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No location folders yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first geo-tagged note in AR view to start
            </p>
            <Button onClick={onViewInAR} className="bg-gradient-to-r from-primary to-accent">
              <Plus className="h-4 w-4 mr-2" />
              Open AR View
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {folders
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((folder) => (
                <Card
                  key={folder.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onSelectFolder(folder)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{folder.name}</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {folder.coordinates.latitude.toFixed(6)},{" "}
                            {folder.coordinates.longitude.toFixed(6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {new Date(folder.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="secondary">{folder.notes.length} notes</Badge>
                        {folder.satelliteData && (
                          <Badge variant="outline">Satellite data available</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
