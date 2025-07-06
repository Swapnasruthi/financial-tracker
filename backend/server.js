const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-finance-visualizer';
let db;

async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Routes

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await db.collection('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray();
    res.json(transactions);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, date, description, type, category } = req.body;
    
    // Validation
    if (!amount || !date || !description || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    const transactionData = {
      amount: Number(amount),
      date,
      description,
      type,
      category: category || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('transactions').insertOne(transactionData);
    res.json({ ...transactionData, _id: result.insertedId });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT update transaction
app.put('/api/transactions', async (req, res) => {
  try {
    const { _id, ...update } = req.body;
    
    if (!_id) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }
    
    // Ensure category is handled properly
    const updateData = {
      ...update,
      category: update.category || undefined,
      updatedAt: new Date()
    };
    
    const result = await db.collection('transactions').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ ...updateData, _id });
  } catch (error) {
    console.error('PUT /api/transactions error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE transaction
app.delete('/api/transactions', async (req, res) => {
  try {
    const { _id } = req.body;
    
    if (!_id) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }
    
    const result = await db.collection('transactions').deleteOne({ 
      _id: new ObjectId(_id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ _id });
  } catch (error) {
    console.error('DELETE /api/transactions error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Personal Finance Backend is running' });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer(); 