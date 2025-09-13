import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '$lib/server/PrismaContext';

const JWT_SECRET = 'your-jwt-secret-key-change-in-production'; // TODO: Move to environment variable
const SALT_ROUNDS = 12;

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanUsername.length < 2 || cleanUsername.length > 20) {
      return json({ error: 'Username must be 2-20 characters (letters, numbers, _, -)' }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.users.findUnique({
      where: { username: cleanUsername }
    });

    if (existingUser) {
      return json({ error: 'Username already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.users.create({
      data: {
        username: cleanUsername,
        password_hash: passwordHash,
        created_at: new Date(),
        last_seen: new Date()
      }
    });

    // Generate JWT token
    const token = jwt.sign({ username: cleanUsername, userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    return json({
      success: true,
      token,
      user: {
        username: cleanUsername
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};