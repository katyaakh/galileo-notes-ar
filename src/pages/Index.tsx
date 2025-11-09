import { useState } from "react";
import { ARView } from "@/components/ARView";
import { LocationFolders } from "@/components/LocationFolders";
import { LocationDetail } from "@/components/LocationDetail";
import { PermissionsScreen } from "@/components/PermissionsScreen";
import { type LocationFolder } from "@/lib/geolocation";

const Index = () => {
  const [viewMode, setViewMode] = useState<"permissions" | "ar" | "folders" | "detail">("permissions");
  const [selectedFolder, setSelectedFolder] = useState<LocationFolder | null>(null);

  const handleSelectFolder = (folder: LocationFolder) => {
    setSelectedFolder(folder);
    setViewMode("detail");
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setViewMode("folders");
  };

  return (
    <div className="min-h-screen">
      {viewMode === "permissions" && (
        <PermissionsScreen onPermissionsGranted={() => setViewMode("ar")} />
      )}
      {viewMode === "ar" && <ARView onViewNotes={() => setViewMode("folders")} />}
      {viewMode === "folders" && (
        <LocationFolders
          onViewInAR={() => setViewMode("ar")}
          onSelectFolder={handleSelectFolder}
        />
      )}
      {viewMode === "detail" && selectedFolder && (
        <LocationDetail
          folder={selectedFolder}
          onBack={handleBackToFolders}
          onUpdate={() => {
            // Refresh folder data
            const { getAllFolders } = require("@/lib/geolocation");
            const updated = getAllFolders().find((f: LocationFolder) => f.id === selectedFolder.id);
            if (updated) setSelectedFolder(updated);
          }}
        />
      )}
    </div>
  );
};

export default Index;
