import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Crossword as CrosswordData, CrosswordEntry } from '../types'
import { IconGrid } from './Icons'

interface CrosswordProps {
  puzzle: CrosswordData
  lessonId: string
  stepNumber?: number
}

type CellMap = Map<string, { letter: string; numbers: number[] }>

function cellKey(row: number, col: number) {
  return `${row},${col}`
}

function buildCellMap(puzzle: CrosswordData): CellMap {
  const map: CellMap = new Map()
  for (const entry of puzzle.entries) {
    const dr = entry.direction === 'across' ? 0 : 1
    const dc = entry.direction === 'across' ? 1 : 0
    for (let i = 0; i < entry.answer.length; i++) {
      const r = entry.row + dr * i
      const c = entry.col + dc * i
      const key = cellKey(r, c)
      const existing = map.get(key)
      if (existing) {
        if (i === 0 && !existing.numbers.includes(entry.number)) {
          existing.numbers.push(entry.number)
          existing.numbers.sort((a, b) => a - b)
        }
      } else {
        map.set(key, {
          letter: entry.answer[i],
          numbers: i === 0 ? [entry.number] : [],
        })
      }
    }
  }
  return map
}

function entryCells(entry: CrosswordEntry): { row: number; col: number }[] {
  const dr = entry.direction === 'across' ? 0 : 1
  const dc = entry.direction === 'across' ? 1 : 0
  return entry.answer.split('').map((_, i) => ({
    row: entry.row + dr * i,
    col: entry.col + dc * i,
  }))
}

function findEntriesAt(
  entries: CrosswordEntry[],
  row: number,
  col: number,
): CrosswordEntry[] {
  return entries.filter((entry) =>
    entryCells(entry).some((cell) => cell.row === row && cell.col === col),
  )
}

const KB_ROWS: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

export function Crossword({ puzzle, lessonId, stepNumber = 5 }: CrosswordProps) {
  const cellMap = useMemo(() => buildCellMap(puzzle), [puzzle])
  const [guesses, setGuesses] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [status, setStatus] = useState<'idle' | 'partial' | 'complete'>('idle')
  const [solvedKeys, setSolvedKeys] = useState<Set<string>>(() => new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  const across = useMemo(
    () => puzzle.entries.filter((e) => e.direction === 'across'),
    [puzzle.entries],
  )
  const down = useMemo(
    () => puzzle.entries.filter((e) => e.direction === 'down'),
    [puzzle.entries],
  )

  const activeEntry = useMemo(() => {
    if (!activeEntryId) return null
    return puzzle.entries.find((e) => `${e.direction}-${e.number}` === activeEntryId) ?? null
  }, [activeEntryId, puzzle.entries])

  const activeCellKeys = useMemo(() => {
    if (!activeEntry) return new Set<string>()
    return new Set(entryCells(activeEntry).map((c) => cellKey(c.row, c.col)))
  }, [activeEntry])

  const selectCell = useCallback(
    (row: number, col: number, preferDirection?: 'across' | 'down') => {
      const at = findEntriesAt(puzzle.entries, row, col)
      if (!at.length) return
      setSelected({ row, col })
      let next = at[0]
      if (preferDirection) {
        next = at.find((e) => e.direction === preferDirection) ?? next
      } else if (activeEntry) {
        const same = at.find(
          (e) => e.direction === activeEntry.direction && e.number === activeEntry.number,
        )
        if (same) {
          // Tap same cell again to toggle direction when both exist
          if (selected?.row === row && selected?.col === col && at.length > 1) {
            next = at.find((e) => e !== same) ?? same
          } else {
            next = same
          }
        } else {
          next = at[0]
        }
      }
      setActiveEntryId(`${next.direction}-${next.number}`)
      setChecked(false)
      setStatus('idle')
    },
    [puzzle.entries, activeEntry, selected],
  )

  const selectEntry = useCallback((entry: CrosswordEntry) => {
    setActiveEntryId(`${entry.direction}-${entry.number}`)
    setSelected({ row: entry.row, col: entry.col })
    setChecked(false)
    setStatus('idle')
    gridRef.current?.focus()
  }, [])

  const moveToNextEmpty = useCallback(
    (entry: CrosswordEntry, fromRow: number, fromCol: number) => {
      const cells = entryCells(entry)
      const startIdx = cells.findIndex((c) => c.row === fromRow && c.col === fromCol)
      for (let i = startIdx + 1; i < cells.length; i++) {
        const key = cellKey(cells[i].row, cells[i].col)
        if (!guesses[key]) {
          setSelected(cells[i])
          return
        }
      }
      // stay on last if filled
      if (cells.length) setSelected(cells[cells.length - 1])
    },
    [guesses],
  )

  const typeLetter = useCallback(
    (letter: string) => {
      if (!selected || !activeEntry) return
      const key = cellKey(selected.row, selected.col)
      if (!cellMap.has(key)) return
      const upper = letter.toUpperCase()
      setGuesses((prev) => ({ ...prev, [key]: upper }))
      setChecked(false)
      setStatus('idle')
      moveToNextEmpty(activeEntry, selected.row, selected.col)
    },
    [selected, activeEntry, cellMap, moveToNextEmpty],
  )

  const backspace = useCallback(() => {
    if (!selected || !activeEntry) return
    const key = cellKey(selected.row, selected.col)
    if (guesses[key]) {
      setGuesses((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      setChecked(false)
      setStatus('idle')
      return
    }
    const cells = entryCells(activeEntry)
    const idx = cells.findIndex((c) => c.row === selected.row && c.col === selected.col)
    if (idx > 0) {
      const prevCell = cells[idx - 1]
      const prevKey = cellKey(prevCell.row, prevCell.col)
      setGuesses((prev) => {
        const next = { ...prev }
        delete next[prevKey]
        return next
      })
      setSelected(prevCell)
      setChecked(false)
      setStatus('idle')
    }
  }, [selected, activeEntry, guesses])

  const checkPuzzle = useCallback(() => {
    let filled = 0
    let correct = 0
    let total = 0
    for (const [key, cell] of cellMap) {
      total++
      const g = guesses[key]
      if (g) {
        filled++
        if (g === cell.letter) correct++
      }
    }
    setChecked(true)
    if (correct === total && filled === total) setStatus('complete')
    else if (filled === 0) setStatus('idle')
    else setStatus('partial')
  }, [cellMap, guesses])

  // Permanently mark cells when a whole word is filled correctly
  useEffect(() => {
    const next = new Set<string>()
    for (const entry of puzzle.entries) {
      const cells = entryCells(entry)
      const allCorrect =
        cells.length > 0 &&
        cells.every((c) => {
          const key = cellKey(c.row, c.col)
          return Boolean(guesses[key]) && guesses[key] === cellMap.get(key)?.letter
        })
      if (allCorrect) {
        for (const c of cells) next.add(cellKey(c.row, c.col))
      }
    }
    setSolvedKeys((prev) => {
      if (prev.size === next.size && [...next].every((k) => prev.has(k))) return prev
      return next
    })

    if (cellMap.size > 0 && [...cellMap.keys()].every((k) => guesses[k] === cellMap.get(k)?.letter)) {
      setChecked(true)
      setStatus('complete')
    }
  }, [guesses, puzzle.entries, cellMap])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!selected) return
      if (e.key === 'Backspace') {
        e.preventDefault()
        backspace()
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const dir =
          e.key === 'ArrowRight' || e.key === 'ArrowLeft'
            ? 'across'
            : 'down'
        const delta =
          e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
        const at = findEntriesAt(puzzle.entries, selected.row, selected.col)
        const entry =
          at.find((en) => en.direction === dir) ??
          at.find((en) => en.direction === activeEntry?.direction) ??
          at[0]
        if (!entry) return
        const cells = entryCells(entry)
        const idx = cells.findIndex((c) => c.row === selected.row && c.col === selected.col)
        const next = cells[idx + delta]
        if (next) {
          setActiveEntryId(`${entry.direction}-${entry.number}`)
          setSelected(next)
        }
        return
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        typeLetter(e.key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, backspace, typeLetter, puzzle.entries, activeEntry])

  // Reset board and auto-select first across clue when lesson changes
  useEffect(() => {
    setGuesses({})
    setSolvedKeys(new Set())
    setChecked(false)
    setStatus('idle')
    if (across[0]) selectEntry(across[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  function isEntrySolved(entry: CrosswordEntry): boolean {
    return entryCells(entry).every((c) => {
      const key = cellKey(c.row, c.col)
      return Boolean(guesses[key]) && guesses[key] === cellMap.get(key)?.letter
    })
  }

  function cellClass(row: number, col: number): string {
    const key = cellKey(row, col)
    if (!cellMap.has(key)) return 'cw-cell cw-block'
    const classes = ['cw-cell', 'cw-letter']
    if (selected?.row === row && selected?.col === col) classes.push('cw-selected')
    else if (activeCellKeys.has(key)) classes.push('cw-in-word')
    if (solvedKeys.has(key)) {
      classes.push('cw-correct')
    } else if (checked) {
      const g = guesses[key]
      if (g) {
        classes.push(g === cellMap.get(key)!.letter ? 'cw-correct' : 'cw-wrong')
      }
    }
    return classes.join(' ')
  }

  const size = puzzle.size

  return (
    <section className="crossword card step-card" aria-labelledby={`crossword-${lessonId}`}>
      <div className="step-heading">
        <span className="step-num" aria-hidden="true">
          {stepNumber}
        </span>
        <span className="step-icon" aria-hidden="true">
          <IconGrid />
        </span>
        <h2 id={`crossword-${lessonId}`}>Crossword</h2>
      </div>

      <p className="step-hint">
        Fill the crossword. Tap a square, then type a letter. Tap the same square again to switch
        across / down.
      </p>

      {activeEntry && (
        <p className="cw-active-clue" aria-live="polite">
          <span className="cw-active-label">
            {activeEntry.number} {activeEntry.direction === 'across' ? 'Across' : 'Down'}
          </span>
          {activeEntry.clue}
        </p>
      )}

      <div
        className="cw-grid-wrap"
        ref={gridRef}
        tabIndex={0}
        role="grid"
        aria-label="Crossword grid"
      >
        <div
          className="cw-grid"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: size * size }, (_, i) => {
            const row = Math.floor(i / size)
            const col = i % size
            const key = cellKey(row, col)
            const cell = cellMap.get(key)
            if (!cell) {
              return <div key={key} className="cw-cell cw-block" aria-hidden="true" />
            }
            const num = cell.numbers[0]
            return (
              <button
                key={key}
                type="button"
                className={cellClass(row, col)}
                onClick={() => selectCell(row, col)}
                aria-label={`Row ${row + 1} column ${col + 1}${num ? `, clue ${num}` : ''}${guesses[key] ? `, letter ${guesses[key]}` : ', empty'}`}
              >
                {num ? <span className="cw-num">{num}</span> : null}
                <span className="cw-char">{guesses[key] ?? ''}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="cw-keyboard" aria-label="Letter keyboard">
        {KB_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="cw-kb-row">
            {row.map((letter) => (
              <button
                key={letter}
                type="button"
                className="cw-key"
                onClick={() => typeLetter(letter)}
                disabled={!selected}
              >
                {letter}
              </button>
            ))}
            {rowIdx === 2 ? (
              <button
                type="button"
                className="cw-key cw-key-wide"
                onClick={backspace}
                disabled={!selected}
              >
                Erase
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="puzzle-actions">
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            setGuesses({})
            setSolvedKeys(new Set())
            setChecked(false)
            setStatus('idle')
          }}
        >
          Clear
        </button>
        <button type="button" className="btn primary" onClick={checkPuzzle}>
          Check puzzle
        </button>
      </div>

      {status === 'complete' && (
        <p className="cw-status cw-status-ok" role="status">
          Well done! You finished the crossword.
        </p>
      )}
      {checked && status === 'partial' && (
        <p className="cw-status cw-status-partial" role="status">
          Some letters are right and some need another try. Keep going!
        </p>
      )}

      <div className="cw-clues">
        <div className="cw-clue-col">
          <h3 className="cw-clue-heading">Across</h3>
          <ul className="cw-clue-list">
            {across.map((entry) => {
              const id = `${entry.direction}-${entry.number}`
              const active = activeEntryId === id
              const solved = isEntrySolved(entry)
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`cw-clue-btn ${active ? 'active' : ''} ${solved ? 'solved' : ''}`}
                    onClick={() => selectEntry(entry)}
                  >
                    <span className="cw-clue-num">{entry.number}.</span>
                    <span className="cw-clue-text">{entry.clue}</span>
                    {solved ? <span className="cw-clue-check" aria-label="Solved">✓</span> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="cw-clue-col">
          <h3 className="cw-clue-heading">Down</h3>
          <ul className="cw-clue-list">
            {down.map((entry) => {
              const id = `${entry.direction}-${entry.number}`
              const active = activeEntryId === id
              const solved = isEntrySolved(entry)
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`cw-clue-btn ${active ? 'active' : ''} ${solved ? 'solved' : ''}`}
                    onClick={() => selectEntry(entry)}
                  >
                    <span className="cw-clue-num">{entry.number}.</span>
                    <span className="cw-clue-text">{entry.clue}</span>
                    {solved ? <span className="cw-clue-check" aria-label="Solved">✓</span> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
