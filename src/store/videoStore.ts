import { create } from 'zustand'

export interface VideoEffect {
  id: string
  type: 'brightness' | 'contrast' | 'blur'
  params: {
    brightness?: number
    contrast?: number
    blur?: number
  }
}

interface VideoState {
  videoUrl: string | null
  effects: VideoEffect[]
  addEffect: (type: VideoEffect['type']) => void
  removeEffect: (id: string) => void
  updateEffect: (id: string, params: Partial<VideoEffect['params']>) => void
  setVideoUrl: (url: string | null) => void
}

export const useVideoStore = create<VideoState>((set) => ({
  videoUrl: null,
  effects: [],
  addEffect: (type) => set((state) => ({
    effects: [...state.effects, {
      id: Math.random().toString(36).substring(7),
      type,
      params: {
        brightness: type === 'brightness' ? 0 : undefined,
        contrast: type === 'contrast' ? 0 : undefined,
        blur: type === 'blur' ? 0 : undefined,
      }
    }]
  })),
  removeEffect: (id) => set((state) => ({
    effects: state.effects.filter((effect) => effect.id !== id)
  })),
  updateEffect: (id, params) => set((state) => ({
    effects: state.effects.map((effect) => 
      effect.id === id 
        ? { ...effect, params: { ...effect.params, ...params } }
        : effect
    )
  })),
  setVideoUrl: (url) => set({ videoUrl: url })
})) 