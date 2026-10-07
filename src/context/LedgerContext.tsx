import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Category,
  ColorThemeChoice,
  FontFamilyChoice,
  LedgerFinancialReport,
  ThemeSettings,
  Transaction,
  TypographySettings,
} from '../types';
import { calculateLedgerReport } from '../utils/calculations';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_THEME,
  DEFAULT_TRANSACTIONS,
  DEFAULT_TYPOGRAPHY,
} from '../utils/defaultData';
import {
  applyCustomFontToDOM,
  getCustomFont,
  removeCustomFont as deleteFontFromDB,
  saveCustomFont,
} from '../utils/fontStorage';

interface LedgerContextType {
  transactions: Transaction[];
  categories: Category[];
  typography: TypographySettings;
  theme: ThemeSettings;
  selectedMonth: string; // YYYY-MM or 'all'
  searchQuery: string;
  typeFilter: 'all' | 'income' | 'expense';
  categoryFilter: string; // 'all' or categoryId
  report: LedgerFinancialReport;
  customFontLoaded: boolean;
  
  // Setters & Filters
  setSelectedMonth: (month: string) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (filter: 'all' | 'income' | 'expense') => void;
  setCategoryFilter: (catId: string) => void;
  
  // CRUD Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // CRUD Categories
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Settings
  updateTypography: (settings: Partial<TypographySettings>) => void;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  uploadCustomFont: (file: File) => Promise<{ success: boolean; error?: string }>;
  removeUploadedCustomFont: () => Promise<void>;

  // Data management
  resetToDefaultData: () => void;
  clearAllData: () => void;
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;
  exportCSV: () => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

const FONT_MAP: Record<FontFamilyChoice, string> = {
  nastaliq: "'Noto Nastaliq Urdu', serif",
  gulzar: "'Gulzar', serif",
  naskh: "'Noto Sans Arabic', sans-serif",
  amiri: "'Amiri', serif",
  lateef: "'Lateef', cursive",
  modern: "'Plus Jakarta Sans', sans-serif",
  custom: "'CustomUploadedFont', 'Noto Nastaliq Urdu', serif",
};

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current month default in YYYY-MM format
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('daily_ledger_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('daily_ledger_categories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CATEGORIES;
  });

  const [typography, setTypography] = useState<TypographySettings>(() => {
    try {
      const saved = localStorage.getItem('daily_ledger_typography');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TYPOGRAPHY;
  });

  const [theme, setTheme] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('daily_ledger_theme');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_THEME;
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customFontLoaded, setCustomFontLoaded] = useState<boolean>(false);

  // Initialize custom font from IndexedDB if stored
  useEffect(() => {
    let isMounted = true;
    getCustomFont().then((stored) => {
      if (stored && isMounted) {
        applyCustomFontToDOM(stored.dataUrl, stored.format);
        setCustomFontLoaded(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('daily_ledger_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('daily_ledger_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('daily_ledger_typography', JSON.stringify(typography));
    } catch (e) {
      console.error(e);
    }

    // Apply font variables to root
    const root = document.documentElement;
    root.style.setProperty('--app-font-family', FONT_MAP[typography.fontFamily] || FONT_MAP.nastaliq);
    root.style.setProperty('--app-font-size', `${typography.fontSize}px`);
    root.style.setProperty('--app-line-height', `${typography.lineHeight}`);
  }, [typography]);

  useEffect(() => {
    try {
      localStorage.setItem('daily_ledger_theme', JSON.stringify(theme));
    } catch (e) {
      console.error(e);
    }

    // Apply dark class to body/html
    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Derived financial report based on current month filter
  const report = useMemo(() => {
    const month = selectedMonth === 'all' ? undefined : selectedMonth;
    return calculateLedgerReport(transactions, categories, month);
  }, [transactions, categories, selectedMonth]);

  // Transaction CRUD
  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Category CRUD
  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    };
    setCategories((prev) => [...prev, newCat]);
  }, []);

  const updateCategory = useCallback((id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Typography & Theme setters
  const updateTypography = useCallback((settings: Partial<TypographySettings>) => {
    setTypography((prev) => ({ ...prev, ...settings }));
  }, []);

  const updateTheme = useCallback((settings: Partial<ThemeSettings>) => {
    setTheme((prev) => ({ ...prev, ...settings }));
  }, []);

  const uploadCustomFont = useCallback(
    async (file: File): Promise<{ success: boolean; error?: string }> => {
      try {
        const allowedExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
        const lowerName = file.name.toLowerCase();
        const isValidExt = allowedExtensions.some((ext) => lowerName.endsWith(ext));
        if (!isValidExt) {
          return {
            success: false,
            error: 'براہ کرم درست فونٹ فائل منتخب کریں (.ttf, .otf, .woff, .woff2)',
          };
        }

        // Detect format
        let format = 'opentype';
        if (lowerName.endsWith('.woff2')) format = 'woff2';
        else if (lowerName.endsWith('.woff')) format = 'woff';
        else if (lowerName.endsWith('.ttf')) format = 'truetype';

        // Read file as Data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('فائل پڑھنے میں مسئلہ پیش آیا۔'));
          reader.readAsDataURL(file);
        });

        // Clean display name
        const fontDisplayName = file.name
          .replace(/\.(ttf|otf|woff2|woff)$/i, '')
          .replace(/[-_]/g, ' ')
          .trim();

        // Save to IndexedDB & inject into DOM
        await saveCustomFont(file.name, dataUrl, format);

        // Update typography settings
        setTypography((prev) => ({
          ...prev,
          fontFamily: 'custom',
          customFontName: fontDisplayName,
        }));
        setCustomFontLoaded(true);

        return { success: true };
      } catch (err: any) {
        console.error('Custom font upload error:', err);
        return {
          success: false,
          error: err.message || 'فونٹ اپلوڈ کرنے میں نامعلوم خرابی پیش آئی۔',
        };
      }
    },
    []
  );

  const removeUploadedCustomFont = useCallback(async () => {
    try {
      await deleteFontFromDB();
      setCustomFontLoaded(false);
      setTypography((prev) => ({
        ...prev,
        fontFamily: 'nastaliq',
        customFontName: undefined,
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Backup & Restore
  const resetToDefaultData = useCallback(() => {
    setTransactions(DEFAULT_TRANSACTIONS);
    setCategories(DEFAULT_CATEGORIES);
    setTypography(DEFAULT_TYPOGRAPHY);
    setTheme(DEFAULT_THEME);
    localStorage.removeItem('daily_ledger_transactions');
    localStorage.removeItem('daily_ledger_categories');
    localStorage.removeItem('daily_ledger_typography');
    localStorage.removeItem('daily_ledger_theme');
  }, []);

  const clearAllData = useCallback(() => {
    setTransactions([]);
  }, []);

  const exportJSON = useCallback(() => {
    const backup = {
      version: 1,
      exportDate: new Date().toISOString(),
      transactions,
      categories,
      typography,
      theme,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transactions, categories, typography, theme]);

  const importJSON = useCallback((jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.transactions) && Array.isArray(data.categories)) {
        setTransactions(data.transactions);
        setCategories(data.categories);
        if (data.typography) setTypography(data.typography);
        if (data.theme) setTheme(data.theme);
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  }, []);

  const exportCSV = useCallback(() => {
    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const headers = ['تاریخ', 'قسم', 'کیٹیگری', 'تفصیل', 'رقم (روپے)', 'طریقہ ادائیگی', 'نوٹس'];
    const rows = transactions.map((t) => [
      t.date,
      t.type === 'income' ? 'آمدن' : 'خرچ',
      catMap.get(t.categoryId) || 'نامعلوم',
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      t.paymentMethod,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transactions, categories]);

  return (
    <LedgerContext.Provider
      value={{
        transactions,
        categories,
        typography,
        theme,
        selectedMonth,
        searchQuery,
        typeFilter,
        categoryFilter,
        report,
        customFontLoaded,
        setSelectedMonth,
        setSearchQuery,
        setTypeFilter,
        setCategoryFilter,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        updateTypography,
        updateTheme,
        uploadCustomFont,
        removeUploadedCustomFont,
        resetToDefaultData,
        clearAllData,
        exportJSON,
        importJSON,
        exportCSV,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};
