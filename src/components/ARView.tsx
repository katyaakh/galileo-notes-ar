import { useState, useEffect, useRef } from "react";
import { Camera, Navigation, Plus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteForm } from "@/components/NoteForm";
import { ProximityAlert } from "@/components/ProximityAlert";
import {
  watchGeolocation,
  clearGeolocationWatch,
  type LocationCoordinates,
  getNearbyNotes,
  type LocationNote,
} from "@/lib/geolocation";
import { toast } from "sonner";

interface ARViewProps {
  onViewNotes: () => void;
}

export const ARView = ({ onViewNotes }: ARViewProps) => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [nearbyNotes, setNearbyNotes] = useState<LocationNote[]>([]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const watchIdRef = useRef<number>(-1);

  useEffect(() => {
    // Request camera access
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        toast.error("Camera access denied. AR features will be limited.");
      }
    };

    startCamera();

    // Start watching location
    watchIdRef.current = watchGeolocation(
      (coords) => {
        setCurrentLocation(coords);
        const nearby = getNearbyNotes(coords.latitude, coords.longitude);
        setNearbyNotes(nearby);
      },
      (error) => {
        toast.error(`Location error: ${error.message}`);
      }
    );

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (watchIdRef.current !== -1) {
        clearGeolocationWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const handleNoteSaved = () => {
    setShowNoteForm(false);
    toast.success("Note saved at current location!");
    // Refresh nearby notes
    if (currentLocation) {
      const nearby = getNearbyNotes(currentLocation.latitude, currentLocation.longitude);
      setNearbyNotes(nearby);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* AR Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md px-3 py-2 rounded-full">
            <Navigation className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-medium">
              {currentLocation
                ? `${currentLocation.accuracy.toFixed(0)}m accuracy`
                : "Locating..."}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewNotes}
            className="bg-card/80 backdrop-blur-md rounded-full"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>

        {/* AR Note markers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {nearbyNotes.map((note) => (
            <div
              key={note.id}
              className="absolute bg-primary/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg animate-pulse"
              style={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <p className="text-primary-foreground text-sm font-medium">{note.note}</p>
            </div>
          ))}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4">
          {currentLocation && (
            <div className="bg-card/80 backdrop-blur-md px-4 py-2 rounded-full text-xs text-muted-foreground">
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              {currentLocation.altitude && ` • ${currentLocation.altitude.toFixed(0)}m`}
            </div>
          )}
          <Button
            size="lg"
            onClick={() => setShowNoteForm(true)}
            disabled={!currentLocation}
            className="rounded-full bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Note Here
          </Button>
        </div>
      </div>

      {/* Note form modal */}
      {showNoteForm && currentLocation && (
        <NoteForm
          currentLocation={currentLocation}
          onClose={() => setShowNoteForm(false)}
          onSave={handleNoteSaved}
        />
      )}

      {/* Proximity alerts */}
      {nearbyNotes.length > 0 && (
        <ProximityAlert notes={nearbyNotes} />
      )}
    </div>
  );
};
