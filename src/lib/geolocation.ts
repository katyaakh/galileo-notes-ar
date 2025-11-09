export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  timestamp: number;
}

export interface LocationNote {
  id: string;
  coordinates: LocationCoordinates;
  note: string;
  createdAt: number;
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
const STORAGE_KEY = "location-notes";

export const saveNote = (note: LocationNote): void => {
  const notes = getAllNotes();
  notes.push(note);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const getAllNotes = (): LocationNote[] => {
  const notesJson = localStorage.getItem(STORAGE_KEY);
  return notesJson ? JSON.parse(notesJson) : [];
};

export const deleteNote = (id: string): void => {
  const notes = getAllNotes().filter((note) => note.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const getNearbyNotes = (
  currentLat: number,
  currentLon: number,
  threshold: number = PROXIMITY_THRESHOLD
): LocationNote[] => {
  const allNotes = getAllNotes();
  return allNotes.filter((note) =>
    isNearLocation(
      currentLat,
      currentLon,
      note.coordinates.latitude,
      note.coordinates.longitude,
      threshold
    )
  );
};
