import { create } from 'zustand'

export type VideoEffect = {
  id: string
  type: 'brightness' | 'contrast' | 'blur' | 'dither'
  params: {
    brightness?: number
    contrast?: number
    blur?: number
    dither?: {
      threshold?: number
      pattern?: 'floyd-steinberg' | 'ordered' | 'atkinson'
    }
  }
}

interface VideoState {
  videoUrl: string | null
  effects: VideoEffect[]
  addEffect: (type: VideoEffect['type']) => void
  removeEffect: (id: string) => void
  updateEffect: (id: string, params: VideoEffect['params']) => void
  setVideoUrl: (url: string | null) => void
}

export const useVideoStore = create<VideoState>((set) => ({
  videoUrl: null,
  effects: [],
  addEffect: (type) => set((state) => ({
    effects: [...state.effects, { 
      id: Math.random().toString(), 
      type, 
      params: type === 'dither' ? {
        dither: {
          threshold: 128,
          pattern: 'floyd-steinberg'
        }
      } : {}
    }],
  })),
  removeEffect: (id) => set((state) => ({
    effects: state.effects.filter((effect) => effect.id !== id)
  })),
  updateEffect: (id, params) => set((state) => ({
    effects: state.effects.map((effect) =>
      effect.id === id ? { ...effect, params: { ...effect.params, ...params } } : effect
    )
  })),
  setVideoUrl: (url) => set({ videoUrl: url })
})) 