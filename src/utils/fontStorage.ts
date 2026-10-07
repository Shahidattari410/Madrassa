const DB_NAME = 'DailyLedgerFontDB';
const STORE_NAME = 'custom_font_store';
const FONT_RECORD_KEY = 'active_custom_font';

interface StoredFont {
  fileName: string;
  dataUrl: string;
  format: string;
  uploadedAt: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveCustomFont = async (fileName: string, dataUrl: string, format: string): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record: StoredFont = {
      fileName,
      dataUrl,
      format,
      uploadedAt: Date.now(),
    };
    store.put(record, FONT_RECORD_KEY);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        applyCustomFontToDOM(dataUrl, format);
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save font to IndexedDB:', err);
    // Fallback apply to DOM directly
    applyCustomFontToDOM(dataUrl, format);
  }
};

export const getCustomFont = async (): Promise<StoredFont | null> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(FONT_RECORD_KEY);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.error('Failed to get font from IndexedDB:', err);
    return null;
  }
};

export const removeCustomFont = async (): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(FONT_RECORD_KEY);
    return new Promise((resolve) => {
      tx.oncomplete = () => {
        // Remove style tag if exists
        const existingStyle = document.getElementById('custom-uploaded-font-style');
        if (existingStyle) {
          existingStyle.remove();
        }
        resolve();
      };
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.error('Failed to delete custom font:', err);
  }
};

export const applyCustomFontToDOM = (dataUrl: string, format: string = 'opentype') => {
  let styleTag = document.getElementById('custom-uploaded-font-style') as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'custom-uploaded-font-style';
    document.head.appendChild(styleTag);
  }

  // Format mapping
  let formatString = 'opentype';
  if (format.includes('woff2')) formatString = 'woff2';
  else if (format.includes('woff')) formatString = 'woff';
  else if (format.includes('truetype') || format.includes('ttf')) formatString = 'truetype';

  styleTag.textContent = `
    @font-face {
      font-family: 'CustomUploadedFont';
      src: url('${dataUrl}') format('${formatString}');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
    .font-custom {
      font-family: 'CustomUploadedFont', 'Noto Nastaliq Urdu', serif !important;
    }
  `;
};
