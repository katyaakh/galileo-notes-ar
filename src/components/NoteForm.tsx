import { useState } from "react";
import { MapPin, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { type LocationCoordinates } from "@/lib/geolocation";

interface NoteFormProps {
  currentLocation: LocationCoordinates;
  onClose: () => void;
  onSave: (noteText: string) => void;
}

export const NoteForm = ({ currentLocation, onClose, onSave }: NoteFormProps) => {
  const [noteText, setNoteText] = useState("");

  const handleSave = () => {
    if (!noteText.trim()) return;
    onSave(noteText);
  };

  return (
    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Add Location Note</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Lat: {currentLocation.latitude.toFixed(6)}</p>
            <p>Lon: {currentLocation.longitude.toFixed(6)}</p>
            {currentLocation.altitude && (
              <p>Alt: {currentLocation.altitude.toFixed(0)}m</p>
            )}
            <p className="text-xs mt-1">Accuracy: ±{currentLocation.accuracy.toFixed(0)}m</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-text">Note</Label>
            <Textarea
              id="note-text"
              placeholder="What would you like to remember about this spot?"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!noteText.trim()}
            className="flex-1 bg-gradient-to-r from-primary to-accent"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </div>
      </Card>
    </div>
  );
};
