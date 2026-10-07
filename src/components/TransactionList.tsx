import React, { useMemo } from 'react';
import { useLedger } from '../context/LedgerContext';
import { Transaction } from '../types';
import { formatMoney, formatUrduDate } from '../utils/numberFormat';
import { triggerNativePrint } from '../utils/printHelper';
import { CategoryIcon } from './CategoryIcon';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  Filter,
  Download,
  Printer,
  Plus,
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
  Wallet,
  BarChart3,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface TransactionListProps {
  onEditTransaction: (tx: Transaction) => void;
  onOpenNewTx: () => void;
  onOpenPrint: () => void;
  onViewCharts?: () => void;
}

const PAYMENT_METHOD_NAMES: Record<string, { label: string; icon: React.FC<any> }> = {
  cash: { label: 'نقد (کیش)', icon: Banknote },
  bank: { label: 'بینک اکاؤنٹ', icon: Building2 },
  easypaisa: { label: 'ایزی پیسہ', icon: Smartphone },
  jazzcash: { label: 'جاز کیش', icon: Smartphone },
  credit: { label: 'کریڈٹ کارڈ', icon: CreditCard },
  other: { label: 'دیگر / ادھار', icon: Wallet },
};

export const TransactionList: React.FC<TransactionListProps> = ({
  onEditTransaction,
  onOpenNewTx,
  onOpenPrint,
  onViewCharts,
}) => {
  const {
    transactions,
    categories,
    typography,
    theme,
    selectedMonth,
    setSelectedMonth,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    deleteTransaction,
    exportCSV,
  } = useLedger();

  const themeStyles = getThemeConfig(theme.themeColor);

  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  // Generate available months from transactions
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.date) set.add(t.date.slice(0, 7));
    });
    // Add current month if not present
    set.add(new Date().toISOString().slice(0, 7));
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month filter
      if (selectedMonth !== 'all' && !tx.date.startsWith(selectedMonth)) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && tx.categoryId !== categoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cat = categoryMap.get(tx.categoryId);
        const matchTitle = (tx.title || '').toLowerCase().includes(q);
        const matchNotes = (tx.notes || '').toLowerCase().includes(q);
        const matchCat = cat?.name.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchNotes && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedMonth, typeFilter, categoryFilter, searchQuery, categoryMap]);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 transition-colors overflow-hidden">
      
      {/* Controls & Filters Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Title & Count */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              روزنامچہ و لین دین کی فہرست
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              <span>کل اندراجات: {filteredTransactions.length}</span>
              <span aria-hidden="true">·</span>
              <span>صاف شفاف مکمل تفصیلات</span>
            </div>
          </div>

          {/* Quick Actions (CSV, Print, New) */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            {onViewCharts && (
              <button
                onClick={onViewCharts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                title="مالیاتی چارٹس اور تجزیاتی ٹیبل دیکھیں"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                <span>چارٹ ٹیبل</span>
              </button>
            )}

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              title="ایکسل / CSV فائل ڈاؤنلوڈ کریں"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ایکسپورٹ CSV</span>
            </button>

            <button
              onClick={onOpenPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              title="فوری موبائل پرنٹ یا Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>موبائل پرنٹ</span>
            </button>

            <button
              onClick={onOpenNewTx}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-all ${themeStyles.primary} ${themeStyles.primaryHover}`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>نیا اندراج</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="تلاش کریں (تفصیل، نام، نوٹس)..."
              className="w-full pr-9 pl-3 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Month Selector */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full pr-9 pl-3 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="all">تمام تاریخیں / تمام مہینے</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  مہینہ: {m}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1 rounded-md transition-all text-center ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              تمام
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1 rounded-md transition-all text-center ${
                typeFilter === 'income'
                  ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              صرف آمدن
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1 rounded-md transition-all text-center ${
                typeFilter === 'expense'
                  ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-sm font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              صرف خرچ
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <Filter className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pr-9 pl-3 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="all">تمام کیٹیگریز</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type === 'income' ? 'آمدن: ' : 'خرچ: '} {c.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear active filter indicator */}
        {(searchQuery || selectedMonth !== 'all' || typeFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
            <span>فلٹرز فعال ہیں</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedMonth('all');
                setTypeFilter('all');
                setCategoryFilter('all');
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              تمام فلٹرز صاف کریں
            </button>
          </div>
        )}
      </div>

      {/* Table & List View */}
      {filteredTransactions.length === 0 ? (
        <div className="py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
            کوئی اندراج نہیں ملا
          </h4>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            دیے گئے فلٹرز کے مطابق کوئی ریکارڈ موجود نہیں، یا ابھی تک کوئی اندراج نہیں کیا گیا۔
          </p>
          <button
            onClick={onOpenNewTx}
            className={`mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl shadow-sm ${themeStyles.primary} ${themeStyles.primaryHover}`}
          >
            <Plus className="w-4 h-4" />
            <span>پہلا اندراج درج کریں</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 text-stone-500 dark:text-stone-400 text-xs">
                <th className="py-3 px-4 font-medium">تاریخ</th>
                <th className="py-3 px-4 font-medium">قسم و کیٹیگری</th>
                <th className="py-3 px-4 font-medium">تفصیل و نوٹس</th>
                <th className="py-3 px-4 font-medium">طریقہ کار</th>
                <th className="py-3 px-4 font-medium text-left">رقم</th>
                <th className="py-3 px-4 font-medium text-center">عمل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {filteredTransactions.map((tx) => {
                const cat = categoryMap.get(tx.categoryId);
                const paymentInfo = PAYMENT_METHOD_NAMES[tx.paymentMethod] || PAYMENT_METHOD_NAMES.cash;
                const isIncome = tx.type === 'income';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onEditTransaction(tx)}
                    className="hover:bg-stone-50/80 dark:hover:bg-stone-800/30 transition-colors group cursor-pointer"
                    title="اندراج میں ترمیم کے لیے کلک کریں"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-600 dark:text-stone-300">
                      <div className="font-medium">
                        {formatUrduDate(tx.date, typography.numberSystem)}
                      </div>
                      <div className="text-[11px] text-stone-400 font-numbers">{tx.date}</div>
                    </td>

                    {/* Category & Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${cat?.color || '#059669'}15`,
                            color: cat?.color || '#059669',
                          }}
                        >
                          <CategoryIcon name={cat?.icon || 'Tag'} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-stone-100">
                            {cat?.name || 'نامعلوم کیٹیگری'}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                            {isIncome ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                                <ArrowUpRight className="w-3 h-3" /> آمدن
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5 font-medium">
                                <ArrowDownLeft className="w-3 h-3" /> خرچ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Title & Notes */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-stone-900 dark:text-stone-100 truncate">
                        {tx.title}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          {tx.notes}
                        </div>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 dark:text-stone-400 text-xs">
                      <div className="inline-flex items-center gap-1.5">
                        <paymentInfo.icon className="w-3.5 h-3.5 text-stone-400" />
                        <span>{paymentInfo.label}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-left font-numbers font-bold text-sm sm:text-base">
                      <span
                        className={
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatMoney(tx.amount, typography.currency, typography.numberSystem)}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTransaction(tx);
                          }}
                          className="px-2 py-1 rounded-md text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1"
                          title="اندراج میں ترمیم کریں"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>ایڈٹ</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTransaction(tx.id);
                          }}
                          className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
