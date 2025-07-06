# Personal Finance Visualizer - Backend

Express.js backend server for the Personal Finance Visualizer application.

## Features

- RESTful API for transaction management (CRUD operations)
- MongoDB integration for data persistence
- CORS enabled for frontend communication
- Input validation and error handling
- Health check endpoint



backend is live on render -- https://financial-tracker-0hqo.onrender.com
frontend is live on vercel -- https://financial-tracker-cwuq.vercel.app/


## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/personal-finance-visualizer?retryWrites=true&w=majority
PORT=5000
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### GET /api/transactions
Get all transactions sorted by date (newest first)

### POST /api/transactions
Create a new transaction
```json
{
  "amount": 100.50,
  "date": "2024-01-15",
  "description": "Grocery shopping",
  "type": "expense"
}
```

### PUT /api/transactions
Update an existing transaction
```json
{
  "_id": "transaction_id",
  "amount": 150.00,
  "date": "2024-01-15",
  "description": "Updated description",
  "type": "expense"
}
```

### DELETE /api/transactions
Delete a transaction
```json
{
  "_id": "transaction_id"
}
```

### GET /health
Health check endpoint

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)

## Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon 