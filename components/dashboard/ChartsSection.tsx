'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction } from '@/types/transaction';
import { getCategoryById } from '@/lib/categories';
import { getMonthlyExpenses, CategoryStat } from '@/lib/utils/dashboard-utils';

/**
 * Interface for monthly expense data
 */
interface MonthlyExpense {
  month: string;
  total: number;
}



/**
 * Props for the ChartsSection component
 */
interface ChartsSectionProps {
  transactions: Transaction[];
  categoryStats: CategoryStat[];
}

/**
 * ChartsSection Component
 * 
 * Displays three different charts:
 * 1. Monthly Expenses Chart - Bar chart showing monthly expense trends
 * 2. Income vs Expenses Chart - Pie chart showing overall financial overview
 * 3. Spending by Category Chart - Pie chart showing category breakdown
 * 
 * Each chart has proper empty states and responsive design
 */
export function ChartsSection({ transactions, categoryStats }: ChartsSectionProps) {


  /**
   * Calculate total income and expenses for the pie chart
   */
  const getIncomeExpenseData = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return [
      { name: 'Income', value: totalIncome, color: '#10b981' },
      { name: 'Expenses', value: totalExpenses, color: '#ef4444' }
    ];
  };

  const monthlyExpenses = getMonthlyExpenses(transactions);
  const incomeExpenseData = getIncomeExpenseData();

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Monthly Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📈</div>
              <div>No expense data to display</div>
              <div className="text-sm">Add some expenses to see the chart</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenses}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Total']} />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Income vs Expenses Chart */}
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
                  data={incomeExpenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Spending by Category Chart */}
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
              {/* Category Pie Chart */}
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
              
              {/* Category Breakdown List */}
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
  );
} 