import { useState, useCallback } from 'react'
import SpotlightCard from './SpotlightCard'
import { Code2, Settings, ExternalLink, Mail, MessageCircle, Share2 } from 'lucide-react'
import styles from './ProfileCard.module.css'
import { PLACEHOLDER } from '../data/placeholder'

const WECHAT_ID = 'Wujy9277'
const EMAIL = '3034485397@qq.com'

const iconBtns = [
  { icon: Settings, label: '设置', toastOnly: true, toastLabel: '这个按钮未开发' },
  { icon: Code2, label: 'Github', href: 'https://github.com/wjy11234' },
  { icon: ExternalLink, label: '外链', copyText: 'iumlambalamadu10@gmail.com', copyLabel: '邮箱地址' },
  { icon: Mail, label: '邮箱', copyText: EMAIL, copyLabel: '邮箱号' },
  { icon: MessageCircle, label: '微信', copyText: WECHAT_ID, copyLabel: '微信号' },
  { icon: Share2, label: '分享', href: 'https://space.bilibili.com/1919230074' },
]

function ProfileCard() {
  const [toastMessage, setToastMessage] = useState(null)

  const handleCopy = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setToastMessage(`${label}已复制到剪贴板：${text}`)
    setTimeout(() => setToastMessage(null), 3500)
  }, [])

  return (
    <SpotlightCard
      className={styles.card}
      spotlightColor="rgba(139, 92, 246, 0.15)"
    >
      <div className={styles.avatarRow}>
        <img src={PLACEHOLDER.avatar} alt="avatar" className={styles.avatar} />
        <div>
          <h2 className={styles.username}>JywuSama</h2>
          <p className={styles.bio}>
            陶吉吉。
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>文章</span>
          <span className={styles.statValue} style={{ color: '#a78bfa' }}>0</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>杂谈</span>
          <span className={styles.statValue} style={{ color: '#38bdf8' }}>7</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>照片</span>
          <span className={styles.statValue} style={{ color: '#a78bfa' }}>7</span>
        </div>
      </div>

      <div className={styles.iconRow}>
        {iconBtns.map((btn, i) =>
          btn.href ? (
            <a
              key={i}
              className={styles.iconBtn}
              title={btn.label}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={btn.label}
            >
              <btn.icon size={16} />
            </a>
          ) : btn.copyText ? (
            <button
              key={i}
              className={styles.iconBtn}
              title={btn.label}
              aria-label={btn.label}
              onClick={() => handleCopy(btn.copyText, btn.copyLabel)}
            >
              <btn.icon size={16} />
            </button>
          ) : btn.toastOnly ? (
            <button
              key={i}
              className={styles.iconBtn}
              title={btn.label}
              aria-label={btn.label}
              onClick={() => {
                setToastMessage(btn.toastLabel)
                setTimeout(() => setToastMessage(null), 3500)
              }}
            >
              <btn.icon size={16} />
            </button>
          ) : (
            <button key={i} className={styles.iconBtn} title={btn.label} aria-label={btn.label}>
              <btn.icon size={16} />
            </button>
          )
        )}
      </div>

      {/* Toast 弹窗 */}
      {toastMessage && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </SpotlightCard>
  )
}

export default ProfileCard
