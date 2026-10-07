import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { formatMoney, formatUrduDate } from '../utils/numberFormat';
import { BarChart3 } from 'lucide-react';

export const PrintableSheet: React.FC = () => {
  const { transactions, categories, report, typography, selectedMonth } = useLedger();

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const filtered = selectedMonth === 'all'
    ? transactions
    : transactions.filter((t) => t.date.startsWith(selectedMonth));

  // Daily trend calculations for print charts
  const dailyMap: { [date: string]: { income: number; expense: number } } = {};
  filtered.forEach((tx) => {
    if (!dailyMap[tx.date]) {
      dailyMap[tx.date] = { income: 0, expense: 0 };
    }
    if (tx.type === 'income') {
      dailyMap[tx.date].income += tx.amount;
    } else {
      dailyMap[tx.date].expense += tx.amount;
    }
  });

  const sortedDates = Object.keys(dailyMap).sort().slice(-10);
  const maxDailyVal = Math.max(
    1,
    ...sortedDates.map((d) => Math.max(dailyMap[d].income, dailyMap[d].expense))
  );

  const activeFontDisplayName = typography.fontFamily === 'custom'
    ? (typography.customFontName || 'آپ کا اپلوڈ کردہ کسٹم فونٹ')
    : typography.fontFamily === 'nastaliq'
    ? 'نوٹو نستعلیق اردو'
    : typography.fontFamily === 'gulzar'
    ? 'گلزار نستعلیق'
    : typography.fontFamily === 'naskh'
    ? 'نوٹو نسخ'
    : typography.fontFamily === 'amiri'
    ? 'امیری خط'
    : typography.fontFamily === 'lateef'
    ? 'لطیف خط'
    : 'جدید اسلوب';

  return (
    <div
      id="printable-background-sheet"
      className="fixed -left-[9999px] top-0 w-full max-w-4xl bg-white text-stone-900 p-6 space-y-6 print:static print:left-auto print:block print:w-full print:p-0"
      style={{ fontFamily: 'var(--app-font-family)' }}
      dir="rtl"
    >
      {/* Header */}
      <div className="border-b-2 border-stone-800 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 leading-relaxed">
            روزمرہ حساب کتاب و مالیاتی گوشوارہ
          </h1>
          <div className="text-xs text-stone-600 mt-1">
            دورانیہ: {selectedMonth === 'all' ? 'تمام ریکارڈز' : `ماہ: ${selectedMonth}`} | تاریخ اجراء: {new Date().toLocaleDateString('ur-PK')}
          </div>
        </div>
        <div className="text-left font-numbers text-xs text-stone-500">
          <div>صفحہ: 1 / 1</div>
          <div>سٹیٹس: مصدقہ حسابی گوشوارہ</div>
          <div className="text-[10px] text-stone-400 font-sans mt-0.5">فونٹ: {activeFontDisplayName}</div>
        </div>
      </div>

      {/* Financial Summary Matrix with Formulas */}
      <div className="grid grid-cols-4 gap-3 border border-stone-300 p-4 rounded-xl text-center">
        <div className="border-l border-stone-200">
          <div className="text-xs text-stone-500">کل آمدن (Σ Income)</div>
          <div className="text-lg font-bold font-numbers text-emerald-700 mt-1">
            {formatMoney(report.totalIncome, typography.currency, typography.numberSystem)}
          </div>
        </div>

        <div className="border-l border-stone-200">
          <div className="text-xs text-stone-500">کل اخراجات (Σ Expenses)</div>
          <div className="text-lg font-bold font-numbers text-rose-700 mt-1">
            {formatMoney(report.totalExpense, typography.currency, typography.numberSystem)}
          </div>
        </div>

        <div className="border-l border-stone-200">
          <div className="text-xs text-stone-500">خالص بیلنس (Net Balance)</div>
          <div className={`text-lg font-bold font-numbers mt-1 ${report.netBalance >= 0 ? 'text-stone-900' : 'text-rose-700'}`}>
            {formatMoney(report.netBalance, typography.currency, typography.numberSystem)}
          </div>
        </div>

        <div>
          <div className="text-xs text-stone-500">بچت کی شرح (Savings Rate)</div>
          <div className="text-lg font-bold font-numbers text-amber-700 mt-1">
            {report.savingsRatePercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Visual Financial Charts Section (Exquisite Print Charts) */}
      <div className="border border-stone-300 rounded-xl p-3 sm:p-4 space-y-3 bg-stone-50/60 print:bg-white print:border-stone-300 break-inside-avoid">
        
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span>بصری مالیاتی گراف اور کیٹیگری چارٹس (Financial Charts & Analytics)</span>
          </h3>
          <div className="text-[11px] text-stone-500 font-numbers flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block"></span>
              <span>آمدن</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block"></span>
              <span>اخراجات</span>
            </span>
          </div>
        </div>

        {/* 1. Multi-Color Category Expense Distribution Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-stone-700">
            <span className="font-bold">کیٹیگری وائز اخراجات کا تناسبی حصہ:</span>
            <span className="font-numbers text-stone-500">
              کل خرچ: {formatMoney(report.totalExpense, typography.currency, typography.numberSystem)}
            </span>
          </div>

          {/* Stacked Percentage Bar */}
          <div className="w-full h-3.5 rounded-md overflow-hidden flex bg-stone-200 border border-stone-300">
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
                  className="h-full"
                />
              );
            })}
          </div>

          {/* Color Legend Chips */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5 text-[10px]">
            {report.expenseCategories.slice(0, 6).map((c) => (
              <div key={c.category.id} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.category.color }} />
                <span className="text-stone-700">{c.category.name}:</span>
                <span className="font-numbers font-bold text-stone-900">{c.percentageOfTotal.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Side-by-Side Comparison: Category Budget Progress Bars & Daily Trend Columns */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-stone-200">
          
          {/* Left Column: Top Categories Budget & Share Progress */}
          <div className="space-y-2 border-l border-stone-200 pl-2">
            <div className="text-[11px] font-bold text-stone-800 flex justify-between">
              <span>کیٹیگری بجٹ و استعمال گراف</span>
              <span className="text-[10px] text-stone-500">پروگریس بارز</span>
            </div>

            <div className="space-y-2">
              {report.expenseCategories.slice(0, 4).map((item) => {
                const isOver = item.budgetLimit && item.budgetUsagePercentage && item.budgetUsagePercentage > 100;
                return (
                  <div key={item.category.id} className="text-[11px] space-y-0.5">
                    <div className="flex justify-between items-center text-stone-700">
                      <span className="font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.category.color }} />
                        <span>{item.category.name}</span>
                      </span>
                      <span className="font-numbers font-bold">
                        {formatMoney(item.totalAmount, '', typography.numberSystem, false)} ({item.percentageOfTotal.toFixed(0)}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, item.budgetLimit ? (item.budgetUsagePercentage || 0) : item.percentageOfTotal)}%`,
                          backgroundColor: isOver ? '#e11d48' : item.category.color,
                        }}
                      />
                    </div>
                    {item.budgetLimit ? (
                      <div className="flex justify-between text-[10px] text-stone-500 font-numbers">
                        <span>بجٹ حد: {formatMoney(item.budgetLimit, '', typography.numberSystem, false)}</span>
                        <span className={isOver ? 'text-rose-600 font-bold' : 'text-emerald-700'}>
                          {item.budgetUsagePercentage?.toFixed(0)}% استعمال
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Daily Income vs Expense Trend Bar Chart */}
          <div className="space-y-2 pr-1">
            <div className="text-[11px] font-bold text-stone-800 flex justify-between">
              <span>یومیہ آمدن بمقابلہ اخراجات رجحان</span>
              <span className="text-[10px] text-stone-500">حالیہ ایام کا تقابلی گراف</span>
            </div>

            {sortedDates.length === 0 ? (
              <div className="text-center py-6 text-[11px] text-stone-400">کوئی یومیہ ریکارڈ موجود نہیں</div>
            ) : (
              <div className="h-28 flex items-end justify-between gap-1 pt-3 border-b border-stone-200 px-1">
                {sortedDates.map((dateKey) => {
                  const data = dailyMap[dateKey];
                  const incHeight = Math.max(4, Math.round((data.income / maxDailyVal) * 80));
                  const expHeight = Math.max(4, Math.round((data.expense / maxDailyVal) * 80));
                  const label = dateKey.slice(5); // MM-DD

                  return (
                    <div key={dateKey} className="flex-1 flex flex-col items-center h-full justify-end">
                      {/* Bars Pair */}
                      <div className="flex items-end gap-0.5 w-full justify-center h-20">
                        {/* Income Bar */}
                        <div
                          style={{ height: `${incHeight}%` }}
                          className="w-2.5 sm:w-3 bg-emerald-600 rounded-t-xs"
                          title={`${dateKey} آمدن: ${data.income}`}
                        />
                        {/* Expense Bar */}
                        <div
                          style={{ height: `${expHeight}%` }}
                          className="w-2.5 sm:w-3 bg-rose-600 rounded-t-xs"
                          title={`${dateKey} خرچ: ${data.expense}`}
                        />
                      </div>
                      {/* Date Label */}
                      <span className="text-[9px] font-numbers text-stone-500 mt-1 whitespace-nowrap scale-90 origin-top">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Category Summary Breakdown */}
      <div>
        <h3 className="text-sm font-bold text-stone-800 mb-2 border-b border-stone-200 pb-1">
          کیٹیگری وائز خلاصہ و تناسب
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {report.expenseCategories.map((c) => (
            <div key={c.category.id} className="p-2 border border-stone-200 rounded-lg flex justify-between">
              <span className="font-medium text-stone-700">{c.category.name}</span>
              <span className="font-numbers font-bold text-stone-900">
                {formatMoney(c.totalAmount, typography.currency, typography.numberSystem)} ({c.percentageOfTotal.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Transactions Table */}
      <div>
        <h3 className="text-sm font-bold text-stone-800 mb-2 border-b border-stone-200 pb-1">
          تفصیلی روزنامچہ و اندراجات ({filtered.length})
        </h3>
        <table className="w-full text-right text-xs border border-stone-300">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-300">
              <th className="p-2">تاریخ</th>
              <th className="p-2">قسم</th>
              <th className="p-2">کیٹیگری</th>
              <th className="p-2">تفصیل</th>
              <th className="p-2">طریقہ کار</th>
              <th className="p-2 text-left">رقم ({typography.currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {filtered.map((tx) => {
              const cat = categoryMap.get(tx.categoryId);
              const isInc = tx.type === 'income';
              return (
                <tr key={tx.id}>
                  <td className="p-2 whitespace-nowrap font-numbers">{tx.date}</td>
                  <td className="p-2 whitespace-nowrap font-medium">
                    {isInc ? 'آمدن' : 'خرچ'}
                  </td>
                  <td className="p-2 whitespace-nowrap">{cat?.name}</td>
                  <td className="p-2 max-w-xs truncate">{tx.title}</td>
                  <td className="p-2 whitespace-nowrap text-stone-500">{tx.paymentMethod}</td>
                  <td className="p-2 text-left font-numbers font-bold whitespace-nowrap">
                    {isInc ? '+' : '-'} {formatMoney(tx.amount, '', typography.numberSystem, false)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Verification & Signature footer */}
      <div className="pt-8 border-t border-stone-300 grid grid-cols-2 text-xs text-stone-600">
        <div>
          <span>دستخط نگرانِ کھاتہ: ______________________</span>
        </div>
        <div className="text-left font-numbers">
          <span>تاریخ تصدیق: {new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </div>
  );
};
