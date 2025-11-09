import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LocationNote } from "@/lib/geolocation";

interface ProximityAlertProps {
  notes: LocationNote[];
}

export const ProximityAlert = ({ notes }: ProximityAlertProps) => {
  if (notes.length === 0) return null;

  return (
    <div className="absolute top-20 left-4 right-4 z-40">
      <Card className="bg-secondary/95 backdrop-blur-md border-secondary p-4 animate-in slide-in-from-top-4">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-secondary-foreground animate-pulse mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-secondary-foreground mb-1">
              {notes.length} {notes.length === 1 ? "Note" : "Notes"} Nearby
            </h4>
            <p className="text-sm text-secondary-foreground/80">
              You're close to a location you've tagged before
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
