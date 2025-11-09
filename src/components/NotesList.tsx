import { MapPin, Calendar, Trash2, Navigation2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllNotes, deleteNote, type LocationNote } from "@/lib/geolocation";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import geoTaggerLogo from "@/assets/geotagger-logo.png";

interface NotesListProps {
  onViewInAR: () => void;
}

export const NotesList = ({ onViewInAR }: NotesListProps) => {
  const [notes, setNotes] = useState<LocationNote[]>([]);
  const [filterText, setFilterText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    setNotes(getAllNotes());
  }, []);

  const locationGroups = useMemo(() => {
    const groups = new Set<string>();
    notes.forEach((note) => {
      if (note.locationGroup) {
        groups.add(note.locationGroup);
      }
    });
    return Array.from(groups).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesFilter = filterText
        ? note.note.toLowerCase().includes(filterText.toLowerCase()) ||
          note.locationGroup?.toLowerCase().includes(filterText.toLowerCase())
        : true;
      
      const matchesGroup = selectedGroup
        ? note.locationGroup === selectedGroup
        : true;
      
      return matchesFilter && matchesGroup;
    });
  }, [notes, filterText, selectedGroup]);

  const groupedNotes = useMemo(() => {
    const groups: Record<string, LocationNote[]> = {
      "Ungrouped": [],
    };

    filteredNotes.forEach((note) => {
      const group = note.locationGroup || "Ungrouped";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(note);
    });

    return groups;
  }, [filteredNotes]);

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
          <div className="flex items-center gap-3">
            <img src={geoTaggerLogo} alt="GeoTagger" className="h-12 w-12 rounded-lg" />
            <h1 className="text-2xl font-bold">My Location Notes</h1>
          </div>
          <Button onClick={onViewInAR} variant="outline" className="gap-2">
            <Navigation2 className="h-4 w-4" />
            AR View
          </Button>
        </div>

        {/* Filter and groups */}
        <div className="space-y-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter notes..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10"
            />
          </div>

          {locationGroups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedGroup === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedGroup(null)}
              >
                All
              </Badge>
              {locationGroups.map((group) => (
                <Badge
                  key={group}
                  variant={selectedGroup === group ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
                >
                  {group}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {filteredNotes.length === 0 ? (
          <Card className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {notes.length === 0 ? "No notes yet" : "No matching notes"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {notes.length === 0
                ? "Start adding location-based notes in AR view"
                : "Try adjusting your filters"}
            </p>
            {notes.length === 0 && (
              <Button onClick={onViewInAR} className="bg-gradient-to-r from-primary to-accent">
                Open AR View
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotes).map(([group, groupNotes]) =>
              groupNotes.length > 0 ? (
                <div key={group} className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground/80 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {group}
                  </h2>
                  <div className="space-y-3">
                    {groupNotes.map((note) => (
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
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};
