import { ColorThemeChoice } from '../types';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  bgLight: string;
  bgLightHover: string;
  textPrimary: string;
  badgeBg: string;
  ring: string;
  border: string;
  gradient: string;
}

export const THEME_CONFIGS: Record<ColorThemeChoice, ThemeColors> = {
  emerald: {
    primary: 'bg-emerald-600 text-white',
    primaryHover: 'hover:bg-emerald-700',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300',
    bgLightHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
    textPrimary: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    ring: 'focus:ring-emerald-500 focus:border-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    gradient: 'from-emerald-600 to-teal-700',
  },
  sapphire: {
    primary: 'bg-blue-600 text-white',
    primaryHover: 'hover:bg-blue-700',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300',
    bgLightHover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
    textPrimary: 'text-blue-700 dark:text-blue-400',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
    ring: 'focus:ring-blue-500 focus:border-blue-500',
    border: 'border-blue-200 dark:border-blue-800/60',
    gradient: 'from-blue-600 to-indigo-700',
  },
  amber: {
    primary: 'bg-amber-600 text-white',
    primaryHover: 'hover:bg-amber-700',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300',
    bgLightHover: 'hover:bg-amber-100 dark:hover:bg-amber-900/50',
    textPrimary: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    ring: 'focus:ring-amber-500 focus:border-amber-500',
    border: 'border-amber-200 dark:border-amber-800/60',
    gradient: 'from-amber-600 to-yellow-600',
  },
  rose: {
    primary: 'bg-rose-600 text-white',
    primaryHover: 'hover:bg-rose-700',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300',
    bgLightHover: 'hover:bg-rose-100 dark:hover:bg-rose-900/50',
    textPrimary: 'text-rose-700 dark:text-rose-400',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    ring: 'focus:ring-rose-500 focus:border-rose-500',
    border: 'border-rose-200 dark:border-rose-800/60',
    gradient: 'from-rose-600 to-pink-700',
  },
  slate: {
    primary: 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900',
    primaryHover: 'hover:bg-slate-900 dark:hover:bg-white',
    bgLight: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    bgLightHover: 'hover:bg-slate-200 dark:hover:bg-slate-700',
    textPrimary: 'text-slate-800 dark:text-slate-200',
    badgeBg: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    ring: 'focus:ring-slate-500 focus:border-slate-500',
    border: 'border-slate-300 dark:border-slate-700',
    gradient: 'from-slate-800 to-slate-950',
  },
  amethyst: {
    primary: 'bg-purple-600 text-white',
    primaryHover: 'hover:bg-purple-700',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300',
    bgLightHover: 'hover:bg-purple-100 dark:hover:bg-purple-900/50',
    textPrimary: 'text-purple-700 dark:text-purple-400',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
    ring: 'focus:ring-purple-500 focus:border-purple-500',
    border: 'border-purple-200 dark:border-purple-800/60',
    gradient: 'from-purple-600 to-fuchsia-700',
  },
};

export const getThemeConfig = (choice: ColorThemeChoice): ThemeColors => {
  return THEME_CONFIGS[choice] || THEME_CONFIGS.emerald;
};
