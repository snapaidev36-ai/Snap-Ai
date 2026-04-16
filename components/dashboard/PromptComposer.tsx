'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { Separator } from '@/components/ui/separator';
import { sectionContainer, slideDown } from '@/lib/motion/variants';
import type { AspectRatioValue, StyleValue } from '@/lib/generation/options';

import GenerationControls from '@/components/dashboard/prompt-composer/GenerationControls';
import GenerationOptions from '@/components/dashboard/prompt-composer/GenerationOptions';
import GenerationResultCard from '@/components/dashboard/prompt-composer/GenerationResultCard';
import GenerationStatusCard from '@/components/dashboard/prompt-composer/GenerationStatusCard';
import PromptInputField from '@/components/dashboard/prompt-composer/PromptInputField';
import RecentPromptsChips from '@/components/dashboard/prompt-composer/RecentPromptsChips';
import { usePromptComposerGeneration } from '@/components/dashboard/prompt-composer/usePromptComposerGeneration';
import { useVoiceInput } from '@/components/dashboard/prompt-composer/useVoiceInput';

type PromptComposerProps = {
  recentPrompts: string[];
};

export default function PromptComposer({ recentPrompts }: PromptComposerProps) {
  const [promptInput, setPromptInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioValue>('4:3');
  const [style, setStyle] = useState<StyleValue>('cinematic');

  const prefersReducedMotion = useReducedMotion();

  const { isListening, isVoiceSupported, pendingVoiceText, toggleVoiceInput } =
    useVoiceInput({
      onTranscriptAppended: appendSegmentToPrompt,
    });

  const {
    isGenerating,
    generationStatus,
    generatedImageUrl,
    generatedPrompt,
    generateImage,
  } = usePromptComposerGeneration();

  function appendSegmentToPrompt(segment: string) {
    const text = segment.trim();
    if (!text) {
      return;
    }

    setPromptInput(previousValue => {
      const previousTrimmed = previousValue.trim();
      if (previousTrimmed && previousTrimmed.endsWith(text)) {
        return previousValue;
      }

      return previousTrimmed ? `${previousTrimmed} ${text}` : text;
    });
  }

  function appendPromptFromChip(prompt: string) {
    setPromptInput(prompt);
  }

  function handleGenerateImage() {
    void generateImage({
      prompt: promptInput,
      aspectRatio,
      style,
    });
  }

  return (
    <motion.section
      className='space-y-3'
      variants={prefersReducedMotion ? undefined : sectionContainer}>
      {recentPrompts.length > 0 ? (
        <RecentPromptsChips
          prompts={recentPrompts}
          reduceMotion={Boolean(prefersReducedMotion)}
          onPromptSelect={appendPromptFromChip}
        />
      ) : null}

      <motion.div
        variants={prefersReducedMotion ? undefined : slideDown}
        className='overflow-hidden rounded-2xl border bg-card shadow-sm'>
        <div className='space-y-4 p-4 sm:p-5'>
          <PromptInputField value={promptInput} onChange={setPromptInput} />

          <Separator />

          <GenerationOptions
            aspectRatio={aspectRatio}
            style={style}
            onAspectRatioChange={setAspectRatio}
            onStyleChange={setStyle}
          />

          <GenerationControls
            isListening={isListening}
            isGenerating={isGenerating}
            isVoiceSupported={isVoiceSupported}
            pendingVoiceText={pendingVoiceText}
            onVoiceToggle={() => void toggleVoiceInput()}
            onGenerate={handleGenerateImage}
          />

          {generationStatus === 'processing' && !generatedImageUrl ? (
            <GenerationStatusCard prompt={generatedPrompt} />
          ) : generatedImageUrl ? (
            <GenerationResultCard
              imageUrl={generatedImageUrl}
              prompt={generatedPrompt}
            />
          ) : null}
        </div>
      </motion.div>
    </motion.section>
  );
}
