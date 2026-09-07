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
  /** Ordered tile ids forming the current word; same id may appear more than once (reuse). */
  const [selected, setSelected] = useState<number[]>([])
  const [found, setFound] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'idle' | 'ok' | 'miss'>('idle')
  const [justUnlocked, setJustUnlocked] = useState(false)

  const arranged = order.map((id) => tiles[id])
  const currentWord = selected.map((id) => tiles[id].char).join('')
  const complete = found.length === puzzle.targetWords.length
  const total = puzzle.targetWords.length

  function tapTile(id: number) {
    if (complete) return
    setFeedback('idle')
    // Always append so letters can be reused within a word (e.g. PEER, TRUTH, COOK).
    setSelected((prev) => [...prev, id])
  }

  function backspace() {
    if (complete) return
    setFeedback('idle')
    setSelected((prev) => prev.slice(0, -1))
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
  // Comfortable ring for ≤5 large tiles
  const radius = n <= 5 ? 108 : Math.min(148, 56 + n * 5.5)

  function useCount(id: number) {
    return selected.filter((s) => s === id).length
  }

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
      </div>

      <div className="puzzle-progress-block" aria-live="polite">
        <p className="puzzle-progress-text">
          Words found: {found.length} of {total}
        </p>
        <p className="puzzle-progress-legend">
          Each circle is one word to find. Filled = found.
        </p>
        <div
          className="progress-dots"
          role="list"
          aria-label={`Progress: ${found.length} of ${total} words found`}
        >
          {puzzle.targetWords.map((w, i) => {
            const isFound = found.includes(w)
            return (
              <span
                key={w}
                role="listitem"
                className={`progress-dot ${isFound ? 'filled' : 'empty'}`}
                title={isFound ? `Found: ${w}` : `Word ${i + 1} not found yet`}
                aria-label={isFound ? `Word ${i + 1} found: ${w}` : `Word ${i + 1} not found yet`}
              />
            )
          })}
        </div>
        {found.length > 0 && (
          <p className="found-words-plain">
            Found so far: {found.join(', ')}
          </p>
        )}
      </div>

      <p className="step-hint puzzle-hint">
        Tap letters to spell the words. You can use the same letter more than once.
      </p>

      <div className="found-words" aria-label="Word slots">
        {puzzle.targetWords.map((w) => {
          const isFound = found.includes(w)
          return (
            <span key={w} className={`found-chip ${isFound ? 'revealed' : 'hidden'}`}>
              {isFound ? w : '•'.repeat(Math.min(w.length, 5))}
            </span>
          )
        })}
      </div>

      <div className={`current-word ${feedback}`} aria-live="polite">
        {currentWord || <span className="placeholder">Tap letters…</span>}
      </div>

      <div
        className={`letter-circle ${n <= 5 ? 'letter-circle--few' : ''}`}
        style={{ width: radius * 2 + 88, height: radius * 2 + 88 }}
        role="group"
        aria-label="Letter circle"
      >
        {arranged.map((tile, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const count = useCount(tile.id)
          const isSelected = count > 0
          return (
            <button
              key={tile.id}
              type="button"
              className={`letter-tile ${isSelected ? 'selected' : ''} ${n <= 5 ? 'letter-tile--large' : ''}`}
              style={
                {
                  ['--tx']: `${x}px`,
                  ['--ty']: `${y}px`,
                } as CSSProperties
              }
              onClick={() => tapTile(tile.id)}
              disabled={complete}
              aria-pressed={isSelected}
              aria-label={`Letter ${tile.char}${isSelected ? `, used ${count} time${count === 1 ? '' : 's'}` : ''}`}
            >
              {tile.char}
              {isSelected && <span className="sel-badge">{count}</span>}
            </button>
          )
        })}
        <div className="circle-center" aria-hidden="true" />
      </div>

      <div className="puzzle-actions">
        <button
          type="button"
          className="btn secondary"
          onClick={backspace}
          disabled={!selected.length || complete}
        >
          Backspace
        </button>
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
