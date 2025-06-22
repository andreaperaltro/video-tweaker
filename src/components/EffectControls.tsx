import * as Slider from '@radix-ui/react-slider'
import { useVideoStore } from '@/store/videoStore'
import { PlusIcon } from '@radix-ui/react-icons'

export function EffectControls() {
  const effects = useVideoStore((state) => state.effects)
  const addEffect = useVideoStore((state) => state.addEffect)
  const removeEffect = useVideoStore((state) => state.removeEffect)
  const updateEffect = useVideoStore((state) => state.updateEffect)

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Effects</h2>
        <div className="flex gap-2">
          <button
            onClick={() => addEffect('brightness')}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Brightness
          </button>
          <button
            onClick={() => addEffect('contrast')}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Contrast
          </button>
          <button
            onClick={() => addEffect('blur')}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Blur
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {effects.map((effect) => (
          <div
            key={effect.id}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium capitalize">{effect.type}</h3>
              <button
                onClick={() => removeEffect(effect.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>

            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              defaultValue={[0]}
              min={-100}
              max={100}
              step={1}
              onValueChange={([value]) => {
                const params = {
                  [effect.type]: value
                }
                updateEffect(effect.id, params)
              }}
            >
              <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Effect value"
              />
            </Slider.Root>
          </div>
        ))}
      </div>
    </div>
  )
} 