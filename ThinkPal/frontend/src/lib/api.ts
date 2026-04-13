const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatRequest {
  message: string;
  mode: 'real' | 'past' | 'future';
}

export interface ChatResponse {
  response: string;
  memories_used: Memory[];
}

export interface DebateRequest {
  message: string;
}

export interface DebateResponse {
  past_you: string;
  future_you: string;
  final_answer: string;
  memories_used: Memory[];
}

export interface Memory {
  id: string;
  text: string;
  type: 'habit' | 'thought' | 'event';
  timestamp: string;
  distance?: number;
}

export interface MemoryAddRequest {
  text: string;
  type: 'habit' | 'thought' | 'event';
}

export interface MemorySearchRequest {
  query: string;
}

export interface MemorySearchResponse {
  results: Memory[];
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 300000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function sendChat(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetchWithTimeout(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to send message');
  }
  
  return response.json();
}

export async function sendDebate(request: DebateRequest): Promise<DebateResponse> {
  const response = await fetchWithTimeout(`${API_BASE}/debate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to start debate');
  }
  
  return response.json();
}

export async function addMemory(request: MemoryAddRequest): Promise<{ status: string; memory: Memory }> {
  const response = await fetchWithTimeout(`${API_BASE}/memory/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add memory');
  }
  
  return response.json();
}

export async function searchMemories(request: MemorySearchRequest): Promise<MemorySearchResponse> {
  const response = await fetchWithTimeout(`${API_BASE}/memory/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to search memories');
  }
  
  return response.json();
}

export async function getAllMemories(): Promise<{ memories: Memory[] }> {
  const response = await fetchWithTimeout(`${API_BASE}/memory/all`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get memories');
  }
  
  return response.json();
}
