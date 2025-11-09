import { MapPin, Calendar, Trash2, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllNotes, deleteNote, type LocationNote } from "@/lib/geolocation";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface NotesListProps {
  onViewInAR: () => void;
}

export const NotesList = ({ onViewInAR }: NotesListProps) => {
  const [notes, setNotes] = useState<LocationNote[]>([]);

  useEffect(() => {
    setNotes(getAllNotes());
  }, []);

  const handleDelete = (id: string) => {
    deleteNote(id);
    setNotes(getAllNotes());
    toast.success("Note deleted");
  };

  const openInMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Location Notes</h1>
          <Button onClick={onViewInAR} variant="outline" className="gap-2">
            <Navigation2 className="h-4 w-4" />
            AR View
          </Button>
        </div>

        {notes.length === 0 ? (
          <Card className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding location-based notes in AR view
            </p>
            <Button onClick={onViewInAR} className="bg-gradient-to-r from-primary to-accent">
              Open AR View
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card key={note.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-2">{note.note}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {note.coordinates.latitude.toFixed(6)}, {note.coordinates.longitude.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openInMaps(note.coordinates.latitude, note.coordinates.longitude)
                        }
                      >
                        View on Map
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
