export interface Transaction {
  _id?: string
  amount: number
  date: string
  description: string
  type: 'expense' | 'income'
  category?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TransactionFormData {
  amount: string
  date: string
  description: string
  type: 'expense' | 'income'
  category?: string
}

export interface MonthlyExpense {
  month: string
  total: number
} 