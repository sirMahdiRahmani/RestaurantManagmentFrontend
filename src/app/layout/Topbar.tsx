import { Icon } from '../../shared/ui'
import styles from './Topbar.module.css'

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.search}>
        <Icon name="search" size={16} />
        Search menu, guests, factors…
      </div>
      <div className={styles.user}>
        <Icon name="user" size={20} />
        Front desk
      </div>
    </header>
  )
}
