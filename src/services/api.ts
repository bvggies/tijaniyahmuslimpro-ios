// API Service for Tijaniyah Muslim Pro Web
// Uses the same backend as the mobile app

export const API_URL: string =
  process.env.REACT_APP_API_URL ||
  'https://tijaniyahmuslimproappreact-production-1e25.up.railway.app';

const TOKEN_STORAGE_KEY = 'tijaniyah_auth_token';

let accessToken: string | null = null;

// Load token from localStorage
export const loadStoredToken = async (): Promise<void> => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      accessToken = token;
    }
  } catch (error) {
    console.error('Error loading stored token:', error);
  }
};

// Save token to localStorage
export const setToken = async (token: string): Promise<void> => {
  try {
    accessToken = token;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Clear token from localStorage
export const clearToken = async (): Promise<void> => {
  try {
    accessToken = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// Get current token
export const getToken = (): string | null => {
  return accessToken;
};

// Initialize token on module load
loadStoredToken();

async function http(path: string, init: RequestInit = {}, retryCount = 0): Promise<any> {
  const maxRetries = 2;
  const retryDelay = 1000; // 1 second
  
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  
  console.log(`🌐 API Request: ${init.method || 'GET'} ${API_URL}${path}${retryCount > 0 ? ` (retry ${retryCount})` : ''}`);
  if (init.body) console.log('📤 Request body:', init.body);
  
  try {
    const res = await fetch(`${API_URL}${path}`, { ...init, headers });
    
    console.log(`📥 Response: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('❌ API Error:', text || `HTTP ${res.status}`);
      
      // Clear token on 401 errors
      if (res.status === 401) {
        console.log('🔐 Clearing token due to 401 error');
        accessToken = null;
        await clearToken();
      }
      
      // Retry on 502 errors (Railway intermittent issues)
      if (res.status === 502 && retryCount < maxRetries) {
        console.log(`🔄 Retrying in ${retryDelay}ms due to 502 error...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return http(path, init, retryCount + 1);
      }
      
      throw new Error(text || `HTTP ${res.status}`);
    }
    
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    return res.text();
  } catch (error: any) {
    // Retry on network errors
    if (retryCount < maxRetries && (error.message?.includes('fetch') || error.message?.includes('network'))) {
      console.log(`🔄 Retrying in ${retryDelay}ms due to network error...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return http(path, init, retryCount + 1);
    }
    throw error;
  }
}

export const api = {
  // Health
  health: () => http('/health'),
  
  // Test authentication
  testAuth: () => http('/posts?limit=1'),

  // Auth
  signup: (email: string, password: string, name?: string) =>
    http('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  login: async (email: string, password: string) => {
    const data = await http('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data?.accessToken) await setToken(data.accessToken);
    return data;
  },

  // Community
  listPosts: (limit = 20, cursor?: string) =>
    http(`/posts?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  createPost: (content: string, mediaUrls: string[] = []) =>
    http('/posts', { method: 'POST', body: JSON.stringify({ content, mediaUrls }) }),
  getPost: (id: string) => http(`/posts/${encodeURIComponent(id)}`),
  addComment: (id: string, content: string) =>
    http(`/posts/${encodeURIComponent(id)}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  likePost: (id: string) => http(`/posts/${encodeURIComponent(id)}/like`, { method: 'POST' }),
  unlikePost: (id: string) => http(`/posts/${encodeURIComponent(id)}/like`, { method: 'DELETE' }),

  // Journal
  listJournal: () => http('/journal'),
  createJournal: (title: string, content: string, tags: string[] = []) =>
    http('/journal', { method: 'POST', body: JSON.stringify({ title, content, tags }) }),
  updateJournal: (id: string, data: Partial<{ title: string; content: string; tags: string[] }>) =>
    http(`/journal/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteJournal: (id: string) => http(`/journal/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Chat
  getConversations: () => http('/chat/conversations'),
  getOrCreateConversation: (otherUserId: string) =>
    http('/chat/conversations', { method: 'POST', body: JSON.stringify({ otherUserId }) }),
  getMessages: (conversationId: string, limit = 50, cursor?: string) =>
    http(`/chat/conversations/${encodeURIComponent(conversationId)}/messages?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  sendMessage: (conversationId: string, content: string) =>
    http(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
};

