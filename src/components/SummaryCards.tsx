import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  PieChart,
  Calendar,
  ShieldCheck,
  HelpCircle,
  Layers,
  Clock,
  Printer,
  TrendingDown,
  Sparkles,
  Edit2,
  X,
  Check,
} from 'lucide-react';
import { useLedger } from '../context/LedgerContext';
import { formatMoney, formatNumber } from '../utils/numberFormat';
import { getThemeConfig } from '../utils/themeHelper';

interface SummaryCardsProps {
  onOpenFormulaGuide: () => void;
  onOpenCategoryManager: () => void;
  onOpenPrint: () => void;
  onOpenMonthlyComparison?: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  onOpenFormulaGuide,
  onOpenCategoryManager,
  onOpenPrint,
  onOpenMonthlyComparison,
}) => {
  const { report, categories, typography, theme, updateCategory } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const [isQuickBudgetOpen, setIsQuickBudgetOpen] = useState(false);
  const [selectedCatForBudget, setSelectedCatForBudget] = useState<string>('');
  const [budgetVal, setBudgetVal] = useState<string>('');

  const isSurplus = report.netBalance >= 0;

  // Calculate total monthly budget configured across expense categories
  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const totalBudgetCap = expenseCategories
    .filter((c) => c.budgetLimit)
    .reduce((sum, c) => sum + (c.budgetLimit || 0), 0);

  const budgetUtilizationPercentage =
    totalBudgetCap > 0 ? (report.totalExpense / totalBudgetCap) * 100 : 0;

  // Top spending category
  const topExpense = report.expenseCategories[0];

  const handleQuickMobilePrint = () => {
    onOpenPrint();
  };

  const handleSaveQuickBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatForBudget) return;
    const parsed = budgetVal.trim() ? parseFloat(budgetVal) : undefined;
    updateCategory(selectedCatForBudget, {
      budgetLimit: parsed && parsed > 0 ? parsed : undefined,
    });
    setIsQuickBudgetOpen(false);
    setSelectedCatForBudget('');
    setBudgetVal('');
  };

  return (
    <section className="space-y-3">
      {/* Header and Quick Direct Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>مالیاتی ڈیش بورڈ و خلاصہ</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-normal">
              خودکار حسابی فارمولے
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMonthlyComparison && (
            <button
              onClick={onOpenMonthlyComparison}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs active:scale-95"
              title="پچھلے مہینے بمقابلہ موجودہ مہینے کے اخراجات کی خودکار سمری رپورٹ"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ماہانہ تقابلی سمری</span>
            </button>
          )}

          {/* Direct Mobile Print Button */}
          <button
            onClick={handleQuickMobilePrint}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 ${themeStyles.primary} ${themeStyles.primaryHover}`}
            title="فوری موبائل پرنٹ / Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>فوری موبائل پرنٹ (یا PDF)</span>
          </button>

          <button
            onClick={onOpenFormulaGuide}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>فارمولے جانچیں</span>
          </button>
        </div>
      </div>

      {/* Distinctive Dashboard Layout with High-Density Mini-Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        
        {/* 1. کل آمدن (Income Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">کل آمدن</span>
            <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
              {formatMoney(report.totalIncome, typography.currency, typography.numberSystem)}
            </div>
            <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
              مجموعہ آمدنیات (Σ Inc)
            </div>
          </div>
        </div>

        {/* 2. کل اخراجات (Expense Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 shadow-2xs hover:border-rose-400 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">کل اخراجات</span>
            <div className="w-5 h-5 rounded-md bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-rose-600 dark:text-rose-400 truncate">
              {formatMoney(report.totalExpense, typography.currency, typography.numberSystem)}
            </div>
            <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
              مجموعہ اخراجات (Σ Exp)
            </div>
          </div>
        </div>

        {/* 3. خالص بیلنس (Net Balance Mini-Box) */}
        <div className={`p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border shadow-2xs transition-all ${
          isSurplus
            ? 'border-emerald-300 dark:border-emerald-900/60 hover:border-emerald-400'
            : 'border-rose-300 dark:border-rose-900/60 bg-rose-50/10'
        }`}>
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">خالص بیلنس</span>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
              isSurplus
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
            }`}>
              <Wallet className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className={`text-base sm:text-lg font-bold font-numbers tracking-tight truncate ${
              isSurplus ? 'text-stone-900 dark:text-stone-100' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatMoney(report.netBalance, typography.currency, typography.numberSystem)}
            </div>
            <div className="text-[11px] font-medium mt-0.5 truncate">
              <span className={isSurplus ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {isSurplus ? '✓ محفوظ منافع' : '⚠ بجٹ خسارہ'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. بچت کی شرح (Savings Rate Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/60 shadow-2xs hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">بچت شرح</span>
            <div className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <PieChart className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-amber-600 dark:text-amber-400 truncate">
              {formatNumber(report.savingsRatePercentage, typography.numberSystem, 1)}%
            </div>
            <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
              آمدن کی محفوظ فیصد
            </div>
          </div>
        </div>

        {/* 5. مجموعی بجٹ حد (Total Budget Cap Mini-Box) */}
        <div
          onClick={() => {
            const firstExp = expenseCategories[0]?.id || '';
            setSelectedCatForBudget(firstExp);
            const found = expenseCategories.find((c) => c.id === firstExp);
            setBudgetVal(found?.budgetLimit ? String(found.budgetLimit) : '');
            setIsQuickBudgetOpen(true);
          }}
          className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all group"
          title="بجٹ کی حدود دیکھنے یا ایڈٹ کرنے کے لیے کلک کریں"
        >
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">مجموعی بجٹ حد</span>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600">
              <Layers className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-stone-800 dark:text-stone-200 truncate">
              {totalBudgetCap > 0
                ? formatMoney(totalBudgetCap, typography.currency, typography.numberSystem)
                : 'متعین کریں'}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 truncate flex items-center gap-1">
              <span>✏️ بجٹ ایڈٹ کریں</span>
            </div>
          </div>
        </div>

        {/* 6. بجٹ کا استعمال شدہ تناسب (Budget Utilization Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">بجٹ استعمال</span>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <TrendingDown className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-stone-800 dark:text-stone-200 truncate">
              {totalBudgetCap > 0
                ? `${formatNumber(budgetUtilizationPercentage, typography.numberSystem, 0)}%`
                : 'کوئی حد نہیں'}
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetUtilizationPercentage > 100
                    ? 'bg-rose-500'
                    : budgetUtilizationPercentage > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, budgetUtilizationPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7. یومیہ اوسط خرچ (Daily Avg Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">یومیہ اوسط</span>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <Calendar className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-stone-800 dark:text-stone-200 truncate">
              {formatMoney(Math.round(report.dailyAverageExpense), typography.currency, typography.numberSystem)}
            </div>
            <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
              فی دن اوسط خرچ
            </div>
          </div>
        </div>

        {/* 8. محفوظ یومیہ حد (Safe Daily Spend Cap Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">محفوظ یومیہ حد</span>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-stone-800 dark:text-stone-200 truncate">
              {formatMoney(Math.round(report.remainingDailyBudget), typography.currency, typography.numberSystem)}
            </div>
            <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
              باقی دنوں کے لیے حد
            </div>
          </div>
        </div>

        {/* 9. متوقع ماہانہ خرچ (30D Projection Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">ماہانہ متوقع</span>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-numbers font-bold text-[10px]">
              30D
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-stone-800 dark:text-stone-200 truncate">
              {formatMoney(Math.round(report.projectedMonthlyExpense), typography.currency, typography.numberSystem)}
            </div>
            <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
              مجموعی 30 دن کا تخمینہ
            </div>
          </div>
        </div>

        {/* 10. سب سے بڑا خرچ شعبہ (Top Category Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">سب سے بڑا خرچ</span>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base font-bold text-stone-800 dark:text-stone-200 truncate">
              {topExpense ? topExpense.category.name : 'کوئی نہیں'}
            </div>
            <div className="text-[11px] font-numbers text-rose-600 dark:text-rose-400 font-bold mt-0.5 truncate">
              {topExpense
                ? formatMoney(topExpense.totalAmount, typography.currency, typography.numberSystem)
                : '-'}
            </div>
          </div>
        </div>

        {/* 11. ماہانہ دورانیہ و ایام (Month Days Mini-Box) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-medium">دورانیہ ایام</span>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <Clock className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold font-numbers tracking-tight text-stone-800 dark:text-stone-200 truncate">
              {formatNumber(report.daysRemainingInMonth, typography.numberSystem)} دن باقی
            </div>
            <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
              {formatNumber(report.daysCount, typography.numberSystem)} دن کا اندراج
            </div>
          </div>
        </div>

        {/* 12. فوری پرنٹ منی باکس (Instant Mobile Print Mini-Box) */}
        <div
          onClick={handleQuickMobilePrint}
          className={`p-3 sm:p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-2xs hover:bg-emerald-100/50 cursor-pointer transition-all flex flex-col justify-between`}
          title="موبائل پرنٹ یا پی ڈی ایف فوری شروع کریں"
        >
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs">
            <span className="font-bold">موبائل پرنٹ</span>
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <Printer className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              پرنٹ یا Save PDF
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
              فوری موبائل کمانڈ
            </div>
          </div>
        </div>

      </div>

      {/* Quick Budget Limit Editor Modal */}
      {isQuickBudgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-sm w-full p-5 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  بجٹ کی حد ایڈٹ کریں
                </h4>
              </div>
              <button
                onClick={() => setIsQuickBudgetOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickBudget} className="space-y-3">
              <div>
                <label className="text-xs text-stone-600 dark:text-stone-400 block mb-1 font-medium">
                  کیٹیگری منتخب کریں:
                </label>
                <select
                  value={selectedCatForBudget}
                  onChange={(e) => {
                    const catId = e.target.value;
                    setSelectedCatForBudget(catId);
                    const found = expenseCategories.find((c) => c.id === catId);
                    setBudgetVal(found?.budgetLimit ? String(found.budgetLimit) : '');
                  }}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.budgetLimit ? `(موجودہ حد: ${c.budgetLimit})` : '(کوئی حد نہیں)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-600 dark:text-stone-400 block mb-1 font-medium">
                  ماہانہ بجٹ کی حد ({typography.currency}):
                </label>
                <input
                  type="number"
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(e.target.value)}
                  placeholder="مثلاً: 25000 (خالی چھوڑنے پر حد ہٹ جائے گی)"
                  className="w-full text-right py-2 px-3 text-sm font-numbers rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[5000, 10000, 20000, 30000, 50000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBudgetVal(String(val))}
                    className="px-2 py-1 rounded-md border border-stone-200 dark:border-stone-700 font-numbers text-[11px] hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBudgetVal('')}
                  className="px-2 py-1 rounded-md border border-rose-200 text-rose-600 dark:border-rose-900 text-[11px] hover:bg-rose-50"
                >
                  حد ہٹائیں
                </button>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={onOpenCategoryManager}
                  className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline"
                >
                  تمام کیٹیگریز کھولیں
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickBudgetOpen(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 rounded-lg"
                  >
                    منسوخ
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg text-white shadow-xs ${themeStyles.primary}`}
                  >
                    محفوظ کریں
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
