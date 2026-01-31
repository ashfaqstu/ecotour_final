<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Smart Eco Tour - Frontend

An AI-powered sustainable travel planning app that helps you explore the world responsibly.

## Features

- 🌍 Generate sustainable travel itineraries
- 🌱 Customizable sustainability preferences (carbon, community, biodiversity, overtourism)
- 👥 Group matching with like-minded eco-travelers
- 📊 Detailed sustainability scores and breakdowns

## Run Locally

**Prerequisites:** Node.js, Python 3.8+ (for backend)

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file with your configuration:
   ```bash
   cp .env.example .env.local
   ```
   
3. Edit `.env.local` and set your values:
   ```
   VITE_API_URL=http://localhost:8000
   API_KEY=your_gemini_api_key_here
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

### Backend Setup (Required for full functionality)

1. Navigate to the backend directory:
   ```bash
   cd ../smart-eco-tour-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or: source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Running Both Together

**Terminal 1 (Backend):**
```bash
cd smart-eco-tour-backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd ecotour
npm run dev
```

The frontend will automatically connect to the backend at `http://localhost:8000`. If the backend is unavailable, the app falls back to using the Gemini API directly.

## API Integration

The frontend connects to these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-itinerary` | POST | Generate sustainable travel itineraries |
| `/api/traveler-profile` | POST | Create/update traveler profile |
| `/api/find-group` | POST | Find matching travelers for group travel |
| `/api/travelers` | GET | List all registered travelers |
| `/api/sustainability-tips` | GET | Get sustainability tips |
| `/api/health` | GET | Health check endpoint |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `API_KEY` | Gemini API key for fallback AI | (required for fallback) |

