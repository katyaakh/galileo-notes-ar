import { useState } from "react";
import { MapPin, Satellite, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getAllFolders, 
  updateFolderSatelliteData, 
  type LocationFolder 
} from "@/lib/geolocation";
import { toast } from "sonner";
import { SatelliteOverlay } from "./SatelliteOverlay";

interface MapViewProps {
  onSelectFolder: (folder: LocationFolder) => void;
}

export const MapView = ({ onSelectFolder }: MapViewProps) => {
  const [folders] = useState<LocationFolder[]>(getAllFolders());
  const [selectedFolder, setSelectedFolder] = useState<LocationFolder | null>(null);
  const [isLoadingSatellite, setIsLoadingSatellite] = useState(false);

  const handleFetchSatellite = async (folder: LocationFolder) => {
    setIsLoadingSatellite(true);
    try {
      await updateFolderSatelliteData(folder.id);
      const updated = getAllFolders().find((f) => f.id === folder.id);
      if (updated) {
        setSelectedFolder(updated);
      }
      toast.success("Satellite data updated");
    } catch (error) {
      toast.error("Failed to fetch satellite data");
    } finally {
      setIsLoadingSatellite(false);
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="grid md:grid-cols-2 gap-0 h-full">
        {/* Map Area - Placeholder for actual map integration */}
        <div className="relative bg-muted/20 min-h-[400px] md:min-h-full border-r">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <MapPin className="h-16 w-16 text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mapbox integration coming soon
                </p>
                <p className="text-xs text-muted-foreground">
                  Click location folders below to view details
                </p>
              </div>
            </div>
          </div>

          {/* Markers overlay simulation */}
          <div className="absolute inset-0 pointer-events-none">
            {folders.slice(0, 3).map((folder, idx) => (
              <div
                key={folder.id}
                className="absolute animate-pulse"
                style={{
                  left: `${30 + idx * 25}%`,
                  top: `${40 + idx * 10}%`,
                }}
              >
                <MapPin className="h-8 w-8 text-primary drop-shadow-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Location Folders Sidebar */}
        <div className="overflow-y-auto h-full">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Location Folders</h2>
              <Badge variant="secondary">{folders.length} locations</Badge>
            </div>

            {folders.length === 0 ? (
              <Card className="p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No location folders yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {folders.map((folder) => (
                  <Card
                    key={folder.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedFolder?.id === folder.id
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
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
                              <span>{new Date(folder.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{folder.notes.length} notes</Badge>
                      </div>

                      {selectedFolder?.id === folder.id && (
                        <div className="space-y-3 pt-3 border-t">
                          {folder.satelliteData && (
                            <SatelliteOverlay data={folder.satelliteData} />
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFetchSatellite(folder);
                              }}
                              disabled={isLoadingSatellite}
                              className="flex-1"
                            >
                              <Satellite className="h-4 w-4 mr-2" />
                              {isLoadingSatellite ? "Fetching..." : "Get Data"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectFolder(folder);
                              }}
                              className="flex-1"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
