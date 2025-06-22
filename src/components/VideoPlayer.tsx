import { useEffect, useRef } from 'react'
import { useVideoStore } from '@/store/videoStore'
import { processFrame } from '@/lib/videoProcessing'

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const videoUrl = useVideoStore((state) => state.videoUrl)
  const effects = useVideoStore((state) => state.effects)

  // Set up video and canvas once when video URL changes
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !videoUrl) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Reset video source
    video.src = ''
    
    // Set up video with proper event handling
    video.src = videoUrl
    
    // Wait for video metadata to load before setting dimensions
    video.onloadedmetadata = () => {
      // Set canvas dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Initial frame draw
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Start playback
      video.play().catch(console.error)
    }

    // Handle video errors
    video.onerror = (e) => {
      console.error('Video loading error:', e)
    }

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      video.src = ''
      video.onloadedmetadata = null
      video.onerror = null
    }
  }, [videoUrl])

  // Process a single frame
  function processSingleFrame() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    if (video.videoWidth === 0 || video.videoHeight === 0) return // Skip if video dimensions aren't ready

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ensure canvas dimensions match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    // Only process frame if we have valid dimensions
    if (canvas.width > 0 && canvas.height > 0) {
      processFrame(ctx, video, effects)
    }
  }

  // Handle render loop separately
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function render() {
      if (!video || video.ended) return
      if (!video.videoWidth || !video.videoHeight) return // Skip if video dimensions aren't ready
      if (!ctx) return
      
      if (video.paused) {
        // Process a single frame if paused
        processSingleFrame()
      } else {
        // Continue animation if playing
        processFrame(ctx, video, effects)
        animationFrameRef.current = requestAnimationFrame(render)
      }
    }

    // Start/stop render loop based on video play state
    function handlePlayPause() {
      if (!video) return
      if (video.paused) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        // Process one frame when pausing
        processSingleFrame()
      } else {
        render()
      }
    }

    video.addEventListener('play', handlePlayPause)
    video.addEventListener('pause', handlePlayPause)

    // Process initial frame or start animation
    if (video.readyState >= 2) { // Check if video metadata is loaded
      render()
    }

    return () => {
      video.removeEventListener('play', handlePlayPause)
      video.removeEventListener('pause', handlePlayPause)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [effects]) // Only re-run when effects change, but maintain play state

  if (!videoUrl) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Upload a video to get started
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        playsInline
        controls
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
} 