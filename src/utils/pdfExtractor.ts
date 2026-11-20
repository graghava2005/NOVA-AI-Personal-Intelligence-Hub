import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  // Use official CDN matching pdfjs-dist version 3.11.174 for reliable browser execution
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export interface ExtractedDocument {
  text: string;
  pageCount: number;
  fileName: string;
  fileSize: number;
}

export async function extractTextFromFile(file: File): Promise<ExtractedDocument> {
  const fileName = file.name;
  const fileSize = file.size;

  if (file.type === 'text/plain' || fileName.toLowerCase().endsWith('.txt') || fileName.toLowerCase().endsWith('.md')) {
    const text = await file.text();
    return {
      text,
      pageCount: 1,
      fileName,
      fileSize
    };
  }

  if (file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += `[Page ${i}]\n${pageText}\n\n`;
      }

      const trimmed = fullText.trim();
      if (!trimmed || trimmed.replace(/\[Page \d+\]/g, '').trim().length === 0) {
        throw new Error('This PDF appears to be scanned or contains no selectable text characters.');
      }

      return {
        text: trimmed,
        pageCount,
        fileName,
        fileSize
      };
    } catch (err: any) {
      console.warn('PDF extraction issue:', err);
      throw new Error(err.message || 'Failed to extract text from PDF file. Please ensure it is a valid PDF document.');
    }
  }

  throw new Error('Unsupported file format. Please upload a PDF (.pdf) or Text document (.txt, .md).');
}
