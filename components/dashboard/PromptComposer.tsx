'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mic, Send } from 'lucide-react';
import { sectionContainer, fadeUp, slideDown } from '@/lib/motion/variants';

import {
  ASPECT_RATIO_OPTIONS,
  RECENT_PROMPTS,
  STYLE_OPTIONS,
} from '@/components/dashboard/dashboard.constants';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<{
    isFinal?: boolean;
    0?: { transcript?: string };
  }>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type BrowserWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function PromptComposer() {
  const [promptInput, setPromptInput] = useState('');
  const [pendingVoiceText, setPendingVoiceText] = useState('');
  const [aspectRatio, setAspectRatio] = useState('4:3');
  const [style, setStyle] = useState('cinematic');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceDebounceTimeoutRef = useRef<number | null>(null);
  const pendingFinalTranscriptRef = useRef<string>('');
  const observedFinalTranscriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const prefersReducedMotion = useReducedMotion();

  const isVoiceSupported =
    isClient &&
    Boolean(
      (window as BrowserWindow).SpeechRecognition ||
      (window as BrowserWindow).webkitSpeechRecognition,
    );

  useEffect(() => {
    return () => {
      if (voiceDebounceTimeoutRef.current) {
        window.clearTimeout(voiceDebounceTimeoutRef.current);
        voiceDebounceTimeoutRef.current = null;
      }

      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  function appendSegmentToPrompt(segment: string) {
    const text = segment?.trim();
    if (!text) return;

    setPromptInput(prev => {
      const prevTrim = prev.trim();
      if (prevTrim && prevTrim.endsWith(text)) return prev;
      return prevTrim ? `${prevTrim} ${text}` : text;
    });
  }

  function queueFinalTranscript(segment: string) {
    const text = segment.trim();
    if (!text) return;

    pendingFinalTranscriptRef.current = pendingFinalTranscriptRef.current
      ? `${pendingFinalTranscriptRef.current} ${text}`.trim()
      : text;

    if (voiceDebounceTimeoutRef.current) {
      window.clearTimeout(voiceDebounceTimeoutRef.current);
    }

    voiceDebounceTimeoutRef.current = window.setTimeout(() => {
      const pendingFinalText = pendingFinalTranscriptRef.current.trim();
      if (pendingFinalText) {
        appendSegmentToPrompt(pendingFinalText);
        pendingFinalTranscriptRef.current = '';
      }
      voiceDebounceTimeoutRef.current = null;
    }, 180);
  }

  function flushVoiceTranscriptBuffer() {
    if (voiceDebounceTimeoutRef.current) {
      window.clearTimeout(voiceDebounceTimeoutRef.current);
      voiceDebounceTimeoutRef.current = null;
    }

    const pendingFinalText = pendingFinalTranscriptRef.current.trim();
    if (pendingFinalText) {
      appendSegmentToPrompt(pendingFinalText);
      pendingFinalTranscriptRef.current = '';
      return;
    }

    const interimText = interimTranscriptRef.current.trim();
    if (interimText) {
      appendSegmentToPrompt(interimText);
      interimTranscriptRef.current = '';
    }
  }

  async function ensureMicrophoneConstraints(): Promise<boolean> {
    if (!navigator?.mediaDevices?.getUserMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { noiseSuppression: true, echoCancellation: true },
      });
      stream.getTracks().forEach(t => t.stop());
      return true;
    } catch {
      return false;
    }
  }

  function appendPromptFromChip(prompt: string) {
    setPromptInput(prompt);
  }

  function createRecognitionInstance() {
    const browserWindow = window as BrowserWindow;
    const SpeechRecognitionImpl =
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      return null;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    // best-effort: limit alternatives
    // @ts-expect-error - some engines expose maxAlternatives
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: unknown) => {
      const ev = event as SpeechRecognitionEventLike;
      const finalParts: string[] = [];
      const interimParts: string[] = [];

      const startIndex = ev.resultIndex ?? 0;
      const results = ev.results;
      for (let i = startIndex; i < results.length; i++) {
        const res = results[i];
        if (!res) continue;

        const t = res[0]?.transcript?.trim() ?? '';
        if (!t) continue;
        if (res.isFinal) finalParts.push(t);
        else interimParts.push(t);
      }

      if (finalParts.length) {
        const combinedFinal = finalParts.join(' ').trim();
        let toQueue = combinedFinal;
        const observedFinal = observedFinalTranscriptRef.current;
        if (observedFinal && combinedFinal.startsWith(observedFinal)) {
          toQueue = combinedFinal.slice(observedFinal.length).trim();
        } else if (observedFinal && observedFinal.startsWith(combinedFinal)) {
          toQueue = '';
        }

        observedFinalTranscriptRef.current = combinedFinal;
        interimTranscriptRef.current = '';
        setPendingVoiceText('');
        if (toQueue) {
          queueFinalTranscript(toQueue);
        }
        return;
      }

      const interimCombined = interimParts.join(' ').trim();
      if (interimCombined && interimTranscriptRef.current !== interimCombined) {
        interimTranscriptRef.current = interimCombined;
        setPendingVoiceText(interimCombined);
      } else if (!interimCombined) {
        setPendingVoiceText('');
      }
    };

    recognition.onerror = () => {
      if (voiceDebounceTimeoutRef.current) {
        window.clearTimeout(voiceDebounceTimeoutRef.current);
        voiceDebounceTimeoutRef.current = null;
      }
      pendingFinalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      setPendingVoiceText('');
      observedFinalTranscriptRef.current = '';
      setIsListening(false);
    };

    recognition.onend = () => {
      flushVoiceTranscriptBuffer();
      pendingFinalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      observedFinalTranscriptRef.current = '';
      setPendingVoiceText('');
      setIsListening(false);
    };

    return recognition;
  }

  async function toggleVoiceInput(): Promise<void> {
    if (!isVoiceSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognitionInstance();
    }

    if (!recognitionRef.current) return;

    // Prepare session base and reset transient refs
    pendingFinalTranscriptRef.current = '';
    observedFinalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setPendingVoiceText('');

    // Try to enable basic mic constraints (noise suppression/echo cancel) where supported
    await ensureMicrophoneConstraints();

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }

  return (
    <motion.section
      className='space-y-3'
      variants={prefersReducedMotion ? undefined : sectionContainer}>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-sm font-medium text-foreground'>
          Recent prompts:
        </span>
        {RECENT_PROMPTS.map(prompt => (
          <motion.button
            key={prompt}
            type='button'
            onClick={() => appendPromptFromChip(prompt)}
            variants={prefersReducedMotion ? undefined : fadeUp}
            className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-3 py-1 text-xs transition-colors'>
            {prompt}
          </motion.button>
        ))}
      </div>

      <motion.div
        variants={prefersReducedMotion ? undefined : slideDown}
        className='overflow-hidden rounded-2xl border bg-card shadow-sm'>
        <div className='space-y-4 p-4 sm:p-5'>
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
              value={promptInput}
              onChange={event => setPromptInput(event.target.value)}
            />
          </div>

          <Separator />

          <div className='flex flex-col gap-3 xs:flex-row sm:items-center xs:justify-between'>
            <div className='flex flex-wrap items-center gap-2'>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
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

              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger
                  aria-label='Select style'
                  className='flex-1 min-w-32'>
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

            <div className='flex items-center justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                aria-label={
                  isListening ? 'Stop voice input' : 'Start voice input'
                }
                disabled={!isVoiceSupported}
                onClick={() => void toggleVoiceInput()}
                className={
                  isListening ? 'border-primary text-primary' : undefined
                }>
                <Mic className='size-4' />
              </Button>
              <Button
                type='button'
                size='icon'
                aria-label='Generate image from prompt'>
                <Send className='size-4' />
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-end'>
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
      </motion.div>
    </motion.section>
  );
}
