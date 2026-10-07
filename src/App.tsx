/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { TransactionList } from './components/TransactionList';
import { FinancialCharts } from './components/FinancialCharts';
import { TransactionModal } from './components/TransactionModal';
import { SettingsModal } from './components/SettingsModal';
import { FormulaGuideModal } from './components/FormulaGuideModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { PrintStatementModal } from './components/PrintStatementModal';
import { PrintableSheet } from './components/PrintableSheet';
import { MonthlyComparisonModal } from './components/MonthlyComparisonModal';
import { Transaction } from './types';
import { triggerNativePrint } from './utils/printHelper';
import { Plus, Calculator, Settings, Layers, Printer, BarChart3, BookOpen } from 'lucide-react';
import { getThemeConfig } from './utils/themeHelper';

function MainLedgerApp() {
  const { theme, setCategoryFilter } = useLedger();
  const themeStyles = getThemeConfig(theme.themeColor);

  const [activeTab, setActiveTab] = useState<'ledger' | 'charts' | 'analytics'>('ledger');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFormulaGuideOpen, setIsFormulaGuideOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isMonthlyComparisonOpen, setIsMonthlyComparisonOpen] = useState(false);

  const handleOpenNewTx = () => {
    setEditingTransaction(null);
    setIsTxModalOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const handleFilterByCategory = (catId: string) => {
    setCategoryFilter(catId);
    setActiveTab('ledger');
  };

  const handleOpenPrint = () => {
    // 1. Immediately open the Mobile Print & PDF Hub modal with active feedback
    setIsPrintOpen(true);
    // 2. Trigger native mobile print attempt asynchronously
    setTimeout(() => {
      triggerNativePrint('printable-statement');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors selection:bg-emerald-600 selection:text-white">
      
      {/* 3-Zone Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTx={handleOpenNewTx}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFormulaGuide={() => setIsFormulaGuideOpen(true)}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onOpenPrint={handleOpenPrint}
        onOpenMonthlyComparison={() => setIsMonthlyComparisonOpen(true)}
      />

      {/* Main Container - 1440px desktop presence */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Financial Formulas Summary Cards (12 Compact Mini-Boxes) */}
        <SummaryCards
          onOpenFormulaGuide={() => setIsFormulaGuideOpen(true)}
          onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
          onOpenPrint={handleOpenPrint}
          onOpenMonthlyComparison={() => setIsMonthlyComparisonOpen(true)}
        />

        {/* Mobile Navigation Segmented Tabs */}
        <div className="md:hidden flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'ledger'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>کھاتہ روزنامچہ</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'charts'
                ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>چارٹ و ٹیبل</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>کیٹیگریز و بجٹ</span>
          </button>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'ledger' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Ledger Table (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <TransactionList
                onEditTransaction={handleEditTx}
                onOpenNewTx={handleOpenNewTx}
                onOpenPrint={handleOpenPrint}
                onViewCharts={() => setActiveTab('charts')}
              />
            </div>

            {/* Category Breakdown & Budget Caps (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <CategoryBreakdown
                onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
                onFilterByCategory={handleFilterByCategory}
              />
            </div>
          </div>
        ) : activeTab === 'charts' ? (
          /* Financial Charts and Analytics Table View */
          <div className="max-w-5xl mx-auto space-y-6">
            <FinancialCharts
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
              onOpenPrint={handleOpenPrint}
            />
          </div>
        ) : (
          /* Full Category Breakdown with Budget Caps */
          <div className="max-w-4xl mx-auto space-y-6">
            <CategoryBreakdown
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
              onFilterByCategory={handleFilterByCategory}
            />
          </div>
        )}

      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="md:hidden fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <button
          onClick={handleOpenNewTx}
          className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-white active:scale-95 transition-transform ${themeStyles.primary}`}
          aria-label="نیا اندراج درج کریں"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 py-6 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 dark:text-stone-300">روزمرہ حساب کتاب</span>
            <span aria-hidden="true">·</span>
            <span>مکمل خودکار مالیاتی فارمولے و اردو ٹائپوگرافی</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFormulaGuideOpen(true)}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              حسابی مساوات
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              فونٹ و کلر ترتیبات
            </button>
            <button
              onClick={handleOpenPrint}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              پرنٹ گوشوارہ
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        initialTransaction={editingTransaction}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <FormulaGuideModal
        isOpen={isFormulaGuideOpen}
        onClose={() => setIsFormulaGuideOpen(false)}
      />

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />

      <PrintStatementModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />

      <MonthlyComparisonModal
        isOpen={isMonthlyComparisonOpen}
        onClose={() => setIsMonthlyComparisonOpen(false)}
        onOpenPrint={handleOpenPrint}
      />

      {/* Permanent Printable Sheet for Instant Mobile Native Print */}
      <PrintableSheet />

    </div>
  );
}

export default function App() {
  return (
    <LedgerProvider>
      <MainLedgerApp />
    </LedgerProvider>
  );
}
