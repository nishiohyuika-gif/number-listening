import { useEffect, useRef, useState } from 'react';
import { useSession } from '../store/sessionStore';
import { useSettings } from '../store/settingsStore';
import { useTTS } from '../speech/useTTS';
import { getStrings } from '../i18n/strings';
import { PlayControls } from '../components/PlayControls';
import { AnswerInput } from '../components/AnswerInput';
import { Feedback } from '../components/Feedback';
import { Button } from '../components/ui/Button';
import type { Answer } from '../types/core';

interface Props {
  onFinish: () => void;
}

export function QuizPage({ onFinish }: Props) {
  const session = useSession();
  const settings = useSettings();
  const tts = useTTS();
  const s = getStrings(settings.uiLang);

  const [playCount, setPlayCount] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<Answer | null>(null);
  const autoPlayedFor = useRef<string | null>(null);

  const current = session.current?.questions[session.currentIndex];

  // Auto-play once per new question (after voices have loaded).
  useEffect(() => {
    if (!current || !tts.voicesLoaded) return;
    if (autoPlayedFor.current === current.id) return;
    autoPlayedFor.current = current.id;
    setLastAnswer(null);
    setPlayCount(1);
    tts.speak({ text: current.speechText, lang: current.targetLang, rate: settings.playbackRate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, tts.voicesLoaded]);

  // Keyboard shortcuts:
  //   - Enter on feedback screen → next question
  //   - Ctrl/Cmd+Space → replay (works even when typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        if (!current) return;
        e.preventDefault();
        tts.speak({ text: current.speechText, lang: current.targetLang, rate: settings.playbackRate });
        setPlayCount((c) => c + 1);
        return;
      }
      if (e.key === 'Enter' && lastAnswer && !isEditable) {
        e.preventDefault();
        const cur = session.current;
        if (!cur) return;
        const isLast = session.currentIndex + 1 >= cur.questions.length;
        session.next();
        if (isLast) onFinish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAnswer, session.currentIndex, current?.id, settings.playbackRate]);

  if (!current || !session.current) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <p className="text-center text-slate-500">No active session.</p>
      </div>
    );
  }

  const handlePlay = () => {
    tts.speak({ text: current.speechText, lang: current.targetLang, rate: settings.playbackRate });
    setPlayCount((c) => c + 1);
  };

  const handleSubmit = (input: string) => {
    const ans = session.submitAnswer(input, playCount);
    setLastAnswer(ans);
    tts.stop();
  };

  const handleNext = () => {
    const isLast = session.currentIndex + 1 >= session.current!.questions.length;
    session.next();
    if (isLast) {
      onFinish();
    }
  };

  const voiceMissing = tts.voicesLoaded && !tts.voiceAvailable(current.targetLang);
  const total = session.current.questions.length;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      <header className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          {session.currentIndex + 1} / {total}
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-400">
          {s.categoryName[current.category]}
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
        <PlayControls
          onPlay={handlePlay}
          rate={settings.playbackRate}
          onRateChange={settings.setPlaybackRate}
          playCount={playCount}
          maxPlays={settings.maxPlays}
          speaking={tts.speaking}
          voiceMissing={voiceMissing}
          s={s}
        />
        {!tts.apiAvailable && (
          <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">
            {s.ttsUnavailable}
          </p>
        )}

        {!lastAnswer ? (
          <AnswerInput
            question={current}
            onSubmit={handleSubmit}
            submitLabel={s.submit}
          />
        ) : (
          <>
            <Feedback question={current} answer={lastAnswer} s={s} />
            <Button fullWidth onClick={handleNext}>
              {session.currentIndex + 1 >= total ? s.finish : s.next}
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-center text-slate-400">
        Enter: {s.submit}/{s.next} · Ctrl+Space: {s.replay}
      </p>
    </div>
  );
}
