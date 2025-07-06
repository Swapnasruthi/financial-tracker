export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export const predefinedCategories: Category[] = [
  // Expense Categories
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#ef4444',
    type: 'expense'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    color: '#3b82f6',
    type: 'expense'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#8b5cf6',
    type: 'expense'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#f59e0b',
    type: 'expense'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    color: '#10b981',
    type: 'expense'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: '💡',
    color: '#6366f1',
    type: 'expense'
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: '🏠',
    color: '#f97316',
    type: 'expense'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#06b6d4',
    type: 'expense'
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: '#ec4899',
    type: 'expense'
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    color: '#84cc16',
    type: 'expense'
  },
  {
    id: 'taxes',
    name: 'Taxes',
    icon: '💰',
    color: '#f43f5e',
    type: 'expense'
  },
  {
    id: 'other-expense',
    name: 'Other Expense',
    icon: '📝',
    color: '#6b7280',
    type: 'expense'
  },

  // Income Categories
  {
    id: 'salary',
    name: 'Salary',
    icon: '💼',
    color: '#10b981',
    type: 'income'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    color: '#3b82f6',
    type: 'income'
  },
  {
    id: 'investment',
    name: 'Investment',
    icon: '📈',
    color: '#f59e0b',
    type: 'income'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '🏢',
    color: '#8b5cf6',
    type: 'income'
  },
  {
    id: 'gift',
    name: 'Gift',
    icon: '🎁',
    color: '#ec4899',
    type: 'income'
  },
  {
    id: 'refund',
    name: 'Refund',
    icon: '↩️',
    color: '#06b6d4',
    type: 'income'
  },
  {
    id: 'other-income',
    name: 'Other Income',
    icon: '📝',
    color: '#6b7280',
    type: 'income'
  }
];

export const getCategoriesByType = (type: 'expense' | 'income'): Category[] => {
  return predefinedCategories.filter(category => 
    category.type === type || category.type === 'both'
  );
};

export const getCategoryById = (id: string): Category | undefined => {
  return predefinedCategories.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return predefinedCategories.find(category => category.name === name);
}; 