import { useState, useEffect } from "react";
import { Target, CheckCircle2, MapPin, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { requestGeolocation, calculateDistance, getAllFolders } from "@/lib/geolocation";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
  reward: number;
  completed: boolean;
}

interface MissionObjective {
  id: string;
  description: string;
  targetLat?: number;
  targetLon?: number;
  requiredDistance?: number;
  completed: boolean;
}

export const MissionGameplay = () => {
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [missionProgress, setMissionProgress] = useState(0);

  // Generate sample missions based on user's location folders
  useEffect(() => {
    const folders = getAllFolders();
    if (folders.length > 0 && !currentMission) {
      const sampleMission: Mission = {
        id: "mission-1",
        title: "Field Data Collection",
        description: "Visit your tagged locations and verify the current conditions",
        objectives: folders.slice(0, 3).map((folder, idx) => ({
          id: `obj-${idx}`,
          description: `Visit ${folder.name} and add a new observation`,
          targetLat: folder.coordinates.latitude,
          targetLon: folder.coordinates.longitude,
          requiredDistance: 50, // meters
          completed: false,
        })),
        reward: 100,
        completed: false,
      };
      setCurrentMission(sampleMission);
    }
  }, []);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const location = await requestGeolocation();
        setUserLocation({ lat: location.latitude, lon: location.longitude });
      } catch (error) {
        // Handle silently
      }
    };

    checkLocation();
    const interval = setInterval(checkLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentMission) {
      const completed = currentMission.objectives.filter((obj) => obj.completed).length;
      const total = currentMission.objectives.length;
      setMissionProgress((completed / total) * 100);
    }
  }, [currentMission]);

  const checkObjectiveCompletion = (objective: MissionObjective) => {
    if (!userLocation || !objective.targetLat || !objective.targetLon) return;

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lon,
      objective.targetLat,
      objective.targetLon
    );

    if (distance <= (objective.requiredDistance || 50)) {
      if (!objective.completed) {
        objective.completed = true;
        setCurrentMission({ ...currentMission! });
        toast.success("Objective completed!");
      }
    }
  };

  useEffect(() => {
    if (currentMission && userLocation) {
      currentMission.objectives.forEach(checkObjectiveCompletion);
    }
  }, [userLocation, currentMission]);

  if (!currentMission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Missions</h3>
          <p className="text-muted-foreground mb-4">
            Create location folders first to unlock missions
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mission Header */}
        <Card className="p-6 bg-gradient-to-br from-card to-primary/5">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{currentMission.title}</h1>
                  <p className="text-muted-foreground text-sm">
                    {currentMission.description}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Trophy className="h-3 w-3" />
                {currentMission.reward} pts
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Mission Progress</span>
                <span className="text-muted-foreground">
                  {currentMission.objectives.filter((o) => o.completed).length} /{" "}
                  {currentMission.objectives.length}
                </span>
              </div>
              <Progress value={missionProgress} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Objectives List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Objectives</h2>
          {currentMission.objectives.map((objective, idx) => (
            <Card
              key={objective.id}
              className={`p-4 transition-all ${
                objective.completed ? "bg-primary/5 border-primary/30" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${objective.completed ? "text-primary" : "text-muted-foreground"}`}>
                  {objective.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                      <span className="text-xs">{idx + 1}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${objective.completed ? "line-through" : ""}`}>
                    {objective.description}
                  </p>
                  {objective.targetLat && objective.targetLon && userLocation && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Distance:{" "}
                      {calculateDistance(
                        userLocation.lat,
                        userLocation.lon,
                        objective.targetLat,
                        objective.targetLon
                      ).toFixed(0)}
                      m away
                    </div>
                  )}
                </div>
                {objective.completed && (
                  <Badge variant="default" className="gap-1">
                    <Star className="h-3 w-3" />
                    +{Math.floor(currentMission.reward / currentMission.objectives.length)}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Complete Mission Button */}
        {missionProgress === 100 && (
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent"
            onClick={() => {
              toast.success(`Mission completed! Earned ${currentMission.reward} points!`);
              setCurrentMission(null);
            }}
          >
            <Trophy className="h-5 w-5 mr-2" />
            Complete Mission
          </Button>
        )}
      </div>
    </div>
  );
};
