import type { Language } from '../types/core';
import { LANGUAGE_BCP47 } from '../types/core';

/** Wait until speechSynthesis populates its voices list (it may be async on first load). */
export function waitForVoices(timeoutMs = 3000): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }
  const synth = window.speechSynthesis;
  const existing = synth.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);
  return new Promise((resolve) => {
    let resolved = false;
    const onChange = () => {
      const voices = synth.getVoices();
      if (voices.length > 0 && !resolved) {
        resolved = true;
        synth.onvoiceschanged = null;
        resolve(voices);
      }
    };
    synth.onvoiceschanged = onChange;
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(synth.getVoices());
      }
    }, timeoutMs);
  });
}

export function pickVoice(
  voices: SpeechSynthesisVoice[],
  lang: Language,
): SpeechSynthesisVoice | undefined {
  const target = LANGUAGE_BCP47[lang];
  const targetPrefix = target.split('-')[0]!;
  // Prefer exact match, then prefix match, then localService voices, then anything
  const exact = voices.filter((v) => v.lang === target);
  const prefix = voices.filter((v) => v.lang.startsWith(targetPrefix));
  const candidates = exact.length > 0 ? exact : prefix;
  if (candidates.length === 0) return undefined;
  const local = candidates.find((v) => v.localService);
  return local ?? candidates[0];
}
