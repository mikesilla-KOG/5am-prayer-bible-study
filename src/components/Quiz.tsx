import { useState } from 'react'
import type { Question } from '../types'
import { IconChecklist } from './Icons'

interface QuizProps {
  questions: Question[]
  lessonId: string
  stepNumber?: number
}

export function Quiz({ questions, lessonId, stepNumber = 5 }: QuizProps) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)

  const q = questions[index]
  const chosen = q ? answers[q.id] : undefined
  const isCorrect = chosen === q?.correctIndex
  const score = questions.reduce(
    (n, question) => n + (answers[question.id] === question.correctIndex ? 1 : 0),
    0,
  )

  function select(choiceIndex: number) {
    if (revealed || finished || !q) return
    setAnswers((prev) => ({ ...prev, [q.id]: choiceIndex }))
    setRevealed(true)
  }

  function next() {
    if (index >= questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setRevealed(false)
  }

  function reset() {
    setIndex(0)
    setAnswers({})
    setRevealed(false)
    setFinished(false)
  }

  return (
    <section className="quiz card step-card" aria-labelledby={`quiz-${lessonId}`}>
      <div className="step-heading">
        <span className="step-num" aria-hidden="true">
          {stepNumber}
        </span>
        <span className="step-icon" aria-hidden="true">
          <IconChecklist />
        </span>
        <h2 id={`quiz-${lessonId}`}>Questions</h2>
      </div>

      {finished ? (
        <div className="quiz-done">
          <p className="score" role="status">
            You got {score} of {questions.length} right
            {score === questions.length ? ' — Well done!' : '!'}
          </p>
          <button type="button" className="btn secondary big" onClick={reset}>
            Try again
          </button>
        </div>
      ) : q ? (
        <>
          <p className="quiz-progress-label">
            Question {index + 1} of {questions.length}
          </p>
          <p className="quiz-prompt">{q.prompt}</p>
          <div className="choices" role="group" aria-label={`Choices for question ${index + 1}`}>
            {q.choices.map((choice, ci) => {
              let cls = 'choice'
              if (chosen === ci) cls += ' selected'
              if (revealed && ci === q.correctIndex) cls += ' correct'
              if (revealed && chosen === ci && !isCorrect) cls += ' wrong'
              return (
                <button
                  key={ci}
                  type="button"
                  className={cls}
                  onClick={() => select(ci)}
                  disabled={revealed}
                  aria-pressed={chosen === ci}
                >
                  {choice}
                </button>
              )
            })}
          </div>
          {revealed && (
            <>
              <p className={`explanation ${isCorrect ? 'ok' : 'nope'}`}>
                {isCorrect ? 'Correct. ' : 'Not quite. '}
                {q.explanation}
              </p>
              <div className="quiz-actions">
                <button type="button" className="btn primary big" onClick={next}>
                  {index >= questions.length - 1 ? 'See score' : 'Next question'}
                </button>
              </div>
            </>
          )}
        </>
      ) : null}
    </section>
  )
}
