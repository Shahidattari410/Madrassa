export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'credit' | 'other';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  budgetLimit?: number; // Monthly budget cap for expenses
}

export interface Transaction {
  id: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  title: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: number;
}

export type FontFamilyChoice = 'nastaliq' | 'gulzar' | 'naskh' | 'amiri' | 'lateef' | 'modern' | 'custom';

export type ColorThemeChoice = 'emerald' | 'sapphire' | 'amber' | 'rose' | 'slate' | 'amethyst';

export type NumberSystemChoice = 'urdu' | 'latin';

export interface TypographySettings {
  fontFamily: FontFamilyChoice;
  fontSize: number; // in pixels (e.g., 14 to 22)
  lineHeight: number; // e.g., 1.6 to 2.4
  numberSystem: NumberSystemChoice;
  currency: string; // e.g., 'روپے'
  customFontName?: string;
}

export interface ThemeSettings {
  themeColor: ColorThemeChoice;
  isDarkMode: boolean;
}

export interface CategoryFinancialStat {
  category: Category;
  totalAmount: number;
  transactionCount: number;
  percentageOfTotal: number; // % of total expenses or income
  budgetLimit?: number;
  budgetUsagePercentage?: number;
  budgetRemaining?: number;
}

export interface LedgerFinancialReport {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRatePercentage: number;
  dailyAverageExpense: number;
  projectedMonthlyExpense: number;
  remainingDailyBudget: number;
  expenseCategories: CategoryFinancialStat[];
  incomeCategories: CategoryFinancialStat[];
  daysCount: number;
  daysRemainingInMonth: number;
}

export interface CategoryComparisonItem {
  category: Category;
  currentAmount: number;
  previousAmount: number;
  diffAmount: number; // current - previous
  percentageChange: number; // ((current - previous) / previous) * 100
  trend: 'increased' | 'decreased' | 'unchanged' | 'new';
}

export interface MonthlyComparisonReport {
  currentMonth: string; // YYYY-MM
  previousMonth: string; // YYYY-MM
  currentTotalExpense: number;
  previousTotalExpense: number;
  expenseDiff: number;
  expensePercentageChange: number;
  expenseTrend: 'increased' | 'decreased' | 'unchanged';

  currentTotalIncome: number;
  previousTotalIncome: number;
  incomeDiff: number;
  incomePercentageChange: number;

  currentNetBalance: number;
  previousNetBalance: number;
  netBalanceDiff: number;

  currentSavingsRate: number;
  previousSavingsRate: number;
  savingsRateDiff: number;

  categoryComparisons: CategoryComparisonItem[];
  highestIncreaseCategory?: CategoryComparisonItem;
  highestSavingsCategory?: CategoryComparisonItem;
  autoInsights: string[]; // Urdu automatic analytical conclusions
}
