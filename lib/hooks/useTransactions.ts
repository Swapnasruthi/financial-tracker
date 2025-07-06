'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/transaction';
import { transactionApi } from '@/lib/api';
import { 
  getTransactionStats, 
  getCategoryStats, 
  filterTransactionsByCategory,
  TransactionStats,
  CategoryStat
} from '@/lib/utils/dashboard-utils';

/**
 * Interface for form data
 */
interface TransactionFormData {
  amount: string;
  date: string;
  description: string;
  type: 'expense' | 'income';
  category: string;
}

/**
 * Custom hook for managing transaction state and operations
 * 
 * Provides:
 * - Transaction data management
 * - CRUD operations (Create, Read, Update, Delete)
 * - Form state management
 * - Loading and error states
 * - Category filtering
 * - Statistics calculation
 */
export function useTransactions() {
  // State for transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for form management
  const [form, setForm] = useState<TransactionFormData>({
    amount: '',
    date: '',
    description: '',
    type: 'expense',
    category: ''
  });
  const [formError, setFormError] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // State for UI management
  const [open, setOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  /**
   * Fetch all transactions from the API
   */
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await transactionApi.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setForm({
      amount: '',
      date: '',
      description: '',
      type: 'expense',
      category: ''
    });
    setFormError('');
    setEditingTransaction(null);
  }, []);

  /**
   * Handle form field changes
   */
  const handleFormChange = useCallback((field: keyof TransactionFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Handle form submission (create or update transaction)
   */
  const handleSubmit = useCallback(async () => {
    // Validate required fields
    if (!form.amount || !form.date || !form.description) {
      setFormError('All fields are required.');
      return;
    }
    
    // Validate amount
    if (Number(form.amount) <= 0) {
      setFormError('Amount must be a positive number.');
      return;
    }
    
    try {
      setFormError('');
      
      if (editingTransaction) {
        // Update existing transaction
        const updatedTransaction = await transactionApi.update({
          ...editingTransaction,
          amount: Number(form.amount),
          date: form.date,
          description: form.description,
          type: form.type,
          category: form.category || undefined
        });
        
        setTransactions(prev => 
          prev.map(t => t._id === editingTransaction._id ? updatedTransaction : t)
        );
      } else {
        // Create new transaction
        const newTransaction = await transactionApi.create({
          amount: Number(form.amount),
          date: form.date,
          description: form.description,
          type: form.type,
          category: form.category || undefined
        });
        
        setTransactions(prev => [newTransaction, ...prev]);
      }
      
      resetForm();
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save transaction');
      console.error('Error saving transaction:', err);
    }
  }, [form, editingTransaction, resetForm]);

  /**
   * Handle editing a transaction
   */
  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setForm({
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description,
      type: transaction.type,
      category: transaction.category || ''
    });
    setOpen(true);
  }, []);

  /**
   * Handle deleting a transaction
   */
  const handleDelete = useCallback(async (id: string) => {
    try {
      await transactionApi.delete(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    }
  }, []);

  /**
   * Handle dialog open/close
   */
  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  }, [resetForm]);

  /**
   * Handle category filter change
   */
  const handleCategoryFilterChange = useCallback((categoryId: string) => {
    setCategoryFilter(categoryId);
  }, []);

  // Calculate derived data
  const filteredTransactions = filterTransactionsByCategory(transactions, categoryFilter);
  const stats = getTransactionStats(transactions);
  const categoryStats = getCategoryStats(transactions);

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    // Data
    transactions,
    filteredTransactions,
    stats,
    categoryStats,
    categoryFilter,
    
    // Form state
    form,
    formError,
    editingTransaction,
    open,
    
    // Loading and error states
    loading,
    error,
    
    // Event handlers
    onFormChange: handleFormChange,
    onSubmit: handleSubmit,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onOpenChange: handleOpenChange,
    onCategoryFilterChange: handleCategoryFilterChange,
    
    // Utility functions
    resetForm,
    fetchTransactions
  };
} 