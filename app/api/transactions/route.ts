import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDB } from '@/lib/mongodb';
import { Transaction } from '@/types/transaction';

export async function GET() {
  try {
    const db = await getDB();
    const transactions = await db.collection('transactions').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDB();
    const data = await req.json();
    
    // Validate required fields
    if (!data.amount || !data.date || !data.description || !data.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate amount is a number
    if (isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }
    
    const transactionData = {
      ...data,
      amount: Number(data.amount),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('transactions').insertOne(transactionData);
    return NextResponse.json({ ...transactionData, _id: result.insertedId });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = await getDB();
    const data = await req.json();
    
    if (!data._id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }
    
    const { _id, ...update } = data;
    const updateData = {
      ...update,
      updatedAt: new Date()
    };
    
    // Handle both MongoDB ObjectId and in-memory string IDs
    const queryId = _id.startsWith('mem_') ? _id : new ObjectId(_id);
    
    const result = await db.collection('transactions').updateOne(
      { _id: queryId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json({ ...updateData, _id });
  } catch (error) {
    console.error('PUT /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = await getDB();
    const { _id } = await req.json();
    
    if (!_id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }
    
    // Handle both MongoDB ObjectId and in-memory string IDs
    const queryId = _id.startsWith('mem_') ? _id : new ObjectId(_id);
    
    const result = await db.collection('transactions').deleteOne({ _id: queryId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json({ _id });
  } catch (error) {
    console.error('DELETE /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 