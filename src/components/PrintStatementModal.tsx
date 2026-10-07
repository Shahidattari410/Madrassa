import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { formatMoney, formatUrduDate } from '../utils/numberFormat';
import {
  triggerNativePrint,
  downloadOfflinePrintableStatement,
  shareReportMobile,
} from '../utils/printHelper';
import {
  generatePdfFromElement,
  sharePdfToMobilePrinter,
} from '../utils/pdfGenerator';
import {
  X,
  Printer,
  Download,
  Share2,
  Check,
  Type,
  Smartphone,
  FileCheck,
  Sparkles,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface PrintStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintStatementModal: React.FC<PrintStatementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { transactions, categories, report, typography, theme, selectedMonth } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const [notification, setNotification] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);

  if (!isOpen) return null;

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const filtered = selectedMonth === 'all'
    ? transactions
    : transactions.filter((t) => t.date.startsWith(selectedMonth));

  // Compute Daily Income & Expense data for the printable trend chart
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

  const sortedDates = Object.keys(dailyMap).sort().slice(-10); // Last 10 active days for crisp A4 layout
  const maxDailyVal = Math.max(
    1,
    ...sortedDates.map((d) => Math.max(dailyMap[d].income, dailyMap[d].expense))
  );

  // 1. Direct Native Mobile Print (Uses browser & system print spooler)
  const handleDirectPrint = () => {
    setNotification('پرنٹ کمانڈ موبائل سسٹم کو بھیج دی گئی ہے...');
    const success = triggerNativePrint('printable-statement');
    if (!success) {
      handleDownloadPdf();
    } else {
      setTimeout(() => setNotification('اگر پرنٹ ڈائیلاگ نہ کھلے تو بٹن "موبائل سسٹم پرنٹر" استعمال کریں'), 2500);
    }
  };

  // 2. Direct Mobile Print Service Connection (Shares PDF to Android/iOS Print App)
  const handleConnectMobilePrinter = async () => {
    setIsProcessing(true);
    setNotification('موبائل پرنٹ سروس سے کنکشن قائم کیا جا رہا ہے...');
    const result = await sharePdfToMobilePrinter('printable-statement', 'روزمرہ-حساب-کتاب');
    setIsProcessing(false);
    if (result === 'shared') {
      setNotification('موبائل پرنٹر / شیئر ونڈو کامیابی سے کھل چکی ہے!');
    } else if (result === 'downloaded') {
      setNotification('PDF فائل ڈاؤنلوڈ ہو چکی ہے، آپ اسے کسی بھی پرنٹر ایپ میں کھول سکتے ہیں!');
    } else {
      setNotification('پرنٹ فائل تیار ہو گئی ہے!');
    }
    setTimeout(() => setNotification(null), 4000);
  };

  // 3. Crisp Vector/Canvas A4 PDF Generation
  const handleDownloadPdf = async () => {
    setIsProcessing(true);
    setNotification('اعلیٰ معیار کی PDF فائل تیار ہو رہی ہے...');
    const success = await generatePdfFromElement('printable-statement', 'روزمرہ-حساب-کتاب');
    setIsProcessing(false);
    if (success) {
      setNotification('مصدقہ A4 PDF موبائل میں محفوظ ہو چکی ہے!');
    } else {
      handleDownloadOffline();
    }
    setTimeout(() => setNotification(null), 4000);
  };

  // 4. Download Standalone Printable HTML File for Offline
  const handleDownloadOffline = () => {
    const success = downloadOfflinePrintableStatement('printable-statement', 'روزمرہ-حساب-کتاب');
    if (success) {
      setNotification('مکمل پرنٹ شیٹ فائل موبائل میں ڈاؤنلوڈ ہو چکی ہے!');
      setTimeout(() => setNotification(null), 4000);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-sm print-modal-container">
      <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden text-right transition-colors print-modal-card">
        
        {/* Controls Bar (hidden during print) */}
        <div className="no-print px-4 sm:px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex flex-col gap-3 shrink-0 bg-stone-50 dark:bg-stone-800/60">
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>موبائل پرنٹ و پی ڈی ایف سینٹر</span>
                </h3>
                {/* Active Indicator Badge */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>پرنٹ فعال ہے</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
                <span>A4 سائز معیاری گوشوارہ</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-xs">
                  <Type className="w-3 h-3 shrink-0" />
                  <span>فعال فونٹ: {activeFontDisplayName}</span>
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons: Clear, Tactile, and Directly Connected */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            
            {/* Primary Print Button 1: Direct System Print */}
            <button
              onClick={handleDirectPrint}
              disabled={isProcessing}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 text-white ${themeStyles.primary} ${themeStyles.primaryHover}`}
              title="موبائل کے سسٹم پرنٹر ڈائیلاگ سے پرنٹ کریں"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>۱. پرنٹر سے پرنٹ کریں</span>
            </button>

            {/* Primary Button 2: Direct Mobile Print App / Share */}
            <button
              onClick={handleConnectMobilePrinter}
              disabled={isProcessing}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-xs border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              title="موبائل پرنٹ ایپ (Samsung / Android / iOS) یا شیئر کھولیں"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>۲. موبائل پرنٹ ایپ کھولیں</span>
            </button>

            {/* Button 3: Download Clean High-Resolution PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-center gap-2 transition-colors"
              title="موبائل میں مکمل A4 پی ڈی ایف فائل محفوظ کریں"
            >
              <Download className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>۳. PDF محفوظ کریں</span>
            </button>

          </div>

          {/* Chart display toggle in print */}
          <div className="flex items-center justify-between pt-1 text-xs text-stone-600 dark:text-stone-300">
            <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>پرنٹ میں خوبصورت بصری گراف اور کیٹیگری چارٹس شامل رکھیں</span>
              </span>
            </label>
            <span className="text-[11px] text-stone-400">A4 پرنٹ کے لیے خودکار ایڈجسٹ</span>
          </div>

          {/* Notification Feedback */}
          {notification && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

        </div>

        {/* Printable Paper Canvas */}
        <div
          className="p-4 sm:p-8 overflow-y-auto space-y-6 bg-white text-stone-900"
          id="printable-statement"
          style={{ fontFamily: 'var(--app-font-family)' }}
        >
          
          {/* Header */}
          <div className="border-b-2 border-stone-800 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-relaxed">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border border-stone-300 p-3 sm:p-4 rounded-xl text-center">
            <div className="border-l border-stone-200 p-1">
              <div className="text-xs text-stone-500">کل آمدن (Σ Income)</div>
              <div className="text-base sm:text-lg font-bold font-numbers text-emerald-700 mt-1">
                {formatMoney(report.totalIncome, typography.currency, typography.numberSystem)}
              </div>
            </div>

            <div className="border-l border-stone-200 p-1">
              <div className="text-xs text-stone-500">کل اخراجات (Σ Expenses)</div>
              <div className="text-base sm:text-lg font-bold font-numbers text-rose-700 mt-1">
                {formatMoney(report.totalExpense, typography.currency, typography.numberSystem)}
              </div>
            </div>

            <div className="border-l border-stone-200 p-1">
              <div className="text-xs text-stone-500">خالص بیلنس (Net Balance)</div>
              <div className={`text-base sm:text-lg font-bold font-numbers mt-1 ${report.netBalance >= 0 ? 'text-stone-900' : 'text-rose-700'}`}>
                {formatMoney(report.netBalance, typography.currency, typography.numberSystem)}
              </div>
            </div>

            <div className="p-1">
              <div className="text-xs text-stone-500">بچت کی شرح (Savings Rate)</div>
              <div className="text-base sm:text-lg font-bold font-numbers text-amber-700 mt-1">
                {report.savingsRatePercentage.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Visual Financial Charts Section (Exquisite Print Charts) */}
          {includeCharts && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-200">
                
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
          )}

          {/* Category Summary Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-stone-800 mb-2 border-b border-stone-200 pb-1">
              کیٹیگری وائز خلاصہ و تناسب
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
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
            <div className="overflow-x-auto">
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
          </div>

          {/* Verification & Signature footer */}
          <div className="pt-6 sm:pt-8 border-t border-stone-300 grid grid-cols-2 text-xs text-stone-600">
            <div>
              <span>دستخط نگرانِ کھاتہ: ______________________</span>
            </div>
            <div className="text-left font-numbers">
              <span>تاریخ تصدیق: {new Date().toISOString().slice(0, 10)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
