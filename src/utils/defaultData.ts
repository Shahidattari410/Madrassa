import { Category, Transaction, TypographySettings, ThemeSettings } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // آمدن کیٹیگریز (Income)
  {
    id: 'inc-salary',
    name: 'ماہانہ تنخواہ / اجرت',
    type: 'income',
    icon: 'Briefcase',
    color: '#059669', // Emerald
  },
  {
    id: 'inc-business',
    name: 'کاروباری آمدن و منافع',
    type: 'income',
    icon: 'TrendingUp',
    color: '#0284c7', // Sky
  },
  {
    id: 'inc-freelance',
    name: 'فری لانسنگ / ضمنی کام',
    type: 'income',
    icon: 'Laptop',
    color: '#7c3aed', // Purple
  },
  {
    id: 'inc-rental',
    name: 'کرایہ کی وصولی',
    type: 'income',
    icon: 'Home',
    color: '#d97706', // Amber
  },
  {
    id: 'inc-gift',
    name: 'تحائف و متفرق وصولی',
    type: 'income',
    icon: 'Gift',
    color: '#db2777', // Pink
  },

  // اخراجات کیٹیگریز (Expense)
  {
    id: 'exp-groceries',
    name: 'گھریلو راشن و سودا سلف',
    type: 'expense',
    icon: 'ShoppingCart',
    color: '#ea580c', // Orange
    budgetLimit: 35000,
  },
  {
    id: 'exp-bills',
    name: 'یوٹیلٹی بلز (بجلی، گیس، پانی)',
    type: 'expense',
    icon: 'Zap',
    color: '#dc2626', // Red
    budgetLimit: 25000,
  },
  {
    id: 'exp-travel',
    name: 'سفر، پیٹرول و کرایہ',
    type: 'expense',
    icon: 'Car',
    color: '#4f46e5', // Indigo
    budgetLimit: 15000,
  },
  {
    id: 'exp-food',
    name: 'باہر کھانا و ریفریشمنٹ',
    type: 'expense',
    icon: 'Utensils',
    color: '#d97706', // Amber
    budgetLimit: 12000,
  },
  {
    id: 'exp-health',
    name: 'طبی علاج و ادویات',
    type: 'expense',
    icon: 'Activity',
    color: '#e11d48', // Rose
    budgetLimit: 10000,
  },
  {
    id: 'exp-education',
    name: 'تعلیم، فیس و کتب',
    type: 'expense',
    icon: 'BookOpen',
    color: '#2563eb', // Blue
    budgetLimit: 20000,
  },
  {
    id: 'exp-charity',
    name: 'صدقہ، خیرات و امداد',
    type: 'expense',
    icon: 'Heart',
    color: '#059669', // Emerald
    budgetLimit: 8000,
  },
  {
    id: 'exp-mobile',
    name: 'موبائل، انٹرنیٹ پیکج',
    type: 'expense',
    icon: 'Smartphone',
    color: '#0891b2', // Cyan
    budgetLimit: 5000,
  },
  {
    id: 'exp-repairs',
    name: 'مرمت و دیکھ بھال',
    type: 'expense',
    icon: 'Wrench',
    color: '#64748b', // Slate
    budgetLimit: 8000,
  },
  {
    id: 'exp-misc',
    name: 'دیگر متفرق اخراجات',
    type: 'expense',
    icon: 'Tag',
    color: '#84cc16', // Lime
    budgetLimit: 6000,
  },
];

// Helper to get formatted date string for recent days
const getRecentDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    categoryId: 'inc-salary',
    amount: 140000,
    title: 'ماہانہ تنخواہ وصولی',
    date: getRecentDate(5),
    paymentMethod: 'bank',
    notes: 'بینک الفلاح کے اکاؤنٹ میں منتقل',
    createdAt: Date.now() - 5 * 86400000,
  },
  {
    id: 'tx-2',
    type: 'income',
    categoryId: 'inc-business',
    amount: 32000,
    title: 'ضمنی پروجیکٹ منافع',
    date: getRecentDate(3),
    paymentMethod: 'easypaisa',
    notes: 'کلائنٹ کی طرف سے ادائیگی وصول',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'tx-3',
    type: 'expense',
    categoryId: 'exp-groceries',
    amount: 18500,
    title: 'ماہانہ گروسری و راشن خریداری',
    date: getRecentDate(4),
    paymentMethod: 'cash',
    notes: 'آٹا، چاول، گھی اور دالیں وغیرہ',
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: 'tx-4',
    type: 'expense',
    categoryId: 'exp-bills',
    amount: 14200,
    title: 'لیسکو بجلی کا بل ادا کیا',
    date: getRecentDate(3),
    paymentMethod: 'bank',
    notes: 'آن لائن بینکنگ کے ذریعے ادا',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'tx-5',
    type: 'expense',
    categoryId: 'exp-travel',
    amount: 4500,
    title: 'گاڑی میں پیٹرول بھروایا',
    date: getRecentDate(2),
    paymentMethod: 'credit',
    notes: 'ٹوٹل پارکو پیٹرول پمپ',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'tx-6',
    type: 'expense',
    categoryId: 'exp-food',
    amount: 2800,
    title: 'فیملی ڈنر / کھانا',
    date: getRecentDate(1),
    paymentMethod: 'cash',
    notes: 'ہفتہ وار فیملی کھانا',
    createdAt: Date.now() - 1 * 86400000,
  },
  {
    id: 'tx-7',
    type: 'expense',
    categoryId: 'exp-charity',
    amount: 5000,
    title: 'ماہانہ صدقہ و راشن پیکٹ مدد',
    date: getRecentDate(2),
    paymentMethod: 'cash',
    notes: 'مستحق خاندان کی کفالت',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'tx-8',
    type: 'expense',
    categoryId: 'exp-mobile',
    amount: 2200,
    title: 'گھر کا انٹرنیٹ وائی فائی بل',
    date: getRecentDate(0),
    paymentMethod: 'jazzcash',
    notes: 'پی ٹی سی ایل فائبر پیکج',
    createdAt: Date.now(),
  },
  {
    id: 'tx-9',
    type: 'expense',
    categoryId: 'exp-health',
    amount: 1950,
    title: 'ماہانہ ادویات فارمیسی',
    date: getRecentDate(0),
    paymentMethod: 'cash',
    notes: 'فارمیسی بل',
    createdAt: Date.now(),
  },
  // پچھلے مہینے کا ریکارڈ (برائے خودکار ماہانہ موازنہ و تقابلی تجزیہ)
  {
    id: 'tx-prev-1',
    type: 'income',
    categoryId: 'inc-salary',
    amount: 140000,
    title: 'گزشتہ ماہانہ تنخواہ وصولی',
    date: getRecentDate(35),
    paymentMethod: 'bank',
    notes: 'پچھلے مہینے کی تنخواہ',
    createdAt: Date.now() - 35 * 86400000,
  },
  {
    id: 'tx-prev-2',
    type: 'expense',
    categoryId: 'exp-groceries',
    amount: 22500,
    title: 'گزشتہ ماہ گروسری و راشن خریداری',
    date: getRecentDate(34),
    paymentMethod: 'cash',
    notes: 'پچھلے مہینے کا راشن',
    createdAt: Date.now() - 34 * 86400000,
  },
  {
    id: 'tx-prev-3',
    type: 'expense',
    categoryId: 'exp-bills',
    amount: 18400,
    title: 'گزشتہ ماہ بجلی کا بل',
    date: getRecentDate(33),
    paymentMethod: 'bank',
    notes: 'پچھلے مہینے کا لیسکو بل',
    createdAt: Date.now() - 33 * 86400000,
  },
  {
    id: 'tx-prev-4',
    type: 'expense',
    categoryId: 'exp-travel',
    amount: 5200,
    title: 'گزشتہ ماہ پیٹرول اخراجات',
    date: getRecentDate(32),
    paymentMethod: 'credit',
    notes: 'پیٹرول خرچ',
    createdAt: Date.now() - 32 * 86400000,
  },
  {
    id: 'tx-prev-5',
    type: 'expense',
    categoryId: 'exp-food',
    amount: 4200,
    title: 'گزشتہ ماہ ریستوران کھانا',
    date: getRecentDate(31),
    paymentMethod: 'cash',
    notes: 'ڈنر',
    createdAt: Date.now() - 31 * 86400000,
  },
  {
    id: 'tx-prev-6',
    type: 'expense',
    categoryId: 'exp-charity',
    amount: 4000,
    title: 'گزشتہ ماہ صدقہ و خیرات',
    date: getRecentDate(30),
    paymentMethod: 'cash',
    notes: 'خیرات',
    createdAt: Date.now() - 30 * 86400000,
  },
];

export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  fontFamily: 'nastaliq',
  fontSize: 16,
  lineHeight: 1.85,
  numberSystem: 'latin',
  currency: 'روپے',
};

export const DEFAULT_THEME: ThemeSettings = {
  themeColor: 'emerald',
  isDarkMode: false,
};
