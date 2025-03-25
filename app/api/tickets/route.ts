import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db-connection';

// GET /api/tickets - Get all tickets
export async function GET(request: NextRequest) {
  try {
    const tickets = await db.query(
      'SELECT * FROM tickets ORDER BY createdAt DESC'
    );
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate ticket ID (e.g., TICKET-1001)
    const countResult = await db.query('SELECT COUNT(*) as count FROM tickets');
    const count = (countResult as any[])[0].count;
    const ticketId = `TICKET-${1001 + count}`;
    
    // Insert the ticket
    const sql = `
      INSERT INTO tickets (
        id, title, description, status, priority, 
        department, createdBy, assignedTo, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      ticketId,
      data.title,
      data.description,
      data.status || 'open',
      data.priority || 'medium',
      data.department,
      data.createdBy,
      data.assignedTo || null,
      // createdAt and updatedAt are handled by NOW()
    ];
    
    await db.insert(sql, params);
    
    // Return the created ticket
    const ticket = await db.getOne('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
