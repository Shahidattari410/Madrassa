import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Creates a jsPDF document from an HTML element
 */
const createPdfDocument = async (elementId: string): Promise<jsPDF | null> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Target printable element not found:', elementId);
    return null;
  }

  // Capture the element with html2canvas
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution for crisp Urdu typography
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  
  // Create A4 PDF (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  if (contentHeight <= pageHeight - margin * 2) {
    // Single page fit
    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
  } else {
    // Multi-page handling
    let heightLeft = contentHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
    heightLeft -= (pageHeight - margin * 2);

    while (heightLeft > 0) {
      pdf.addPage();
      position = margin - (contentHeight - heightLeft);
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pageHeight - margin * 2);
    }
  }

  return pdf;
};

/**
 * Converts the target element into a high-resolution A4 PDF document
 * and triggers download on mobile devices and desktop.
 */
export const generatePdfFromElement = async (
  elementId: string = 'printable-statement',
  fileName: string = 'daily-ledger-statement'
): Promise<boolean> => {
  try {
    const pdf = await createPdfDocument(elementId);
    if (!pdf) return false;

    const finalFileName = `${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(finalFileName);
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return false;
  }
};

/**
 * Generates a PDF Blob for sharing or mobile printing.
 */
export const generatePdfBlob = async (
  elementId: string = 'printable-statement'
): Promise<Blob | null> => {
  try {
    const pdf = await createPdfDocument(elementId);
    if (!pdf) return null;
    return pdf.output('blob');
  } catch (error) {
    console.error('PDF Blob Error:', error);
    return null;
  }
};

/**
 * Directly connects to Mobile Printer via Android / iOS Web Share with the PDF file.
 * This launches Android Print Spooler / System Print dialog directly.
 */
export const sharePdfToMobilePrinter = async (
  elementId: string = 'printable-statement',
  fileName: string = 'daily-ledger-statement'
): Promise<'shared' | 'downloaded' | 'failed'> => {
  try {
    const blob = await generatePdfBlob(elementId);
    if (!blob) return 'failed';

    const pdfFile = new File([blob], `${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`, {
      type: 'application/pdf',
    });

    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [pdfFile] })
    ) {
      await navigator.share({
        title: 'روزمرہ حساب کتاب - مالیاتی گوشوارہ',
        text: 'روزمرہ حساب کتاب مالیاتی گوشوارہ پرنٹ و پی ڈی ایف',
        files: [pdfFile],
      });
      return 'shared';
    } else {
      // If Web Share API files is not supported, download PDF directly
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name;
      a.click();
      URL.revokeObjectURL(url);
      return 'downloaded';
    }
  } catch (error) {
    console.warn('Share to mobile printer cancelled or failed:', error);
    return 'failed';
  }
};

