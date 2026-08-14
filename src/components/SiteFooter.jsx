import { useState, useEffect } from 'react'
import { Zap, Atom, Palette } from 'lucide-react'
import styles from './SiteFooter.module.css'

// ===== 可配置变量 =====
// 运行起始时间戳（修改为实际上线时间）
const START_TIMESTAMP = new Date('2026-08-04T00:00:00+08:00').getTime()

// ICP 备案号
const ICP_TEXT = '辽ICP备2026018239号-1'

// 技术栈标签（根据项目实际技术栈）
const TECH_TAGS = [
  { name: 'Vite 8', Icon: Zap },
  { name: 'React 19', Icon: Atom },
  { name: 'CSS Modules', Icon: Palette },
]

// ===== 工具函数 =====
function formatUptime(timestamp) {
  const now = Date.now()
  const diff = Math.max(0, now - timestamp)
  const totalHours = Math.floor(diff / 3600000)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  return `${days}天${hours}小时`
}

function formatClock() {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function SiteFooter() {
  const [time, setTime] = useState(formatClock)
  const [uptime, setUptime] = useState(() => formatUptime(START_TIMESTAMP))

  useEffect(() => {
    // 每秒更新时钟
    const clockTimer = setInterval(() => setTime(formatClock()), 1000)
    // 每分钟更新运行时长
    const uptimeTimer = setInterval(() => setUptime(formatUptime(START_TIMESTAMP)), 60000)

    return () => {
      clearInterval(clockTimer)
      clearInterval(uptimeTimer)
    }
  }, [])

  return (
    <footer className={styles.footer}>
      {/* 底部装饰图 */}
      <div className={styles.bottomImage}>
        <img src="/animals.webp" alt="animals" className={styles.animalsImg} />
      </div>

      <div className={styles.inner}>
        {/* 1. 数字时钟 */}
        <div className={styles.clock}>{time}</div>

        {/* 2. 运行时长 */}
        <div className={styles.uptime}>
          <span className={styles.dot} />
          <span className={styles.uptimeText}>系统已稳定运行: {uptime}</span>
        </div>

        {/* 3. 技术栈标签 */}
        <div className={styles.tags}>
          {TECH_TAGS.map((t) => (
            <span key={t.name} className={styles.tag}>
              <t.Icon size={14} className={styles.tagIcon} />
              {t.name}
            </span>
          ))}
        </div>

        {/* 4. ICP备案 */}
        <a
          className={styles.icp}
          href="https://beian.miit.gov.cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ICP_TEXT}
        </a>
      </div>
    </footer>
  )
}

export default SiteFooter
