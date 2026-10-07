import React, { useState, useMemo } from 'react';
import { useLedger } from '../context/LedgerContext';
import { calculateMonthlyComparison } from '../utils/calculations';
import { formatMoney, formatNumber } from '../utils/numberFormat';
import { CategoryIcon } from './CategoryIcon';
import { triggerNativePrint } from '../utils/printHelper';
import {
  X,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Printer,
  Minus,
  Layers,
  Award,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface MonthlyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrint?: () => void;
}

export const MonthlyComparisonModal: React.FC<MonthlyComparisonModalProps> = ({
  isOpen,
  onClose,
  onOpenPrint,
}) => {
  const { transactions, categories, typography, theme, selectedMonth } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  // Available months from all transactions
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.date) set.add(t.date.slice(0, 7));
    });
    set.add(new Date().toISOString().slice(0, 7));
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Selected target month for comparison (defaults to current month)
  const [targetMonth, setTargetMonth] = useState<string>(
    selectedMonth !== 'all' ? selectedMonth : (availableMonths[0] || new Date().toISOString().slice(0, 7))
  );

  const comparison = useMemo(() => {
    return calculateMonthlyComparison(transactions, categories, targetMonth);
  }, [transactions, categories, targetMonth]);

  if (!isOpen) return null;

  const isExpenseSaved = comparison.expenseTrend === 'decreased';
  const isExpenseIncreased = comparison.expenseTrend === 'increased';

  const handlePrintComparison = () => {
    triggerNativePrint('printable-comparison-section');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-right transition-colors">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50 dark:bg-stone-800/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${themeStyles.primary}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  ماہانہ خودکار تقابلی رپورٹ و خلاصہ
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  خودکار تجزیہ
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                گزشتہ مہینے بمقابلہ موجودہ مہینے کے اخراجات کا جامع تقابل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Month Selector Dropdown */}
            <div className="relative">
              <select
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="py-1.5 px-3 text-xs sm:text-sm font-numbers rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    مہینہ: {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrintComparison}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
              title="تقابلی رپورٹ پرنٹ کریں"
            >
              <Printer className="w-5 h-5 text-emerald-600" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div
          id="printable-comparison-section"
          className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
        >
          
          {/* Months Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <Calendar className="w-4 h-4 text-stone-500" />
              <span>موازنہ برائے دورانیہ:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-numbers font-bold text-stone-800 dark:text-stone-200">
                پچھلا مہینہ: {comparison.previousMonth}
              </span>
              <span className="text-stone-400">بمقابلہ</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 font-numbers font-bold text-emerald-700 dark:text-emerald-300">
                موجودہ مہینہ: {comparison.currentMonth}
              </span>
            </div>

            {/* Quick Status Pill */}
            <div>
              {isExpenseSaved ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>{Math.abs(comparison.expensePercentageChange).toFixed(1)}% اخراجات میں کمی (بچت)</span>
                </span>
              ) : isExpenseIncreased ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300">
                  <TrendingUp className="w-4 h-4 text-rose-600" />
                  <span>+{comparison.expensePercentageChange.toFixed(1)}% اخراجات میں اضافہ</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  <Minus className="w-4 h-4" />
                  <span>اخراجات یکساں و مستحکم</span>
                </span>
              )}
            </div>
          </div>

          {/* 4 Core Metric Comparison Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Card 1: Total Expense Comparison */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isExpenseSaved
                ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80'
            }`}>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium">مجموعی اخراجات</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-numbers ${
                  isExpenseSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {isExpenseSaved ? 'بچت' : 'اضافہ'}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-bold font-numbers text-stone-900 dark:text-stone-100">
                  {formatMoney(comparison.currentTotalExpense, typography.currency, typography.numberSystem)}
                </div>
                <div className="text-[11px] text-stone-500 font-numbers mt-0.5">
                  گزشتہ: {formatMoney(comparison.previousTotalExpense, typography.currency, typography.numberSystem)}
                </div>
              </div>

              <div className={`mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-xs font-numbers font-bold flex items-center justify-between ${
                isExpenseSaved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                <span>فرق: {comparison.expenseDiff > 0 ? '+' : ''}{formatMoney(comparison.expenseDiff, '', typography.numberSystem, false)}</span>
                <span>{comparison.expensePercentageChange > 0 ? '+' : ''}{comparison.expensePercentageChange.toFixed(1)}%</span>
              </div>
            </div>

            {/* Card 2: Total Income Comparison */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium">مجموعی آمدن</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-bold font-numbers text-emerald-600 dark:text-emerald-400">
                  {formatMoney(comparison.currentTotalIncome, typography.currency, typography.numberSystem)}
                </div>
                <div className="text-[11px] text-stone-500 font-numbers mt-0.5">
                  گزشتہ: {formatMoney(comparison.previousTotalIncome, typography.currency, typography.numberSystem)}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs font-numbers text-stone-600 dark:text-stone-300 flex items-center justify-between">
                <span>فرق: {comparison.incomeDiff > 0 ? '+' : ''}{formatMoney(comparison.incomeDiff, '', typography.numberSystem, false)}</span>
                <span>{comparison.incomePercentageChange > 0 ? '+' : ''}{comparison.incomePercentageChange.toFixed(1)}%</span>
              </div>
            </div>

            {/* Card 3: Net Balance Comparison */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium">خالص بیلنس / بچت</span>
                <span className="text-[10px] text-stone-400">Net Balance</span>
              </div>
              
              <div className="mt-2">
                <div className={`text-lg sm:text-xl font-bold font-numbers ${
                  comparison.currentNetBalance >= 0 ? 'text-stone-900 dark:text-stone-100' : 'text-rose-600'
                }`}>
                  {formatMoney(comparison.currentNetBalance, typography.currency, typography.numberSystem)}
                </div>
                <div className="text-[11px] text-stone-500 font-numbers mt-0.5">
                  گزشتہ: {formatMoney(comparison.previousNetBalance, typography.currency, typography.numberSystem)}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs font-numbers text-stone-600 dark:text-stone-300 flex items-center justify-between">
                <span>تبدیلی: {comparison.netBalanceDiff > 0 ? '+' : ''}{formatMoney(comparison.netBalanceDiff, '', typography.numberSystem, false)}</span>
                <span>{comparison.netBalanceDiff >= 0 ? 'بہتری' : 'کمی'}</span>
              </div>
            </div>

            {/* Card 4: Savings Rate Comparison */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium">بچت کی شرح</span>
                <span className="text-[10px] text-amber-500 font-bold font-numbers">Rate %</span>
              </div>
              
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-bold font-numbers text-amber-600 dark:text-amber-400">
                  {comparison.currentSavingsRate.toFixed(1)}%
                </div>
                <div className="text-[11px] text-stone-500 font-numbers mt-0.5">
                  گزشتہ شرح: {comparison.previousSavingsRate.toFixed(1)}%
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs font-numbers text-stone-600 dark:text-stone-300 flex items-center justify-between">
                <span>فرق: {comparison.savingsRateDiff > 0 ? '+' : ''}{comparison.savingsRateDiff.toFixed(1)}%</span>
                <span className={comparison.savingsRateDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {comparison.savingsRateDiff >= 0 ? 'مثبت اضافہ' : 'کمی'}
                </span>
              </div>
            </div>

          </div>

          {/* Visual Side-by-Side Comparison Bars */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-3">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300">
              اخراجات کا تقابلی بصری موازنہ (Visual Comparison)
            </h4>

            {/* Visual Bars */}
            <div className="space-y-2">
              {/* Previous Month Bar */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  <span>پچھلا مہینہ ({comparison.previousMonth}):</span>
                  <span className="font-numbers font-bold">
                    {formatMoney(comparison.previousTotalExpense, typography.currency, typography.numberSystem)}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div
                    className="h-full bg-stone-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        Math.max(comparison.previousTotalExpense, comparison.currentTotalExpense) > 0
                          ? (comparison.previousTotalExpense / Math.max(comparison.previousTotalExpense, comparison.currentTotalExpense)) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Month Bar */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  <span>موجودہ مہینہ ({comparison.currentMonth}):</span>
                  <span className="font-numbers font-bold text-stone-900 dark:text-stone-100">
                    {formatMoney(comparison.currentTotalExpense, typography.currency, typography.numberSystem)}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExpenseSaved ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                    style={{
                      width: `${
                        Math.max(comparison.previousTotalExpense, comparison.currentTotalExpense) > 0
                          ? (comparison.currentTotalExpense / Math.max(comparison.previousTotalExpense, comparison.currentTotalExpense)) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Automatic Intelligent Urdu Insights Box */}
          <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>خودکار مالیاتی نتائج اور تجزیاتی نکات (Auto Summary Insights)</span>
            </div>

            <div className="space-y-2">
              {comparison.autoInsights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Category-by-Category Expense Variance Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-500" />
                <span>ہر کیٹیگری کا تفصیلی تقابل و شرح تبدیلی</span>
              </h4>
              <span className="text-xs text-stone-400">
                کل کیٹیگریز: {comparison.categoryComparisons.length}
              </span>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800">
                    <th className="py-2.5 px-3 font-bold">کیٹیگری</th>
                    <th className="py-2.5 px-3 font-bold">پچھلا مہینہ</th>
                    <th className="py-2.5 px-3 font-bold">موجودہ مہینہ</th>
                    <th className="py-2.5 px-3 font-bold">فرق (روپے)</th>
                    <th className="py-2.5 px-3 font-bold">تبدیلی (%)</th>
                    <th className="py-2.5 px-3 font-bold text-center">کیفیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {comparison.categoryComparisons.map((item) => {
                    const isDiffSaved = item.diffAmount < 0;
                    const isDiffIncreased = item.diffAmount > 0;

                    return (
                      <tr key={item.category.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                        {/* Name and Icon */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${item.category.color}20`, color: item.category.color }}
                            >
                              <CategoryIcon name={item.category.icon} className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-stone-900 dark:text-stone-100">
                              {item.category.name}
                            </span>
                          </div>
                        </td>

                        {/* Previous Month */}
                        <td className="py-2.5 px-3 font-numbers text-stone-600 dark:text-stone-400 whitespace-nowrap">
                          {formatMoney(item.previousAmount, '', typography.numberSystem, false)}
                        </td>

                        {/* Current Month */}
                        <td className="py-2.5 px-3 font-numbers font-bold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                          {formatMoney(item.currentAmount, '', typography.numberSystem, false)}
                        </td>

                        {/* Diff */}
                        <td className={`py-2.5 px-3 font-numbers font-bold whitespace-nowrap ${
                          isDiffSaved ? 'text-emerald-600 dark:text-emerald-400' : isDiffIncreased ? 'text-rose-600 dark:text-rose-400' : 'text-stone-500'
                        }`}>
                          {item.diffAmount > 0 ? '+' : ''}
                          {formatMoney(item.diffAmount, '', typography.numberSystem, false)}
                        </td>

                        {/* Percentage Change */}
                        <td className={`py-2.5 px-3 font-numbers font-bold whitespace-nowrap ${
                          isDiffSaved ? 'text-emerald-600 dark:text-emerald-400' : isDiffIncreased ? 'text-rose-600 dark:text-rose-400' : 'text-stone-500'
                        }`}>
                          {item.percentageChange > 0 ? '+' : ''}
                          {item.percentageChange.toFixed(0)}%
                        </td>

                        {/* Status Badge */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {item.trend === 'decreased' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <ArrowDownRight className="w-3 h-3 text-emerald-600" />
                              <span>بچت ہوئی</span>
                            </span>
                          ) : item.trend === 'increased' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              <ArrowUpRight className="w-3 h-3 text-rose-600" />
                              <span>اضافہ</span>
                            </span>
                          ) : item.trend === 'new' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              <span>نیا اندراج</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                              <span>یکساں</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50 dark:bg-stone-800/40">
          <div className="text-xs text-stone-500">
            ماہانہ خودکار حساب و کتاب · تمام فارمولے خودکار منسلک ہیں
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintComparison}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white shadow-sm flex items-center gap-1.5 active:scale-95 transition-all ${themeStyles.primary}`}
            >
              <Printer className="w-4 h-4" />
              <span>رپورٹ پرنٹ کریں</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              بند کریں
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
