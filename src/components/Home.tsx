import config from '../data/config.json'
import type { Lesson } from '../types'
import type { PlanStatus } from '../utils/schedule'
import { formatDisplayDate, toLocalISODate } from '../utils/schedule'
import { DayView } from './DayView'

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
      <section className="home-complete">
        <div className="card celebrate-card">
          <p className="day-meta">{todayLabel}</p>
          <h1>Study complete</h1>
          <p>{config.completionMessage}</p>
          <button type="button" className="btn primary" onClick={onAllLessons}>
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
        <button type="button" className="btn secondary" onClick={onAllLessons}>
          All lessons
        </button>
      </section>
    )
  }

  const badge =
    status.kind === 'before'
      ? `Plan starts ${formatDisplayDate(config.planStartDate)} · showing Day 1`
      : `Today · Day ${status.dayNumber} of ${totalDays}`

  return (
    <div className="home">
      {status.kind === 'before' && (
        <p className="banner info">
          The plan begins {formatDisplayDate(config.planStartDate)}. Until then, start with Day 1 whenever
          you are ready.
        </p>
      )}
      <DayView lesson={lesson} badge={badge} onAllLessons={onAllLessons} />
      {status.kind === 'active' && status.dayNumber > 1 && (
        <p className="catch-up muted center">
          Behind?{' '}
          <button type="button" className="text-link" onClick={() => onOpenDay(status.dayNumber - 1)}>
            Open Day {status.dayNumber - 1}
          </button>{' '}
          or{' '}
          <button type="button" className="text-link" onClick={onAllLessons}>
            browse all days
          </button>
          .
        </p>
      )}
    </div>
  )
}
