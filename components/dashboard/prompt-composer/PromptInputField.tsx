'use client';

import { Textarea } from '@/components/ui/textarea';

type PromptInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PromptInputField({
  value,
  onChange,
}: PromptInputFieldProps) {
  return (
    <div className='space-y-2'>
      <label
        htmlFor='dashboard-prompt'
        className='text-sm font-medium text-foreground'>
        Describe your image
      </label>
      <Textarea
        id='dashboard-prompt'
        placeholder='Let’s do some magic...'
        className='min-h-30 resize-none'
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  );
}
