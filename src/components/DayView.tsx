import type { Lesson } from '../types'
import { IconBook, IconHeadphones, IconLightbulb } from './Icons'
import { Quiz } from './Quiz'
import { WordPuzzle } from './WordPuzzle'

interface DayViewProps {
  lesson: Lesson
  badge?: string
  onBack?: () => void
  onAllLessons?: () => void
}

function audibleAsinFromUrl(url: string): string | null {
  const match = url.match(/\/pd\/([A-Z0-9]+)/i)
  return match ? match[1].toUpperCase() : null
}

function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent)
}

function audibleOpenHref(webUrl: string): string {
  const asin = audibleAsinFromUrl(webUrl)
  if (!asin || !isAndroid()) return webUrl
  const fallback = encodeURIComponent(webUrl)
  return `intent://www.audible.com/pd/${asin}#Intent;scheme=https;package=com.audible.application;S.browser_fallback_url=${fallback};end`
}

export function DayView({ lesson, badge, onBack, onAllLessons }: DayViewProps) {
  const reading = lesson.readingLinks[0]
  const esvAudio =
    lesson.audioLinks.find((l) => l.kind === 'esv-embed' || l.url.includes('esv.org/audio-player')) ??
    lesson.audioLinks.find((l) => l.url && l.kind !== 'audible')
  const audible = lesson.audioLinks.find((l) => l.kind === 'audible' || l.url.includes('audible.com'))
  const stickVideo = lesson.stickFigureVideo
    ? `${import.meta.env.BASE_URL}${lesson.stickFigureVideo.replace(/^\/+/, '')}`
    : null

  return (
    <article className="day-view">
      {(onBack || badge) && (
        <div className="day-toolbar">
          {onBack && (
            <button type="button" className="btn ghost big-ghost" onClick={onBack}>
              ← Back
            </button>
          )}
          {badge && <span className="day-badge">{badge}</span>}
        </div>
      )}

      <header className="day-hero card">
        <p className="day-meta">
          Day {lesson.dayNumber} · {lesson.scriptureReference}
        </p>
        <h1 className="day-title">{lesson.title}</h1>
      </header>

      {/* Step 1 — Read (one big button for the full passage) */}
      <section className="card step-card" aria-labelledby="reading-heading">
        <div className="step-heading">
          <span className="step-num" aria-hidden="true">
            1
          </span>
          <span className="step-icon" aria-hidden="true">
            <IconBook />
          </span>
          <h2 id="reading-heading">Read</h2>
        </div>
        <p className="step-hint">Open today&apos;s two chapters in the Bible (NIV).</p>
        {reading && (
          <a
            className="btn primary big read-btn"
            href={reading.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBook className="btn-icon" />
            {reading.label}
          </a>
        )}
      </section>

      {/* Step 2 — Listen (in-browser ESV player for the two-chapter span) */}
      <section className="card step-card" aria-labelledby="audio-heading">
        <div className="step-heading">
          <span className="step-num" aria-hidden="true">
            2
          </span>
          <span className="step-icon" aria-hidden="true">
            <IconHeadphones />
          </span>
          <h2 id="audio-heading">Listen</h2>
        </div>
        <p className="step-hint">Play the day&apos;s chapters right here.</p>

        {esvAudio?.url ? (
          <div className="esv-player-wrap">
            <iframe
              className="esv-player"
              src={esvAudio.url}
              title={esvAudio.label || 'Bible audio player'}
              loading="lazy"
              allow="autoplay"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <p className="step-hint">Audio player coming soon.</p>
        )}

        {audible?.url && (
          <div className="audible-secondary">
            <a className="btn secondary big audible-btn" href={audibleOpenHref(audible.url)}>
              <IconHeadphones className="btn-icon" />
              Open Audible
            </a>
            <p className="step-hint listen-instruction">
              Opens Audible. Then tap Library and choose Acts.
            </p>
            <a
              className="web-backup-link"
              href={audible.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Or open Audible in your web browser
            </a>
          </div>
        )}
      </section>

      {stickVideo && (
        <section className="card step-card" aria-labelledby="watch-heading">
          <div className="step-heading">
            <span className="step-num" aria-hidden="true">
              ★
            </span>
            <span className="step-icon" aria-hidden="true">
              <IconLightbulb />
            </span>
            <h2 id="watch-heading">Watch Acts 1</h2>
          </div>
          <p className="step-hint">
            Stick-figure walkthrough of Acts 1 (KJV) — watch while the verses are read to stay focused. A little funny on purpose.
          </p>
          <div className="stick-video-wrap">
            <video
              className="stick-video"
              controls
              playsInline
              preload="metadata"
              src={stickVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      )}

      {/* Step 3 — Learn */}
      <section className="card step-card lesson-text" aria-labelledby="lesson-heading">
        <div className="step-heading">
          <span className="step-num" aria-hidden="true">
            3
          </span>
          <span className="step-icon" aria-hidden="true">
            <IconLightbulb />
          </span>
          <h2 id="lesson-heading">Learn</h2>
        </div>
        <ul className="lesson-bullets">
          {lesson.lesson.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      </section>

      <WordPuzzle puzzle={lesson.wordPuzzle} lessonId={lesson.id} stepNumber={4} />

      <Quiz questions={lesson.questions} lessonId={lesson.id} stepNumber={5} />

      {onAllLessons && (
        <p className="day-footer-nav">
          <button type="button" className="btn secondary big" onClick={onAllLessons}>
            All lessons
          </button>
        </p>
      )}
    </article>
  )
}
