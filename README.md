# Air Quality Monitoring System

A real-time air quality monitoring application with live updates, historical data tracking, and alert management. Built with Next.js 16, Express.js, MongoDB, and Socket.io.

## Features

- **Real-time AQI Updates**: Live air quality data with Socket.io updates every 30 minutes
- **AQI Gauge Visualization**: Interactive gauge showing current air quality index
- **Pollutant Tracking**: Monitor individual pollutants (PM2.5, PM10, CO, NO₂, SO₂, O₃)
- **Weather Integration**: View current weather conditions alongside air quality data
- **Historical Data**: 48-hour trend charts and daily statistics
- **Alerts System**: Get notified when air quality levels change
- **Multiple Cities**: Monitor air quality across 8+ major cities
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **Dark Mode Support**: Built-in theme support using Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4.2
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Real-time**: Socket.io-client
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Scheduling**: node-cron
- **API Data**: World Air Quality Index (WAQI) API

## Project Structure

```
project-root/
├── /app                          # Next.js frontend (App Router)
│   ├── page.tsx                 # Dashboard page
│   ├── /history                 # History page
│   ├── /alerts                  # Alerts page
│   ├── layout.tsx               # Root layout with AirQualityProvider
│   └── globals.css              # Global styles
├── /components                   # Reusable React components
│   ├── Header.tsx               # Navigation header
│   ├── AQIGauge.tsx             # AQI gauge visualization
│   ├── PollutantsCard.tsx       # Pollutants display
│   ├── WeatherCard.tsx          # Weather conditions
│   ├── AQIChart.tsx             # Historical charts
│   └── /ui                      # shadcn/ui components
├── /context                      # React Context
│   └── AirQualityContext.tsx    # Global air quality state
├── /hooks                        # Custom React hooks
│   └── use-socket.ts            # Socket.io hook
├── /backend                      # Express.js backend
│   ├── server.js                # Main server file
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   ├── /config                  # Configuration files
│   │   └── database.js          # MongoDB connection
│   ├── /models                  # Mongoose schemas
│   │   ├── AirData.js           # Air quality data schema
│   │   └── Alert.js             # Alert schema
│   ├── /routes                  # API routes
│   │   └── airRoutes.js         # Air quality endpoints
│   ├── /controllers             # Business logic
│   │   └── airController.js     # Air quality operations
│   └── /services                # Services
│       └── cronService.js       # Scheduled tasks
├── package.json                  # Frontend dependencies
├── .env.example                 # Frontend environment template
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.mjs              # Next.js configuration
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud like MongoDB Atlas)
- WAQI API Key (get free key from https://waqi.info/api/token)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MONGODB_URI`: Your MongoDB connection string
   - `WAQI_API_KEY`: Your WAQI API key
   - `CITIES`: Comma-separated list of cities to monitor
   - `PORT`: Server port (default: 3001)
   - `SOCKET_IO_CORS_ORIGIN`: Frontend URL (default: http://localhost:3000)

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   The server will:
   - Connect to MongoDB
   - Start listening on the configured port
   - Begin fetching air quality data immediately
   - Run periodic updates every 30 minutes

### Frontend Setup

1. **Navigate to frontend directory (root)**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and ensure:
   - `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001)
   - `NEXT_PUBLIC_SOCKET_URL`: Backend Socket.io URL (default: http://localhost:3001)

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## API Endpoints

### Air Quality Data

- **GET `/api/air/current/:city`** - Get latest AQI data for a city
  ```json
  {
    "city": "Beijing",
    "aqi": 75,
    "level": "Moderate",
    "pollutants": { "pm25": 45.5, "pm10": 62.3, ... },
    "weather": { "temperature": 22, "humidity": 65, ... },
    "timestamp": "2024-01-15T10:30:00Z"
  }
  ```

- **GET `/api/air/history/:city?limit=48`** - Get historical data
  - Parameters: `limit` (max 168, default 48)

- **GET `/api/air/stats/:city`** - Get 24-hour statistics
  - Returns average, min, and max AQI values

- **GET `/api/air/alerts?limit=50`** - Get all alerts
  - Parameters: `limit` (max 500, default 50)

- **PATCH `/api/air/alerts/:id/seen`** - Mark alert as seen

- **POST `/api/air/refresh`** - Manual data refresh (admin)

## Socket.io Events

### Client Events
- **`connection`** - Emitted when client connects
  - Data: `{ connected: true, socketId: string, timestamp: Date }`

### Server Events
- **`air-update`** - Real-time AQI update for a city
- **`new-alert`** - New air quality alert triggered
- **`connection-status`** - Server connection status

## Configuration

### Available Cities

The system can monitor any city supported by the WAQI API. Default configured cities:
- Beijing
- Delhi
- New York
- London
- Tokyo
- Paris
- Singapore
- Sydney

To add more cities, update the `CITIES` environment variable in the backend `.env`:
```
CITIES=Beijing,Delhi,New York,London,Tokyo,Custom City
```

### Update Frequency

Default: Every 30 minutes (configurable via cron expression in `cronService.js`)

To change:
```javascript
// In backend/services/cronService.js
startCronJob(cities, '*/15 * * * *'); // Every 15 minutes
```

Cron expressions follow standard format: `minute hour day month weekday`

## Data Retention

- Historical data is automatically kept for 90 days
- Alerts are stored indefinitely
- TTL index on AirData collection handles cleanup

## Error Handling

- API errors return appropriate HTTP status codes (400, 404, 500)
- Socket connection errors are automatically retried
- Client-side errors display user-friendly toast notifications
- Server logs include detailed error information

## Development

### Running Both Services

In development, you'll need two terminal windows:

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```

**Terminal 2: Frontend**
```bash
npm run dev
```

### Building for Production

**Frontend**
```bash
npm run build
npm start
```

**Backend**
```bash
cd backend
node server.js
```

## Database Schema

### AirData Collection
```javascript
{
  city: String,
  aqi: Number,
  level: String,
  dominantPollutant: String,
  pollutants: {
    pm25: Number,
    pm10: Number,
    co: Number,
    no2: Number,
    so2: Number,
    o3: Number
  },
  weather: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    windDirection: Number,
    pressure: Number
  },
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Alert Collection
```javascript
{
  city: String,
  aqi: Number,
  level: String,
  message: String,
  seen: Boolean,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
   - `NEXT_PUBLIC_SOCKET_URL`: Your backend Socket.io URL
4. Deploy

### Heroku / Railway / Render (Backend)

1. Create MongoDB instance on MongoDB Atlas
2. Deploy backend service
3. Set environment variables:
   - `MONGODB_URI`
   - `WAQI_API_KEY`
   - `CITIES`
   - `SOCKET_IO_CORS_ORIGIN`: Your frontend Vercel URL

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB URI is correct and accessible
- Check that `SOCKET_IO_CORS_ORIGIN` matches your frontend URL
- Verify WAQI_API_KEY is valid

### Real-time Updates Not Working
- Check browser DevTools for Socket.io connection errors
- Verify backend is running on the correct port
- Check `NEXT_PUBLIC_SOCKET_URL` in frontend env

### No Data Displayed
- Backend may still be fetching initial data
- Check MongoDB connection and WAQI API key
- Wait 30 seconds for first cron job to run

### WAQI API Rate Limiting
- Free tier has rate limits
- Consider implementing request caching

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in browser console and server logs
3. Verify all environment variables are set correctly

## Future Enhancements

- [ ] User authentication for personalized alerts
- [ ] Email/SMS notifications for critical alerts
- [ ] Air quality forecasting
- [ ] Comparison between cities
- [ ] Custom alert thresholds
- [ ] Data export functionality
- [ ] API rate limiting and authentication
- [ ] Caching layer with Redis
