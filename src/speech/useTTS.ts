import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../types/core';
import { LANGUAGE_BCP47 } from '../types/core';
import { pickVoice, waitForVoices } from './voices';

interface SpeakArgs {
  text: string;
  lang: Language;
  rate?: number;
}

export interface UseTTSResult {
  speak: (args: SpeakArgs) => void;
  stop: () => void;
  speaking: boolean;
  /** True if a voice for the requested language is available. */
  voiceAvailable: (lang: Language) => boolean;
  /** True if the Web Speech API itself is available in this browser. */
  apiAvailable: boolean;
  voicesLoaded: boolean;
}

export function useTTS(): UseTTSResult {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const apiAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!apiAvailable) return;
    let mounted = true;
    waitForVoices().then((v) => {
      if (!mounted) return;
      setVoices(v);
      setVoicesLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, [apiAvailable]);

  const speak = useCallback(
    ({ text, lang, rate = 1 }: SpeakArgs) => {
      if (!apiAvailable) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = LANGUAGE_BCP47[lang];
      u.rate = rate;
      const voice = pickVoice(voices, lang);
      if (voice) u.voice = voice;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utteranceRef.current = u;
      synth.speak(u);
    },
    [voices, apiAvailable],
  );

  const stop = useCallback(() => {
    if (!apiAvailable) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [apiAvailable]);

  const voiceAvailable = useCallback(
    (lang: Language) => !!pickVoice(voices, lang),
    [voices],
  );

  return { speak, stop, speaking, voiceAvailable, apiAvailable, voicesLoaded };
}
