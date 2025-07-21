import { pdf } from '@react-pdf/renderer';
import { PoemPDFDocument } from '~/components/poems/PoemPDFDocument';
import type { BasePoem } from '~/types/poem';

/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to slugify
 * @returns A slugified string suitable for filenames
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generates and downloads a PDF for a given poem
 * @param poem - The poem object to generate PDF for
 * @throws Error if PDF generation or download fails
 */
export async function generatePoemPDF(poem: BasePoem): Promise<void> {
  let objectUrl: string | null = null;
  
  try {
    // Create PDF instance with the poem document
    const pdfInstance = pdf(<PoemPDFDocument poem={poem} />);
    
    // Convert to blob
    const blob = await pdfInstance.toBlob();
    
    // Create object URL for download
    objectUrl = URL.createObjectURL(blob);
    
    // Create filename from poem title
    const filename = `poem-${slugify(poem.title)}.pdf`;
    
    // Create and trigger download link
    const downloadLink = document.createElement('a');
    downloadLink.href = objectUrl;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error(`Failed to generate PDF for "${poem.title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clean up object URL to prevent memory leaks
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

/**
 * Generates a PDF blob for a given poem without triggering download
 * Useful for cases where you want to handle the blob differently
 * @param poem - The poem object to generate PDF for
 * @returns Promise that resolves to the PDF blob
 */
export async function generatePoemPDFBlob(poem: BasePoem): Promise<Blob> {
  try {
    const pdfInstance = pdf(<PoemPDFDocument poem={poem} />);
    return await pdfInstance.toBlob();
  } catch (error) {
    console.error('Failed to generate PDF blob:', error);
    throw new Error(`Failed to generate PDF blob for "${poem.title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Checks if the browser supports PDF generation
 * @returns true if PDF generation is supported
 */
export function isPDFGenerationSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' && 
         typeof URL !== 'undefined' && 
         typeof URL.createObjectURL === 'function';
}