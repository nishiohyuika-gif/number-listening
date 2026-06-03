import { useState } from 'react';
import { useSettings } from './store/settingsStore';
import { useSession } from './store/sessionStore';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { ResultPage } from './pages/ResultPage';
import type { Question } from './types/core';

type Phase = 'home' | 'quiz' | 'result';

export default function App() {
  const [phase, setPhase] = useState<Phase>('home');
  const settings = useSettings();
  const session = useSession();

  const start = () => {
    session.startSession({
      uiLang: settings.uiLang,
      targetLang: settings.targetLang,
      categories: settings.categories,
      difficulty: settings.difficulty,
      count: settings.questionsPerSession,
    });
    setPhase('quiz');
  };

  const review = (mistakes: Question[]) => {
    session.startReviewFrom(mistakes);
    setPhase('quiz');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {phase === 'home' && <HomePage onStart={start} />}
      {phase === 'quiz' && <QuizPage onFinish={() => setPhase('result')} />}
      {phase === 'result' && (
        <ResultPage onHome={() => setPhase('home')} onReviewStart={review} />
      )}
    </div>
  );
}
