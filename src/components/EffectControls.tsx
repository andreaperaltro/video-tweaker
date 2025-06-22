import * as Slider from '@radix-ui/react-slider'
import { useVideoStore } from '@/store/videoStore'
import { PlusIcon } from '@radix-ui/react-icons'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon } from '@radix-ui/react-icons'

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
          <button
            onClick={() => addEffect('dither')}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Dither
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

            {effect.type === 'dither' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pattern</label>
                  <Select.Root
                    value={effect.params.dither?.pattern ?? 'floyd-steinberg'}
                    onValueChange={(value) => {
                      updateEffect(effect.id, {
                        dither: {
                          ...effect.params.dither,
                          pattern: value as 'floyd-steinberg' | 'ordered' | 'atkinson'
                        }
                      })
                    }}
                  >
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
                        <Select.Viewport>
                          <Select.Item value="floyd-steinberg" className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer outline-none">
                            <Select.ItemText>Floyd-Steinberg</Select.ItemText>
                          </Select.Item>
                          <Select.Item value="ordered" className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer outline-none">
                            <Select.ItemText>Ordered</Select.ItemText>
                          </Select.Item>
                          <Select.Item value="atkinson" className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer outline-none">
                            <Select.ItemText>Atkinson</Select.ItemText>
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Threshold</label>
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={[effect.params.dither?.threshold ?? 128]}
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={([value]) => {
                      updateEffect(effect.id, {
                        dither: {
                          ...effect.params.dither,
                          threshold: value
                        }
                      })
                    }}
                  >
                    <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-[3px]">
                      <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Threshold value"
                    />
                  </Slider.Root>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 