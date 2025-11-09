// Simulate satellite data fetching and processing
// In production, replace with actual Copernicus/Sentinel Hub API calls

export interface SatelliteDataGrid {
  latitude: number;
  longitude: number;
  data: number[][];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface FieldData {
  ndvi_mean: number;
  soil_moisture_mean: number;
  temperature: number;
  humidity: number;
  precipitation: number;
  wind_speed: number;
  condition: string;
}

// Generate a grid of values around a point using normal distribution
const generateDataGrid = (
  centerLat: number,
  centerLon: number,
  mean: number,
  stdDev: number,
  min: number,
  max: number,
  gridSize: number = 20
): SatelliteDataGrid => {
  const grid: number[][] = [];
  const latRange = 0.01; // ~1km range
  const lonRange = 0.01;

  // Generate seeded random but consistent values
  const seed = Math.abs(Math.sin(centerLat * centerLon) * 10000);
  let random = seed;
  
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  for (let i = 0; i < gridSize; i++) {
    const row: number[] = [];
    for (let j = 0; j < gridSize; j++) {
      // Box-Muller transform for normal distribution
      const u1 = seededRandom();
      const u2 = seededRandom();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const value = Math.max(min, Math.min(max, mean + z * stdDev));
      row.push(value);
    }
    grid.push(row);
  }

  return {
    latitude: centerLat,
    longitude: centerLon,
    data: grid,
    bounds: {
      north: centerLat + latRange / 2,
      south: centerLat - latRange / 2,
      east: centerLon + lonRange / 2,
      west: centerLon - lonRange / 2,
    },
  };
};

// Simulate NDVI (Normalized Difference Vegetation Index) data
// NDVI ranges from -1 to 1, but typically 0.2-0.8 for vegetation
export const fetchNDVIData = async (
  latitude: number,
  longitude: number
): Promise<SatelliteDataGrid> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate NDVI data with mean around 0.65 (healthy vegetation)
  return generateDataGrid(latitude, longitude, 0.65, 0.12, 0, 1);
};

// Simulate soil moisture data (percentage)
export const fetchSoilMoistureData = async (
  latitude: number,
  longitude: number
): Promise<SatelliteDataGrid> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate soil moisture data (20-50% range)
  return generateDataGrid(latitude, longitude, 35, 8, 0, 100);
};

// Simulate temperature data (Celsius)
export const fetchTemperatureData = async (
  latitude: number,
  longitude: number
): Promise<SatelliteDataGrid> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate temperature data
  return generateDataGrid(latitude, longitude, 18, 3, -10, 40);
};

// Create color gradient for heatmap visualization
export const getColorForValue = (
  value: number,
  min: number,
  max: number,
  colorScheme: "ndvi" | "moisture" | "temperature"
): string => {
  const normalized = (value - min) / (max - min);

  if (colorScheme === "ndvi") {
    // Green gradient for NDVI (red -> yellow -> green)
    if (normalized < 0.3) {
      return `rgb(${Math.round(220 - normalized * 200)}, ${Math.round(50 + normalized * 150)}, 50)`;
    } else if (normalized < 0.6) {
      return `rgb(${Math.round(160 - (normalized - 0.3) * 300)}, ${Math.round(200)}, 50)`;
    } else {
      return `rgb(50, ${Math.round(200 - (normalized - 0.6) * 100)}, ${Math.round(50 + (normalized - 0.6) * 150)})`;
    }
  } else if (colorScheme === "moisture") {
    // Blue gradient for soil moisture
    const r = Math.round(255 - normalized * 200);
    const g = Math.round(255 - normalized * 100);
    const b = 255;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Red-blue gradient for temperature
    if (normalized < 0.5) {
      const r = Math.round(100 + normalized * 310);
      const g = Math.round(100 + normalized * 200);
      const b = 255;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const r = 255;
      const g = Math.round(255 - (normalized - 0.5) * 400);
      const b = Math.round(255 - (normalized - 0.5) * 510);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
};

// Generate a canvas-based heatmap image
export const generateHeatmapCanvas = (
  dataGrid: SatelliteDataGrid,
  colorScheme: "ndvi" | "moisture" | "temperature",
  minValue?: number,
  maxValue?: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const size = dataGrid.data.length;
  canvas.width = size * 10; // Scale up for better visibility
  canvas.height = size * 10;
  const ctx = canvas.getContext("2d")!;

  // Calculate min/max if not provided
  const flatData = dataGrid.data.flat();
  const min = minValue ?? Math.min(...flatData);
  const max = maxValue ?? Math.max(...flatData);

  // Draw heatmap
  const cellWidth = canvas.width / size;
  const cellHeight = canvas.height / size;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = dataGrid.data[i][j];
      const color = getColorForValue(value, min, max, colorScheme);
      ctx.fillStyle = color;
      ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
    }
  }

  return canvas;
};
