import { NavLink } from 'react-router-dom'
import { Icon } from '../../shared/ui'
import { navRegistry } from './navRegistry'
import styles from './Sidebar.module.css'

export function Sidebar() {
  return (
    <nav className={styles.sidebar} aria-label="Primary">
      <div className={styles.brand}>
        <Icon name="grid" />
        RestoOS
      </div>
      {navRegistry.map((entry) => (
        <NavLink
          key={entry.to}
          to={entry.to}
          className={({ isActive }) => [styles.link, isActive ? styles.active : ''].join(' ')}
          end={entry.to === '/menu'}
        >
          <Icon name={entry.icon} />
          {entry.label}
          {entry.status === 'planned' ? <span className={styles.plannedTag}>Soon</span> : null}
        </NavLink>
      ))}
    </nav>
  )
}
