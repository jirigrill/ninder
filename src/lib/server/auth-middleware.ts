import jwt from 'jsonwebtoken';
import type { RequestEvent } from '@sveltejs/kit';

const JWT_SECRET = 'your-jwt-secret-key-change-in-production'; // TODO: Move to environment variable

export interface AuthenticatedUser {
  username: string;
  userId: number;
}

export function authenticate(event: RequestEvent): AuthenticatedUser | null {
  const authHeader = event.request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; userId: number };
    return {
      username: decoded.username,
      userId: decoded.userId
    };
  } catch {
    return null;
  }
}

export function requireAuth(event: RequestEvent): AuthenticatedUser {
  const user = authenticate(event);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}