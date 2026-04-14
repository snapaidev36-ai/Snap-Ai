'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

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

type UseVoiceInputOptions = {
  onTranscriptAppended: (segment: string) => void;
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

export function useVoiceInput({ onTranscriptAppended }: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [pendingVoiceText, setPendingVoiceText] = useState('');

  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceDebounceTimeoutRef = useRef<number | null>(null);
  const pendingFinalTranscriptRef = useRef<string>('');
  const observedFinalTranscriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');
  const onTranscriptAppendedRef = useRef(onTranscriptAppended);

  useEffect(() => {
    onTranscriptAppendedRef.current = onTranscriptAppended;
  }, [onTranscriptAppended]);

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

  const isVoiceSupported =
    isClient &&
    Boolean(
      (window as BrowserWindow).SpeechRecognition ||
      (window as BrowserWindow).webkitSpeechRecognition,
    );

  function appendTranscript(segment: string) {
    const text = segment.trim();
    if (!text) {
      return;
    }

    onTranscriptAppendedRef.current(text);
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
        appendTranscript(pendingFinalText);
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
      appendTranscript(pendingFinalText);
      pendingFinalTranscriptRef.current = '';
      return;
    }

    const interimText = interimTranscriptRef.current.trim();
    if (interimText) {
      appendTranscript(interimText);
      interimTranscriptRef.current = '';
    }
  }

  async function ensureMicrophoneConstraints(): Promise<boolean> {
    if (!navigator?.mediaDevices?.getUserMedia) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { noiseSuppression: true, echoCancellation: true },
      });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
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
      for (let index = startIndex; index < results.length; index++) {
        const result = results[index];
        if (!result) continue;

        const transcript = result[0]?.transcript?.trim() ?? '';
        if (!transcript) continue;
        if (result.isFinal) finalParts.push(transcript);
        else interimParts.push(transcript);
      }

      if (finalParts.length) {
        const combinedFinal = finalParts.join(' ').trim();
        let transcriptToQueue = combinedFinal;
        const observedFinal = observedFinalTranscriptRef.current;
        if (observedFinal && combinedFinal.startsWith(observedFinal)) {
          transcriptToQueue = combinedFinal.slice(observedFinal.length).trim();
        } else if (observedFinal && observedFinal.startsWith(combinedFinal)) {
          transcriptToQueue = '';
        }

        observedFinalTranscriptRef.current = combinedFinal;
        interimTranscriptRef.current = '';
        setPendingVoiceText('');
        if (transcriptToQueue) {
          queueFinalTranscript(transcriptToQueue);
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

  async function toggleVoiceInput() {
    if (!isVoiceSupported) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognitionInstance();
    }

    if (!recognitionRef.current) {
      return;
    }

    pendingFinalTranscriptRef.current = '';
    observedFinalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setPendingVoiceText('');

    await ensureMicrophoneConstraints();

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }

  return {
    isListening,
    isVoiceSupported,
    pendingVoiceText,
    toggleVoiceInput,
  };
}
