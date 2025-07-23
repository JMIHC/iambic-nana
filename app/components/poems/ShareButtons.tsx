import { useState } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from 'react-share'
import { Link, Check } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  excerpt: string
  className?: string
}

export function ShareButtons({ url, title, excerpt, className }: ShareButtonsProps) {
  const [showCopied, setShowCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <div className={`relative ${className || ''}`}>
      <div className="flex flex-row gap-3">
        <div title="Share on Facebook" className="transition-transform hover:scale-110">
          <FacebookShareButton url={url}>
            <FacebookIcon size={36} round className="md:block hidden" />
            <FacebookIcon size={32} round className="md:hidden" />
          </FacebookShareButton>
        </div>

        <div title="Share on Twitter" className="transition-transform hover:scale-110">
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={36} round className="md:block hidden" />
            <TwitterIcon size={32} round className="md:hidden" />
          </TwitterShareButton>
        </div>

        <div title="Share via Email" className="transition-transform hover:scale-110">
          <EmailShareButton url={url} subject={title} body={excerpt}>
            <EmailIcon size={36} round className="md:block hidden" />
            <EmailIcon size={32} round className="md:hidden" />
          </EmailShareButton>
        </div>

        <button
          onClick={handleCopyLink}
          className="relative rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 hover:scale-110"
          aria-label="Copy link"
          title="Copy link"
        >
          <div className="w-9 h-9 md:w-[36px] md:h-[36px] flex items-center justify-center">
            {showCopied ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Link className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </div>
        </button>
      </div>

      {/* Toast notification */}
      {showCopied && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md z-10 min-w-max">
          <p className="text-sm text-green-600 dark:text-green-400">
            Link copied!
          </p>
        </div>
      )}
    </div>
  )
}