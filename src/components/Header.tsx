import config from '../data/config.json'
import { IconHome } from './Icons'

interface HeaderProps {
  onHome: () => void
}

export function Header({ onHome }: HeaderProps) {
  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={onHome} aria-label="Go to home">
        <span className="brand-title">{config.title}</span>
        <span className="brand-subtitle">{config.subtitle}</span>
      </button>
      <button type="button" className="nav-home" onClick={onHome} aria-label="Home">
        <IconHome />
        <span>Home</span>
      </button>
    </header>
  )
}
