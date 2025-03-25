import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db-connection';

// GET /api/tickets/[id] - Get a specific ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await db.getOne(
      'SELECT * FROM tickets WHERE id = ?',
      [params.id]
    );
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(ticket);
  } catch (error) {
    console.error(`Error fetching ticket ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/tickets/[id] - Update a ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Check if ticket exists
    const ticket = await db.getOne(
      'SELECT * FROM tickets WHERE id = ?',
      [params.id]
    );
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }
    
    // Update the ticket
    const sql = `
      UPDATE tickets SET
        title = ?,
        description = ?,
        status = ?,
        priority = ?,
        department = ?,
        assignedTo = ?,
        updatedAt = NOW()
      WHERE id = ?
    `;
    
    const sqlParams = [
      data.title,
      data.description,
      data.status,
      data.priority,
      data.department,
      data.assignedTo,
      params.id
    ];
    
    await db.update(sql, sqlParams);
    
    // Return the updated ticket
    const updatedTicket = await db.getOne(
      'SELECT * FROM tickets WHERE id = ?',
      [params.id]
    );
    
    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error(`Error updating ticket ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets/[id] - Delete a ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if ticket exists
    const ticket = await db.getOne(
      'SELECT * FROM tickets WHERE id = ?',
      [params.id]
    );
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }
    
    // Delete the ticket
    await db.remove('DELETE FROM tickets WHERE id = ?', [params.id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting ticket ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}
