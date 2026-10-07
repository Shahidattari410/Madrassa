import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { Category, TransactionType } from '../types';
import { AVAILABLE_ICONS, CategoryIcon } from './CategoryIcon';
import {
  X,
  Plus,
  Layers,
  Edit2,
  Trash2,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#059669', // Emerald
  '#0284c7', // Sky
  '#2563eb', // Blue
  '#4f46e5', // Indigo
  '#7c3aed', // Purple
  '#9333ea', // Fuchsia
  '#db2777', // Pink
  '#dc2626', // Red
  '#ea580c', // Orange
  '#d97706', // Amber
  '#65a30d', // Lime
  '#0891b2', // Cyan
  '#475569', // Slate
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, addCategory, updateCategory, deleteCategory, theme, typography } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // New/Edit category form state
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#059669');
  const [budgetLimit, setBudgetLimit] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type);
    setIcon(cat.icon);
    setColor(cat.color);
    setBudgetLimit(cat.budgetLimit ? String(cat.budgetLimit) : '');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setType(activeTab);
    setIcon('Tag');
    setColor('#059669');
    setBudgetLimit('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedLimit = budgetLimit ? parseFloat(budgetLimit) : undefined;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        type,
        icon,
        color,
        budgetLimit: type === 'expense' ? parsedLimit : undefined,
      });
    } else {
      addCategory({
        name: name.trim(),
        type,
        icon,
        color,
        budgetLimit: type === 'expense' ? parsedLimit : undefined,
      });
    }

    handleCancelEdit();
  };

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${themeStyles.primary}`}>
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                کیٹیگریز کا انتظام اور بجٹ کی حد
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                اپنی ضروریات کے مطابق نئی کیٹیگریز بنائیں یا بجٹ لمٹ طے کریں
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

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Add / Edit Form Card */}
          <form
            onSubmit={handleSave}
            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {editingCategory ? 'کیٹیگری میں ترمیم کریں:' : 'نئی کیٹیگری کا اضافہ کریں:'}
              </span>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-rose-600 hover:underline"
                >
                  منسوخ کریں
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name */}
              <div>
                <label className="text-xs text-stone-500 mb-1 block">کیٹیگری کا نام:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: گاڑی مرمت، اسکول کتابیں..."
                  className="w-full py-1.5 px-3 text-xs sm:text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Type Switcher */}
              <div>
                <label className="text-xs text-stone-500 mb-1 block">قسم:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                  className="w-full py-1.5 px-3 text-xs sm:text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="expense">اخراجات (Expense)</option>
                  <option value="income">آمدنی (Income)</option>
                </select>
              </div>

              {/* Budget limit if expense */}
              {type === 'expense' && (
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">
                    ماہانہ بجٹ کی حد ({typography.currency} - اختیاری):
                  </label>
                  <input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    placeholder="مثلاً: 25000"
                    className="w-full py-1.5 px-3 text-xs sm:text-sm font-numbers rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Color Preset */}
              <div>
                <label className="text-xs text-stone-500 mb-1 block">رنگ منتخب کریں:</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-5 h-5 rounded-md transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-stone-900 dark:ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="text-xs text-stone-500 mb-1 block">علامت / آئیکون:</label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`p-1.5 rounded-md transition-colors ${
                      icon === ic
                        ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                        : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <CategoryIcon name={ic} className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className={`px-4 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 ${themeStyles.primary} ${themeStyles.primaryHover}`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{editingCategory ? 'تبدیلی محفوظ کریں' : 'کیٹیگری شامل کریں'}</span>
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setActiveTab('expense')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'expense'
                      ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-sm font-bold'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  اخراجات کیٹیگریز
                </button>
                <button
                  onClick={() => setActiveTab('income')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'income'
                      ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  آمدنی کیٹیگریز
                </button>
              </div>

              <span className="text-xs text-stone-500">
                مجموعی تعداد: {filteredCategories.length}
              </span>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
              {filteredCategories.map((c) => (
                <div
                  key={c.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${c.color}20`, color: c.color }}
                    >
                      <CategoryIcon name={c.icon} className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {c.name}
                      </div>
                      {c.budgetLimit ? (
                        <div className="text-xs text-stone-500 dark:text-stone-400 font-numbers">
                          ماہانہ حد: {c.budgetLimit.toLocaleString()} {typography.currency}
                        </div>
                      ) : (
                        <div className="text-[11px] text-stone-400">بجٹ حد متعین نہیں</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(c)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="ترمیم"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteCategory(c.id);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-100 dark:border-stone-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl text-sm font-medium shadow-sm ${themeStyles.primary} ${themeStyles.primaryHover}`}
          >
            مکمل / بند کریں
          </button>
        </div>

      </div>
    </div>
  );
};
