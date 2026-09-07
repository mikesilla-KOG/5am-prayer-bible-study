import { useMemo, useState } from 'react'
import type { Question } from '../types'

interface QuizProps {
  questions: Question[]
  lessonId: string
}

export function Quiz({ questions, lessonId }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    if (!submitted) return null
    let correct = 0
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct += 1
    }
    return { correct, total: questions.length }
  }, [submitted, answers, questions])

  function select(qid: string, index: number) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qid]: index }))
  }

  function submit() {
    if (Object.keys(answers).length < questions.length) return
    setSubmitted(true)
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
  }

  const allAnswered = Object.keys(answers).length === questions.length

  return (
    <section className="quiz card" aria-labelledby={`quiz-${lessonId}`}>
      <h2 id={`quiz-${lessonId}`}>Check your understanding</h2>
      <ol className="quiz-list">
        {questions.map((q, qi) => {
          const chosen = answers[q.id]
          const showResult = submitted && chosen !== undefined
          const isCorrect = chosen === q.correctIndex
          return (
            <li key={q.id} className="quiz-item">
              <p className="quiz-prompt">
                <span className="quiz-num">{qi + 1}.</span> {q.prompt}
              </p>
              <div className="choices" role="group" aria-label={`Choices for question ${qi + 1}`}>
                {q.choices.map((choice, ci) => {
                  let cls = 'choice'
                  if (chosen === ci) cls += ' selected'
                  if (showResult && ci === q.correctIndex) cls += ' correct'
                  if (showResult && chosen === ci && !isCorrect) cls += ' wrong'
                  return (
                    <button
                      key={ci}
                      type="button"
                      className={cls}
                      onClick={() => select(q.id, ci)}
                      disabled={submitted}
                      aria-pressed={chosen === ci}
                    >
                      {choice}
                    </button>
                  )
                })}
              </div>
              {showResult && (
                <p className={`explanation ${isCorrect ? 'ok' : 'nope'}`}>
                  {isCorrect ? 'Correct. ' : 'Not quite. '}
                  {q.explanation}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="quiz-actions">
        {!submitted ? (
          <button type="button" className="btn primary" onClick={submit} disabled={!allAnswered}>
            {allAnswered ? 'Check answers' : `Answer all (${Object.keys(answers).length}/${questions.length})`}
          </button>
        ) : (
          <>
            <p className="score" role="status">
              Score: {score!.correct} / {score!.total}
              {score!.correct === score!.total ? ' — Well done!' : ''}
            </p>
            <button type="button" className="btn secondary" onClick={reset}>
              Try again
            </button>
          </>
        )}
      </div>
    </section>
  )
}
