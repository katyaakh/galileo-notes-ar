export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  timestamp: number;
}

export interface LocationNote {
  id: string;
  locationFolderId: string;
  note: string;
  createdAt: number;
}

export interface LocationFolder {
  id: string;
  name: string;
  coordinates: LocationCoordinates;
  notes: LocationNote[];
  satelliteData?: SatelliteData;
  createdAt: number;
  updatedAt: number;
}

export interface SatelliteData {
  ndvi?: number;
  soilMoisture?: number;
  temperature?: number;
  fetchedAt: number;
}

const PROXIMITY_THRESHOLD = 50; // meters

export const requestGeolocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const watchGeolocation = (
  callback: (coords: LocationCoordinates) => void,
  errorCallback: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    errorCallback({
      code: 0,
      message: "Geolocation not supported",
    } as GeolocationPositionError);
    return -1;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    },
    errorCallback,
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
};

export const clearGeolocationWatch = (watchId: number) => {
  navigator.geolocation.clearWatch(watchId);
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const isNearLocation = (
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number,
  threshold: number = PROXIMITY_THRESHOLD
): boolean => {
  const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
  return distance <= threshold;
};

// Storage functions
const STORAGE_KEY = "location-folders";

export const getAllFolders = (): LocationFolder[] => {
  const foldersJson = localStorage.getItem(STORAGE_KEY);
  return foldersJson ? JSON.parse(foldersJson) : [];
};

const saveFolders = (folders: LocationFolder[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
};

export const findOrCreateFolder = (coordinates: LocationCoordinates): LocationFolder => {
  const folders = getAllFolders();
  
  // Find existing folder within proximity threshold
  const existingFolder = folders.find((folder) =>
    isNearLocation(
      coordinates.latitude,
      coordinates.longitude,
      folder.coordinates.latitude,
      folder.coordinates.longitude
    )
  );

  if (existingFolder) {
    return existingFolder;
  }

  // Create new folder
  const newFolder: LocationFolder = {
    id: crypto.randomUUID(),
    name: `Location: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`,
    coordinates,
    notes: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  folders.push(newFolder);
  saveFolders(folders);
  return newFolder;
};

export const addNoteToFolder = (folderId: string, noteText: string): void => {
  const folders = getAllFolders();
  const folder = folders.find((f) => f.id === folderId);
  
  if (folder) {
    const newNote: LocationNote = {
      id: crypto.randomUUID(),
      locationFolderId: folderId,
      note: noteText,
      createdAt: Date.now(),
    };
    
    folder.notes.push(newNote);
    folder.updatedAt = Date.now();
    saveFolders(folders);
  }
};

export const deleteNote = (folderId: string, noteId: string): void => {
  const folders = getAllFolders();
  const folder = folders.find((f) => f.id === folderId);
  
  if (folder) {
    folder.notes = folder.notes.filter((note) => note.id !== noteId);
    folder.updatedAt = Date.now();
    saveFolders(folders);
  }
};

export const deleteFolder = (folderId: string): void => {
  const folders = getAllFolders().filter((f) => f.id !== folderId);
  saveFolders(folders);
};

export const renameFolder = (folderId: string, newName: string): void => {
  const folders = getAllFolders();
  const folder = folders.find((f) => f.id === folderId);
  
  if (folder) {
    folder.name = newName;
    folder.updatedAt = Date.now();
    saveFolders(folders);
  }
};

export const getNearbyFolders = (
  currentLat: number,
  currentLon: number,
  threshold: number = PROXIMITY_THRESHOLD
): LocationFolder[] => {
  const allFolders = getAllFolders();
  return allFolders.filter((folder) =>
    isNearLocation(
      currentLat,
      currentLon,
      folder.coordinates.latitude,
      folder.coordinates.longitude,
      threshold
    )
  );
};

export const fetchSatelliteData = async (
  lat: number,
  lon: number
): Promise<SatelliteData> => {
  // Mock Copernicus API call - replace with actual API integration
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return {
    ndvi: 0.3 + Math.random() * 0.6, // 0.3-0.9 range
    soilMoisture: 20 + Math.random() * 50, // 20-70%
    temperature: 15 + Math.random() * 15, // 15-30°C
    fetchedAt: Date.now(),
  };
};

export const updateFolderSatelliteData = async (folderId: string): Promise<void> => {
  const folders = getAllFolders();
  const folder = folders.find((f) => f.id === folderId);
  
  if (folder) {
    const satelliteData = await fetchSatelliteData(
      folder.coordinates.latitude,
      folder.coordinates.longitude
    );
    folder.satelliteData = satelliteData;
    folder.updatedAt = Date.now();
    saveFolders(folders);
  }
};
