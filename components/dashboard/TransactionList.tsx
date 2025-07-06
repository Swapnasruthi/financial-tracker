'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { getCategoryById, predefinedCategories } from '@/lib/categories';

/**
 * Props for the TransactionList component
 */
interface TransactionListProps {
  // Data
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  categoryFilter: string;
  
  // Event handlers
  onCategoryFilterChange: (categoryId: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

/**
 * TransactionList Component
 * 
 * Displays a list of transactions with:
 * - Category filtering dropdown
 * - Transaction cards with category badges
 * - Edit and delete actions for each transaction
 * - Empty state when no transactions exist
 * 
 * Each transaction shows:
 * - Description with category badge
 * - Date and type
 * - Amount with color coding (red for expenses, green for income)
 * - Action buttons for edit and delete
 */
export function TransactionList({
  transactions,
  filteredTransactions,
  categoryFilter,
  onCategoryFilterChange,
  onEditTransaction,
  onDeleteTransaction
}: TransactionListProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transactions</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">
              Filter by category:
            </label>
            <select 
              className="border rounded-md p-2 bg-background text-sm"
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
            >
              <option value="">All categories</option>
              {predefinedCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Transactions List */}
          <div className="space-y-3">
            {/* Empty State */}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">📊</div>
                <div>
                  {categoryFilter 
                    ? `No transactions in ${getCategoryById(categoryFilter)?.name || 'this category'}`
                    : 'No transactions yet.'
                  }
                </div>
                <div className="text-sm">
                  {categoryFilter 
                    ? 'Try selecting a different category or add a transaction with this category.'
                    : 'Add your first transaction to get started!'
                  }
                </div>
              </div>
            )}
            
            {/* Transaction Items */}
            {filteredTransactions.map(transaction => {
              const category = transaction.category 
                ? getCategoryById(transaction.category) 
                : undefined;
              
              return (
                <div 
                  key={transaction._id} 
                  className="flex items-center justify-between border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                >
                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 flex-col">
                      <div className="font-medium text-gray-900 ">
                        {transaction.description}
                      </div>
                      {/* Category Badge */}
                      {category && (
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.date} • {transaction.type}
                    </div>
                  </div>
                  
                  {/* Amount and Actions */}
                  <div className="flex items-center gap-3 ml-4">
                    {/* Amount Display */}
                    <span className={`font-semibold ${
                      transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </span>
                    
                    {/* Edit Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditTransaction(transaction)}
                      className="text-xs"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    {/* Delete Button */}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDeleteTransaction(transaction._id!)}
                      className="text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 