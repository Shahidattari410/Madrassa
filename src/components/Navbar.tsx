import React from 'react';
import { Settings, Plus, BookOpen, Layers, Printer, Moon, Sun, Calculator, BarChart3, Sparkles } from 'lucide-react';
import { useLedger } from '../context/LedgerContext';
import { triggerNativePrint } from '../utils/printHelper';
import { getThemeConfig } from '../utils/themeHelper';

interface NavbarProps {
  activeTab: 'ledger' | 'charts' | 'analytics';
  setActiveTab: (tab: 'ledger' | 'charts' | 'analytics') => void;
  onOpenNewTx: () => void;
  onOpenSettings: () => void;
  onOpenFormulaGuide: () => void;
  onOpenCategoryManager: () => void;
  onOpenPrint: () => void;
  onOpenMonthlyComparison?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTx,
  onOpenSettings,
  onOpenFormulaGuide,
  onOpenCategoryManager,
  onOpenPrint,
  onOpenMonthlyComparison,
}) => {
  const { theme, updateTheme } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const handlePrintClick = () => {
    onOpenPrint();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${themeStyles.primary}`}>
              ح
            </div>
            <a
              href="#home"
              className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
            >
              روزمرہ حساب کتاب
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'ledger'
                  ? `${themeStyles.bgLight} font-bold`
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              کھاتہ و روزنامچہ
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'charts'
                  ? `${themeStyles.bgLight} font-bold`
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>چارٹ و ٹیبل</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? `${themeStyles.bgLight} font-bold`
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              کیٹیگری وائز تجزیہ
            </button>

            <button
              onClick={onOpenCategoryManager}
              className="px-3 py-2 text-sm font-medium rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>کیٹیگریز</span>
            </button>

            <button
              onClick={onOpenFormulaGuide}
              className="px-3 py-2 text-sm font-medium rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" />
              <span>مالیاتی فارمولے</span>
            </button>

            {onOpenMonthlyComparison && (
              <button
                onClick={onOpenMonthlyComparison}
                className="px-3 py-2 text-sm font-medium rounded-lg text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors whitespace-nowrap flex items-center gap-1.5"
                title="پچھلے مہینے بمقابلہ موجودہ مہینے کا تقابلی جائزہ"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>ماہانہ تقابلی رپورٹ</span>
              </button>
            )}

            <button
              onClick={handlePrintClick}
              className="px-3 py-2 text-sm font-medium rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap flex items-center gap-1.5"
              title="موبائل پرنٹ یا پی ڈی ایف گوشوارہ"
            >
              <Printer className="w-4 h-4" />
              <span>موبائل پرنٹ</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrintClick}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="فوری موبائل پرنٹ / Save as PDF"
              aria-label="Print Statement"
            >
              <Printer className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            <button
              onClick={() => updateTheme({ isDarkMode: !theme.isDarkMode })}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={theme.isDarkMode ? 'لائٹ موڈ' : 'ڈارک موڈ'}
              aria-label="Toggle Dark Mode"
            >
              {theme.isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              title="فونٹ اور تھیم سیٹنگز"
              aria-label="Typography and Color Settings"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden xl:inline text-xs font-medium">فونٹ و کلر سیٹنگ</span>
            </button>

            <button
              onClick={onOpenNewTx}
              className={`px-3.5 py-2 text-sm font-medium rounded-xl shadow-sm transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${themeStyles.primary} ${themeStyles.primaryHover}`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>نیا اندراج</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
