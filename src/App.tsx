import { useMemo, useState } from 'react'
import { AllLessons } from './components/AllLessons'
import { DayView } from './components/DayView'
import { Header } from './components/Header'
import { Home } from './components/Home'
import config from './data/config.json'
import lessonsData from './data/lessons.json'
import type { Lesson, View } from './types'
import { setLastOpenedDay } from './utils/progress'
import { getLessonByDay, getPlanStatus } from './utils/schedule'
import './App.css'

const lessons = lessonsData as Lesson[]

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' })
  const [progressVersion, setProgressVersion] = useState(0)

  const status = useMemo(
    () => getPlanStatus(config.planStartDate, lessons.length),
    [],
  )

  const todayDay =
    status.kind === 'active'
      ? status.dayNumber
      : status.kind === 'before'
        ? 1
        : null

  const homeLesson =
    status.kind === 'complete'
      ? null
      : getLessonByDay(lessons, status.kind === 'before' ? 1 : status.dayNumber) ?? null

  function openDay(dayNumber: number) {
    setLastOpenedDay(dayNumber)
    setView({ name: 'day', dayNumber })
  }

  function bumpProgress() {
    setProgressVersion((v) => v + 1)
  }

  return (
    <div className="app-shell">
      <Header onHome={() => setView({ name: 'home' })} />
      <main className="app-main">
        {view.name === 'home' && (
          <Home
            status={status}
            lesson={homeLesson}
            totalDays={lessons.length}
            progressVersion={progressVersion}
            onOpenDay={openDay}
            onAllLessons={() => setView({ name: 'all' })}
          />
        )}
        {view.name === 'all' && (
          <AllLessons
            lessons={lessons}
            todayDay={todayDay}
            progressVersion={progressVersion}
            onSelect={openDay}
            onBack={() => setView({ name: 'home' })}
          />
        )}
        {view.name === 'day' &&
          (() => {
            const lesson = getLessonByDay(lessons, view.dayNumber)
            if (!lesson) {
              return (
                <section className="card">
                  <h1>Day not found</h1>
                  <button
                    type="button"
                    className="btn secondary big"
                    onClick={() => setView({ name: 'all' })}
                  >
                    All lessons
                  </button>
                </section>
              )
            }
            return (
              <DayView
                lesson={lesson}
                badge={`Day ${lesson.dayNumber} of ${lessons.length}`}
                onBack={() => setView({ name: 'home' })}
                onAllLessons={() => setView({ name: 'all' })}
                onProgressSaved={bumpProgress}
              />
            )
          })()}
      </main>
      <footer className="site-footer">
        <p>
          {config.title}
          <span className="footer-sub"> · {config.subtitle}</span>
        </p>
        <p className="progress-saved-note footer-saved">Saved on this phone</p>
      </footer>
    </div>
  )
}
