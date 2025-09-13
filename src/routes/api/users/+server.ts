import { json, type RequestHandler } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username } = await request.json()
    
    if (!username || typeof username !== 'string') {
      return json({ error: 'Username is required' }, { status: 400 })
    }
    
    // Clean username
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    
    if (cleanUsername.length < 2 || cleanUsername.length > 20) {
      return json({ error: 'Username must be 2-20 characters' }, { status: 400 })
    }
    
    // Try to find existing user first
    let user = await prisma.users.findUnique({
      where: { username: cleanUsername }
    })
    
    // Create user if doesn't exist
    if (!user) {
      user = await prisma.users.create({
        data: {
          username: cleanUsername,
          created_at: new Date(),
          last_seen: new Date()
        }
      })
    } else {
      // Update last seen
      user = await prisma.users.update({
        where: { username: cleanUsername },
        data: { last_seen: new Date() }
      })
    }
    
    return json({
      id: user.id,
      username: user.username,
      created_at: user.created_at
    })
    
  } catch (error) {
    console.error('User creation error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}