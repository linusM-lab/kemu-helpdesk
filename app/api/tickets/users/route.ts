import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db-connection';
import bcrypt from 'bcryptjs';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const users = await db.query(
      'SELECT id, name, email, role, department, registrationNumber, active FROM users'
    );
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if email already exists
    const existingUser = await db.getOne(
      'SELECT * FROM users WHERE email = ?',
      [data.email]
    );
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Insert the user
    const sql = `
      INSERT INTO users (
        name, email, password, role, department, 
        registrationNumber, active, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      data.name,
      data.email,
      hashedPassword,
      data.role || 'user',
      data.department || null,
      data.registrationNumber || null,
      data.active !== undefined ? data.active : true,
    ];
    
    const userId = await db.insert(sql, params);
    
    // Return the created user (without password)
    const user = await db.getOne(
      'SELECT id, name, email, role, department, registrationNumber, active FROM users WHERE id = ?',
      [userId]
    );
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
