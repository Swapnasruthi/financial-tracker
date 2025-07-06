'use client';

import React from 'react';
import { 
  StatsCards, 
  TransactionForm, 
  TransactionList, 
  ChartsSection 
} from '@/components/dashboard';
import { useTransactions } from '@/lib/hooks/useTransactions';

/**
 * HomePage Component
 * 
 * Main dashboard page that displays:
 * - Statistics cards (income, expenses, balance)
 * - Transaction form for adding/editing transactions
 * - Transaction list with filtering
 * - Charts section with various visualizations
 * 
 * Uses the useTransactions custom hook for state management
 * and is composed of modular components for better maintainability
 */
export default function HomePage() {
  // Use custom hook for transaction management
  const {
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
    onFormChange,
    onSubmit,
    onEdit,
    onDelete,
    onOpenChange,
    onCategoryFilterChange
  } = useTransactions();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div>Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Page Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal Finance Visualizer
          </h1>
          <p className="text-gray-600">
            Track and visualize your personal finances
          </p>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="font-medium">Error:</span>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <StatsCards stats={stats} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction List with Form */}
          <div className="space-y-4">
            {/* Transaction Form */}
            <TransactionForm
              open={open}
              form={form}
              formError={formError}
              editingTransaction={editingTransaction}
              onOpenChange={onOpenChange}
              onFormChange={onFormChange}
              onSubmit={onSubmit}
            />
            
            {/* Transaction List */}
            <TransactionList
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={onCategoryFilterChange}
              onEditTransaction={onEdit}
              onDeleteTransaction={onDelete}
            />
          </div>
          
          {/* Charts Section */}
          <ChartsSection
            transactions={transactions}
            categoryStats={categoryStats}
          />
        </div>
      </div>
    </div>
  );
} 