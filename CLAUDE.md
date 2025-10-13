# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoCampaignNet is a React-based political campaign management platform specializing in data-driven voter targeting and analysis. The application provides interactive mapping tools, doorknocking coordination, and electoral data visualization for Republican campaigns in Missouri.

## Development Commands

### Running the Application
```bash
npm start        # Development server at http://localhost:3000
yarn start       # Alternative using yarn
```

### Building and Testing
```bash
npm run build    # Production build to build/ folder
npm test         # Run test suite in watch mode
```

### Deployment
```bash
npm run predeploy    # Runs build before deployment
npm run deploy       # Deploys to GitHub Pages
```

Note: This project uses CRACO (Create React App Configuration Override) instead of standard create-react-app scripts. All commands use `craco` under the hood (e.g., `craco start`, `craco build`).

## Architecture Overview

### Core Application Structure

The application follows a feature-based architecture with three main functional areas:

1. **Interactive Mapping Client** (`src/mapping/`)
   - Electoral district visualization with precinct-level data
   - Shapefile importing and rendering (supports .zip archives containing shapefiles)
   - Partisan advantage calculations using Turf.js for geospatial operations
   - Leaflet-based mapping with clustering, heatmaps, and drawing tools
   - Entry point: `MappingApp.jsx` → `MapContainer.jsx` → `InteractiveMapper.jsx`

2. **Doorknocking Client** (`src/doorknocking/`)
   - Field operations and canvassing route management
   - Uses IndexedDB for local data persistence (`utils/IndexedDBUtils.jsx`)
   - Excel file imports for plotting voter data on maps
   - Entry point: `DoorknockingApp.jsx` → `KnockingContainer.jsx` → `KnockingMap.jsx`

3. **Public Portfolio Site** (`src/pages/Homescreen.jsx`)
   - Campaign showcase with metrics (1.5M+ texts sent, 7.5M+ social impressions)
   - Interactive Folium map embedded via iframe showing Missouri DMA ad spending
   - Client testimonials and past campaign work

### State Management Pattern

The application uses custom hooks for feature-specific state management instead of Redux or Context API:

- **Mapping State**: `useMapDataHook.jsx` and `usePrecinctDataHook.jsx`
  - Manages map points, party affiliations, shapefile data, and electoral results
  - Handles precinct shapes, electoral field mappings, and demographic selections

- **Doorknocking State**: `useKnockingDataHook.jsx` and `useKnockingFileDataHook.jsx`
  - Manages markers, routes, and file uploads for canvassing operations

This pattern keeps related state together and makes it easy to understand data flow for each feature.

### Authentication & Session Management

Firebase Authentication is integrated throughout protected routes:
- Firebase config: `src/auth/firebase.jsx` (uses environment variables for API keys)
- Protected routes: `src/auth/protectedRoute.jsx`
- Session validation: Uses Firebase Functions (`validateSession`) called on component mount
- Device tracking: Collects IP, browser, and device info via UAParser for session logging

All authenticated pages (MappingApp, DoorknockingApp, EventCoordination, CampaignTools) check session validity via Firebase Functions before rendering content.

### Key Data Processing Workflows

**Electoral Data Analysis**:
1. Import precinct shapefiles (.zip with .shp, .dbf, .shx files)
2. Import district shapefiles
3. Map electoral data fields via modal (`PrecinctDataModal.jsx`)
4. Calculate partisan advantage by intersecting precincts with districts (`calculateElectionMargins.jsx`)
5. Render color-coded districts showing Republican/Democratic margins
6. Uses Turf.js for polygon intersection and area calculations

**Voter Data Import**:
1. Upload Excel/CSV file via `ExcelColumnSelector.jsx` modal
2. Map columns (latitude, longitude, name, optional party)
3. Process with `ExcelProcessingUtils.jsx`
4. Plot as markers on Leaflet map with party color coding
5. Enable drawing tools for selecting voters within polygons

**Shapefile Processing**:
- All shapefiles processed by `ExtractShapes.jsx` using shpjs library
- Converts shapefiles to GeoJSON for Leaflet rendering
- Handles both precinct-level and district-level geometries

### Critical Libraries

- **Leaflet**: Core mapping (`leaflet`, `react-leaflet`)
  - `leaflet-draw`: Drawing/editing shapes
  - `leaflet.heat`: Heatmap visualization
  - `leaflet.markercluster`: Marker clustering
  - `leaflet.fullscreen`: Fullscreen control
- **Turf.js**: Geospatial calculations (intersections, centroids, area)
- **shpjs**: Shapefile parsing
- **XLSX**: Excel file reading/writing
- **Ant Design**: UI component library
- **Firebase**: Authentication, Firestore database, Functions
- **Framer Motion**: Animations (used in homepage)

## Important Implementation Details

### CRACO Configuration
The project uses CRACO to provide Buffer polyfills for the browser (see `craco.config.js`). This is required for shapefile processing libraries. Do not remove this configuration.

### Map Coordinate System
All geographic data uses WGS84 (EPSG:4326) coordinate system with [latitude, longitude] ordering for Leaflet, but GeoJSON uses [longitude, latitude]. The code handles this conversion when processing shapefiles.

### Component-Scoped CSS Modules
Most components use CSS Modules (`.module.css` files) for scoped styling. This prevents style conflicts. Use `styles.className` syntax when referencing these styles.

### Firebase Environment Variables
Required in `.env` file:
- `REACT_APP_FIREBASE_API_KEY`
- Other Firebase config values are hardcoded in `firebase.jsx` but API key must be in env

### Precinct Data Processing Performance
Calculating electoral results across many precincts is computationally intensive. The `calculateElectionMargins.jsx` file includes progress callbacks to update UI during long-running calculations. This prevents the appearance of the app freezing.

## File Organization Conventions

- `/src/pages/`: Top-level route components
- `/src/components/`: Reusable components (Header, Footer, Sidebar)
- `/src/mapping/`: Mapping feature with modals, hooks, and utils subdirectories
- `/src/doorknocking/`: Doorknocking feature with same subdirectory structure
- `/src/auth/`: Authentication components and Firebase config
- `/src/utils/`: Shared utilities (Excel processing, shapefile extraction)
- `/src/modals/`: Shared modal components
- `/src/images/`: Static assets (logos, maps, photos)

## Testing Considerations

When testing mapping features, use small datasets initially. Processing hundreds of precincts can take 30+ seconds. Test data should be in proper WGS84 coordinates for Missouri (approximately 36-40°N, 89-95°W).

## Deployment

The app is configured to deploy to GitHub Pages via `gh-pages` package. The `homepage` field in package.json points to `https://bernoullitechnologies.net`. Deployment runs the build process first, then pushes to the gh-pages branch.

Firebase Functions are deployed separately from the functions/ directory (see firebase.json).
