import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronLeft, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { AudioPlayer } from "~/components/poems/AudioPlayer";
import { friendsPoems } from "~/data/friends-poems";
import { familyPoems } from "~/data/family-poems";
import { faithPoems } from "~/data/faith-poems";
import type { BasePoem } from "~/types/poem";

export default function Listen() {
  const [searchParams] = useSearchParams();
  const [poems, setPoems] = useState<BasePoem[]>([]);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poemsWithAudio, setPoemsWithAudio] = useState<BasePoem[]>([]);

  useEffect(() => {
    const allPoems = [...friendsPoems, ...familyPoems, ...faithPoems];
    const audioPoems = allPoems.filter(poem => poem.audioUrl);
    setPoems(allPoems);
    setPoemsWithAudio(audioPoems);
    
    // Check if a specific poem was requested
    const poemId = searchParams.get('poem');
    if (poemId && audioPoems.length > 0) {
      const poemIndex = audioPoems.findIndex(p => p.id === poemId);
      if (poemIndex !== -1) {
        setCurrentPoemIndex(poemIndex);
      }
    }
  }, [searchParams]);

  const currentPoem = poemsWithAudio[currentPoemIndex];

  const handleNext = () => {
    if (currentPoemIndex < poemsWithAudio.length - 1) {
      setCurrentPoemIndex(currentPoemIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPoemIndex > 0) {
      setCurrentPoemIndex(currentPoemIndex - 1);
    }
  };

  const handlePoemSelect = (index: number) => {
    setCurrentPoemIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/poems"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Poems
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Listen to Poems
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Enjoy audio recordings of selected poems
          </p>

          {poemsWithAudio.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <Volume2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No audio recordings available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Now Playing
                </h2>
                {currentPoem && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentPoem.title}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        currentPoem.category === 'faith' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        currentPoem.category === 'family' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {currentPoem.category.charAt(0).toUpperCase() + currentPoem.category.slice(1)}
                      </span>
                    </div>
                    
                    <AudioPlayer 
                      audioUrl={currentPoem.audioUrl!} 
                      title={currentPoem.title}
                    />

                    <div className="flex justify-between items-center mt-6">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPoemIndex === 0}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous poem"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>
                      
                      <Link
                        to={`/poems/${currentPoem.id}`}
                        className="text-primary hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                      >
                        View Full Poem
                      </Link>

                      <button
                        onClick={handleNext}
                        disabled={currentPoemIndex === poemsWithAudio.length - 1}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next poem"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Playlist ({poemsWithAudio.length} poems)
                </h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {poemsWithAudio.map((poem, index) => (
                    <button
                      key={poem.id}
                      onClick={() => handlePoemSelect(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentPoemIndex
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {index === currentPoemIndex && (
                            <Volume2 className="w-4 h-4 text-primary" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {poem.title}
                            </p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              poem.category === 'faith' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                              poem.category === 'family' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {poem.category.charAt(0).toUpperCase() + poem.category.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}