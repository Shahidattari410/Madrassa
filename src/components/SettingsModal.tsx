import React, { useRef, useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { FontFamilyChoice, ColorThemeChoice, NumberSystemChoice } from '../types';
import {
  X,
  Type,
  Palette,
  Sliders,
  RotateCcw,
  Download,
  Upload,
  Check,
  Hash,
  Coins,
  Sun,
  Moon,
  Trash2,
  FileUp,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { getThemeConfig } from '../utils/themeHelper';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FONTS_LIST: { id: FontFamilyChoice; name: string; englishName: string; sample: string }[] = [
  {
    id: 'nastaliq',
    name: 'نوٹو نستعلیق اردو',
    englishName: 'Noto Nastaliq Urdu',
    sample: 'خوبصورت روایتی خطِ نستعلیق برائے حساب و کتاب',
  },
  {
    id: 'gulzar',
    name: 'گلزار نستعلیق',
    englishName: 'Gulzar',
    sample: 'کلاسیکی خوشخط اردو نستعلیقی انداز',
  },
  {
    id: 'naskh',
    name: 'نوٹو نسخ عربی و اردو',
    englishName: 'Noto Sans Arabic',
    sample: 'جدید، واضح اور آسانی سے پڑھا جانے والا خطِ نسخ',
  },
  {
    id: 'amiri',
    name: 'امیری کلاسیکی نسخ',
    englishName: 'Amiri',
    sample: 'ادبی و روایتی اشاعتی خط برائے روزمرہ کھاتہ',
  },
  {
    id: 'lateef',
    name: 'لطیف خط',
    englishName: 'Lateef',
    sample: 'نرم، نفیس اور خوبصورت قلمی تحریر',
  },
  {
    id: 'modern',
    name: 'جدید اسلوب (Modern Sans)',
    englishName: 'Plus Jakarta Sans',
    sample: 'کاروباری اور بین الاقوامی ڈیجیٹل انداز',
  },
];

const THEMES_LIST: { id: ColorThemeChoice; name: string; color: string; border: string }[] = [
  { id: 'emerald', name: 'زمردی اسلامی', color: '#059669', border: 'border-emerald-500' },
  { id: 'sapphire', name: 'شاہی نیلم', color: '#2563eb', border: 'border-blue-500' },
  { id: 'amber', name: 'سنہری امبر', color: '#d97706', border: 'border-amber-500' },
  { id: 'rose', name: 'یاقوتی گلاب', color: '#e11d48', border: 'border-rose-500' },
  { id: 'slate', name: 'سلیٹی وقار', color: '#334155', border: 'border-slate-500' },
  { id: 'amethyst', name: 'جامنی نفاست', color: '#9333ea', border: 'border-purple-500' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    typography,
    theme,
    updateTypography,
    updateTheme,
    uploadCustomFont,
    removeUploadedCustomFont,
    customFontLoaded,
    resetToDefaultData,
    clearAllData,
    exportJSON,
    importJSON,
  } = useLedger();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontUploadInputRef = useRef<HTMLInputElement>(null);
  const themeStyles = getThemeConfig(theme.themeColor);

  const [uploadingFont, setUploadingFont] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  if (!isOpen) return null;

  const handleFontFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFont(true);
    setStatusMessage(null);

    const res = await uploadCustomFont(file);
    setUploadingFont(false);

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `فونٹ "${file.name}" کامیابی سے اپلوڈ ہو گیا اور پوری ویب سائٹ اور پرنٹ رپورٹ پر فعال کر دیا گیا ہے!`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'فونٹ اپلوڈ کرنے میں مسئلہ پیش آیا۔',
      });
    }

    // Reset input so user can re-upload if needed
    if (fontUploadInputRef.current) {
      fontUploadInputRef.current.value = '';
    }
  };

  const handleRemoveCustomFont = async () => {
    await removeUploadedCustomFont();
    setStatusMessage({
      type: 'success',
      text: 'کسٹم فونٹ ہٹا دیا گیا اور ڈیفالٹ نستعلیق فونٹ پر واپس کر دیا گیا ہے۔',
    });
  };

  const handleBackupFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importJSON(content);
      if (success) {
        setStatusMessage({
          type: 'success',
          text: 'کھاتے کا تمام ڈیٹا کامیابی سے بحال (Restore) کر لیا گیا ہے!',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'فائل کی ساخت درست نہیں ہے۔ براہ کرم درست بیک اپ فائل منتخب کریں۔',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right transition-colors">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${themeStyles.primary}`}>
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                فونٹ، سائز اور کلر تھیم کی ترتیبات
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                موبائل سے کسٹم فونٹ اپلوڈ کریں اور رنگین تھیمز منتخب کریں
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

        {/* Status Toast / Alert Box */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:opacity-70 text-stone-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-7">
          
          {/* Section 1: Custom Font Upload from Mobile / PC */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>موبائل یا کمپیوٹر سے نیا فونٹ اپلوڈ کریں</span>
              </label>
              <span className="text-[11px] text-stone-400">فارمیٹس: .ttf, .otf, .woff, .woff2</span>
            </div>

            {/* Custom Font Upload Area */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 text-center space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                <div>
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>اپنا پسندیدہ خط / فونٹ فائل لگائیں</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    مثلاً جمیل نوری نستعلیق، مہر نستعلیق، القلم، یا کوئی بھی پسندیدہ خط۔ اپلوڈ ہونے کے بعد یہ فونٹ پورے صفحے اور پرنٹ رپورٹ پر خودکار کام کرے گا۔
                  </p>
                </div>

                <label className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${themeStyles.primary} ${themeStyles.primaryHover} ${
                  uploadingFont ? 'opacity-70 cursor-wait' : ''
                }`}>
                  <FileUp className="w-4 h-4" />
                  <span>{uploadingFont ? 'اپلوڈ جاری...' : 'موبائل سے فونٹ فائل چنیں'}</span>
                  <input
                    type="file"
                    ref={fontUploadInputRef}
                    onChange={handleFontFileUpload}
                    accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
                    disabled={uploadingFont}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Custom Font Status Card if exists */}
              {(customFontLoaded || typography.fontFamily === 'custom') && (
                <div className="mt-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-3 text-right">
                  <div className="min-w-0 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      فونٹ
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                        {typography.customFontName || 'آپ کا اپلوڈ کردہ کسٹم فونٹ'}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ کامیابی سے محفوظ شدہ اور فعال
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateTypography({ fontFamily: 'custom' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        typography.fontFamily === 'custom'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {typography.fontFamily === 'custom' ? 'منتخب شدہ ہے' : 'اسے منتخب کریں'}
                    </button>

                    <button
                      onClick={handleRemoveCustomFont}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="کسٹم فونٹ ختم کریں"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Standard Built-in Fonts */}
          <section className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Type className="w-4 h-4 text-stone-500" />
                <span>متبادل معیاری اردو فونٹس (Pre-installed Fonts)</span>
              </label>
              <span className="text-xs text-stone-400">کل 6 معیاری خطوط</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FONTS_LIST.map((f) => {
                const isSelected = typography.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => updateTypography({ fontFamily: f.id })}
                    className={`p-3 rounded-xl border text-right transition-all duration-150 relative ${
                      isSelected
                        ? `${themeStyles.border} ${themeStyles.bgLight} ring-2 ring-emerald-500/50 shadow-sm`
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {f.name}
                      </span>
                      {isSelected && (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${themeStyles.primary}`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mb-2">
                      {f.englishName}
                    </div>
                    <div
                      className={`text-xs text-stone-700 dark:text-stone-300 truncate font-${f.id}`}
                    >
                      {f.sample}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Font Size & Line Height */}
          <section className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-500" />
                <span>فونٹ کا سائز اور کشادگی (Size & Spacing)</span>
              </label>
              <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                {typography.fontSize}px / سطر فاصلہ {typography.lineHeight}
              </span>
            </div>

            {/* Quick Size Presets */}
            <div className="flex items-center gap-2 text-xs font-medium">
              {[
                { label: 'چھوٹا (14px)', size: 14 },
                { label: 'معیاری (16px)', size: 16 },
                { label: 'بڑا (18px)', size: 18 },
                { label: 'جلی / نمایاں (20px)', size: 20 },
              ].map((preset) => (
                <button
                  key={preset.size}
                  onClick={() => updateTypography({ fontSize: preset.size })}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-colors ${
                    typography.fontSize === preset.size
                      ? `${themeStyles.primary} border-transparent font-bold`
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Sliders */}
            <div className="space-y-3 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl">
              <div>
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                  <span>حروف کا باریک/موٹا سائز سلائیڈر:</span>
                  <span className="font-mono">{typography.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="13"
                  max="22"
                  step="1"
                  value={typography.fontSize}
                  onChange={(e) => updateTypography({ fontSize: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
                  <span>سطروں کا درمیانی فاصلہ (نستعلیق کے لیے کشادگی):</span>
                  <span className="font-mono">{typography.lineHeight}</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="2.4"
                  step="0.05"
                  value={typography.lineHeight}
                  onChange={(e) => updateTypography({ lineHeight: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Live Text Preview Box */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <div className="text-[11px] text-stone-400 mb-1">
                براہِ راست فعال فونٹ اور سائز کا پیش منظر (Live Preview):
              </div>
              <p
                className="text-stone-800 dark:text-stone-200"
                style={{
                  fontFamily: 'var(--app-font-family)',
                  fontSize: `${typography.fontSize}px`,
                  lineHeight: typography.lineHeight,
                }}
              >
                روزمرہ اخراجات: راشن 18,500 روپے | بجلی بل 14,200 روپے | خالص بچت کی رقم 25,000 روپے۔
              </p>
            </div>
          </section>

          {/* Section 4: Color Themes */}
          <section className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-stone-500" />
                <span>رنگین تھیمز (Color Palette)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateTheme({ isDarkMode: !theme.isDarkMode })}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                >
                  {theme.isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{theme.isDarkMode ? 'لائٹ موڈ' : 'ڈارک موڈ'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEMES_LIST.map((th) => {
                const isSelected = theme.themeColor === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => updateTheme({ themeColor: th.id })}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-right transition-all ${
                      isSelected
                        ? `${th.border} bg-stone-50 dark:bg-stone-800 ring-2 ring-emerald-500/40 shadow-sm`
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: th.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {th.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 5: Number System & Currency */}
          <section className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Hash className="w-4 h-4 text-stone-500" />
              <span>ہندسے اور کرنسی کی قسم (Numerals & Currency)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-stone-500 mb-1.5 block">ہندسوں کا رسم الخط:</span>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => updateTypography({ numberSystem: 'latin' })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-center transition-colors ${
                      typography.numberSystem === 'latin'
                        ? `${themeStyles.primary} border-transparent font-bold`
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    معیاری ہندسے (1 2 3 4 5)
                  </button>
                  <button
                    onClick={() => updateTypography({ numberSystem: 'urdu' })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-center transition-colors ${
                      typography.numberSystem === 'urdu'
                        ? `${themeStyles.primary} border-transparent font-bold`
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    اردو ہندسے (۱ ۲ ۳ ۴ ۵)
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-stone-500 mb-1.5 block">کرنسی لیبل:</span>
                <div className="flex gap-1.5 text-xs">
                  {['روپے', 'PKR', '₹', 'ريال', '$'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => updateTypography({ currency: curr })}
                      className={`flex-1 py-2 rounded-lg border text-center transition-colors ${
                        typography.currency === curr
                          ? `${themeStyles.primary} border-transparent font-bold`
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Backup & Restore */}
          <section className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-stone-500" />
              <span>کھاتہ ڈیٹا بیک اپ اور ری اسٹور (Backup & Restore)</span>
            </label>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={exportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>بیک اپ فائل ڈاؤنلوڈ کریں</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>بیک اپ فائل سے بحال کریں</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleBackupFileUpload}
                  accept=".json"
                  className="hidden"
                />
              </label>

              {/* Inline confirmation for reset */}
              {confirmResetOpen ? (
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                  <span className="text-[11px] text-stone-600 dark:text-stone-300 px-1">کیا یقین ہے؟</span>
                  <button
                    onClick={() => {
                      resetToDefaultData();
                      setConfirmResetOpen(false);
                      setStatusMessage({ type: 'success', text: 'ڈیفالٹ مثالی ڈیٹا بحال کر دیا گیا۔' });
                    }}
                    className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                  >
                    ہاں، ری سیٹ کریں
                  </button>
                  <button
                    onClick={() => setConfirmResetOpen(false)}
                    className="px-2 py-1 text-stone-500 text-[11px]"
                  >
                    منسوخ
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmResetOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ڈیفالٹ مثالی ڈیٹا پر سیٹ کریں</span>
                </button>
              )}

              {/* Inline confirmation for clear */}
              {confirmClearOpen ? (
                <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-1 rounded-lg mr-auto">
                  <span className="text-[11px] text-rose-700 dark:text-rose-300 px-1">تمام ریکارڈز مٹ جائیں گے!</span>
                  <button
                    onClick={() => {
                      clearAllData();
                      setConfirmClearOpen(false);
                      setStatusMessage({ type: 'success', text: 'تمام ریکارڈز صاف کر دیے گئے۔' });
                    }}
                    className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-bold"
                  >
                    ہاں، سب مٹائیں
                  </button>
                  <button
                    onClick={() => setConfirmClearOpen(false)}
                    className="px-2 py-1 text-stone-500 text-[11px]"
                  >
                    منسوخ
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClearOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mr-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تمام اندراجات مٹائیں</span>
                </button>
              )}
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-100 dark:border-stone-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl text-sm font-medium shadow-sm ${themeStyles.primary} ${themeStyles.primaryHover}`}
          >
            محفوظ و بند کریں
          </button>
        </div>

      </div>
    </div>
  );
};
