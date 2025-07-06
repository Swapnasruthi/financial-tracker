import { Transaction } from '@/types/transaction';
import { getCategoryById } from '@/lib/categories';

/**
 * Interface for transaction statistics
 */
export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

/**
 * Interface for monthly expense data
 */
export interface MonthlyExpense {
  month: string;
  total: number;
}

/**
 * Interface for category statistics
 */
export interface CategoryStat {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

/**
 * Calculate transaction statistics from a list of transactions
 * 
 * @param transactions - Array of transactions to analyze
 * @returns Object containing total income, expenses, and balance
 */
export function getTransactionStats(transactions: Transaction[]): TransactionStats {
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalExpenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  
  return { totalIncome, totalExpenses, balance };
}

/**
 * Calculate monthly expenses from transactions
 * Groups expenses by month and sums the amounts
 * 
 * @param transactions - Array of transactions to analyze
 * @returns Array of monthly expense data sorted by month
 */
export function getMonthlyExpenses(transactions: Transaction[]): MonthlyExpense[] {
  const monthly: { [month: string]: number } = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      const month = transaction.date.slice(0, 7); // Extract YYYY-MM format
      monthly[month] = (monthly[month] || 0) + transaction.amount;
    }
  });
  
  return Object.entries(monthly)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Calculate category statistics from transactions
 * Groups transactions by category and sums the amounts
 * 
 * @param transactions - Array of transactions to analyze
 * @returns Array of category statistics sorted by total amount (descending)
 */
export function getCategoryStats(transactions: Transaction[]): CategoryStat[] {
  const categoryTotals: { [categoryId: string]: number } = {};
  
  // Sum up amounts by category
  transactions.forEach(transaction => {
    if (transaction.category) {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    }
  });
  
  // Convert to array and add category metadata
  return Object.entries(categoryTotals)
    .map(([categoryId, total]) => {
      const category = getCategoryById(categoryId);
      return {
        categoryId,
        name: category?.name || 'Unknown',
        icon: category?.icon || '📝',
        color: category?.color || '#6b7280',
        total
      };
    })
    .sort((a, b) => b.total - a.total); // Sort by total descending
}

/**
 * Filter transactions by category
 * 
 * @param transactions - Array of transactions to filter
 * @param categoryFilter - Category ID to filter by (empty string for all categories)
 * @returns Filtered array of transactions
 */
export function filterTransactionsByCategory(
  transactions: Transaction[], 
  categoryFilter: string
): Transaction[] {
  if (!categoryFilter) {
    return transactions; // Return all transactions if no filter
  }
  
  return transactions.filter(transaction => transaction.category === categoryFilter);
}

/**
 * Format currency amount for display
 * 
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get color for transaction type
 * 
 * @param type - Transaction type ('expense' or 'income')
 * @returns CSS color class
 */
export function getTransactionTypeColor(type: 'expense' | 'income'): string {
  return type === 'expense' ? 'text-red-600' : 'text-green-600';
}

/**
 * Get sign for transaction amount display
 * 
 * @param type - Transaction type ('expense' or 'income')
 * @returns Sign string ('-' for expenses, '+' for income)
 */
export function getTransactionSign(type: 'expense' | 'income'): string {
  return type === 'expense' ? '-' : '+';
} 