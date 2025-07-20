import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import ReactH5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import styles from './AudioPlayer.module.css';

// TypeScript interfaces
interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Error Boundary Component
class AudioPlayerErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AudioPlayer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <p className="font-medium">Audio player error</p>
            <p className="text-xs mt-1">Unable to load the audio player. Please try refreshing the page.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Main AudioPlayer Component
export function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  if (!audioUrl) {
    return (
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
        <p>No audio available for this poem</p>
      </div>
    );
  }

  return (
    <AudioPlayerErrorBoundary>
      <div className={styles.audioPlayerContainer}>
        <div className={styles.audioPlayerWrapper}>
          {title && (
            <div className="mb-2 text-sm text-muted-foreground">
              <span className="font-medium">Audio:</span> {title}
            </div>
          )}
          <ReactH5AudioPlayer
            src={audioUrl}
            autoPlay={false}
            showJumpControls={false}
            layout="stacked-reverse"
            className="rhap-custom"
          />
        </div>
      </div>
    </AudioPlayerErrorBoundary>
  );
}