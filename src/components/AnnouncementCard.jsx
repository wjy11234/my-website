import SpotlightCard from './SpotlightCard'
import { Megaphone } from 'lucide-react'
import { announcement } from '../data/siteData'
import styles from './AnnouncementCard.module.css'

function AnnouncementCard() {
  return (
    <SpotlightCard
      className={styles.card}
      spotlightColor="rgba(139, 92, 246, 0.08)"
    >
      <div className={styles.header}>
        <Megaphone size={18} className={styles.icon} />
        <span className={styles.label}>公告</span>
      </div>

      <h3 className={styles.title}>{announcement.title}</h3>
      <p className={styles.subtitle}>{announcement.subtitle}</p>

      {announcement.items && announcement.items.length > 0 && (
        <ul className={styles.list}>
          {announcement.items.map((item, i) => (
            <li key={i} className={styles.listItem}>
              <span className={styles.dot} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </SpotlightCard>
  )
}

export default AnnouncementCard
