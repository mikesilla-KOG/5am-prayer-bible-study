/** Simple inline SVG icons — no external CDN. */

interface IconProps {
  className?: string
  title?: string
}

const svgProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
}

export function IconBook({ className, title }: IconProps) {
  return (
    <svg {...svgProps} className={className} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  )
}

export function IconHeadphones({ className, title }: IconProps) {
  return (
    <svg {...svgProps} className={className} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
      <path d="M21 16a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 16a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  )
}

export function IconLightbulb({ className, title }: IconProps) {
  return (
    <svg {...svgProps} className={className} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  )
}

export function IconPuzzle({ className, title }: IconProps) {
  return (
    <svg {...svgProps} className={className} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M10 4h4v2.2a1.8 1.8 0 1 0 0 3.6V12h2.2a1.8 1.8 0 1 1 3.6 0H22v4h-2.2a1.8 1.8 0 1 0-3.6 0H14v2.2a1.8 1.8 0 1 1-3.6 0V20H6v-4h2.2a1.8 1.8 0 1 0 0-3.6H6V8h4V5.8A1.8 1.8 0 1 0 10 4z" />
    </svg>
  )
}

export function IconChecklist({ className, title }: IconProps) {
  return (
    <svg {...svgProps} className={className} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M9 11l2 2 4-4" />
      <path d="M9 17l2 2 4-4" />
      <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
    </svg>
  )
}

export function IconHome({ className, title }: IconProps) {
  return (
    <svg {...svgProps} className={className} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  )
}

export function IconChevron({ className, title }: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={!title}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}
