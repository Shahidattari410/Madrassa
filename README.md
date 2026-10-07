# روزمرہ حساب کتاب (Daily Ledger & Bookkeeping) 📊✨

ایک مکمل، خوبصورت، تیز رفتار اور جدید روزمرہ کیش بک و حسابی کھاتہ ایپ جو خاص طور پر اردو زبان، موبائل پرنٹنگ، ماہانہ تقابلی رپورٹس اور بجٹ مینجمنٹ کے لیے تیار کی گئی ہے۔

![App Preview](https://raw.githubusercontent.com/username/daily-ledger-urdu/main/public/banner.png)

---

## 🌟 اہم خصوصیات (Key Features)

1. **موبائل سے فوری پرنٹ و شیئر (Direct Mobile Printing & Web Share)**
   - موبائل پرنٹ ایپ (Android Print Spooler / iOS AirPrint) سے فوری رابطہ۔
   - معیاری A4 فارمیٹ پر ہائی ریزولوشن پی ڈی ایف (PDF) ڈاؤنلوڈ اور سسٹم شیئر۔
   - پرنٹ میں چارٹس، کیٹیگری بریک ڈاؤن اور ٹرانزیکشن ہسٹری کی خوبصورت ڈسپلے۔

2. **ماہانہ خودکار تقابلی سمری رپورٹ (Automated Monthly Comparative Report)**
   - رواں ماہ اور پچھلے ماہ کے اخراجات و آمدن کا خودکار موازنہ۔
   - فیصد میں کمی بیشی اور کیٹیگری کے لحاظ سے تفصیلی تجاویز۔
   - ون کلک پرنٹ اور موبائل شیئرنگ۔

3. **تمام ڈیٹا میں ایڈیٹنگ اور بجٹ کی حد بندی (Full Inline Data Editing & Budget Limits)**
   - ہر ٹرانزیکشن، کیٹیگری اور بجٹ لمٹ میں فوری ایڈٹ کی سہولت۔
   - بجٹ کی حد سے تجاوز پر الرٹ اور بصری گرافکس۔

4. **چارٹ و ٹیبل انٹیگریشن (Interactive Charts & Tables)**
   - پائی چارٹس، بار چارٹس، اور زمرہ وار ٹیبلز۔
   - کیش فلو اور آمدن بمقابلہ اخراجات کا تفصیلی گراف۔

5. **اردو خطاطی و تھیم سیٹنگز (Nastaliq Typography & Themes)**
   - نستعلیق (Noto Nastaliq Urdu, Gulzar, Amiri, Lateef) فونٹس سپورٹ۔
   - ڈارک، لائٹ اور ایمرلڈ گولڈ تھیمز۔

6. **مکمل آف لائن سپورٹ اور ڈیٹا بیک اپ (Offline First & Backups)**
   - لوکل اسٹوریج سپورٹ (بغیر انٹرنیٹ کے بھی کام کرتا ہے)۔
   - JSON بیک اپ اور CSV ایکسپورٹ کی سہولت۔

---

## 🚀 گٹ ہب اور لوکل انسٹالیشن گائیڈ (Getting Started)

### ضروریات (Prerequisites)
- [Node.js](https://nodejs.org/) (ورژن 18 یا اس سے نیا)
- [Git](https://git-scm.com/)

### 1. گٹ ہب سے کلون کریں (Clone Repository)
```bash
git clone https://github.com/your-username/daily-urdu-ledger-app.git
cd daily-urdu-ledger-app
```

### 2. ڈیپینڈینسیز انسٹال کریں (Install Dependencies)
```bash
npm install
```

### 3. ڈویلپمنٹ سرور چلائیں (Run Development Server)
```bash
npm run dev
```
براؤزر میں `http://localhost:3000` کھولیں۔

### 4. پروڈکشن بلڈ تیار کریں (Build for Production)
```bash
npm run build
```
بلڈ تیار ہو کر `dist` فولڈر میں محفوظ ہو جائے گی۔

---

## 🌐 گٹ ہب پیجز / ورسل پر لائیو ڈپلائی کرنے کا طریقہ (Deployment Guide)

### Vercel یا Netlify پر ڈپلائی کریں:
1. اپنے GitHub پر اس ریپوزٹری کو پش کریں۔
2. [Vercel](https://vercel.com) یا [Netlify](https://netlify.com) پر جائیں۔
3. `Import Git Repository` منتخب کریں۔
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. `Deploy` پر کلک کریں!

### GitHub Pages پر ڈپلائی کریں:
ریپوزٹری میں `.github/workflows/deploy.yml` موجود ہے جو خودکار طور پر مین برانچ پر پش ہونے کے بعد GitHub Pages پر بلڈ ڈپلائی کر دیتا ہے۔

---

## 🛠️ استعمال شدہ ٹیکنالوجیز (Tech Stack)

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons, Motion
- **PDF & Printing:** jsPDF, html2canvas, Native Web Share API
- **Fonts:** Google Fonts (Noto Nastaliq Urdu, Gulzar, Amiri, JetBrains Mono)

---

## 📄 لائسنس (License)
یہ پروجیکٹ MIT لائسنس کے تحت دستیاب ہے۔
