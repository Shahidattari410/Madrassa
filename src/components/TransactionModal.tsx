import React, { useState, useEffect } from 'react';
import { useLedger } from '../context/LedgerContext';
import { PaymentMethod, Transaction, TransactionType } from '../types';
import { CategoryIcon } from './CategoryIcon';
import {
  X,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Banknote,
  Building2,
  Smartphone,
  CreditCard,
  Wallet,
  Tag,
  Check,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTransaction?: Transaction | null;
}

const COMMON_TITLES_EXPENSE = [
  'ماہانہ راشن خریداری',
  'بجلی کا بل',
  'گاڑی میں پیٹرول',
  'گھر کا کرایہ',
  'بچوں کی اسکول فیس',
  'دوائیاں و فارمیسی',
  'ہوٹلنگ و فیملی کھانا',
  'موبائل و انٹرنیٹ پیکج',
  'صدقہ و امداد',
];

const COMMON_TITLES_INCOME = [
  'ماہانہ تنخواہ وصولی',
  'کاروباری آمدن و فروخت',
  'فری لانسنگ پروجیکٹ',
  'مکان / دکان کا کرایہ',
  'تحفہ / بونس رقم',
  'منافع کی وصولی',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialTransaction,
}) => {
  const { categories, addTransaction, updateTransaction, theme, typography } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Categories filtered by transaction type
  const availableCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setCategoryId(initialTransaction.categoryId);
      setAmount(String(initialTransaction.amount));
      setTitle(initialTransaction.title);
      setDate(initialTransaction.date);
      setPaymentMethod(initialTransaction.paymentMethod);
      setNotes(initialTransaction.notes || '');
    } else {
      setType('expense');
      const firstExp = categories.find((c) => c.type === 'expense');
      setCategoryId(firstExp ? firstExp.id : categories[0]?.id || '');
      setAmount('');
      setTitle('');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('cash');
      setNotes('');
    }
    setError('');
  }, [initialTransaction, isOpen, categories]);

  // When type changes, ensure category matches the type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const matching = categories.find((c) => c.type === newType);
    if (matching) {
      setCategoryId(matching.id);
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + addValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('براہ کرم درست رقم درج کریں۔');
      return;
    }

    if (!title.trim()) {
      setError('براہ کرم لین دین کی تفصیل درج کریں۔');
      return;
    }

    if (!categoryId) {
      setError('براہ کرم مناسب کیٹیگری منتخب کریں۔');
      return;
    }

    if (initialTransaction) {
      updateTransaction(initialTransaction.id, {
        type,
        categoryId,
        amount: numAmount,
        title: title.trim(),
        date,
        paymentMethod,
        notes: notes.trim(),
      });
    } else {
      addTransaction({
        type,
        categoryId,
        amount: numAmount,
        title: title.trim(),
        date,
        paymentMethod,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  const quickTitles = type === 'expense' ? COMMON_TITLES_EXPENSE : COMMON_TITLES_INCOME;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden text-right transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                type === 'income' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            >
              {type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {initialTransaction ? 'اندراج میں ترمیم کریں' : 'نیا اندراج درج کریں'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                روزمرہ کی آمدن یا خرچ کا کھاتہ درج کریں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* Type Switcher: Income vs Expense */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 block">
              لین دین کی قسم:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  type === 'expense'
                    ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>اخراجات (Expense)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  type === 'income'
                    ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>آمدنی (Income)</span>
              </button>
            </div>
          </div>

          {/* Amount input & Quick Buttons */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 block">
              رقم ({typography.currency}):
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full text-right py-2.5 px-4 text-xl font-bold font-numbers rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-medium">
                {typography.currency}
              </span>
            </div>

            {/* Quick add buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[500, 1000, 2000, 5000, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 font-numbers"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 block">
              کیٹیگری کا انتخاب:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50/40 dark:bg-stone-800/20">
              {availableCategories.map((c) => {
                const isSelected = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`p-2 rounded-lg border text-right transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500 text-stone-900 dark:text-stone-100 font-bold'
                        : 'border-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${c.color}20`, color: c.color }}
                    >
                      <CategoryIcon name={c.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Quick Urdu Suggestions */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 block">
              تفصیل / اندراج کا نام:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: گھریلو راشن، بجلی کا بل، یا تنخواہ..."
              className="w-full py-2 px-3 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Quick Title Chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {quickTitles.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTitle(t)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 block">
                تاریخ:
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm font-numbers rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 block">
                طریقہ ادائیگی:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="cash">نقد (کیش)</option>
                <option value="bank">آن لائن بینک ٹرانسفر</option>
                <option value="easypaisa">ایزی پیسہ (Easypaisa)</option>
                <option value="jazzcash">جاز کیش (JazzCash)</option>
                <option value="credit">کریڈٹ / ڈیبٹ کارڈ</option>
                <option value="other">ادھار / دیگر</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 block">
              اضافی نوٹس (اختیاری):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="بل نمبر، دکان کا نام یا کوئی اور ضروری تفصیل..."
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{initialTransaction ? 'تبدیلیاں محفوظ کریں' : 'کھاتے میں شامل کریں'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
