import { useEffect, useState } from 'react'
import { FileText, Folder, Tag, AlignJustify, CalendarClock, Activity } from 'lucide-react'
import SpotlightCard from './SpotlightCard'
import styles from './SiteStatsCard.module.css'
import { supabase } from '../lib/supabase'
import { articles } from '../data/articles'
import { songs } from '../data/songs'
import { lyrics, lyricsBeggingYou } from '../data/lyrics'
import { announcement } from '../data/announcement'
import { shuoshuo } from '../data/shuoshuo'

function daysBetween(a, b) {
  const ms = new Date(b).getTime() - new Date(a).getTime()
  return Math.max(0, Math.floor(ms / 86400000))
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 统计一段文本里的中文字符数
function countChinese(str) {
  if (!str) return 0
  const m = str.match(/[\u4e00-\u9fff]/g)
  return m ? m.length : 0
}

// 统计全站内容数据的中文总字数
function calcTotalWords() {
  let total = 0

  // 文章：标题 + 描述
  articles.forEach((a) => { total += countChinese(a.title) + countChinese(a.desc) })

  // 歌曲：标题 + 歌手名
  songs.forEach((s) => { total += countChinese(s.title) + countChinese(s.artist) })

  // 歌词：两首歌全部歌词文本
  const allLyrics = [...lyrics, ...lyricsBeggingYou]
  allLyrics.forEach((l) => { total += countChinese(l.text) })

  // 公告：标题 + 副标题 + 条目
  total += countChinese(announcement.title)
  total += countChinese(announcement.subtitle)
  announcement.items.forEach((i) => { total += countChinese(i) })

  // 说说：内容 + 标签
  shuoshuo.forEach((s) => { total += countChinese(s.content) + countChinese(s.tag) })

  return total
}

function SiteStatsCard() {
  const [wallWords, setWallWords] = useState(0)

  // 留言墙文字（留言 + 评论）在 Supabase，异步拉取后计入总字数
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return
    let alive = true
    async function load() {
      try {
        const [msgRes, cmtRes] = await Promise.all([
          supabase.from('messages').select('content'),
          supabase.from('message_comments').select('content'),
        ])
        if (!alive) return
        let n = 0
        const msgRows = msgRes.data || []
        msgRows.forEach((r) => { n += countChinese(r.content) })
        const cmtRows = cmtRes.data || []
        cmtRows.forEach((r) => { n += countChinese(r.content) })
        setWallWords(n)
      } catch {
        // 拉取失败保留 0，不影响本地统计
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const articleCount = articles.length
  const categoryCount = new Set(articles.map((a) => a.tag)).size
  const tagCount = categoryCount
  const totalWords = calcTotalWords() + wallWords
  const earliestDate = articles.reduce((m, a) => (a.date < m ? a.date : m), articles[0]?.date || today())
  const latestDate = articles.reduce((m, a) => (a.date > m ? a.date : m), articles[0]?.date || today())
  const runningDays = daysBetween(earliestDate, today()) + 1
  const lastActiveDays = daysBetween(latestDate, today())

  const items = [
    { icon: <FileText size={16} />, label: '文章', value: String(articleCount) },
    { icon: <Folder size={16} />, label: '分类', value: String(categoryCount) },
    { icon: <Tag size={16} />, label: '标签', value: String(tagCount) },
    { icon: <AlignJustify size={16} />, label: '总字数', value: totalWords.toLocaleString() },
    { icon: <CalendarClock size={16} />, label: '运行天数', value: `${runningDays} 天` },
    { icon: <Activity size={16} />, label: '最后活动', value: lastActiveDays === 0 ? '今天' : `${lastActiveDays} 天前` },
  ]

  return (
    <SpotlightCard className={styles.card} spotlightColor="rgba(255, 255, 255, 0.1)">
      <div className={styles.wrap}>
        <div className={styles.titleRow}>
          <span className={styles.bar} />
          <h3 className={styles.title}>站点统计</h3>
        </div>
        <div className={styles.list}>
          {items.map((it, i) => (
            <div className={styles.item} key={i}>
              <div className={styles.icon}>{it.icon}</div>
              <span className={styles.label}>{it.label}</span>
              <span className={styles.value}>{it.value}</span>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  )
}

export default SiteStatsCard
