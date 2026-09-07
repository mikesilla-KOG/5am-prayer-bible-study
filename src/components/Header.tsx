import config from '../data/config.json'

interface HeaderProps {
  onHome: () => void
  onAllLessons: () => void
  showNav?: boolean
}

export function Header({ onHome, onAllLessons, showNav = true }: HeaderProps) {
  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={onHome} aria-label="Go to today's study">
        <span className="brand-title">{config.title}</span>
        <span className="brand-subtitle">{config.subtitle}</span>
      </button>
      {showNav && (
        <nav className="header-nav" aria-label="Primary">
          <button type="button" className="nav-link" onClick={onHome}>
            Today
          </button>
          <button type="button" className="nav-link" onClick={onAllLessons}>
            All lessons
          </button>
        </nav>
      )}
    </header>
  )
}
