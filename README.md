# Personal Finance Visualizer

A modern web application for tracking and visualizing personal finances built with Next.js frontend and Express.js backend.


backend is live on render -- https://financial-tracker-0hqo.onrender.com
frontend is live on vercel -- https://financial-tracker-cwuq.vercel.app/


## ✨ Features

- **Add/Edit/Delete Transactions**: Full CRUD operations for financial transactions
- **Predefined Categories**: Rich set of predefined categories with icons for both expenses and income
- **Category Filtering**: Filter transactions by category to focus on specific spending areas
- **Category-based Analytics**: Visual breakdown of spending by category with pie charts
- **Transaction List View**: Clean, responsive list of all transactions with filtering
- **Monthly Expenses Chart**: Interactive bar chart showing monthly expense trends using Recharts
- **Income vs Expenses Chart**: Pie chart showing overall financial overview
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error states and validation
- **Real-time Updates**: Immediate UI updates when adding/deleting transactions
- **Form Validation**: Client-side and server-side validation for all inputs
- **Statistics Cards**: Real-time totals for income, expenses, and balance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Database**: MongoDB
- **Styling**: Tailwind CSS with custom design system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database

### Quick Start (Recommended)

**Option 1: Start both servers together**
```bash
npm run dev:full
```

**Option 2: Use the provided scripts**
- Windows: Double-click `start-dev.bat` or run `.\start-dev.bat`
- PowerShell: Run `.\start-dev.ps1`

This will start both frontend and backend automatically.

### Manual Setup

#### Frontend Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Run the frontend development server:**
   ```bash
   npm run dev
   ```

The frontend will run on [http://localhost:3000](http://localhost:3000)

#### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/personal-finance-visualizer?retryWrites=true&w=majority
   PORT=5000
   ```

4. **Start the backend development server:**
   ```bash
   npm run dev
   ```

The backend will run on [http://localhost:5000](http://localhost:5000)

## 📊 Usage

### Adding Transactions
1. Click the "Add Transaction" button
2. Fill in the form:
   - **Amount**: Enter a positive number (e.g., 50.00)
   - **Date**: Select the transaction date
   - **Description**: Describe what the transaction was for
   - **Type**: Choose between "Expense" or "Income"
   - **Category**: Select from predefined categories (optional but recommended)
3. Click "Add Transaction" to save

### Categories
The app includes a comprehensive set of predefined categories:

**Expense Categories:**
- 🍽️ Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- 🏥 Healthcare
- 💡 Utilities
- 🏠 Housing
- 📚 Education
- ✈️ Travel
- 🛡️ Insurance
- 💰 Taxes
- 📝 Other Expense

**Income Categories:**
- 💼 Salary
- 💻 Freelance
- 📈 Investment
- 🏢 Business
- 🎁 Gift
- ↩️ Refund
- 📝 Other Income

### Managing Transactions
- **View**: All transactions are displayed in a clean list with category badges
- **Filter**: Use the category filter dropdown to view transactions by specific category
- **Edit**: Click the "Edit" button next to any transaction
- **Delete**: Click the "Delete" button next to any transaction
- **Charts**: Monthly expenses, income vs expenses, and category breakdown charts update automatically

### Features
- **Real-time Charts**: Charts update automatically when data changes
- **Statistics Cards**: See total income, expenses, and balance at a glance
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Clear error messages for validation issues
- **Loading States**: Smooth loading indicators

## 🔧 API Endpoints

The Express backend provides a complete REST API:

- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions` - Update an existing transaction
- `DELETE /api/transactions` - Delete a transaction
- `GET /health` - Health check endpoint

### Example API Usage

```javascript
// Add a transaction
const response = await fetch('http://localhost:5000/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 50.00,
    date: '2024-01-15',
    description: 'Groceries',
    type: 'expense'
  })
});
```

## 🎨 Customization

### Styling
The app uses Tailwind CSS with a custom design system. Colors and components can be customized in:
- `tailwind.config.js` - Design system configuration
- `app/globals.css` - Global styles and CSS variables

### Components
All UI components are built with shadcn/ui and located in `components/ui/`.

## 🚀 Deployment

### Frontend Deployment
The Next.js frontend can be deployed on platforms like:
- Vercel (Recommended)
- Netlify
- Railway
- DigitalOcean App Platform

### Backend Deployment
The Express backend can be deployed on platforms like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

Make sure to set up the MongoDB connection string and frontend URL in your environment variables.

## 🔒 Environment Variables

### Frontend (.env.local)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:5000 |

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 5000 |

## 📁 Project Structure

```
├── app/                    # Next.js frontend
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── backend/               # Express.js backend
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and API service
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your MongoDB connection
3. Ensure both frontend and backend are running
4. Check the backend logs for API errors
5. Try clearing your browser cache

---

**Built with ❤️ using Next.js, Express.js, React, and shadcn/ui**
