'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DialogH, DialogTitle as DialogT, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Transaction } from '@/types/transaction';
import { transactionApi } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Edit, Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { CategorySelector } from '@/components/ui/category-selector';
import { getCategoryById, predefinedCategories } from '@/lib/categories';

function getMonthlyExpenses(transactions: Transaction[]) {
  const monthly: { [month: string]: number } = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const month = t.date.slice(0, 7);
      monthly[month] = (monthly[month] || 0) + t.amount;
    }
  });
  return Object.entries(monthly).map(([month, total]) => ({ month, total }));
}

function getTransactionStats(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  
  return { totalIncome, totalExpenses, balance };
}

function getCategoryStats(transactions: Transaction[]) {
  const categoryTotals: { [categoryId: string]: number } = {};
  
  transactions.forEach(transaction => {
    if (transaction.category) {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    }
  });
  
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
    .sort((a, b) => b.total - a.total);
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [form, setForm] = useState({ amount: '', date: '', description: '', type: 'expense' as 'expense' | 'income', category: '' });
  const [formError, setFormError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await transactionApi.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const resetForm = () => {
    setForm({ amount: '', date: '', description: '', type: 'expense' as 'expense' | 'income', category: '' });
    setFormError('');
    setEditingTransaction(null);
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.date || !form.description) {
      setFormError('All fields are required.');
      return;
    }
    
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
          type: form.type as 'expense' | 'income',
          category: form.category || undefined
        });
        setTransactions(transactions.map(t => 
          t._id === editingTransaction._id ? updatedTransaction : t
        ));
      } else {
        // Create new transaction
        const newTransaction = await transactionApi.create({
          amount: Number(form.amount),
          date: form.date,
          description: form.description,
          type: form.type as 'expense' | 'income',
          category: form.category || undefined
        });
        setTransactions([newTransaction, ...transactions]);
      }
      
      resetForm();
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save transaction');
      console.error(err);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setForm({
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description,
      type: transaction.type,
      category: transaction.category || ''
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionApi.delete(id);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      console.error(err);
    }
  };

  const filteredTransactions = categoryFilter 
    ? transactions.filter(t => t.category === categoryFilter)
    : transactions;
  
  const stats = getTransactionStats(transactions);
  const categoryStats = getCategoryStats(transactions);

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
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Finance Visualizer</h1>
          <p className="text-gray-600">Track and visualize your personal finances</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="font-medium">Error:</span>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalIncome.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">${stats.totalExpenses.toFixed(2)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Balance</p>
                  <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${stats.balance.toFixed(2)}
                  </p>
                </div>
                <div className={`h-8 w-8 rounded-full ${stats.balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions</CardTitle>
                <Dialog open={open} onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  if (!isOpen) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogH>
                      <DialogT>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogT>
                    </DialogH>
                    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input 
                          placeholder="0.00" 
                          type="number" 
                          step="0.01"
                          min="0.01"
                          value={form.amount} 
                          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input 
                          type="date" 
                          value={form.date} 
                          onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input 
                          placeholder="What was this transaction for?" 
                          value={form.description} 
                          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select 
                          className="w-full border rounded-md p-2 bg-background" 
                          value={form.type} 
                          onChange={e => setForm(f => ({ ...f, type: e.target.value as 'expense' | 'income' }))}
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <CategorySelector
                          value={form.category}
                          onChange={(categoryId) => setForm(f => ({ ...f, category: categoryId }))}
                          type={form.type}
                        />
                      </div>
                      {formError && (
                        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                          {formError}
                        </div>
                      )}
                      <DialogFooter>
                        <Button type="submit" className="w-full">Add Transaction</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Filter by category:</label>
                  <select 
                    className="border rounded-md p-2 bg-background text-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All categories</option>
                    {predefinedCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📊</div>
                    <div>No transactions yet.</div>
                    <div className="text-sm">Add your first transaction to get started!</div>
                  </div>
                )}
                {filteredTransactions.map(t => {
                  const category = t.category ? getCategoryById(t.category) : undefined;
                  return (
                    <div key={t._id} className="flex items-center justify-between border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900 truncate">{t.description}</div>
                          {category && (
                            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                              <span>{category.icon}</span>
                              <span>{category.name}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{t.date} • {t.type}</div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className={`font-semibold ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                          {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(t)}
                          className="text-xs"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(t._id!)}
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
          
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {getMonthlyExpenses(transactions).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📈</div>
                    <div>No expense data to display</div>
                    <div className="text-sm">Add some expenses to see the chart</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getMonthlyExpenses(transactions)}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Total']} />
                      <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📊</div>
                    <div>No data to display</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Income', value: stats.totalIncome, color: '#10b981' },
                          { name: 'Expenses', value: stats.totalExpenses, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                      >
                        {[
                          { name: 'Income', value: stats.totalIncome, color: '#10b981' },
                          { name: 'Expenses', value: stats.totalExpenses, color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryStats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📊</div>
                    <div>No categorized transactions</div>
                    <div className="text-sm">Add categories to your transactions to see this chart</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="total"
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {categoryStats.slice(0, 5).map((category) => (
                        <div key={category.categoryId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="font-semibold">${category.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 