import { browser } from '$app/environment'

export interface SimpleUser {
  username: string
  id?: number
}

export class SimpleAuthService {
  private storageKey = 'ninder-username'
  
  // Get current user from localStorage
  getCurrentUser(): SimpleUser | null {
    if (!browser) return null
    
    const username = localStorage.getItem(this.storageKey)
    if (!username) return null
    
    return { username }
  }
  
  // Set username and store in localStorage
  async setUsername(username: string): Promise<{ success: boolean; error?: string; user?: SimpleUser }> {
    if (!username || username.trim().length === 0) {
      return { success: false, error: 'Username is required' }
    }
    
    // Clean username: only alphanumeric and basic chars
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    
    if (cleanUsername.length < 2) {
      return { success: false, error: 'Username must be at least 2 characters' }
    }
    
    if (cleanUsername.length > 20) {
      return { success: false, error: 'Username must be less than 20 characters' }
    }
    
    try {
      // Check if username exists and create if needed
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to create user' }
      }
      
      // Store in localStorage
      if (browser) {
        localStorage.setItem(this.storageKey, cleanUsername)
      }
      
      return { 
        success: true, 
        user: { username: cleanUsername, id: result.id }
      }
      
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }
  
  // Clear current user
  logout(): void {
    if (browser) {
      localStorage.removeItem(this.storageKey)
    }
  }
  
  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const simpleAuth = new SimpleAuthService()