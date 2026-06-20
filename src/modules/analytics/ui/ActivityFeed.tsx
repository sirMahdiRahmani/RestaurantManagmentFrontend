import { Card, EmptyState, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../../../shared/ui'
import type { ActivityEntry } from '../application/useDashboard'
import styles from './DashboardPage.module.css'

export interface ActivityFeedProps {
  activity: ActivityEntry[]
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <Card>
      <h2 className={styles.cardTitle}>Recent activity</h2>
      {activity.length === 0 ? (
        <EmptyState title="No activity yet" />
      ) : (
        <Table aria-label="Recent activity">
          <TableHead>
            <TableRow>
              <TableHeaderCell scope="col">Time</TableHeaderCell>
              <TableHeaderCell scope="col">Event</TableHeaderCell>
              <TableHeaderCell scope="col">Table</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activity.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.time}</TableCell>
                <TableCell>{entry.event}</TableCell>
                <TableCell>{entry.meta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
