import type { Lesson } from '../types'

/** Calendar date as YYYY-MM-DD in local timezone. */
export function toLocalISODate(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Parse YYYY-MM-DD as local midnight (avoids UTC shift). */
export function parseLocalISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysBetween(startISO: string, todayISO: string): number {
  const start = parseLocalISODate(startISO)
  const today = parseLocalISODate(todayISO)
  const ms = today.getTime() - start.getTime()
  return Math.floor(ms / 86_400_000)
}

export type PlanStatus =
  | { kind: 'before'; dayNumber: 1 }
  | { kind: 'active'; dayNumber: number }
  | { kind: 'complete' }

export function getPlanStatus(
  planStartDate: string,
  totalDays: number,
  todayISO: string = toLocalISODate(),
): PlanStatus {
  const offset = daysBetween(planStartDate, todayISO)
  if (offset < 0) return { kind: 'before', dayNumber: 1 }
  const dayNumber = offset + 1
  if (dayNumber > totalDays) return { kind: 'complete' }
  return { kind: 'active', dayNumber }
}

export function getLessonByDay(
  lessons: Lesson[],
  dayNumber: number,
): Lesson | undefined {
  return lessons.find((l) => l.dayNumber === dayNumber)
}

export function formatDisplayDate(iso: string): string {
  const d = parseLocalISODate(iso)
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
