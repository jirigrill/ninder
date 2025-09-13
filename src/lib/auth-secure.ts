export interface SecureUser {
  username: string;
  token: string;
}

const TOKEN_KEY = 'ninder-auth-token';

class SecureAuthService {
  getCurrentUser(): SecureUser | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    try {
      // Parse JWT payload without verification (verification happens server-side)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      
      return {
        username: payload.username,
        token: token
      };
    } catch {
      // Invalid token, remove it
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  async register(username: string, password: string): Promise<{ success: boolean; error?: string; user?: SecureUser }> {
    if (!username.trim() || !password.trim()) {
      return { success: false, error: 'Username and password are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanUsername.length < 2 || cleanUsername.length > 20) {
      return { success: false, error: 'Username must be 2-20 characters (letters, numbers, _, -)' };
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      // Store token
      localStorage.setItem(TOKEN_KEY, data.token);

      return {
        success: true,
        user: { username: cleanUsername, token: data.token }
      };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: SecureUser }> {
    if (!username.trim() || !password.trim()) {
      return { success: false, error: 'Username and password are required' };
    }

    const cleanUsername = username.trim().toLowerCase();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store token
      localStorage.setItem(TOKEN_KEY, data.token);

      return {
        success: true,
        user: { username: cleanUsername, token: data.token }
      };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getAuthHeader(): { Authorization: string } | {} {
    const user = this.getCurrentUser();
    return user ? { Authorization: `Bearer ${user.token}` } : {};
  }
}

export const secureAuth = new SecureAuthService();