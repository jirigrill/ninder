import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '$lib/server/PrismaContext';

const JWT_SECRET = 'your-jwt-secret-key-change-in-production'; // TODO: Move to environment variable

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Find user
    const user = await prisma.users.findUnique({
      where: { username: cleanUsername }
    });

    if (!user) {
      return json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Update last seen
    await prisma.users.update({
      where: { id: user.id },
      data: { last_seen: new Date() }
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
    console.error('Login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};