import type { Lesson } from '../types'
import { Quiz } from './Quiz'
import { WordPuzzle } from './WordPuzzle'

interface DayViewProps {
  lesson: Lesson
  badge?: string
  onBack?: () => void
  onAllLessons?: () => void
}

export function DayView({ lesson, badge, onBack, onAllLessons }: DayViewProps) {
  return (
    <article className="day-view">
      {(onBack || badge) && (
        <div className="day-toolbar">
          {onBack && (
            <button type="button" className="btn ghost" onClick={onBack}>
              ← Back
            </button>
          )}
          {badge && <span className="day-badge">{badge}</span>}
        </div>
      )}

      <header className="day-hero card">
        <p className="day-meta">Day {lesson.dayNumber} · {lesson.scriptureReference}</p>
        <h1 className="day-title">{lesson.title}</h1>
      </header>

      <section className="card" aria-labelledby="reading-heading">
        <h2 id="reading-heading">Read</h2>
        <p className="muted">Open today&apos;s chapters on Bible Gateway (NIV).</p>
        <ul className="link-list">
          {lesson.readingLinks.map((link) => (
            <li key={link.url}>
              <a className="ext-link" href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="audio-heading">
        <h2 id="audio-heading">Listen</h2>
        <p className="muted">
          Audio placeholders — add your own streaming or download URLs in{' '}
          <code>src/data/lessons.json</code>.
        </p>
        <ul className="link-list">
          {lesson.audioLinks.map((link, i) => (
            <li key={i} className="audio-placeholder">
              <span className="audio-label">{link.label}</span>
              {link.url ? (
                <a className="ext-link" href={link.url} target="_blank" rel="noopener noreferrer">
                  Play / stream
                </a>
              ) : (
                <span className="muted small">URL not set yet</span>
              )}
              {link.downloadUrl ? (
                <a className="ext-link" href={link.downloadUrl} target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="card lesson-text" aria-labelledby="lesson-heading">
        <h2 id="lesson-heading">Lesson</h2>
        {lesson.lesson.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      <WordPuzzle puzzle={lesson.wordPuzzle} lessonId={lesson.id} />

      <Quiz questions={lesson.questions} lessonId={lesson.id} />

      {onAllLessons && (
        <p className="day-footer-nav">
          <button type="button" className="btn secondary" onClick={onAllLessons}>
            Browse all lessons
          </button>
        </p>
      )}
    </article>
  )
}
