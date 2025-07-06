# Personal Finance Visualizer

A modern web application for tracking and visualizing personal finances built with Next.js, React, and MongoDB.

## ✨ Features

- **Add/Edit/Delete Transactions**: Full CRUD operations for financial transactions
- **Transaction List View**: Clean, responsive list of all transactions with filtering
- **Monthly Expenses Chart**: Interactive bar chart showing monthly expense trends using Recharts
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error states and validation
- **Real-time Updates**: Immediate UI updates when adding/deleting transactions
- **Form Validation**: Client-side and server-side validation for all inputs

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Database**: MongoDB (with in-memory fallback for development)
- **Styling**: Tailwind CSS with custom design system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables (optional):**
   Create a `.env.local` file in the root:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```
   > Note: The app works without MongoDB using in-memory storage for development.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Usage

### Adding Transactions
1. Click the "Add Transaction" button
2. Fill in the form:
   - **Amount**: Enter a positive number (e.g., 50.00)
   - **Date**: Select the transaction date
   - **Description**: Describe what the transaction was for
   - **Type**: Choose between "Expense" or "Income"
3. Click "Add Transaction" to save

### Managing Transactions
- **View**: All transactions are displayed in a clean list
- **Delete**: Click the "Delete" button next to any transaction
- **Chart**: Monthly expenses are automatically calculated and displayed

### Features
- **Real-time Chart**: The monthly expenses chart updates automatically
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Clear error messages for validation issues
- **Loading States**: Smooth loading indicators

## 🔧 API Endpoints

The application includes a complete REST API:

- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions` - Update an existing transaction
- `DELETE /api/transactions` - Delete a transaction

### Example API Usage

```javascript
// Add a transaction
const response = await fetch('/api/transactions', {
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

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your MongoDB connection string as an environment variable
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | In-memory storage |

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
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
2. Verify your MongoDB connection (if using)
3. Ensure all dependencies are installed
4. Try clearing your browser cache

---

**Built with ❤️ using Next.js, React, and shadcn/ui**
