'use client';

import { Mic, Send } from '@/lib/icons';

import { Button } from '@/components/ui/button';

type GenerationControlsProps = {
  isListening: boolean;
  isGenerating: boolean;
  isVoiceSupported: boolean;
  pendingVoiceText: string;
  onVoiceToggle: () => void;
  onGenerate: () => void;
};

export default function GenerationControls({
  isListening,
  isGenerating,
  isVoiceSupported,
  pendingVoiceText,
  onVoiceToggle,
  onGenerate,
}: GenerationControlsProps) {
  return (
    <div className='flex flex-col gap-3 xs:flex-row sm:items-center xs:justify-between'>
      <div className='flex items-center justify-end gap-2'>
        <Button
          type='button'
          variant='outline'
          size='icon'
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          disabled={!isVoiceSupported}
          onClick={onVoiceToggle}
          className={isListening ? 'border-primary text-primary' : undefined}>
          <Mic className='size-4' />
        </Button>
        <Button
          type='button'
          className='min-w-32'
          aria-label='Generate image from prompt'
          disabled={isGenerating}
          onClick={onGenerate}>
          {isGenerating ? 'Generating...' : 'Generate'}
          <Send className='size-4' />
        </Button>
      </div>

      <div className='flex items-center justify-end'>
        <p className='text-muted-foreground text-xs'>
          {isVoiceSupported
            ? isListening
              ? 'Voice input is listening...'
              : pendingVoiceText
                ? 'Voice transcript captured'
                : 'Voice input ready'
            : 'Voice input is not supported in this browser'}
        </p>
      </div>
    </div>
  );
}
