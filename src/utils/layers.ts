// obstacle layers have even value, others odd
export const Layers = {
  Surface: 1,
  ObjectsBelow: 2,
  Objects: 4,
  ObjectsAbove: 6,
  Tops: 7
} as const

export type LayerType = typeof Layers[keyof typeof Layers]
