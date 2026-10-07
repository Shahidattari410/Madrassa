import {
  Category,
  CategoryComparisonItem,
  CategoryFinancialStat,
  LedgerFinancialReport,
  MonthlyComparisonReport,
  Transaction,
} from '../types';

export const calculateLedgerReport = (
  transactions: Transaction[],
  categories: Category[],
  selectedMonth?: string // YYYY-MM
): LedgerFinancialReport => {
  // Filter transactions by selectedMonth if specified
  const filtered = selectedMonth
    ? transactions.filter((t) => t.date.startsWith(selectedMonth))
    : transactions;

  let totalIncome = 0;
  let totalExpense = 0;

  const categoryTotals: { [categoryId: string]: { total: number; count: number } } = {};

  filtered.forEach((tx) => {
    if (!categoryTotals[tx.categoryId]) {
      categoryTotals[tx.categoryId] = { total: 0, count: 0 };
    }
    categoryTotals[tx.categoryId].total += tx.amount;
    categoryTotals[tx.categoryId].count += 1;

    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
    }
  });

  const netBalance = totalIncome - totalExpense;

  // Formula 1: Savings Rate Percentage
  // Savings Rate = (Net Balance / Total Income) * 100%
  const savingsRatePercentage =
    totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  // Calculate unique days with records or days elapsed in month
  const uniqueDates = new Set(filtered.map((t) => t.date));
  const daysCount = Math.max(1, uniqueDates.size);

  // Formula 2: Daily Average Expense
  // Daily Average = Total Expense / Number of recorded days
  const dailyAverageExpense = totalExpense > 0 ? totalExpense / daysCount : 0;

  // Formula 3: Projected Monthly Expense
  // Monthly Projected = Daily Average * 30
  const projectedMonthlyExpense = dailyAverageExpense * 30;

  // Days remaining in the current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = today.getDate();
  const daysRemainingInMonth = Math.max(1, daysInCurrentMonth - currentDay);

  // Formula 4: Safe Remaining Daily Budget
  // Remaining Daily Budget = Net Balance / Days Remaining
  const remainingDailyBudget =
    netBalance > 0 ? netBalance / daysRemainingInMonth : 0;

  // Category breakdowns
  const expenseCategories: CategoryFinancialStat[] = [];
  const incomeCategories: CategoryFinancialStat[] = [];

  categories.forEach((cat) => {
    const data = categoryTotals[cat.id] || { total: 0, count: 0 };
    const totalAmount = data.total;
    const count = data.count;

    if (cat.type === 'expense') {
      const percentageOfTotal = totalExpense > 0 ? (totalAmount / totalExpense) * 100 : 0;
      const budgetLimit = cat.budgetLimit;
      const budgetUsagePercentage =
        budgetLimit && budgetLimit > 0 ? (totalAmount / budgetLimit) * 100 : undefined;
      const budgetRemaining = budgetLimit !== undefined ? budgetLimit - totalAmount : undefined;

      expenseCategories.push({
        category: cat,
        totalAmount,
        transactionCount: count,
        percentageOfTotal,
        budgetLimit,
        budgetUsagePercentage,
        budgetRemaining,
      });
    } else {
      const percentageOfTotal = totalIncome > 0 ? (totalAmount / totalIncome) * 100 : 0;
      incomeCategories.push({
        category: cat,
        totalAmount,
        transactionCount: count,
        percentageOfTotal,
      });
    }
  });

  // Sort descending by highest amount
  expenseCategories.sort((a, b) => b.totalAmount - a.totalAmount);
  incomeCategories.sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    totalIncome,
    totalExpense,
    netBalance,
    savingsRatePercentage,
    dailyAverageExpense,
    projectedMonthlyExpense,
    remainingDailyBudget,
    expenseCategories,
    incomeCategories,
    daysCount,
    daysRemainingInMonth,
  };
};

export interface FormulaExplanation {
  id: string;
  title: string;
  urduName: string;
  formulaLatex: string;
  formulaText: string;
  substitutedMath: string;
  resultText: string;
  description: string;
}

export const getFormulaExplanations = (
  report: LedgerFinancialReport,
  currency: string = 'روپے'
): FormulaExplanation[] => {
  return [
    {
      id: 'net-balance',
      title: 'خالص بیلنس (Net Balance / Cash Balance)',
      urduName: 'خالص منافع / بچت کی رقم',
      formulaLatex: 'Net Balance = \\sum Income - \\sum Expenses',
      formulaText: 'خالص بیلنس = کل آمدن - کل اخراجات',
      substitutedMath: `${report.totalIncome.toLocaleString()} ${currency} - ${report.totalExpense.toLocaleString()} ${currency}`,
      resultText: `${report.netBalance.toLocaleString()} ${currency}`,
      description: 'آمدنی کے تمام ذرائع میں سے تمام اخراجات نکالنے کے بعد بچ جانے والی رقم۔ مثبت عدد منافع/بچت کو ظاہر کرتا ہے جبکہ منفی عدد خسارے کو۔',
    },
    {
      id: 'savings-rate',
      title: 'بچت کا تناسب (Savings Rate %)',
      urduName: 'کفایت شعاری اور بچت کی شرح',
      formulaLatex: 'Savings Rate (\\%) = \\left( \\frac{Net Balance}{Total Income} \\right) \\times 100\\%',
      formulaText: 'بچت کی شرح = (خالص بیلنس ÷ کل آمدن) × 100',
      substitutedMath: `(${report.netBalance.toLocaleString()} ÷ ${report.totalIncome.toLocaleString() || '1'}) × 100`,
      resultText: `${report.savingsRatePercentage.toFixed(1)}%`,
      description: 'یہ فارمولا بتاتا ہے کہ آپ اپنی کمائی ہوئی کل آمدنی کا کتنا فیصد حصہ خرچ کیے بغیر محفوظ کرنے میں کامیاب رہے ہیں۔ مثالی شرح 20% یا اس سے زائد سمجھی جاتی ہے۔',
    },
    {
      id: 'daily-average',
      title: 'یومیہ اوسط خرچ (Daily Average Expense)',
      urduName: 'روزانہ کا اوسط خرچ',
      formulaLatex: 'Daily Average = \\frac{Total Expenses}{Recorded Days}',
      formulaText: 'یومیہ اوسط = کل اخراجات ÷ اندراج شدہ دنوں کی تعداد',
      substitutedMath: `${report.totalExpense.toLocaleString()} ${currency} ÷ ${report.daysCount} دن`,
      resultText: `${Math.round(report.dailyAverageExpense).toLocaleString()} ${currency} یومیہ`,
      description: 'آپ کی روزمرہ کے عمومی اخراجات کی اوسط رفتار۔ اس سے معلوم ہوتا ہے کہ عام طور پر ایک دن میں کتنے پیسے خرچ ہوتے ہیں۔',
    },
    {
      id: 'projected-monthly',
      title: 'متوقع ماہانہ خرچ (Monthly Expense Projection)',
      urduName: 'مہینے کا اندازہ تخمینہ',
      formulaLatex: 'Projected Monthly = Daily Average \\times 30',
      formulaText: 'متوقع خرچ = یومیہ اوسط × 30 دن',
      substitutedMath: `${Math.round(report.dailyAverageExpense).toLocaleString()} ${currency} × 30`,
      resultText: `${Math.round(report.projectedMonthlyExpense).toLocaleString()} ${currency}`,
      description: 'اگر موجودہ روزمرہ رفتار برقرار رہی تو پورے مہینے میں کل اتنے اخراجات متوقع ہیں۔ یہ بجٹ کو قابو میں رکھنے کے لیے قبل از وقت انتباہ فراہم کرتا ہے۔',
    },
    {
      id: 'remaining-daily-budget',
      title: 'بقیہ ایام کا محفوظ یومیہ خرچ (Safe Daily Spend Cap)',
      urduName: 'باقی دنوں کے لیے یومیہ محفوظ حد',
      formulaLatex: 'Safe Daily Cap = \\frac{Remaining Balance}{Remaining Days}',
      formulaText: 'محفوظ یومیہ حد = موجودہ بیلنس ÷ مہینے کے باقی ماندہ دن',
      substitutedMath: `${Math.max(0, report.netBalance).toLocaleString()} ${currency} ÷ ${report.daysRemainingInMonth} دن`,
      resultText: `${Math.round(report.remainingDailyBudget).toLocaleString()} ${currency} فی دن`,
      description: 'مہینے کے باقی دنوں میں اگر آپ روزانہ اس رقم کے اندر خرچ کریں گے تو آپ کا بجٹ کبھی خسارے میں نہیں جائے گا اور بیلنس برقرار رہے گا۔',
    },
    {
      id: 'category-percentage',
      title: 'کیٹیگری کا حصہ تناسب (Category Share %)',
      urduName: 'ہر شعبے کا خرچ میں فیصد حصہ',
      formulaLatex: 'Category Share (\\%) = \\left( \\frac{Category Total}{Total Expenses} \\right) \\times 100\\%',
      formulaText: 'کیٹیگری حصہ = (کیٹیگری کی رقم ÷ کل اخراجات) × 100',
      substitutedMath: `کیٹیگری خرچ ÷ ${report.totalExpense.toLocaleString() || '1'} × 100`,
      resultText: 'ہر کیٹیگری کا الگ فیصد',
      description: 'یہ تناسب واضح کرتا ہے کہ آپ کا سب سے زیادہ پیسہ کن مدات (راشن، بلز، سفر، وغیرہ) میں استعمال ہو رہا ہے تاکہ غیر ضروری اخراجات کم کیے جا سکیں۔',
    },
  ];
};

/**
 * Calculates previous month string (YYYY-MM) from any given month key
 */
export const getPreviousMonthKey = (monthKey: string): string => {
  if (!monthKey || monthKey === 'all') {
    const now = new Date();
    monthKey = now.toISOString().slice(0, 7);
  }
  const [yearStr, monthStr] = monthKey.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);
  if (isNaN(year) || isNaN(month)) {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }
  if (month === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(month - 1).padStart(2, '0')}`;
};

/**
 * Calculates comprehensive Monthly Comparison Report
 * Compares current month expenses with previous month
 */
export const calculateMonthlyComparison = (
  transactions: Transaction[],
  categories: Category[],
  targetMonth?: string
): MonthlyComparisonReport => {
  const currentMonth = targetMonth && targetMonth !== 'all'
    ? targetMonth
    : new Date().toISOString().slice(0, 7);
  
  const previousMonth = getPreviousMonthKey(currentMonth);

  const currentTxs = transactions.filter((t) => t.date.startsWith(currentMonth));
  const previousTxs = transactions.filter((t) => t.date.startsWith(previousMonth));

  // Current Month Totals
  let currentTotalIncome = 0;
  let currentTotalExpense = 0;
  const currentCatTotals: { [catId: string]: number } = {};

  currentTxs.forEach((t) => {
    if (t.type === 'income') {
      currentTotalIncome += t.amount;
    } else {
      currentTotalExpense += t.amount;
      currentCatTotals[t.categoryId] = (currentCatTotals[t.categoryId] || 0) + t.amount;
    }
  });

  // Previous Month Totals
  let previousTotalIncome = 0;
  let previousTotalExpense = 0;
  const previousCatTotals: { [catId: string]: number } = {};

  previousTxs.forEach((t) => {
    if (t.type === 'income') {
      previousTotalIncome += t.amount;
    } else {
      previousTotalExpense += t.amount;
      previousCatTotals[t.categoryId] = (previousCatTotals[t.categoryId] || 0) + t.amount;
    }
  });

  // Overall Differences
  const expenseDiff = currentTotalExpense - previousTotalExpense;
  const expensePercentageChange = previousTotalExpense > 0
    ? (expenseDiff / previousTotalExpense) * 100
    : (currentTotalExpense > 0 ? 100 : 0);

  const expenseTrend: 'increased' | 'decreased' | 'unchanged' =
    expenseDiff > 0 ? 'increased' : expenseDiff < 0 ? 'decreased' : 'unchanged';

  const incomeDiff = currentTotalIncome - previousTotalIncome;
  const incomePercentageChange = previousTotalIncome > 0
    ? (incomeDiff / previousTotalIncome) * 100
    : (currentTotalIncome > 0 ? 100 : 0);

  const currentNetBalance = currentTotalIncome - currentTotalExpense;
  const previousNetBalance = previousTotalIncome - previousTotalExpense;
  const netBalanceDiff = currentNetBalance - previousNetBalance;

  const currentSavingsRate = currentTotalIncome > 0
    ? (currentNetBalance / currentTotalIncome) * 100
    : 0;
  const previousSavingsRate = previousTotalIncome > 0
    ? (previousNetBalance / previousTotalIncome) * 100
    : 0;
  const savingsRateDiff = currentSavingsRate - previousSavingsRate;

  // Category Breakdown Comparison
  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const categoryComparisons: CategoryComparisonItem[] = expenseCategories.map((cat) => {
    const cur = currentCatTotals[cat.id] || 0;
    const prev = previousCatTotals[cat.id] || 0;
    const diff = cur - prev;
    const pctChange = prev > 0 ? (diff / prev) * 100 : (cur > 0 ? 100 : 0);

    let trend: 'increased' | 'decreased' | 'unchanged' | 'new' = 'unchanged';
    if (prev === 0 && cur > 0) {
      trend = 'new';
    } else if (diff > 0) {
      trend = 'increased';
    } else if (diff < 0) {
      trend = 'decreased';
    }

    return {
      category: cat,
      currentAmount: cur,
      previousAmount: prev,
      diffAmount: diff,
      percentageChange: pctChange,
      trend,
    };
  });

  // Sort comparisons: Active categories first, sorted by highest current spend
  categoryComparisons.sort((a, b) => {
    const activeA = a.currentAmount > 0 || a.previousAmount > 0 ? 1 : 0;
    const activeB = b.currentAmount > 0 || b.previousAmount > 0 ? 1 : 0;
    if (activeA !== activeB) return activeB - activeA;
    return Math.abs(b.diffAmount) - Math.abs(a.diffAmount);
  });

  // Find extremes
  const increasedList = categoryComparisons.filter((c) => c.diffAmount > 0);
  const decreasedList = categoryComparisons.filter((c) => c.diffAmount < 0);

  const highestIncreaseCategory = increasedList.sort((a, b) => b.diffAmount - a.diffAmount)[0];
  const highestSavingsCategory = decreasedList.sort((a, b) => a.diffAmount - b.diffAmount)[0];

  // Auto-generate Urdu Financial Insights
  const autoInsights: string[] = [];

  // Insight 1: Overall Expense Comparison
  if (previousTotalExpense > 0) {
    if (expenseTrend === 'decreased') {
      autoInsights.push(
        `🎉 خوشخبری! موجودہ مہینے میں آپ کے کل اخراجات پچھلے مہینے کے مقابلے میں ${Math.abs(expensePercentageChange).toFixed(1)}% کم رہے ہیں۔ آپ نے ${Math.abs(expenseDiff).toLocaleString()} روپے کی ٹھوس بچت کی ہے۔`
      );
    } else if (expenseTrend === 'increased') {
      autoInsights.push(
        `⚠️ مالیاتی توجہ: موجودہ مہینے میں اخراجات پچھلے مہینے کے مقابلے میں ${Math.abs(expensePercentageChange).toFixed(1)}% زائد رہے ہیں۔ مجموعی طور پر ${Math.abs(expenseDiff).toLocaleString()} روپے کا اضافی بوجھ پڑا ہے۔`
      );
    } else {
      autoInsights.push('موجودہ مہینے اور پچھلے مہینے کے اخراجات میں استحکام اور برابری رہی ہے۔');
    }
  } else {
    autoInsights.push(
      `موجودہ مہینے کے کل ریکارڈ شدہ اخراجات ${currentTotalExpense.toLocaleString()} روپے ہیں (پچھلے مہینے کا ریکارڈ صفر تھا)۔`
    );
  }

  // Insight 2: Highest Increase Category
  if (highestIncreaseCategory && highestIncreaseCategory.diffAmount > 0) {
    autoInsights.push(
      `📈 سب سے زیادہ اضافہ "${highestIncreaseCategory.category.name}" میں ہوا، جہاں پچھلے مہینے کی نسبت ${highestIncreaseCategory.diffAmount.toLocaleString()} روپے (+${highestIncreaseCategory.percentageChange.toFixed(0)}%) زیادہ خرچ ہوئے۔`
    );
  }

  // Insight 3: Highest Savings Category
  if (highestSavingsCategory && highestSavingsCategory.diffAmount < 0) {
    autoInsights.push(
      `💡 سب سے شاندار کفایت شعاری "${highestSavingsCategory.category.name}" میں حاصل ہوئی، جس میں پچھلے مہینے کے مقابلے میں ${Math.abs(highestSavingsCategory.diffAmount).toLocaleString()} روپے کی کمی لائی گئی۔`
    );
  }

  // Insight 4: Savings Rate / Net Balance
  if (currentSavingsRate > 0) {
    autoInsights.push(
      `🌟 موجودہ مہینے کی بچت کی شرح ${currentSavingsRate.toFixed(1)}% رہی (خالص بیلنس: ${currentNetBalance.toLocaleString()} روپے)۔`
    );
  } else if (currentNetBalance < 0) {
    autoInsights.push(
      `🚨 موجودہ مہینے کے اخراجات آمدنی سے زائد ہیں (خسارہ: ${Math.abs(currentNetBalance).toLocaleString()} روپے)۔ غیر ضروری اخراجات پر فوری نظر ثانی تجویز کی جاتی ہے۔`
    );
  }

  return {
    currentMonth,
    previousMonth,
    currentTotalExpense,
    previousTotalExpense,
    expenseDiff,
    expensePercentageChange,
    expenseTrend,
    currentTotalIncome,
    previousTotalIncome,
    incomeDiff,
    incomePercentageChange,
    currentNetBalance,
    previousNetBalance,
    netBalanceDiff,
    currentSavingsRate,
    previousSavingsRate,
    savingsRateDiff,
    categoryComparisons,
    highestIncreaseCategory,
    highestSavingsCategory,
    autoInsights,
  };
};

