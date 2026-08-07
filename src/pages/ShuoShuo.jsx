import { useEffect, useRef } from 'react'
import { shuoshuo } from '../data/siteData'
import NavHeader from '../components/NavHeader'
import styles from './ShuoShuo.module.css'

const TAG_COLORS = {
  '开发': '#a78bfa',
  '日常': '#38bdf8',
  '目标': '#f472b6',
  '深夜': '#818cf8',
  '学习': '#34d399',
}

function ShuoshuoCard({ item, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    // 初始隐藏，等待入场动画
    el.style.opacity = '0'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.setProperty('--delay', `${index * 0.1}s`)
          el.classList.add(styles.visible)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div ref={cardRef} className={styles.timelineItem}>
      {/* 日期标签 */}
      <div className={styles.dateCol}>
        <span className={styles.dateText}>{item.date}</span>
        <span className={styles.timeText}>{item.time}</span>
      </div>

      {/* 时间轴节点 */}
      <div className={styles.timelineNode}>
        <div className={styles.nodeDot} />
        <div className={styles.nodeLine} />
      </div>

      {/* 内容卡片 */}
      <div className={styles.card}>
        <div className={styles.cardGlow} />
        <p className={styles.cardContent}>{item.content}</p>
        <div className={styles.cardFooter}>
          <span
            className={styles.tag}
            style={{ '--tag-color': TAG_COLORS[item.tag] || '#a78bfa' }}
          >
            {item.tag}
          </span>
        </div>
      </div>
    </div>
  )
}

function ShuoShuo() {
  return (
    <div className={styles.page}>
      <NavHeader />
      <div className={styles.pageInner}>
        <div className={styles.header}>
          <h1 className={styles.title}>碎碎念</h1>
          <p className={styles.subtitle}>“经本人严谨（不）科学研究，得出以下结论。”</p>
        </div>

        <div className={styles.timeline}>
          {shuoshuo.map((item, i) => (
            <ShuoshuoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShuoShuo
