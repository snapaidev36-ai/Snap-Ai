export const ASPECT_RATIO_VALUES = ['1:1', '4:3', '9:16', '16:9'] as const;

export type AspectRatioValue = (typeof ASPECT_RATIO_VALUES)[number];

export const STYLE_VALUES = [
  'photoreal',
  'cinematic',
  'anime',
  'digital art',
] as const;

export type StyleValue = (typeof STYLE_VALUES)[number];

export const ASPECT_RATIO_OPTIONS = [
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
] as const;

export const STYLE_OPTIONS = [
  { label: 'Photoreal', value: 'photoreal' },
  { label: 'Cinematic', value: 'cinematic' },
  { label: 'Digital Art', value: 'digital art' },
  { label: 'Anime', value: 'anime' },
] as const;
