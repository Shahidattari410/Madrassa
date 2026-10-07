import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { getFormulaExplanations } from '../utils/calculations';
import { X, Calculator, Sparkles, Sigma, HelpCircle, CheckCircle2 } from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface FormulaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaGuideModal: React.FC<FormulaGuideModalProps> = ({ isOpen, onClose }) => {
  const { report, typography, theme } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  if (!isOpen) return null;

  const formulas = getFormulaExplanations(report, typography.currency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-right transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${themeStyles.primary}`}>
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                مکمل مالیاتی و حسابی فارمولے (Financial Formulas)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                روزمرہ حساب کتاب کے تمام خودکار حسابی فارمولے اور آپ کے فعال کھاتے کا لائیو حساب
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
          
          {/* Intro Box */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
              <Sigma className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              اس سسٹم میں کوئی بھی تخمینہ فرضی نہیں ہے؛ تمام اعداد و شمار مستند ریاضیاتی فارمولوں کے تحت خودکار طور پر حل ہوتے ہیں۔ نیچے ہر فارمولے کی اصولی تعریف اور آپ کے موجودہ کھاتے کے مطابق عملی قیمتیں درج ہیں:
            </div>
          </div>

          {/* List of Formula Cards */}
          <div className="space-y-4">
            {formulas.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700 transition-all shadow-xs"
              >
                {/* Title & Index */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold font-numbers flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-xs text-stone-400 font-medium">
                    {item.urduName}
                  </span>
                </div>

                {/* Mathematical Formula Display */}
                <div className="p-3 my-2.5 rounded-xl bg-stone-100/70 dark:bg-stone-800/60 font-mono text-xs sm:text-sm text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-stone-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2" dir="ltr">
                  <div className="text-stone-500 dark:text-stone-400 font-sans text-xs">
                    فارمولا:
                  </div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">
                    {item.formulaText}
                  </div>
                </div>

                {/* Substituted Live Calculation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/30 border border-stone-100 dark:border-stone-800">
                    <div className="text-stone-400 mb-0.5">آپ کے فعال ڈیٹا سے حساب:</div>
                    <div className="font-numbers font-medium text-stone-800 dark:text-stone-200">
                      {item.substitutedMath}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <div className="text-emerald-600 dark:text-emerald-400 font-medium mb-0.5">نتیجہ (حتمی قدر):</div>
                    <div className="font-numbers font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                      {item.resultText}
                    </div>
                  </div>
                </div>

                {/* Description & Financial insight */}
                <p className="mt-3 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-100 dark:border-stone-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl text-sm font-medium shadow-sm ${themeStyles.primary} ${themeStyles.primaryHover}`}
          >
            سمجھ آگیا / بند کریں
          </button>
        </div>

      </div>
    </div>
  );
};
