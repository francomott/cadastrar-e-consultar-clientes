export const StageEnum = ['LEAD', 'NEGOCIACAO', 'VENDIDO'] as const;

export type Stage = typeof StageEnum[number];