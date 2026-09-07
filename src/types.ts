export interface ReadingLink {
  label: string
  url: string
}

export interface AudioLink {
  label: string
  url: string
  downloadUrl: string
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
  lesson: string[]
  wordPuzzle: WordPuzzle
  questions: Question[]
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
