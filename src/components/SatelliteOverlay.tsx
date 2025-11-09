import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Droplets, Thermometer, Leaf } from "lucide-react";
import { type SatelliteData } from "@/lib/geolocation";

interface SatelliteOverlayProps {
  data: SatelliteData;
}

export const SatelliteOverlay = ({ data }: SatelliteOverlayProps) => {
  const getNDVIColor = (ndvi: number) => {
    if (ndvi < 0.3) return "text-red-500";
    if (ndvi < 0.5) return "text-yellow-500";
    if (ndvi < 0.7) return "text-lime-500";
    return "text-green-500";
  };

  const getNDVILabel = (ndvi: number) => {
    if (ndvi < 0.3) return "Poor vegetation";
    if (ndvi < 0.5) return "Moderate vegetation";
    if (ndvi < 0.7) return "Good vegetation";
    return "Excellent vegetation";
  };

  const getMoistureColor = (moisture: number) => {
    if (moisture < 30) return "text-red-500";
    if (moisture < 50) return "text-yellow-500";
    return "text-blue-500";
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center gap-2 mb-4">
        <Satellite className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Satellite Data</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          {new Date(data.fetchedAt).toLocaleTimeString()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NDVI */}
        {data.ndvi !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Leaf className={`h-4 w-4 ${getNDVIColor(data.ndvi)}`} />
              <span className="text-sm font-medium">NDVI</span>
            </div>
            <div className="text-2xl font-bold">{data.ndvi.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{getNDVILabel(data.ndvi)}</div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                style={{ width: `${data.ndvi * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Soil Moisture */}
        {data.soilMoisture !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className={`h-4 w-4 ${getMoistureColor(data.soilMoisture)}`} />
              <span className="text-sm font-medium">Soil Moisture</span>
            </div>
            <div className="text-2xl font-bold">{data.soilMoisture.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              {data.soilMoisture < 30 ? "Dry" : data.soilMoisture < 50 ? "Moderate" : "Moist"}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
                style={{ width: `${data.soilMoisture}%` }}
              />
            </div>
          </div>
        )}

        {/* Temperature */}
        {data.temperature !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Temperature</span>
            </div>
            <div className="text-2xl font-bold">{data.temperature.toFixed(1)}°C</div>
            <div className="text-xs text-muted-foreground">
              {data.temperature < 15 ? "Cool" : data.temperature < 25 ? "Mild" : "Warm"}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500"
                style={{ width: `${((data.temperature - 10) / 20) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Data source: Copernicus Sentinel satellites
      </div>
    </Card>
  );
};
