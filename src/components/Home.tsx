import { useEffect, useState } from 'react'
import config from '../data/config.json'
import type { Lesson } from '../types'
import { getProgress, isDayComplete, type ProgressState } from '../utils/progress'
import type { PlanStatus } from '../utils/schedule'
import { formatDisplayDate, toLocalISODate } from '../utils/schedule'
import { IconBook, IconChevron } from './Icons'

interface HomeProps {
  status: PlanStatus
  lesson: Lesson | null
  totalDays: number
  progressVersion?: number
  onOpenDay: (dayNumber: number) => void
  onAllLessons: () => void
}

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return true
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const ios = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return mq || ios
}

export function Home({
  status,
  lesson,
  totalDays,
  progressVersion = 0,
  onOpenDay,
  onAllLessons,
}: HomeProps) {
  const todayLabel = formatDisplayDate(toLocalISODate())
  const [progress, setProgress] = useState<ProgressState>(() => getProgress())
  const [standalone, setStandalone] = useState(true)

  useEffect(() => {
    setProgress(getProgress())
  }, [progressVersion])

  useEffect(() => {
    setStandalone(isStandaloneDisplay())
  }, [])

  const completedCount = progress.completedDays.length

  if (status.kind === 'complete') {
    return (
      <section className="home">
        <div className="card celebrate-card">
          <p className="day-meta">{todayLabel}</p>
          <h1>Study complete</h1>
          <p className="lead">{config.completionMessage}</p>
          <p className="progress-saved-note">
            {completedCount} of {totalDays} days done on this phone
          </p>
          <button type="button" className="btn primary big" onClick={onAllLessons}>
            Review all lessons
          </button>
        </div>
        <InstallTip show={!standalone} />
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

  const todayDone = isDayComplete(lesson.dayNumber, progress)

  return (
    <div className="home">
      {status.kind === 'before' && (
        <p className="banner info">
          The plan begins {formatDisplayDate(config.planStartDate)}. You can start Day 1 anytime.
        </p>
      )}

      <section className="card today-card" aria-labelledby="today-heading">
        <p className="day-meta">Today&apos;s lesson</p>
        <p className="today-day-label">
          {dayLabel}
          {todayDone && (
            <span className="done-badge" aria-label="Completed">
              ✓ Done
            </span>
          )}
        </p>
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
          {todayDone ? 'Open again' : 'Start lesson'}
        </button>
      </section>

      <section className="card progress-card" aria-labelledby="progress-heading">
        <h2 id="progress-heading" className="section-label">
          Your progress
        </h2>
        <p className="progress-summary">
          {completedCount === 0
            ? 'No days finished yet — complete the quiz to mark a day Done.'
            : `${completedCount} of ${totalDays} days done`}
        </p>
        <ol className="day-dots" aria-label="Days completed">
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1
            const done = isDayComplete(day, progress)
            return (
              <li key={day}>
                <button
                  type="button"
                  className={`day-dot${done ? ' done' : ''}`}
                  onClick={() => onOpenDay(day)}
                  aria-label={done ? `Day ${day}, Done` : `Day ${day}`}
                >
                  {done ? '✓' : day}
                </button>
              </li>
            )
          })}
        </ol>
        <p className="progress-saved-note">Saved on this phone</p>
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

      <InstallTip show={!standalone} />
    </div>
  )
}

function InstallTip({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <p className="install-tip">
      Tip: Add to Home Screen for an app-like icon (Safari Share → Add to Home Screen, or Chrome menu →
      Install / Add to Home screen).
    </p>
  )
}
