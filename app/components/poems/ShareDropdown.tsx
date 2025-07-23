import { useState } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
} from 'react-share'
import { Share2, Check, Link } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'

interface ShareDropdownProps {
  url: string
  title: string
  excerpt: string
  className?: string
}

export function ShareDropdown({ url, title, excerpt, className }: ShareDropdownProps) {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full transition-transform hover:scale-110"
            aria-label="Share options"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <FacebookShareButton url={url} className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              Share on Facebook
            </DropdownMenuItem>
          </FacebookShareButton>
          
          <TwitterShareButton url={url} title={title} className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              Share on Twitter
            </DropdownMenuItem>
          </TwitterShareButton>
          
          <EmailShareButton url={url} subject={title} body={`${excerpt}\n\nRead more at: ${url}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              Email this poem
            </DropdownMenuItem>
          </EmailShareButton>
          
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleCopyLink}
          >
            <span className="flex items-center gap-2">
              {showCopied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  Link copied!
                </>
              ) : (
                <>
                  <Link className="h-4 w-4" />
                  Copy link
                </>
              )}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Toast notification */}
      {showCopied && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md z-10 min-w-max">
          <p className="text-sm text-green-600 dark:text-green-400">
            Link copied!
          </p>
        </div>
      )}
    </div>
  )
}