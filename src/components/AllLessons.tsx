import type { Lesson } from '../types'
import { IconChevron } from './Icons'

interface AllLessonsProps {
  lessons: Lesson[]
  todayDay?: number | null
  onSelect: (dayNumber: number) => void
  onBack: () => void
}

export function AllLessons({ lessons, todayDay, onSelect, onBack }: AllLessonsProps) {
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
      </header>
      <ul className="lesson-list">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <button type="button" className="lesson-row" onClick={() => onSelect(lesson.dayNumber)}>
              <span className="lesson-day-num" aria-hidden="true">
                {lesson.dayNumber}
              </span>
              <span className="lesson-info">
                <span className="lesson-row-title">{lesson.title}</span>
                <span className="lesson-ref">{lesson.scriptureReference}</span>
              </span>
              {todayDay === lesson.dayNumber && <span className="today-pill">Today</span>}
              <IconChevron className="row-chevron" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
