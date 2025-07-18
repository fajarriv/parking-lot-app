# Parking Lot Management System

## Requirements

- **Ruby**: 3.4.4 (see `/server/.ruby-version`)
- **Node.js**: 20 or higher
- **npm**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd parking-lot-app
```

### 2. Backend Setup (Server)

```bash
# Navigate to server directory
cd server

# Install Ruby dependencies
bundle install

# Setup database
rails db:create
rails db:migrate

# Start the Rails server
rails server
```

The Rails API will be available at: **http://localhost:3000**

### 3. Frontend Setup (Client)

```bash
# Navigate to client directory (from project root)
cd client

# Install Node.js dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start the development server
npm run dev
```

The React application will be available at: **http://localhost:5173**

## ⚙️ Environment Configuration

### Server Configuration

The Rails server runs on port **3000** by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=4000 rails server
```

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Important**: The client requires this environment variable to connect to the Rails API.

## Running the Application

1. **Start the Backend** (Terminal 1):

   ```bash
   cd server
   rails server
   ```

   Server will run on: http://localhost:3000

2. **Start the Frontend** (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```
   Client will run on: http://localhost:5173

## API Endpoints

### Parking Map

- `GET /api/v1/parking-map` - Get current parking map state
- `POST /api/v1/parking-map` - Create new parking map

### Entry Points

- `GET /api/v1/entry-points` - Get all entry points
- `POST /api/v1/entry-points` - Add new entry point

### Vehicle Management

- `POST /api/v1/parking-management/park` - Park a vehicle
- `PATCH /api/v1/parking-management/unpark` - Unpark a vehicle
- `GET /api/v1/parking-management/vehicle/:plate_number` - Get vehicle status

## Usage

### Initial Setup

1. Access the application at http://localhost:5173
2. Go to "Manage" tab to create a parking map (e.g., 5x8 grid), 3 entry points created by default
3. Switch to "Map" tab to start parking vehicles

### Parking Operations

- **Park Vehicle**: Click "Park Vehicle" button, enter plate number, select vehicle type and entry point
- **Unpark Vehicle**: Click "Unpark Vehicle" button, enter plate number
- **Parking Lot Statistics**: Stats are displayed in the side panel

**Important Note**: This application uses simulated time for demonstration purposes. 3 seconds in real-time equals 1 hour in the parking system.

## 🔧 Development Commands

### Client Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Server Commands

```bash
rails server         # Start Rails server
rails console        # Open Rails console
rails db:migrate     # Run database migrations
rails db:seed        # Seed database with sample data
bundle install       # Install Ruby gems
```

### Default Port Information

- **Rails API Server**: http://localhost:3000
- **React Development Server**: http://localhost:5173
- **API Base URL**: http://localhost:3000/api/v1
