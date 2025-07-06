'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DialogH, DialogTitle as DialogT, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Transaction } from '@/types/transaction';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', date: '', description: '', type: 'expense' });
  const [formError, setFormError] = useState('');

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }
      const data = await response.json();
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

  const handleAdd = async () => {
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
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(form.amount),
          date: form.date,
          description: form.description,
          type: form.type as 'expense' | 'income'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add transaction');
      }
      
      const newTransaction = await response.json();
      setTransactions([newTransaction, ...transactions]);
      setForm({ amount: '', date: '', description: '', type: 'expense' });
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add transaction');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }
      
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      console.error(err);
    }
  };

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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">Add Transaction</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogH>
                      <DialogT>Add New Transaction</DialogT>
                    </DialogH>
                    <form onSubmit={e => { e.preventDefault(); handleAdd(); }} className="space-y-4">
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
                          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
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
              <div className="space-y-3">
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📊</div>
                    <div>No transactions yet.</div>
                    <div className="text-sm">Add your first transaction to get started!</div>
                  </div>
                )}
                {transactions.map(t => (
                  <div key={t._id} className="flex items-center justify-between border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{t.description}</div>
                      <div className="text-sm text-gray-500">{t.date} • {t.type}</div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`font-semibold ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                        {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                      </span>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(t._id!)}
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1">
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
        </div>
      </div>
    </div>
  );
} 