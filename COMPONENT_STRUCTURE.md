# Personal Finance Visualizer - Component Structure

## 📁 Project Architecture

The application has been refactored into a modular component structure for better maintainability, readability, and developer experience.

## 🏗️ Directory Structure

```
├── app/
│   └── page.tsx                    # Main dashboard page (simplified)
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── category-selector.tsx
│   └── dashboard/                  # Dashboard-specific components
│       ├── index.ts               # Component exports
│       ├── StatsCards.tsx         # Statistics cards
│       ├── TransactionForm.tsx    # Add/edit transaction form
│       ├── TransactionList.tsx    # Transaction list with filtering
│       └── ChartsSection.tsx      # All charts and visualizations
├── lib/
│   ├── api.ts                     # API client functions
│   ├── categories.ts              # Category definitions and utilities
│   ├── hooks/
│   │   └── useTransactions.ts     # Custom hook for transaction management
│   └── utils/
│       └── dashboard-utils.ts     # Data processing utilities
└── types/
    └── transaction.ts             # TypeScript type definitions
```

## 🧩 Component Breakdown

### 1. **StatsCards Component** (`components/dashboard/StatsCards.tsx`)
**Purpose**: Displays key financial statistics in card format

**Features**:
- Total Income card (green theme)
- Total Expenses card (red theme)  
- Balance card (green/red based on positive/negative)
- Responsive grid layout
- Icons for visual appeal

**Props**:
```typescript
interface StatsCardsProps {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
}
```

### 2. **TransactionForm Component** (`components/dashboard/TransactionForm.tsx`)
**Purpose**: Handles adding and editing transactions

**Features**:
- Modal dialog form
- Amount input with validation
- Date picker
- Description field
- Type selector (expense/income)
- Category selector with search
- Form validation and error display
- Supports both create and edit modes

**Props**:
```typescript
interface TransactionFormProps {
  open: boolean;
  form: TransactionFormData;
  formError: string;
  editingTransaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
  onFormChange: (field: keyof TransactionFormData, value: string) => void;
  onSubmit: () => void;
}
```

### 3. **TransactionList Component** (`components/dashboard/TransactionList.tsx`)
**Purpose**: Displays and manages transaction list

**Features**:
- Category filtering dropdown
- Transaction cards with category badges
- Edit and delete actions
- Empty state handling
- Responsive design
- Color-coded amounts (red for expenses, green for income)

**Props**:
```typescript
interface TransactionListProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  categoryFilter: string;
  onCategoryFilterChange: (categoryId: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}
```

### 4. **ChartsSection Component** (`components/dashboard/ChartsSection.tsx`)
**Purpose**: Displays all charts and visualizations

**Features**:
- Monthly Expenses bar chart
- Income vs Expenses pie chart
- Spending by Category pie chart
- Empty states for each chart
- Responsive chart containers
- Category breakdown list

**Props**:
```typescript
interface ChartsSectionProps {
  transactions: Transaction[];
  categoryStats: CategoryStat[];
}
```

## 🎣 Custom Hooks

### **useTransactions Hook** (`lib/hooks/useTransactions.ts`)
**Purpose**: Centralized state management for all transaction operations

**Features**:
- Transaction CRUD operations
- Form state management
- Loading and error states
- Category filtering
- Statistics calculation
- Optimized with useCallback for performance

**Returns**:
```typescript
{
  // Data
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  stats: TransactionStats;
  categoryStats: CategoryStat[];
  categoryFilter: string;
  
  // Form state
  form: TransactionFormData;
  formError: string;
  editingTransaction: Transaction | null;
  open: boolean;
  
  // Loading and error states
  loading: boolean;
  error: string;
  
  // Event handlers
  onFormChange: (field: keyof TransactionFormData, value: string) => void;
  onSubmit: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenChange: (open: boolean) => void;
  onCategoryFilterChange: (categoryId: string) => void;
}
```

## 🛠️ Utility Functions

### **Dashboard Utils** (`lib/utils/dashboard-utils.ts`)
**Purpose**: Data processing and calculation functions

**Functions**:
- `getTransactionStats()` - Calculate income, expenses, balance
- `getMonthlyExpenses()` - Group expenses by month
- `getCategoryStats()` - Calculate category totals
- `filterTransactionsByCategory()` - Filter by category
- `formatCurrency()` - Format amounts for display
- `getTransactionTypeColor()` - Get color for transaction type
- `getTransactionSign()` - Get sign for amount display

## 📊 Data Flow

```
useTransactions Hook
    ↓
Dashboard Utils (data processing)
    ↓
Individual Components
    ↓
UI Rendering
```

## 🎯 Benefits of This Structure

### **1. Separation of Concerns**
- Each component has a single responsibility
- Business logic is separated from UI components
- Data processing is isolated in utility functions

### **2. Reusability**
- Components can be easily reused across different pages
- Utility functions are shared across components
- Custom hooks can be extended for other features

### **3. Maintainability**
- Easy to locate and modify specific functionality
- Clear component boundaries
- Comprehensive comments and documentation

### **4. Developer Experience**
- Clean imports with index files
- TypeScript interfaces for all props
- Consistent naming conventions
- Detailed JSDoc comments

### **5. Performance**
- Optimized with useCallback in custom hooks
- Efficient data processing utilities
- Minimal re-renders through proper state management

### **6. Testing**
- Components can be tested in isolation
- Utility functions are pure and testable
- Custom hooks can be tested independently

## 🔧 Adding New Features

### **Adding a New Component**:
1. Create component in `components/dashboard/`
2. Add TypeScript interfaces for props
3. Add comprehensive JSDoc comments
4. Export from `components/dashboard/index.ts`
5. Import and use in main page

### **Adding New Utilities**:
1. Add function to `lib/utils/dashboard-utils.ts`
2. Add JSDoc comments with parameters and return types
3. Export from the file
4. Import and use in components

### **Adding New Hooks**:
1. Create hook in `lib/hooks/`
2. Follow the same pattern as `useTransactions`
3. Add comprehensive comments
4. Export and use in components

## 📝 Code Style Guidelines

### **Comments**:
- Use JSDoc format for all functions and components
- Explain the purpose, parameters, and return values
- Add inline comments for complex logic

### **Naming**:
- Components: PascalCase (e.g., `StatsCards`)
- Functions: camelCase (e.g., `getTransactionStats`)
- Files: kebab-case (e.g., `dashboard-utils.ts`)

### **TypeScript**:
- Define interfaces for all props
- Use strict typing throughout
- Export types from dedicated files

### **File Organization**:
- Group related components in directories
- Use index files for clean imports
- Separate utilities by functionality

This modular structure makes the codebase much more maintainable and allows developers to work on different features independently without conflicts. 