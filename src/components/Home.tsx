import config from '../data/config.json'
import type { Lesson } from '../types'
import type { PlanStatus } from '../utils/schedule'
import { formatDisplayDate, toLocalISODate } from '../utils/schedule'
import { IconBook, IconChevron } from './Icons'

interface HomeProps {
  status: PlanStatus
  lesson: Lesson | null
  totalDays: number
  onOpenDay: (dayNumber: number) => void
  onAllLessons: () => void
}

export function Home({ status, lesson, totalDays, onOpenDay, onAllLessons }: HomeProps) {
  const todayLabel = formatDisplayDate(toLocalISODate())

  if (status.kind === 'complete') {
    return (
      <section className="home">
        <div className="card celebrate-card">
          <p className="day-meta">{todayLabel}</p>
          <h1>Study complete</h1>
          <p className="lead">{config.completionMessage}</p>
          <button type="button" className="btn primary big" onClick={onAllLessons}>
            Review all lessons
          </button>
        </div>
      </section>
    )
  }

  if (!lesson) {
    return (
      <section className="card">
        <h1>Lesson not found</h1>
        <button type="button" className="btn secondary big" onClick={onAllLessons}>
          All lessons
        </button>
      </section>
    )
  }

  const dayLabel =
    status.kind === 'before'
      ? `Day 1 of ${totalDays}`
      : `Day ${status.dayNumber} of ${totalDays}`

  return (
    <div className="home">
      {status.kind === 'before' && (
        <p className="banner info">
          The plan begins {formatDisplayDate(config.planStartDate)}. You can start Day 1 anytime.
        </p>
      )}

      <section className="card today-card" aria-labelledby="today-heading">
        <p className="day-meta">Today&apos;s lesson</p>
        <p className="today-day-label">{dayLabel}</p>
        <h1 id="today-heading" className="today-title">
          {lesson.title}
        </h1>
        <p className="today-ref">
          <IconBook className="inline-icon" />
          {lesson.scriptureReference}
        </p>
        <button
          type="button"
          className="btn primary big start-btn"
          onClick={() => onOpenDay(lesson.dayNumber)}
        >
          Start lesson
        </button>
      </section>

      <section className="all-lessons-teaser" aria-labelledby="all-heading">
        <h2 id="all-heading" className="section-label">
          All lessons
        </h2>
        <button type="button" className="all-lessons-btn" onClick={onAllLessons}>
          <span>See all {totalDays} days</span>
          <IconChevron />
        </button>
      </section>
    </div>
  )
}
