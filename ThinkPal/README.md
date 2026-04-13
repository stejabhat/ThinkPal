# Mini You AI

A cinematic, futuristic Mind Operating System that simulates your past, present, and future selves using local AI.

## What is This?

Mini You AI is a personal AI system that acts as a "digital brain" - it simulates your mind through three distinct personas:

- **Present Self**: Your current balanced personality
- **Past Self**: Earlier emotional, impulsive version
- **Future Self**: Disciplined, strategic future version
- **Council**: Debate mode where Past and Future selves argue, then Present self synthesizes

It feels like "a brain simulation engine, not a chatbot" - a cinematic UI that makes you feel like you're interacting with your own mind in real-time.

## Tech Stack

### Backend
- **FastAPI** - Python web framework
- **Ollama** - Local LLM (Mistral/LLaMA 3)
- **ChromaDB** - Vector database for memory storage
- **sentence-transformers** - For generating embeddings

### Frontend
- **Next.js 16** - React framework
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Features

### Core Features
- Chat with Real/Past/Future self modes
- Debate mode (Past vs Future + synthesis)
- Persistent memory system with embeddings
- Memory search and retrieval

### UI Features (X-Factors)
- **Thought Core**: Neural orb that pulses when AI is thinking
- **Mind Sync**: Live neural network visualization
- **Brain State**: Real-time mental state waveform
- **Thought Stream**: Live system thought log
- **Personality Scope**: Trait analysis with oscilloscope
- **Memory DNA**: DNA helix visualization of memories

### Design
- Old Money / Royal aesthetic
- Antique gold and burgundy color scheme
- Playfair Display serif typography
- Glassmorphism panels
- Cinematic animations

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Ollama installed

### 1. Clone the Project

### 2. Backend Setup

```bash
cd mini_you_ai/backend

# Create virtual environment
python3 -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd mini_you_ai/frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start Ollama

```bash
# Start Ollama server
ollama serve

# Pull a model (if not already done)
ollama pull mistral
```

### 2. Start Backend

```bash
cd mini_you_ai/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Start Frontend

```bash
cd mini_you_ai/frontend
npm run dev
```

### 4. Open Browser

Navigate to: `http://localhost:3000`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chat` | POST | Chat with AI (mode: real/past/future) |
| `/debate` | POST | Start debate between Past and Future |
| `/memory/add` | POST | Add a new memory |
| `/memory/search` | POST | Search memories |
| `/memory/all` | GET | Get all memories |
| `/health` | GET | Health check |

### API Request Examples

```bash
# Chat with Present Self
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What do you think about success?", "mode": "real"}'

# Start Debate
curl -X POST http://localhost:8000/debate \
  -H "Content-Type: application/json" \
  -d '{"message": "Should I take the job offer?"}'

# Add Memory
curl -X POST http://localhost:8000/memory/add \
  -H "Content-Type: application/json" \
  -d '{"text": "I love reading philosophy", "type": "habit"}'
```

## Project Structure

```
mini_you_ai/
├── backend/
│   ├── main.py           # FastAPI endpoints
│   ├── config.py         # Settings
│   ├── memory.py        # ChromaDB memory store
│   ├── llm.py            # Ollama integration
│   ├── .env              # Environment config
│   └── requirements.txt  # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx      # Main page
    │   │   ├── layout.tsx    # Root layout
    │   │   └── globals.css   # Royal theme styles
    │   ├── components/
    │   │   ├── ThoughtCore.tsx
    │   │   ├── MemoryStream.tsx
    │   │   ├── PersonalityEngine.tsx
    │   │   ├── DebateMode.tsx
    │   │   └── ... (more components)
    │   └── lib/
    │       └── api.ts        # API client
    └── package.json
```

## Configuration

### Backend (.env)
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
EMBEDDING_MODEL=all-MiniLM-L6-v2
CHROMA_PERSIST_DIRECTORY=./chroma_db
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Troubleshooting

### Ollama not responding
- Ensure Ollama is running: `ollama serve`
- Pull the model: `ollama pull mistral`
- Check API: `curl http://localhost:11434/api/tags`

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check .env.local has correct API URL

### Slow responses
- LLM inference on local hardware can be slow
- Consider using a faster model or GPU


---

*Mini You AI - Your Digital Mind, Simulated Locally*
