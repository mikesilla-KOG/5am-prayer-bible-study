import type { Lesson } from '../types'

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
        <button type="button" className="btn ghost" onClick={onBack}>
          ← Today
        </button>
      </div>
      <header className="card">
        <h1>All lessons</h1>
        <p className="muted">Book of Acts · {lessons.length} days · four chapters each. Catch up anytime.</p>
      </header>
      <ul className="lesson-list">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <button type="button" className="lesson-row" onClick={() => onSelect(lesson.dayNumber)}>
              <span className="lesson-day">Day {lesson.dayNumber}</span>
              <span className="lesson-info">
                <span className="lesson-row-title">{lesson.title}</span>
                <span className="lesson-ref">{lesson.scriptureReference}</span>
              </span>
              {todayDay === lesson.dayNumber && <span className="today-pill">Today</span>}
              <span className="chevron" aria-hidden="true">
                ›
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
