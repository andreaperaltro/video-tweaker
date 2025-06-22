import { useCallback } from 'react'
import { useVideoStore } from '@/store/videoStore'

export function VideoUpload() {
  const setVideoUrl = useVideoStore((state) => state.setVideoUrl)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setVideoUrl(url)
  }, [setVideoUrl])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setVideoUrl(url)
  }, [setVideoUrl])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  return (
    <div
      className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('video-upload')?.click()}
    >
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Drag and drop a video file here, or click to select
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Supports MP4 and WebM formats
        </p>
      </div>
    </div>
  )
} 