import type { ActivityEvent, ActivityEventType } from '../domain/types'
import styles from './ActivityFeed.module.css'

const TYPE_ICONS: Record<ActivityEventType, string> = {
  factor_settled: '💳',
  stock_received: '📦',
  guest_registered: '👤',
  item_low_stock: '⚠️',
}

interface ActivityFeedProps {
  events: ActivityEvent[]
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return <p className={styles.empty}>No recent activity.</p>
  }

  return (
    <div className={styles.feed}>
      {events.map((event) => (
        <div key={event.id} className={styles.event}>
          <span className={styles.icon}>{TYPE_ICONS[event.type]}</span>
          <div className={styles.content}>
            <span className={styles.desc}>{event.description}</span>
            <span className={styles.time}>{new Date(event.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <span className={styles.meta}>{event.meta}</span>
        </div>
      ))}
    </div>
  )
}
