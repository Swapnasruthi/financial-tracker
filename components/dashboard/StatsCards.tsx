'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Interface for transaction statistics
 */
interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

/**
 * Props for the StatsCards component
 */
interface StatsCardsProps {
  stats: TransactionStats;
}

/**
 * StatsCards Component
 * 
 * Displays three cards showing:
 * - Total Income (green)
 * - Total Expenses (red) 
 * - Balance (green if positive, red if negative)
 * 
 * Each card has an icon and formatted currency display
 */
export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Income Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalIncome.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      {/* Expenses Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${stats.totalExpenses.toFixed(2)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
      
      {/* Balance Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${
                stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${stats.balance.toFixed(2)}
              </p>
            </div>
            <div className={`h-8 w-8 rounded-full ${
              stats.balance >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 