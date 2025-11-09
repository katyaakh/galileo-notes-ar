import { useState, useEffect } from "react";
import { PermissionsScreen } from "@/components/PermissionsScreen";
import { ARView } from "@/components/ARView";
import { NotesList } from "@/components/NotesList";

type ViewMode = "permissions" | "ar" | "list";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("permissions");

  useEffect(() => {
    // Check if permissions were previously granted
    const checkPermissions = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        if (permissionStatus.state === "granted") {
          setViewMode("ar");
        }
      } catch (error) {
        // If permissions API not available, stay on permissions screen
      }
    };

    checkPermissions();
  }, []);

  return (
    <>
      {viewMode === "permissions" && (
        <PermissionsScreen onPermissionsGranted={() => setViewMode("ar")} />
      )}
      {viewMode === "ar" && <ARView onViewNotes={() => setViewMode("list")} />}
      {viewMode === "list" && <NotesList onViewInAR={() => setViewMode("ar")} />}
    </>
  );
};

export default Index;
