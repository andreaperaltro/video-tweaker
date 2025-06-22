'use client'

import { VideoPlayer } from '@/components/VideoPlayer'
import { VideoUpload } from '@/components/VideoUpload'
import { EffectControls } from '@/components/EffectControls'
import { useVideoStore } from '@/store/videoStore'

export default function Home() {
  const videoUrl = useVideoStore((state) => state.videoUrl)
  const setVideoUrl = useVideoStore((state) => state.setVideoUrl)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Video Tweaker</h1>
          {videoUrl && (
            <button
              onClick={() => setVideoUrl(null)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload New Video
            </button>
          )}
        </div>
        
        {!videoUrl ? (
          <VideoUpload />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VideoPlayer />
            </div>
            <div>
              <EffectControls />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
