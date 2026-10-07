/**
 * Mobile-First Native Print, PDF, and Share utility.
 * Handles Android, iOS Safari, mobile webview, desktop, and embedded preview environments.
 */

export const triggerIframePrint = (elementId: string = 'printable-statement'): boolean => {
  try {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return false;

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '10px';
    iframe.style.height = '10px';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const headNodes = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'));
    const headHtml = headNodes.map((n) => n.outerHTML).join('\n');
    const rootStyles = window.getComputedStyle(document.documentElement);
    const appFontFamily = rootStyles.getPropertyValue('--app-font-family') || "'Noto Nastaliq Urdu', serif";

    const doc = iframe.contentWindow?.document;
    if (!doc) return false;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>روزمرہ حساب کتاب - پرنٹ</title>
  ${headHtml}
  <style>
    :root {
      --app-font-family: ${appFontFamily};
    }
    body {
      font-family: var(--app-font-family);
      background: white;
      color: #1c1917;
      margin: 0;
      padding: 15mm;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page {
      size: A4;
      margin: 10mm;
    }
  </style>
</head>
<body>
  ${targetElement.innerHTML}
</body>
</html>`);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Iframe print failed:', e);
      }
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 3000);
    }, 300);

    return true;
  } catch (err) {
    console.error('Trigger iframe print failed:', err);
    return false;
  }
};

export const triggerNativePrint = (elementId: string = 'printable-statement'): boolean => {
  try {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
      window.print();
      return true;
    }

    // Prepare body for printing
    document.body.classList.add('mobile-print-active');

    // Remove fixed modal backdrop effects
    const modals = document.querySelectorAll('.print-modal-container');
    modals.forEach((m) => m.classList.add('printing-active'));

    // Trigger print synchronously within user gesture
    window.focus();
    window.print();

    // Cleanup after print dialog closes
    const cleanup = () => {
      document.body.classList.remove('mobile-print-active');
      modals.forEach((m) => m.classList.remove('printing-active'));
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2000);
    return true;
  } catch (err) {
    console.warn('Direct window.print error, attempting iframe print fallback:', err);
    return triggerIframePrint(elementId);
  }
};

/**
 * Downloads a standalone, self-contained printable HTML/PDF statement file.
 * Perfect for mobile phones to save offline, open in Chrome/Safari, or print/share.
 */
export const downloadOfflinePrintableStatement = (
  elementId: string = 'printable-statement',
  fileName: string = 'daily-ledger-statement'
): boolean => {
  try {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return false;

    // Collect all active head stylesheets and styles (including fonts)
    const headNodes = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'));
    const headHtml = headNodes.map((node) => node.outerHTML).join('\n');

    const rootStyles = window.getComputedStyle(document.documentElement);
    const appFontFamily = rootStyles.getPropertyValue('--app-font-family') || "'Noto Nastaliq Urdu', serif";
    const appFontSize = rootStyles.getPropertyValue('--app-font-size') || '16px';
    const appLineHeight = rootStyles.getPropertyValue('--app-line-height') || '1.85';

    const completeHtml = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>روزمرہ حساب کتاب - مالیاتی گوشوارہ</title>
  ${headHtml}
  <style>
    :root {
      --app-font-family: ${appFontFamily};
      --app-font-size: ${appFontSize};
      --app-line-height: ${appLineHeight};
    }
    @page {
      size: A4;
      margin: 12mm;
    }
    body {
      background: #f5f5f4;
      color: #1c1917;
      font-family: var(--app-font-family);
      margin: 0;
      padding: 16px;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .print-sheet {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .font-numbers {
      font-family: 'JetBrains Mono', monospace !important;
      font-variant-numeric: tabular-nums !important;
    }
    .mobile-print-button-bar {
      max-width: 800px;
      margin: 0 auto 16px auto;
      display: flex;
      gap: 10px;
      justify-content: space-between;
    }
    .mobile-btn {
      background: #059669;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      font-family: inherit;
    }
    @media print {
      body {
        background: white !important;
        padding: 0 !important;
      }
      .mobile-print-button-bar {
        display: none !important;
      }
      .print-sheet {
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 0 !important;
      }
    }
  </style>
</head>
<body>
  <div class="mobile-print-button-bar no-print">
    <button class="mobile-btn" onclick="window.print()">
      🖨️ موبائل پرنٹ / PDF محفوظ کریں
    </button>
    <span style="font-size: 12px; color: #78716c; align-self: center;">
      A4 سائز پرنٹ اور پی ڈی ایف کے لیے تیار ہے
    </span>
  </div>
  <div class="print-sheet">
    ${targetElement.innerHTML}
  </div>
  <script>
    // Auto-trigger print prompt on load if opened directly on mobile
    if (window.location.search.includes('print=true')) {
      setTimeout(function() { window.print(); }, 400);
    }
  </script>
</body>
</html>`;

    const blob = new Blob([completeHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Download offline statement failed:', err);
    return false;
  }
};

/**
 * Mobile Web Share API: Allows mobile user to directly share report to WhatsApp, Mail, Printer, or Files.
 */
export const shareReportMobile = async (textSummary: string): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'روزمرہ حساب کتاب - مالیاتی خلاصہ',
        text: textSummary,
      });
      return true;
    } catch (err) {
      console.warn('Share dismissed or failed:', err);
    }
  }
  return false;
};
