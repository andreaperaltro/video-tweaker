import { VideoEffect } from '@/store/videoStore'

export function processFrame(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  effects: VideoEffect[]
) {
  // Validate input dimensions
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    console.warn('Video dimensions not ready')
    return
  }

  // Ensure canvas dimensions match video
  if (ctx.canvas.width !== video.videoWidth || ctx.canvas.height !== video.videoHeight) {
    ctx.canvas.width = video.videoWidth
    ctx.canvas.height = video.videoHeight
  }

  // Validate canvas dimensions
  if (ctx.canvas.width === 0 || ctx.canvas.height === 0) {
    console.warn('Canvas dimensions are invalid')
    return
  }

  // Create a temporary canvas for compositing effects
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = ctx.canvas.width
  tempCanvas.height = ctx.canvas.height
  
  // Validate temp canvas dimensions
  if (tempCanvas.width === 0 || tempCanvas.height === 0) {
    console.warn('Temp canvas dimensions are invalid')
    return
  }

  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) {
    console.warn('Failed to get temp canvas context')
    return
  }

  // Reset any previous filters
  tempCtx.filter = 'none'
  ctx.filter = 'none'
  
  try {
    // Draw the original frame to temp canvas
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)
    
    // Apply pixel-based effects first
    effects.forEach(effect => {
      switch (effect.type) {
        case 'brightness':
          applyBrightness(tempCtx, effect.params.brightness || 0)
          break
        case 'contrast':
          applyContrast(tempCtx, effect.params.contrast || 0)
          break
      }
    })
    
    // Apply blur last as it's a filter-based effect
    const blurEffect = effects.find(e => e.type === 'blur')
    if (blurEffect && blurEffect.params.blur) {
      ctx.filter = `blur(${blurEffect.params.blur}px)`
    }
    
    // Draw the final result
    ctx.drawImage(tempCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height)
  } catch (error) {
    console.error('Error processing video frame:', error)
  }
}

function applyBrightness(ctx: CanvasRenderingContext2D, value: number) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const data = imageData.data

  // Convert value from -100 to 100 range to -255 to 255
  const brightness = Math.floor((value / 100) * 255)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + brightness))     // Red
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness)) // Green
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness)) // Blue
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyContrast(ctx: CanvasRenderingContext2D, value: number) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const data = imageData.data

  // Convert value from -100 to 100 range to 0 to 2
  const contrast = ((value + 100) / 100) ** 2

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      const pixel = data[i + j]
      // Apply contrast formula
      data[i + j] = Math.min(255, Math.max(0,
        Math.floor(((pixel / 255 - 0.5) * contrast + 0.5) * 255)
      ))
    }
  }

  ctx.putImageData(imageData, 0, 0)
} 