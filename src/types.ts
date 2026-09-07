export interface ReadingLink {
  label: string
  url: string
}

export interface AudioLink {
  label: string
  url: string
  downloadUrl: string
  /** esv-embed = in-browser player; audible = optional Audible app/web */
  kind?: 'esv-embed' | 'audible' | string
}

export interface Question {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export interface FeaturedVerse {
  reference: string
  text: string
}

export interface WordPuzzle {
  letters: string[]
  targetWords: string[]
  featuredVerse: FeaturedVerse
}

export interface Lesson {
  id: string
  dayNumber: number
  title: string
  scriptureReference: string
  readingLinks: ReadingLink[]
  audioLinks: AudioLink[]
  /** Short Learn bullets (5th-grade reading level; 3–8 items). */
  lesson: string[]
  wordPuzzle: WordPuzzle
  questions: Question[]
  /** Optional stick-figure focus video path under public/ (Day 1 Acts 1). */
  stickFigureVideo?: string
}

export interface AppConfig {
  title: string
  subtitle: string
  planStartDate: string
  bibleTranslation: string
  completionMessage: string
}

export type View =
  | { name: 'home' }
  | { name: 'day'; dayNumber: number }
  | { name: 'all' }
