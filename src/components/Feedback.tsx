import type { Answer, Question } from '../types/core';
import type { UIStrings } from '../i18n/strings';

interface Props {
  question: Question;
  answer: Answer;
  s: UIStrings;
}

export function Feedback({ question, answer, s }: Props) {
  return (
    <div
      className={`rounded-xl border p-4 space-y-2 ${
        answer.correct
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-rose-50 border-rose-200'
      }`}
    >
      <div
        className={`text-lg font-semibold ${
          answer.correct ? 'text-emerald-700' : 'text-rose-700'
        }`}
      >
        {answer.correct ? '✓ ' + s.correct : '✗ ' + s.wrong}
      </div>
      <div className="text-sm text-slate-700">
        <span className="font-medium">{s.yourAnswer}:</span>{' '}
        <span className="font-mono">{answer.userInput}</span>
      </div>
      <div className="text-sm text-slate-700">
        <span className="font-medium">{s.answer}:</span>{' '}
        <span className="font-mono">{question.displayAnswer}</span>
      </div>
      <div className="text-xs text-slate-500 italic break-words">
        {question.speechText}
      </div>
    </div>
  );
}
