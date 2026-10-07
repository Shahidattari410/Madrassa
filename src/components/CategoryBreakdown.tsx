import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { formatMoney, formatNumber } from '../utils/numberFormat';
import { CategoryIcon } from './CategoryIcon';
import { Category } from '../types';
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Layers,
  Plus,
  Edit2,
  Check,
  X,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface CategoryBreakdownProps {
  onOpenCategoryManager: () => void;
  onFilterByCategory: (categoryId: string) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  onOpenCategoryManager,
  onFilterByCategory,
}) => {
  const { report, categories, updateCategory, typography, theme, categoryFilter, setCategoryFilter } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');
  const [editingBudgetCat, setEditingBudgetCat] = useState<Category | null>(null);
  const [tempBudgetInput, setTempBudgetInput] = useState<string>('');

  const categoriesToShow = activeTab === 'expenses' ? report.expenseCategories : report.incomeCategories;
  const grandTotal = activeTab === 'expenses' ? report.totalExpense : report.totalIncome;

  const handleOpenBudgetEditor = (cat: Category) => {
    setEditingBudgetCat(cat);
    setTempBudgetInput(cat.budgetLimit ? String(cat.budgetLimit) : '');
  };

  const handleSaveBudgetLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudgetCat) return;

    const parsed = tempBudgetInput.trim() ? parseFloat(tempBudgetInput) : undefined;
    updateCategory(editingBudgetCat.id, {
      budgetLimit: parsed && parsed > 0 ? parsed : undefined,
    });
    setEditingBudgetCat(null);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-6 transition-colors">
      
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-stone-500" />
            <span>کیٹیگری وائز مالیاتی تجزیہ اور بجٹ کی حد</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            ہر کیٹیگری کا بجٹ مقرر کریں، تناسب جانچیں اور ڈیٹا میں ترمیم کریں
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Tab */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'expenses'
                  ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-sm font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              اخراجات ({report.expenseCategories.length})
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'income'
                  ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              آمدنی ({report.incomeCategories.length})
            </button>
          </div>

          <button
            onClick={onOpenCategoryManager}
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="کیٹیگریز کا انتظام"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grand Total Indicator */}
      <div className="flex items-center justify-between py-2.5 px-3.5 my-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-xs sm:text-sm">
        <span className="text-stone-600 dark:text-stone-300 font-medium">
          {activeTab === 'expenses' ? 'کل ریکارڈ شدہ اخراجات' : 'کل ریکارڈ شدہ آمدن'}:
        </span>
        <span className="font-bold font-numbers text-stone-900 dark:text-stone-100 text-sm sm:text-base">
          {formatMoney(grandTotal, typography.currency, typography.numberSystem)}
        </span>
      </div>

      {/* Inline Quick Budget Limit Editor Modal */}
      {editingBudgetCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl max-w-sm w-full p-5 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${editingBudgetCat.color}20`, color: editingBudgetCat.color }}
                >
                  <CategoryIcon name={editingBudgetCat.icon} className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  بجٹ کی حد ایڈٹ کریں ({editingBudgetCat.name})
                </h4>
              </div>
              <button
                onClick={() => setEditingBudgetCat(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudgetLimit} className="space-y-3">
              <div>
                <label className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
                  ماہانہ بجٹ کی حد ({typography.currency}):
                </label>
                <input
                  type="number"
                  value={tempBudgetInput}
                  onChange={(e) => setTempBudgetInput(e.target.value)}
                  placeholder="مثلاً: 35000 (خالی چھوڑنے پر کوئی حد نہیں ہوگی)"
                  className="w-full text-right py-2 px-3 text-sm font-numbers rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[10000, 20000, 30000, 50000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTempBudgetInput(String(val))}
                    className="px-2 py-1 rounded-md border border-stone-200 dark:border-stone-700 font-numbers text-[11px] hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTempBudgetInput('')}
                  className="px-2 py-1 rounded-md border border-rose-200 text-rose-600 dark:border-rose-900 text-[11px] hover:bg-rose-50"
                >
                  بجٹ حد ہٹائیں
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingBudgetCat(null)}
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
            </form>
          </div>
        </div>
      )}

      {/* Category List with Rich Typography, Progress, and Direct Edit Buttons */}
      <div className="space-y-3">
        {categoriesToShow.length === 0 ? (
          <div className="text-center py-8 text-stone-500 dark:text-stone-400 text-sm">
            اس دورانیے میں کوئی اندراج موجود نہیں۔
          </div>
        ) : (
          categoriesToShow.map((item) => {
            const isFilterActive = categoryFilter === item.category.id;
            const isOverBudget =
              item.budgetLimit && item.budgetUsagePercentage !== undefined && item.budgetUsagePercentage > 100;

            return (
              <div
                key={item.category.id}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                  isFilterActive
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-400'
                    : 'border-stone-200 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900/40'
                }`}
              >
                {/* Top row: Category name, icon, and amount */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${item.category.color}15`,
                        color: item.category.color,
                      }}
                    >
                      <CategoryIcon name={item.category.icon} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 dark:text-stone-100 truncate text-sm">
                          {item.category.name}
                        </span>
                        {/* Direct Category Edit trigger */}
                        <button
                          onClick={onOpenCategoryManager}
                          className="opacity-40 hover:opacity-100 text-stone-500 transition-opacity p-0.5"
                          title="کیٹیگری تبدیل کریں"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-numbers">{formatNumber(item.transactionCount, typography.numberSystem)} اندراج</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-numbers font-medium text-stone-700 dark:text-stone-300">
                          {formatNumber(item.percentageOfTotal, typography.numberSystem, 1)}% حصہ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <div
                      className={`text-base font-bold font-numbers ${
                        activeTab === 'expenses'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {formatMoney(item.totalAmount, typography.currency, typography.numberSystem)}
                    </div>

                    {/* Filter button */}
                    <button
                      onClick={() => {
                        const newFilter = isFilterActive ? 'all' : item.category.id;
                        setCategoryFilter(newFilter);
                        onFilterByCategory(newFilter);
                      }}
                      className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                        isFilterActive
                          ? 'text-emerald-600 font-bold underline'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                      }`}
                    >
                      <Filter className="w-3 h-3" />
                      <span>{isFilterActive ? 'فلٹر ختم' : 'ریکارڈز'}</span>
                    </button>
                  </div>
                </div>

                {/* Percentage Bar of Total */}
                <div className="mt-2.5">
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, item.percentageOfTotal)}%`,
                        backgroundColor: item.category.color,
                      }}
                    />
                  </div>
                </div>

                {/* Direct Budget Limit Area & Edit Option */}
                {activeTab === 'expenses' && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                    {item.budgetLimit && item.budgetLimit > 0 ? (
                      <div>
                        <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                          <div className="flex items-center gap-1.5">
                            {isOverBudget ? (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                            <span>بجٹ حد: {formatMoney(item.budgetLimit, typography.currency, typography.numberSystem)}</span>
                            
                            {/* Prominent Direct Budget Edit Button */}
                            <button
                              onClick={() => handleOpenBudgetEditor(item.category)}
                              className="inline-flex items-center gap-0.5 text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
                              title="بجٹ کی حد میں ترمیم کریں"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>حد ایڈٹ کریں</span>
                            </button>
                          </div>

                          <span className={`font-numbers font-medium ${isOverBudget ? 'text-rose-600 font-bold' : ''}`}>
                            {formatNumber(item.budgetUsagePercentage || 0, typography.numberSystem, 0)}%
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                          <span>
                            {isOverBudget ? (
                              <span className="text-rose-600 dark:text-rose-400 font-medium">
                                زائد خرچ: {formatMoney(Math.abs(item.budgetRemaining || 0), typography.currency, typography.numberSystem)}
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                بقیہ گنجائش: {formatMoney(item.budgetRemaining || 0, typography.currency, typography.numberSystem)}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* When no budget limit is set: give direct option to set one! */
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>اس کیٹیگری کے لیے کوئی بجٹ حد مقرر نہیں ہے</span>
                        <button
                          onClick={() => handleOpenBudgetEditor(item.category)}
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                        >
                          <Plus className="w-3 h-3" />
                          <span>بجٹ کی حد مقرر کریں</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
