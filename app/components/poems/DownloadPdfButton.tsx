import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { generatePoemPDF, isPDFGenerationSupported } from '~/lib/pdfGenerator';
import type { BasePoem } from '~/types/poem';

interface DownloadPdfButtonProps {
  poem: BasePoem;
  variant?: 'outline' | 'secondary' | 'default';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function DownloadPdfButton({ 
  poem, 
  variant = 'outline',
  size = 'default',
  className 
}: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if PDF generation is supported in this environment
  const isSupported = isPDFGenerationSupported();

  const handleDownload = async () => {
    if (!isSupported) {
      setError('PDF generation is not supported in this browser');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await generatePoemPDF(poem);
      setSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      console.error('PDF generation failed:', err);
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if PDF generation is not supported
  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
        aria-label={`Download PDF of ${poem.title}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : success ? (
          <>
            <FileDown className="mr-2 h-4 w-4 text-green-600" />
            Downloaded!
          </>
        ) : (
          <>
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </>
        )}
      </Button>
      
      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md z-10 min-w-max max-w-xs">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md z-10 min-w-max">
          <p className="text-sm text-green-600 dark:text-green-400">
            PDF downloaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}

// Alternative compact version for use in cards or tight spaces
export function CompactDownloadPdfButton({ 
  poem, 
  className 
}: { 
  poem: BasePoem; 
  className?: string; 
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!isPDFGenerationSupported()) return;

    setIsLoading(true);
    try {
      await generatePoemPDF(poem);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPDFGenerationSupported()) {
    return null;
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className={className}
      aria-label={`Download PDF of ${poem.title}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
    </Button>
  );
}