/** Per-device study progress in localStorage (survives reload; not synced across phones). */

const STORAGE_KEY = '5am-prayer-progress-v1'

export interface DayScore {
  correct: number
  total: number
}

export interface ProgressState {
  /** Day numbers marked complete after finishing the quiz. */
  completedDays: number[]
  /** Quiz scores keyed by day number string. */
  quizScores: Record<string, DayScore>
  /** Last day the reader opened. */
  lastOpenedDay?: number
}

function emptyState(): ProgressState {
  return { completedDays: [], quizScores: {} }
}

function readRaw(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      completedDays: Array.isArray(parsed.completedDays)
        ? parsed.completedDays.filter((n) => typeof n === 'number')
        : [],
      quizScores:
        parsed.quizScores && typeof parsed.quizScores === 'object'
          ? parsed.quizScores
          : {},
      lastOpenedDay:
        typeof parsed.lastOpenedDay === 'number' ? parsed.lastOpenedDay : undefined,
    }
  } catch {
    return emptyState()
  }
}

function write(state: ProgressState): ProgressState {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota / private mode — ignore; UI still works for the session.
  }
  return state
}

export function getProgress(): ProgressState {
  return readRaw()
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function isDayComplete(dayNumber: number, state?: ProgressState): boolean {
  const s = state ?? readRaw()
  return s.completedDays.includes(dayNumber)
}

export function getQuizScore(dayNumber: number, state?: ProgressState): DayScore | undefined {
  const s = state ?? readRaw()
  return s.quizScores[String(dayNumber)]
}

/**
 * Save quiz score and mark the day complete.
 * Rule: a day is complete when the reader finishes the quiz (sees their score),
 * regardless of how many answers were correct.
 */
export function recordQuizComplete(
  dayNumber: number,
  correct: number,
  total: number,
): ProgressState {
  const state = readRaw()
  state.quizScores[String(dayNumber)] = { correct, total }
  if (!state.completedDays.includes(dayNumber)) {
    state.completedDays = [...state.completedDays, dayNumber].sort((a, b) => a - b)
  }
  state.lastOpenedDay = dayNumber
  return write(state)
}

export function setLastOpenedDay(dayNumber: number): ProgressState {
  const state = readRaw()
  state.lastOpenedDay = dayNumber
  return write(state)
}
