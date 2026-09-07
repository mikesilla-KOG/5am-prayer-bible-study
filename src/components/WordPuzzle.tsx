import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { WordPuzzle as WordPuzzleData } from '../types'
import { IconPuzzle } from './Icons'

interface WordPuzzleProps {
  puzzle: WordPuzzleData
  lessonId: string
  stepNumber?: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface LetterTile {
  id: number
  char: string
}

export function WordPuzzle({ puzzle, lessonId, stepNumber = 4 }: WordPuzzleProps) {
  const tiles = useMemo<LetterTile[]>(
    () => puzzle.letters.map((char, id) => ({ id, char })),
    [puzzle.letters],
  )

  const [order] = useState(() => shuffle(tiles.map((t) => t.id)))
  const [selected, setSelected] = useState<number[]>([])
  const [found, setFound] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'idle' | 'ok' | 'miss'>('idle')
  const [justUnlocked, setJustUnlocked] = useState(false)

  const arranged = order.map((id) => tiles[id])
  const currentWord = selected.map((id) => tiles[id].char).join('')
  const complete = found.length === puzzle.targetWords.length
  const progress = `${found.length} of ${puzzle.targetWords.length}`

  function toggleTile(id: number) {
    if (complete) return
    setFeedback('idle')
    setSelected((prev) => {
      if (prev.includes(id)) {
        const idx = prev.indexOf(id)
        return prev.slice(0, idx)
      }
      return [...prev, id]
    })
  }

  function clearSelection() {
    setSelected([])
    setFeedback('idle')
  }

  function submitWord() {
    if (!currentWord || complete) return
    const upper = currentWord.toUpperCase()
    if (puzzle.targetWords.includes(upper) && !found.includes(upper)) {
      const next = [...found, upper]
      setFound(next)
      setSelected([])
      setFeedback('ok')
      if (next.length === puzzle.targetWords.length) {
        setJustUnlocked(true)
      }
    } else if (found.includes(upper)) {
      setFeedback('miss')
      setSelected([])
    } else {
      setFeedback('miss')
      window.setTimeout(() => {
        setSelected([])
        setFeedback('idle')
      }, 450)
    }
  }

  const n = arranged.length
  const radius = Math.min(148, 56 + n * 5.5)

  return (
    <section className="word-puzzle card step-card" aria-labelledby={`puzzle-${lessonId}`}>
      <div className="step-heading">
        <span className="step-num" aria-hidden="true">
          {stepNumber}
        </span>
        <span className="step-icon" aria-hidden="true">
          <IconPuzzle />
        </span>
        <h2 id={`puzzle-${lessonId}`}>Word puzzle</h2>
        <p className="puzzle-progress" aria-live="polite">
          {progress}
        </p>
      </div>
      <p className="step-hint puzzle-hint">Tap letters to spell the words.</p>

      <div className="found-words" aria-label="Words found">
        {puzzle.targetWords.map((w) => {
          const isFound = found.includes(w)
          return (
            <span key={w} className={`found-chip ${isFound ? 'revealed' : 'hidden'}`}>
              {isFound ? w : '•'.repeat(Math.min(w.length, 8))}
            </span>
          )
        })}
      </div>

      <div className={`current-word ${feedback}`} aria-live="polite">
        {currentWord || <span className="placeholder">Tap letters…</span>}
      </div>

      <div
        className="letter-circle"
        style={{ width: radius * 2 + 72, height: radius * 2 + 72 }}
        role="group"
        aria-label="Letter circle"
      >
        {arranged.map((tile, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const isSelected = selected.includes(tile.id)
          const selIndex = selected.indexOf(tile.id)
          return (
            <button
              key={tile.id}
              type="button"
              className={`letter-tile ${isSelected ? 'selected' : ''}`}
              style={
                {
                  ['--tx']: `${x}px`,
                  ['--ty']: `${y}px`,
                } as CSSProperties
              }
              onClick={() => toggleTile(tile.id)}
              disabled={complete}
              aria-pressed={isSelected}
              aria-label={`Letter ${tile.char}${isSelected ? `, selected ${selIndex + 1}` : ''}`}
            >
              {tile.char}
              {isSelected && <span className="sel-badge">{selIndex + 1}</span>}
            </button>
          )
        })}
        <div className="circle-center" aria-hidden="true" />
      </div>

      <div className="puzzle-actions">
        <button
          type="button"
          className="btn secondary"
          onClick={clearSelection}
          disabled={!selected.length || complete}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={submitWord}
          disabled={!selected.length || complete}
        >
          Check word
        </button>
      </div>

      {complete && (
        <div className={`verse-unlock ${justUnlocked ? 'celebrate' : ''}`} role="status">
          <p className="unlock-label">Verse unlocked</p>
          <blockquote className="featured-verse">
            <p className="verse-text">&ldquo;{puzzle.featuredVerse.text}&rdquo;</p>
            <cite className="verse-ref">— {puzzle.featuredVerse.reference}</cite>
          </blockquote>
        </div>
      )}
    </section>
  )
}
