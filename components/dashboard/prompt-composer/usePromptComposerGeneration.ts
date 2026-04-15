'use client';

import { useEffect, useRef, useState } from 'react';

import { ApiClientError, apiClient } from '@/lib/client/api';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/components/ui/sonner';
import type { AspectRatioValue, StyleValue } from '@/lib/generation/options';

import {
  clearGenerationRecoveryRecord,
  readGenerationRecoveryRecord,
  writeGenerationRecoveryRecord,
} from './storage';
import type {
  GenerateImageResponse,
  GenerationRecoveryRecord,
  GenerationStatusResponse,
} from './types';

type GenerateImageInput = {
  prompt: string;
  aspectRatio: AspectRatioValue;
  style: StyleValue;
};

const POLL_INTERVAL_MS = 5000;

type GenerationState = 'idle' | 'processing';

export function usePromptComposerGeneration() {
  const setUser = useAuthStore(state => state.setUser);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] =
    useState<GenerationState>('idle');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const pollingTimeoutRef = useRef<number | null>(null);
  const activeUsageIdRef = useRef<string | null>(null);
  const isMountedRef = useRef(false);

  function clearPollingTimer() {
    if (pollingTimeoutRef.current) {
      window.clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }

  function syncRecoveryRecord(record: GenerationRecoveryRecord) {
    writeGenerationRecoveryRecord(record);
  }

  function resetGenerationState() {
    clearPollingTimer();
    activeUsageIdRef.current = null;
    setIsGenerating(false);
    setGenerationStatus('idle');
    setGeneratedImageUrl(null);
  }

  function resetAfterFailure() {
    clearGenerationRecoveryRecord();
    resetGenerationState();
    setGeneratedPrompt(null);
  }

  function restoreRecoveryRecord(record: GenerationRecoveryRecord) {
    setGeneratedPrompt(record.prompt);

    if (record.status === 'completed' && record.imageUrl) {
      clearPollingTimer();
      activeUsageIdRef.current = null;
      setGeneratedImageUrl(record.imageUrl);
      setGenerationStatus('idle');
      setIsGenerating(false);
      return;
    }

    if (!record.usageId) {
      resetAfterFailure();
      return;
    }

    activeUsageIdRef.current = record.usageId;
    setGenerationStatus('processing');
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    void pollGenerationStatus(record.usageId);
  }

  async function pollGenerationStatus(usageId: string) {
    clearPollingTimer();

    const tick = async () => {
      if (!isMountedRef.current || activeUsageIdRef.current !== usageId) {
        return;
      }

      try {
        const response = await apiClient<GenerationStatusResponse>(
          `/api/images/status?usageId=${encodeURIComponent(usageId)}`,
        );

        if (!isMountedRef.current || activeUsageIdRef.current !== usageId) {
          return;
        }

        setGeneratedPrompt(response.usage.prompt);

        if (response.status === 'completed' && response.imageUrl) {
          const completedRecord: GenerationRecoveryRecord = {
            usageId: response.usage.id,
            prompt: response.usage.prompt,
            aspectRatio: response.usage.aspectRatio,
            style: response.usage.style,
            status: 'completed',
            imageUrl: response.imageUrl,
          };

          syncRecoveryRecord(completedRecord);
          clearPollingTimer();
          activeUsageIdRef.current = null;
          setGeneratedImageUrl(response.imageUrl);
          setGenerationStatus('idle');
          setIsGenerating(false);
          return;
        }

        syncRecoveryRecord({
          usageId: response.usage.id,
          prompt: response.usage.prompt,
          aspectRatio: response.usage.aspectRatio,
          style: response.usage.style,
          status: 'processing',
          imageUrl: null,
        });

        pollingTimeoutRef.current = window.setTimeout(() => {
          void tick();
        }, POLL_INTERVAL_MS);
      } catch (error) {
        if (!isMountedRef.current || activeUsageIdRef.current !== usageId) {
          return;
        }

        if (error instanceof ApiClientError && error.status === 404) {
          toast.error(
            'We could not find that image generation. Please try again.',
          );
          resetAfterFailure();
          return;
        }

        if (error instanceof ApiClientError && error.status === 401) {
          toast.error('Your session expired while checking the image status.');
          resetAfterFailure();
          return;
        }

        pollingTimeoutRef.current = window.setTimeout(() => {
          void tick();
        }, POLL_INTERVAL_MS);
      }
    };

    void tick();
  }

  async function generateImage(input: GenerateImageInput) {
    if (isGenerating) {
      return;
    }

    const trimmedPrompt = input.prompt.trim();
    if (!trimmedPrompt) {
      toast.error('Add a prompt before generating an image.');
      return;
    }

    resetGenerationState();
    setIsGenerating(true);
    setGenerationStatus('processing');
    setGeneratedPrompt(trimmedPrompt);

    try {
      const response = await apiClient<GenerateImageResponse>(
        '/api/images/generate',
        {
          method: 'POST',
          body: {
            prompt: trimmedPrompt,
            aspectRatio: input.aspectRatio,
            style: input.style,
          },
        },
      );

      setUser(response.user);
      syncRecoveryRecord({
        usageId: response.usage.id,
        prompt: response.usage.prompt,
        aspectRatio: response.usage.aspectRatio,
        style: response.usage.style,
        status: 'processing',
        imageUrl: null,
      });
      setGeneratedPrompt(response.usage.prompt);
      toast.info(response.message);
      activeUsageIdRef.current = response.usage.id;
      void pollGenerationStatus(response.usage.id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Generation failed';

      resetAfterFailure();
      toast.error(message);
    }
  }

  useEffect(() => {
    isMountedRef.current = true;

    const recoveryRecord = readGenerationRecoveryRecord();
    if (recoveryRecord) {
      restoreRecoveryRecord(recoveryRecord);
    }

    return () => {
      isMountedRef.current = false;
      clearPollingTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    generateImage,
    generatedImageUrl,
    generatedPrompt,
    generationStatus,
    isGenerating,
  };
}
