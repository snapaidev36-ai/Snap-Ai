'use client';

import type { AspectRatioValue, StyleValue } from '@/lib/generation/options';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ASPECT_RATIO_OPTIONS,
  STYLE_OPTIONS,
} from '@/components/dashboard/dashboard.constants';

type GenerationOptionsProps = {
  aspectRatio: AspectRatioValue;
  style: StyleValue;
  onAspectRatioChange: (value: AspectRatioValue) => void;
  onStyleChange: (value: StyleValue) => void;
};

export default function GenerationOptions({
  aspectRatio,
  style,
  onAspectRatioChange,
  onStyleChange,
}: GenerationOptionsProps) {
  return (
    <div className='flex flex-wrap items-center sm:max-w-75 gap-2'>
      <Select
        value={aspectRatio}
        onValueChange={value => onAspectRatioChange(value as AspectRatioValue)}>
        <SelectTrigger
          aria-label='Select aspect ratio'
          className='flex-1 min-w-24'>
          <SelectValue placeholder='Aspect ratio' />
        </SelectTrigger>
        <SelectContent>
          {ASPECT_RATIO_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={style}
        onValueChange={value => onStyleChange(value as StyleValue)}>
        <SelectTrigger aria-label='Select style' className='flex-1 min-w-32'>
          <SelectValue placeholder='Style' />
        </SelectTrigger>
        <SelectContent>
          {STYLE_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
