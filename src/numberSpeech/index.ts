import type { Language } from '../types/core';
import type { NumberSpeech } from '../types/speech';
import ja from './ja';
import en from './en';
import fr from './fr';
import zh from './zh';
import ko from './ko';
import de from './de';
import it from './it';
import es from './es';
import nl from './nl';

const ENGINES: Record<Language, NumberSpeech> = { ja, en, fr, zh, ko, de, it, es, nl };

export function getEngine(lang: Language): NumberSpeech {
  return ENGINES[lang];
}
