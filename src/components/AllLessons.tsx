import { useEffect, useState } from 'react'
import type { Lesson } from '../types'
import { getProgress, getQuizScore, isDayComplete, type ProgressState } from '../utils/progress'
import { IconChevron } from './Icons'

interface AllLessonsProps {
  lessons: Lesson[]
  todayDay?: number | null
  progressVersion?: number
  onSelect: (dayNumber: number) => void
  onBack: () => void
}

export function AllLessons({
  lessons,
  todayDay,
  progressVersion = 0,
  onSelect,
  onBack,
}: AllLessonsProps) {
  const [progress, setProgress] = useState<ProgressState>(() => getProgress())

  useEffect(() => {
    setProgress(getProgress())
  }, [progressVersion])

  return (
    <section className="all-lessons">
      <div className="day-toolbar">
        <button type="button" className="btn ghost big-ghost" onClick={onBack}>
          ← Home
        </button>
      </div>
      <header className="card">
        <h1>All lessons</h1>
        <p className="muted lead">Book of Acts · {lessons.length} days</p>
        <p className="progress-saved-note">Saved on this phone</p>
      </header>
      <ul className="lesson-list">
        {lessons.map((lesson) => {
          const done = isDayComplete(lesson.dayNumber, progress)
          const score = getQuizScore(lesson.dayNumber, progress)
          return (
            <li key={lesson.id}>
              <button
                type="button"
                className={`lesson-row${done ? ' lesson-row-done' : ''}`}
                onClick={() => onSelect(lesson.dayNumber)}
              >
                <span className={`lesson-day-num${done ? ' done' : ''}`} aria-hidden="true">
                  {done ? '✓' : lesson.dayNumber}
                </span>
                <span className="lesson-info">
                  <span className="lesson-row-title">{lesson.title}</span>
                  <span className="lesson-ref">
                    {lesson.scriptureReference}
                    {score ? ` · Quiz ${score.correct}/${score.total}` : ''}
                  </span>
                </span>
                {done ? (
                  <span className="done-pill">Done</span>
                ) : todayDay === lesson.dayNumber ? (
                  <span className="today-pill">Today</span>
                ) : null}
                <IconChevron className="row-chevron" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
