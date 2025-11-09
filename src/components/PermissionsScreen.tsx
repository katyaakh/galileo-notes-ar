import { useState } from "react";
import { Camera, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requestGeolocation } from "@/lib/geolocation";
import { toast } from "sonner";

interface PermissionsScreenProps {
  onPermissionsGranted: () => void;
}

export const PermissionsScreen = ({ onPermissionsGranted }: PermissionsScreenProps) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermissions = async () => {
    setIsRequesting(true);

    try {
      // Request location
      await requestGeolocation();

      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((track) => track.stop());

      toast.success("Permissions granted! Starting AR...");
      onPermissionsGranted();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Permission denied";
      toast.error(`Permission error: ${errorMessage}`);
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AR Notes</h1>
          </div>
          <p className="text-muted-foreground">
            Anchor your thoughts to real-world locations
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Location Access</h3>
              <p className="text-xs text-muted-foreground">
                We use GPS and Galileo GNSS to precisely tag your notes to real-world coordinates
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Camera className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Camera Access</h3>
              <p className="text-xs text-muted-foreground">
                View your notes in augmented reality overlaid on your camera feed
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Info className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Privacy First</h3>
              <p className="text-xs text-muted-foreground">
                All data stored locally on your device. No cloud, no tracking.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={requestPermissions}
          disabled={isRequesting}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-accent"
        >
          {isRequesting ? "Requesting permissions..." : "Grant Permissions & Start"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to grant camera and location permissions
        </p>
      </Card>
    </div>
  );
};
