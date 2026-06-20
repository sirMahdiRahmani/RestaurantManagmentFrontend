import styles from './Avatar.module.css'

export interface AvatarProps {
  name: string
  size?: number
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  const first = parts[0]!.charAt(0)
  const last = parts[parts.length - 1]!.charAt(0)
  return (first + last).toUpperCase()
}

export function Avatar({ name, size = 36 }: AvatarProps) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials(name)}
    </span>
  )
}
