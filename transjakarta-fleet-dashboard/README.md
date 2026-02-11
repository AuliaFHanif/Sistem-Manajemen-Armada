# MBTA Fleet Monitor Dashboard

A real-time fleet monitoring dashboard for tracking MBTA (Massachusetts Bay Transportation Authority) vehicles. This application provides live vehicle tracking, route filtering, and interactive map visualization.

## ✨ Features

- **Real-time Vehicle Tracking**: Auto-refreshes every 20 seconds to display current vehicle positions and status
- **Dual View Modes**: Toggle between list view and interactive map view
- **Route Filtering**: Filter vehicles by specific transit routes/services
- **Live Status Updates**: Shows current vehicle position, destination, and occupancy levels
- **Interactive Map**:
  - Color-coded markers matching route colors
  - Auto-zoom to fit filtered vehicles
  - Click markers to zoom in for details
  - Recenter button to reset view
- **Staleness Indicator**: Visual indicators for data freshness (live vs. stale data)
- **Responsive Design**: Fully responsive UI that works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.x
- **Build Tool**: Vite 7.3.x
- **Styling**: TailwindCSS 4.1.x
- **Mapping Library**: Leaflet 1.9.4 + React-Leaflet 5.0.0
- **Linting**: ESLint 9.39.x with TypeScript ESLint

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. Clone the repository and navigate to the project directory:

```bash
cd transjakarta-fleet-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your MBTA API configuration:

```env
VITE_MBTA_API_URL=https://api-v3.mbta.com
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
transjakarta-fleet-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── FleetMap.tsx    # Interactive map component
│   │   └── VehicleCard.tsx # Vehicle information card
│   ├── hooks/              # Custom React hooks
│   │   ├── useVehicles.ts  # Vehicle data fetching hook
│   │   └── useRoutes.ts    # Routes data fetching hook
│   ├── services/           # API services
│   │   └── api.ts          # MBTA API service
│   ├── types/              # TypeScript type definitions
│   │   └── mbta.ts         # MBTA API types
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## 🎯 Key Components

### App.tsx

Main application component that orchestrates the dashboard, handles view toggling, and route filtering.

### VehicleCard.tsx

Displays individual vehicle information including:

- Route details with color-coded badges
- Current position and status
- Next destination
- Occupancy levels
- Last update timestamp

### FleetMap.tsx

Interactive Leaflet map featuring:

- Custom color-coded markers for each route
- Auto-bounds adjustment based on filtered vehicles
- Recenter functionality
- Popup information on marker click

### useVehicles Hook

Custom hook that:

- Fetches vehicle data from MBTA API
- Auto-refreshes every 20 seconds
- Manages loading and error states
- Includes route, trip, and stop information

### useRoutes Hook

Fetches and manages route data for the filter dropdown.

## 🔧 Configuration

### Environment Variables

- `VITE_MBTA_API_URL`: Base URL for the MBTA API (default: `https://api-v3.mbta.com`)

### API Integration

The application uses the MBTA V3 API to fetch:

- Vehicle positions and status
- Route information
- Trip details (destinations)
- Stop information

## 🎨 UI/UX Features

- **Color Scheme**: Professional blue theme (`#003366`) with route-specific accent colors
- **Animations**: Smooth transitions, pulsing live indicators, hover effects
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation support
- **Performance**: Optimized re-renders with React hooks and memoization

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Sistem Manajemen Armada (Fleet Management System) initiative.

## 🙏 Acknowledgments

- MBTA for providing the public transit API
- OpenStreetMap contributors for map tiles
- Leaflet and React-Leaflet teams for the mapping library

---

© 2026 Fleet Dashboard — TransJakarta
