'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DialogH, DialogTitle as DialogT, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CategorySelector } from '@/components/ui/category-selector';
import { Plus } from 'lucide-react';
import { Transaction } from '@/types/transaction';

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
 * Props for the TransactionForm component
 */
interface TransactionFormProps {
  // Form state
  open: boolean;
  form: TransactionFormData;
  formError: string;
  editingTransaction: Transaction | null;
  
  // Event handlers
  onOpenChange: (open: boolean) => void;
  onFormChange: (field: keyof TransactionFormData, value: string) => void;
  onSubmit: () => void;
}

/**
 * TransactionForm Component
 * 
 * Handles the creation and editing of transactions with:
 * - Amount input with validation
 * - Date picker
 * - Description field
 * - Type selector (expense/income)
 * - Category selector with predefined options
 * - Form validation and error display
 * 
 * Supports both creating new transactions and editing existing ones
 */
export function TransactionForm({
  open,
  form,
  formError,
  editingTransaction,
  onOpenChange,
  onFormChange,
  onSubmit
}: TransactionFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogH>
          <DialogT>
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogT>
        </DialogH>
        
        <form onSubmit={e => { 
          e.preventDefault(); 
          onSubmit(); 
        }} className="space-y-4">
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input 
              placeholder="0.00" 
              type="number" 
              step="0.01"
              min="0.01"
              value={form.amount} 
              onChange={e => onFormChange('amount', e.target.value)} 
            />
          </div>
          
          {/* Date Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input 
              type="date" 
              value={form.date} 
              onChange={e => onFormChange('date', e.target.value)} 
            />
          </div>
          
          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input 
              placeholder="What was this transaction for?" 
              value={form.description} 
              onChange={e => onFormChange('description', e.target.value)} 
            />
          </div>
          
          {/* Type Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select 
              className="w-full border rounded-md p-2 bg-background" 
              value={form.type} 
              onChange={e => onFormChange('type', e.target.value as 'expense' | 'income')}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <CategorySelector
              value={form.category}
              onChange={(categoryId) => onFormChange('category', categoryId)}
              type={form.type}
            />
          </div>
          
          {/* Error Display */}
          {formError && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {formError}
            </div>
          )}
          
          {/* Submit Button */}
          <DialogFooter>
            <Button type="submit" className="w-full">
              {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 