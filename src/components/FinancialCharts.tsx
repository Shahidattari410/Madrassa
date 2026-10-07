import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { formatMoney, formatNumber } from '../utils/numberFormat';
import { CategoryIcon } from './CategoryIcon';
import { Category } from '../types';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Edit2,
  X,
  Plus,
  Printer,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface FinancialChartsProps {
  onOpenCategoryManager: () => void;
  onOpenPrint?: () => void;
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ onOpenCategoryManager, onOpenPrint }) => {
  const { transactions, categories, report, typography, theme, updateCategory, selectedMonth } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const [chartType, setChartType] = useState<'daily' | 'category'>('category');
  const [editingBudgetCat, setEditingBudgetCat] = useState<Category | null>(null);
  const [budgetInput, setBudgetInput] = useState<string>('');

  const filteredTxs = selectedMonth === 'all'
    ? transactions
    : transactions.filter((t) => t.date.startsWith(selectedMonth));

  // Compute Daily Income & Expense data for the daily chart
  const dailyMap: { [date: string]: { income: number; expense: number } } = {};
  filteredTxs.forEach((tx) => {
    if (!dailyMap[tx.date]) {
      dailyMap[tx.date] = { income: 0, expense: 0 };
    }
    if (tx.type === 'income') {
      dailyMap[tx.date].income += tx.amount;
    } else {
      dailyMap[tx.date].expense += tx.amount;
    }
  });

  const sortedDates = Object.keys(dailyMap).sort().slice(-14); // Last 14 active days
  const maxDayAmount = Math.max(
    1,
    ...sortedDates.map((d) => Math.max(dailyMap[d].income, dailyMap[d].expense))
  );

  const handleOpenBudgetModal = (cat: Category) => {
    setEditingBudgetCat(cat);
    setBudgetInput(cat.budgetLimit ? String(cat.budgetLimit) : '');
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudgetCat) return;

    const parsed = budgetInput.trim() ? parseFloat(budgetInput) : undefined;
    updateCategory(editingBudgetCat.id, {
      budgetLimit: parsed && parsed > 0 ? parsed : undefined,
    });
    setEditingBudgetCat(null);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-6 transition-colors space-y-6">
      
      {/* Chart Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>مالیاتی چارٹس اور تفصیلی حسابی ٹیبل</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            روزمرہ آمدن و اخراجات کا بصری گراف اور کیٹیگری بجٹ کا موازنہ
          </p>
        </div>

        {/* Chart View Switcher and Actions */}
        <div className="flex items-center gap-2">
          {onOpenPrint && (
            <button
              onClick={onOpenPrint}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="موبائل پرنٹ یا Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>موبائل پرنٹ</span>
            </button>
          )}

          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setChartType('category')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                chartType === 'category'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-amber-500" />
              <span>کیٹیگری چارٹ</span>
            </button>

            <button
              onClick={() => setChartType('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                chartType === 'daily'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>یومیہ رجحان گراف</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Graphical Chart Display */}
      {chartType === 'category' ? (
        /* 1. Category Graphical Progress & Share Bars */
        <div className="space-y-4 p-4 rounded-xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-bold mb-2">
            <span>کیٹیگری وائز اخراجات کا گرافیکل حصہ:</span>
            <span className="font-numbers">کل خرچ: {formatMoney(report.totalExpense, typography.currency, typography.numberSystem)}</span>
          </div>

          {/* Multi-segment Colored Stack Bar */}
          <div className="w-full h-4 rounded-lg overflow-hidden flex bg-stone-200 dark:bg-stone-700">
            {report.expenseCategories.map((c) => {
              if (c.percentageOfTotal <= 0) return null;
              return (
                <div
                  key={c.category.id}
                  style={{
                    width: `${c.percentageOfTotal}%`,
                    backgroundColor: c.category.color,
                  }}
                  title={`${c.category.name}: ${c.percentageOfTotal.toFixed(1)}%`}
                  className="h-full transition-all hover:opacity-85"
                />
              );
            })}
          </div>

          {/* Legend Chips with colors */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {report.expenseCategories.slice(0, 8).map((c) => (
              <div
                key={c.category.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.category.color }} />
                <span className="text-stone-800 dark:text-stone-200 truncate max-w-[110px]">{c.category.name}</span>
                <span className="font-numbers font-bold text-stone-500">{c.percentageOfTotal.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2. Daily Comparison Bar Chart */
        <div className="p-4 rounded-xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <span className="font-bold">حالیہ ایام کی آمدن (سبز) بنام اخراجات (سرخ):</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> آمدن
              </span>
              <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> خرچ
              </span>
            </div>
          </div>

          {sortedDates.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">کوئی یومیہ ریکارڈ موجود نہیں</div>
          ) : (
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-44 pt-6 pb-2 border-b border-stone-200 dark:border-stone-700">
              {sortedDates.map((date) => {
                const day = dailyMap[date];
                const incHeight = Math.max(4, (day.income / maxDayAmount) * 100);
                const expHeight = Math.max(4, (day.expense / maxDayAmount) * 100);
                const dayLabel = date.slice(8); // Day digits (e.g. 06)

                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-32">
                      {/* Income Bar */}
                      {day.income > 0 && (
                        <div
                          style={{ height: `${incHeight}%` }}
                          className="w-2 sm:w-3.5 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-600"
                          title={`آمدن: ${day.income.toLocaleString()} (${date})`}
                        />
                      )}
                      {/* Expense Bar */}
                      {day.expense > 0 && (
                        <div
                          style={{ height: `${expHeight}%` }}
                          className="w-2 sm:w-3.5 bg-rose-500 rounded-t-sm transition-all group-hover:bg-rose-600"
                          title={`خرچ: ${day.expense.toLocaleString()} (${date})`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-numbers text-stone-500 group-hover:text-stone-900">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Comprehensive Structured Chart Table */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800">
          <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            کیٹیگری وائز تجزیاتی چارٹ ٹیبل (Analytics & Variance Table)
          </h4>
          <span className="text-xs text-stone-400">تمام شعبوں کا بجٹ اور بچت تناسب</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 border-y border-stone-200 dark:border-stone-800">
                <th className="py-2.5 px-3 font-medium">کیٹیگری</th>
                <th className="py-2.5 px-3 font-medium">خرچ شدہ رقم</th>
                <th className="py-2.5 px-3 font-medium">حصہ (%)</th>
                <th className="py-2.5 px-3 font-medium">بجٹ حد</th>
                <th className="py-2.5 px-3 font-medium">بجٹ پروگریس گراف</th>
                <th className="py-2.5 px-3 font-medium">کیفیت / سٹیٹس</th>
                <th className="py-2.5 px-3 font-medium text-center">بجٹ ایڈٹ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {report.expenseCategories.map((item) => {
                const isOverBudget =
                  item.budgetLimit && item.budgetUsagePercentage !== undefined && item.budgetUsagePercentage > 100;

                return (
                  <tr key={item.category.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition-colors">
                    {/* Category Name & Icon */}
                    <td className="py-3 px-3 whitespace-nowrap">
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

                    {/* Amount */}
                    <td className="py-3 px-3 whitespace-nowrap font-numbers font-bold text-rose-600 dark:text-rose-400">
                      {formatMoney(item.totalAmount, typography.currency, typography.numberSystem)}
                    </td>

                    {/* Share Percentage */}
                    <td className="py-3 px-3 whitespace-nowrap font-numbers text-stone-700 dark:text-stone-300">
                      {formatNumber(item.percentageOfTotal, typography.numberSystem, 1)}%
                    </td>

                    {/* Budget Limit */}
                    <td className="py-3 px-3 whitespace-nowrap font-numbers">
                      {item.budgetLimit && item.budgetLimit > 0 ? (
                        <span className="text-stone-800 dark:text-stone-200 font-medium">
                          {formatMoney(item.budgetLimit, typography.currency, typography.numberSystem)}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">غیر متعین</span>
                      )}
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3 px-3 min-w-[120px]">
                      {item.budgetLimit && item.budgetLimit > 0 ? (
                        <div className="space-y-1">
                          <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isOverBudget ? 'bg-rose-600' : (item.budgetUsagePercentage || 0) > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, item.budgetUsagePercentage || 0)}%` }}
                            />
                          </div>
                          <div className="text-[10px] font-numbers text-stone-500 flex justify-between">
                            <span>{formatNumber(item.budgetUsagePercentage || 0, typography.numberSystem, 0)}% استعمال</span>
                            <span>{item.budgetRemaining && item.budgetRemaining > 0 ? `باقی: ${formatMoney(item.budgetRemaining, '', typography.numberSystem, false)}` : 'ختم'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-stone-400"
                            style={{ width: `${Math.min(100, item.percentageOfTotal)}%` }}
                          />
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {item.budgetLimit && item.budgetLimit > 0 ? (
                        isOverBudget ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-3 h-3" /> زائد خرچ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> بجٹ میں
                          </span>
                        )
                      ) : (
                        <span className="text-stone-400 text-[11px]">بغیر حد</span>
                      )}
                    </td>

                    {/* Direct Edit Button */}
                    <td className="py-3 px-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleOpenBudgetModal(item.category)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 transition-colors"
                        title="اس کیٹیگری کا بجٹ ایڈٹ کریں"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>حد ایڈٹ</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Budget Limit Edit Modal */}
      {editingBudgetCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl max-w-sm w-full p-5 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                بجٹ حد ایڈٹ کریں ({editingBudgetCat.name})
              </h4>
              <button onClick={() => setEditingBudgetCat(null)} className="p-1 text-stone-400 hover:text-stone-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-3">
              <div>
                <label className="text-xs text-stone-500 block mb-1">
                  ماہانہ بجٹ حد ({typography.currency}):
                </label>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="مثلاً: 30000"
                  className="w-full text-right py-2 px-3 text-sm font-numbers rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {[15000, 25000, 40000, 60000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setBudgetInput(String(v))}
                    className="px-2 py-1 rounded-md border border-stone-200 dark:border-stone-700 font-numbers text-[11px]"
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBudgetInput('')}
                  className="px-2 py-1 rounded-md border border-rose-200 text-rose-600 text-[11px]"
                >
                  حد ختم کریں
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingBudgetCat(null)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-100 rounded-lg"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg text-white ${themeStyles.primary}`}
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
