import { NumberSystemChoice } from '../types';

const URDU_DIGITS: { [key: string]: string } = {
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
  '.': '٫',
  ',': '٬',
};

export const toUrduDigits = (input: string | number): string => {
  const str = String(input);
  return str.replace(/[0-9.,]/g, (match) => URDU_DIGITS[match] || match);
};

export const formatMoney = (
  amount: number,
  currency: string = 'روپے',
  numberSystem: NumberSystemChoice = 'latin',
  showCurrency: boolean = true
): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format with standard grouping
  const formattedStandard = absAmount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  const displayDigits = numberSystem === 'urdu' ? toUrduDigits(formattedStandard) : formattedStandard;
  const sign = isNegative ? '-' : '';

  if (!showCurrency) {
    return `${sign}${displayDigits}`;
  }

  return `${sign}${displayDigits} ${currency}`;
};

export const formatNumber = (
  val: number,
  numberSystem: NumberSystemChoice = 'latin',
  fractionDigits: number = 0
): string => {
  const standard = val.toLocaleString('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
  return numberSystem === 'urdu' ? toUrduDigits(standard) : standard;
};

const URDU_MONTHS: { [key: number]: string } = {
  0: 'جنوری',
  1: 'فروری',
  2: 'مارچ',
  3: 'اپریل',
  4: 'مئی',
  5: 'جون',
  6: 'جولائی',
  7: 'اگست',
  8: 'ستمبر',
  9: 'اکتوبر',
  10: 'نومبر',
  11: 'دسمبر',
};

export const formatUrduDate = (
  dateStr: string,
  numberSystem: NumberSystemChoice = 'latin'
): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const monthName = URDU_MONTHS[monthIdx] || parts[1];
  const dayFormatted = numberSystem === 'urdu' ? toUrduDigits(day) : day;
  const yearFormatted = numberSystem === 'urdu' ? toUrduDigits(year) : year;

  return `${dayFormatted} ${monthName} ${yearFormatted}`;
};
