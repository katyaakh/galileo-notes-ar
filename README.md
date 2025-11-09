# 🌍 GeoTagger

**Anchor your thoughts to real-world locations**

GeoTagger is a sophisticated location-based note-taking and environmental monitoring application that combines geospatial technology, augmented reality, satellite data analysis, and weather tracking to provide a comprehensive field documentation tool.

![GeoTagger Permissions Screen](https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Flow](#-user-flow)
- [Screenshots & Screens](#-screenshots--screens)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [API Keys Setup](#-api-keys-setup)
- [Architecture](#-architecture)

---

## ✨ Features

### Core Functionality
- 📍 **Location-Based Notes**: Create geo-tagged notes at specific coordinates
- 🗺️ **Interactive Map View**: Mapbox-powered interactive maps with street and satellite views
- 📱 **AR View**: Augmented reality interface with minimap and location indicators
- 📂 **Location Folders**: Organize notes by location with automatic proximity detection
- 🎯 **Manual Location Creation**: Drop pins and create custom locations on the map

### Environmental Monitoring
- 🛰️ **Satellite Data Integration**: 
  - NDVI (Normalized Difference Vegetation Index)
  - Soil Moisture levels
  - Surface Temperature
  - Historical data trends (7/10/14/30 day periods)
  - Mini-charts and visual indicators
  
- 🌤️ **Weather Layers** (OpenWeatherMap):
  - Precipitation overlay
  - Temperature maps
  - Wind patterns
  - Cloud coverage

### Data Visualization
- 📊 Historical trend analysis with mini-charts
- 📈 Status badges for environmental metrics
- 🎨 Color-coded heatmap overlays
- 📅 Time-series data with period filters

### User Experience
- 🔒 Privacy-first: All data stored locally
- 🌓 Dark/Light mode support
- 📱 Responsive design for mobile and desktop
- 🎮 Bottom navigation for easy access
- 🔔 Real-time proximity alerts

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and design system
- **Shadcn/ui** - Component library

### Mapping & Geolocation
- **Mapbox GL JS** - Interactive maps and visualization
- **Browser Geolocation API** - GPS positioning
- **Haversine Formula** - Distance calculations

### Data & APIs
- **OpenWeatherMap API** - Weather data and overlays
- **LocalStorage** - Client-side data persistence
- **Simulated Copernicus Data** - Satellite data (mockup for demonstration)

### UI Components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Form management
- **Zod** - Schema validation

---

## 🔄 User Flow

### 1. **Initial Setup**
```
Launch App → Permissions Screen → Grant Location & Camera Access → Main Menu
```

**Permissions Screen**
- Location Access (GPS/GNSS for precise tagging)
- Camera Access (AR view functionality)
- Privacy notice (local storage only)

---

### 2. **Main Navigation**
```
Bottom Navigation Bar: [Map] [AR] [Locations] [Menu]
```

---

### 3. **Map View Workflow**

#### A. Basic Navigation
```
Map View → Toggle Street/Satellite → Pan & Zoom → View Location Markers
```

#### B. Weather Layers
```
Map View → Weather Button → Toggle Layers:
  ├─ Precipitation
  ├─ Temperature
  ├─ Wind
  └─ Clouds
```

#### C. Data Overlays
```
Map View → Data Button → Select Location → Toggle Overlays:
  ├─ NDVI (Vegetation Health)
  ├─ Soil Moisture
  └─ Temperature
```

#### D. Location Management
```
Map View → Locations Button → Locations Panel Opens:
  ├─ View All Locations
  ├─ Click Location → Fly to Location
  ├─ View Satellite Data Indicators
  └─ Add Location Button → Place Marker → Drag to Position → Confirm
```

#### E. Creating a New Location
```
1. Click "Add Location" button in Locations panel
2. Draggable marker appears at map center
3. Drag marker to desired position
4. See live coordinates update
5. Click ✓ (Check) to confirm
6. Click ✗ (Cancel) to abort
7. New location appears in panel immediately
```

---

### 4. **Location Details View**
```
Select Location → View Details Button:
  ├─ Location Name & Coordinates
  ├─ Satellite Data Indicators
  │   ├─ NDVI Status
  │   ├─ Soil Moisture
  │   └─ Temperature
  ├─ Historical Data (10-day trends)
  ├─ Period Filter (7/10/14/30 days)
  ├─ Notes List
  └─ Add Note Button → Note Form → Save
```

---

### 5. **AR View Workflow**
```
AR View → Enable Camera (Optional) → View Minimap:
  ├─ Current Location Display
  ├─ Nearby Locations (up to 2 shown)
  ├─ Location Notes Count
  └─ Add Location Button (if no locations nearby)
```

**AR View Features:**
- Camera toggle (on/off)
- Minimap with current location
- Location markers with note counts
- Quick access to add locations

---

### 6. **Location Folders Screen**
```
Locations Tab → Folder List:
  ├─ Search/Filter Locations
  ├─ Sort by Date/Name
  ├─ Click Folder → Location Detail
  └─ Create New Folder
```

---

### 7. **Adding Notes**
```
Location Detail → Add Note:
  1. Click "Add Note" button
  2. Enter note text
  3. Note Form with validation
  4. Save → Note appears in list
  5. Notes are geo-tagged automatically
```

---

### 8. **Satellite Data Analysis**
```
Location Detail → Satellite Data Indicators:
  ├─ NDVI Indicator
  │   ├─ Current Value (0.00-1.00)
  │   ├─ Status Badge (Poor/Fair/Good/Excellent)
  │   ├─ % Change from previous reading
  │   └─ 10-day trend mini-chart
  │
  ├─ Soil Moisture Indicator
  │   ├─ Current % value
  │   ├─ Status (Dry/Moderate/Wet)
  │   ├─ Trend indicator
  │   └─ Historical chart
  │
  └─ Temperature Indicator
      ├─ Current °C value
      ├─ Status (Cold/Normal/Warm/Hot)
      ├─ % Change
      └─ Temperature trend chart

Period Filter: [7 days] [10 days] [14 days] [30 days]
```

---

## 📱 Screenshots & Screens

### 1. Permissions Screen
![Permissions Screen](https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop)

**Purpose**: Request necessary permissions for app functionality
- Location access for GPS tagging
- Camera access for AR features
- Privacy-first approach notice

---

### 2. Map View
![Map View](https://images.unsplash.com/photo-1569163139394-de4798aa62b5?w=800&h=400&fit=crop)

**Features**:
- Interactive Mapbox map (Street/Satellite toggle)
- Location markers with custom pins
- Left sidebar controls:
  - Satellite/Street view toggle
  - Weather layers panel
  - Data overlays panel
  - Locations panel
- Weather layer overlays (precipitation, temperature, wind, clouds)
- Data heatmap overlays (NDVI, soil moisture, temperature)

---

### 3. Locations Panel (Slide-out)
![Locations Panel](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop)

**Features**:
- List of all location folders
- "Add Location" button (blue)
- Location cards showing:
  - Name
  - Coordinates
  - Last updated date
  - Number of notes
- Selected location expanded view:
  - Satellite data indicators
  - Historical trends
  - "View Details" button

---

### 4. Add Location Mode
![Add Location](https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop)

**Features**:
- Draggable marker on map
- Bottom control panel showing:
  - "Position the marker" instruction
  - Live coordinates display
  - ✓ Confirm button (green)
  - ✗ Cancel button (red)
- Real-time coordinate updates while dragging

---

### 5. Satellite Data Indicators
![Satellite Data](https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop)

**Features**:
- NDVI card with:
  - Current value (0.65)
  - Status badge (Good)
  - % change indicator
  - Mini line chart (10-day trend)
- Soil Moisture card
- Temperature card
- Period filter tabs (7/10/14/30 days)
- Color-coded status indicators

---

### 6. AR View
![AR View](https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=400&fit=crop)

**Features**:
- Camera view (optional)
- Minimap overlay showing:
  - Current location name
  - Nearby locations (with note counts)
  - "Add Location" button (if none nearby)
- Camera toggle button
- Bottom navigation bar

---

### 7. Location Detail View
![Location Detail](https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=400&fit=crop)

**Features**:
- Location header with name and coordinates
- Satellite data indicators section
- Notes list with timestamps
- "Add Note" button
- Delete/Edit options
- Back navigation

---

### 8. Weather Layers Panel
![Weather Layers](https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop)

**Features**:
- Toggle switches for:
  - Precipitation (blue icon)
  - Temperature (red icon)
  - Wind (cyan icon)
  - Clouds (gray icon)
- Data source attribution (OpenWeatherMap)
- Real-time layer overlay on map

---

### 9. Data Overlays Panel
![Data Overlays](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop)

**Features**:
- NDVI overlay toggle (green indicator)
- Soil Moisture overlay toggle (blue indicator)
- Temperature overlay toggle (red indicator)
- Requires location selection
- Heatmap visualization on map
- Source: Simulated Copernicus data

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser with geolocation support
- Internet connection for map tiles and weather data

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd geotagger

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

---

## 📖 Usage Guide

### Creating Your First Location

1. **Grant Permissions**
   - Allow location access when prompted
   - Allow camera access (optional, for AR)

2. **Navigate to Map View**
   - Click the Map icon in bottom navigation

3. **Add a Location**
   - Click "Locations" button (top-left)
   - Click "Add Location" button (blue)
   - Drag the marker to your desired position
   - Click ✓ to confirm

4. **Add Notes**
   - Click on the newly created location
   - Click "View Details"
   - Click "Add Note"
   - Enter your note and save

5. **View Satellite Data**
   - In location details, scroll to Satellite Data Indicators
   - View NDVI, Soil Moisture, and Temperature readings
   - Use period filter to see historical trends (7/10/14/30 days)
   - Each indicator shows current value, status, change %, and trend chart

---

### Using Weather Layers

1. Click "Weather" button (top-left on map)
2. Toggle desired layers:
   - **Precipitation**: See rainfall patterns
   - **Temperature**: View temperature maps
   - **Wind**: Display wind patterns
   - **Clouds**: Show cloud coverage
3. Multiple layers can be active simultaneously
4. Layers update in real-time

---

### Viewing Satellite Data

1. Click "Data" button (top-left)
2. Select a location from the map
3. Toggle data overlays:
   - **NDVI**: Vegetation health (green heatmap)
   - **Soil Moisture**: Moisture levels (blue heatmap)
   - **Temperature**: Surface temperature (red heatmap)
4. View detailed indicators in location panel:
   - Current values
   - Status badges (Poor/Fair/Good/Excellent)
   - Historical trends with mini-charts
   - Percentage changes

---

### Understanding Satellite Data Indicators

#### NDVI (Normalized Difference Vegetation Index)
- **Range**: 0.00 - 1.00
- **Status**:
  - < 0.3: Poor (red)
  - 0.3-0.5: Fair (yellow)
  - 0.5-0.7: Good (green)
  - > 0.7: Excellent (dark green)
- **Use**: Indicates vegetation health and photosynthetic activity

#### Soil Moisture
- **Range**: 0% - 100%
- **Status**:
  - < 25%: Dry (orange)
  - 25-60%: Moderate (green)
  - > 60%: Wet (blue)
- **Use**: Track soil water content for agriculture and environmental monitoring

#### Temperature
- **Range**: -50°C to 50°C
- **Status**:
  - < 10°C: Cold (blue)
  - 10-25°C: Normal (green)
  - 25-35°C: Warm (orange)
  - > 35°C: Hot (red)
- **Use**: Monitor surface temperature changes

---

### Using AR View

1. Navigate to AR View (bottom navigation)
2. Optionally enable camera for overlay
3. View minimap with:
   - Your current location
   - Nearby saved locations
   - Note counts for each location
4. Click "Add Location" if no locations are nearby
5. Minimap updates automatically as you move

---

## 🔑 API Keys Setup

### Mapbox (Required)

The app currently uses a public Mapbox token. For production:

1. Sign up at [mapbox.com](https://mapbox.com)
2. Create an access token
3. Replace in `src/components/MapView.tsx`:
```typescript
mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";
```

### OpenWeatherMap (Required for Weather Layers)

Current API key is for demonstration. For production:

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Get an API key
3. Replace in `src/components/MapView.tsx`:
```typescript
const OPENWEATHER_API_KEY = "YOUR_API_KEY";
```

### Copernicus / Sentinel (Future Integration)

Currently using simulated data. For real satellite data:

1. Register at [Copernicus Open Access Hub](https://scihub.copernicus.eu/)
2. Implement API integration in `src/lib/satelliteData.ts`
3. Update fetch functions with real API calls

---

## 🏗️ Architecture

### Project Structure
```
geotagger/
├── src/
│   ├── components/
│   │   ├── ARView.tsx              # Augmented reality view
│   │   ├── MapView.tsx             # Main map interface
│   │   ├── LocationFolders.tsx     # Folder list view
│   │   ├── LocationDetail.tsx      # Detail view for location
│   │   ├── LocationCreator.tsx     # New location form
│   │   ├── SatelliteDataIndicators.tsx  # Data visualization
│   │   ├── SatelliteOverlay.tsx    # Map data overlays
│   │   ├── WeatherForecast.tsx     # Weather component
│   │   ├── BottomNav.tsx           # Navigation bar
│   │   ├── MainMenu.tsx            # Menu screen
│   │   ├── NoteForm.tsx            # Note creation form
│   │   ├── ProximityAlert.tsx      # Location alerts
│   │   └── ui/                     # Shadcn UI components
│   ├── lib/
│   │   ├── geolocation.ts          # Geolocation utilities
│   │   ├── satelliteData.ts        # Satellite data fetching
│   │   └── utils.ts                # Helper functions
│   ├── pages/
│   │   ├── Index.tsx               # Main app page
│   │   └── NotFound.tsx            # 404 page
│   ├── index.css                   # Global styles
│   └── main.tsx                    # App entry point
├── public/
│   └── robots.txt
└── package.json
```

### Data Flow

```
User Interaction
    ↓
React Components
    ↓
Geolocation Library (geolocation.ts)
    ↓
LocalStorage (Browser)

Map Interaction
    ↓
Mapbox GL JS
    ↓
Tile Servers (Mapbox, OpenWeatherMap)

Satellite Data Request
    ↓
satelliteData.ts
    ↓
Simulated API (Future: Copernicus API)
    ↓
Heatmap Canvas Generation
    ↓
Mapbox Layer Overlay
```

### Key Technologies

- **State Management**: React useState, useEffect, useRef
- **Storage**: Browser LocalStorage (no backend required)
- **Geolocation**: Browser Geolocation API + Haversine calculations
- **Mapping**: Mapbox GL JS with custom overlays
- **Data Visualization**: Canvas API for heatmaps, mini-charts
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation

---

## 🔒 Privacy & Data

- **100% Local**: All data stored in browser LocalStorage
- **No Cloud**: No backend servers or databases
- **No Tracking**: No analytics or third-party tracking
- **No Accounts**: No user registration required
- **Offline Capable**: Core features work offline (cached map tiles)

---

## 🚧 Future Enhancements

- [ ] Real Copernicus satellite data integration
- [ ] Offline map tile caching
- [ ] Photo attachments to notes
- [ ] Export data to GeoJSON/KML
- [ ] Share locations via URL
- [ ] Advanced filtering and search
- [ ] Historical data comparison views
- [ ] Custom location icons
- [ ] Mission mode for organized field work
- [ ] Multi-language support

---

## 📄 License

This project is built with [Lovable](https://lovable.dev) and is open source.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, Mapbox, and Lovable**
