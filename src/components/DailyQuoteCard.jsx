import { useEffect, useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import SpotlightCard from './SpotlightCard'
import styles from './DailyQuoteCard.module.css'

// 类型字母 → 中文名
const TYPE_MAP = {
  a: '动画', b: '漫画', c: '游戏', d: '文学',
  e: '原创', f: '网络', g: '其他', h: '影视',
  i: '诗词', j: '网易', k: '哲学', l: '笑话',
}

const CACHE_KEY = 'daily_quote_cache_v1'
// 缓存到当天 24:00，第二天自动刷新
function getTodayEnd() {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() > data.expireAt) return null
    return data
  } catch {
    return null
  }
}

function writeCache(quote) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...quote, expireAt: getTodayEnd() }))
  } catch {}
}

async function fetchQuote() {
  const res = await fetch('https://v1.hitokoto.cn/?c=i&c=k&c=d&encode=json')
  if (!res.ok) throw new Error(`请求失败 ${res.status}`)
  return res.json()
}

function DailyQuoteCard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quote, setQuote] = useState(() => {
    const c = readCache()
    return c ? { hitokoto: c.hitokoto, from: c.from, from_who: c.from_who, type: c.type } : null
  })
  const [spinning, setSpinning] = useState(false)

  const load = useCallback(async (force = false) => {
    if (!force) {
      const cached = readCache()
      if (cached) {
        setQuote({ hitokoto: cached.hitokoto, from: cached.from, from_who: cached.from_who, type: cached.type })
        return
      }
    }
    setLoading(true)
    setError('')
    setSpinning(true)
    try {
      const data = await fetchQuote()
      const q = {
        hitokoto: data.hitokoto || '',
        from: data.from || '',
        from_who: data.from_who || '',
        type: data.type || '',
      }
      setQuote(q)
      writeCache(q)
    } catch (e) {
      setError(e?.message || '加载失败')
    } finally {
      setLoading(false)
      setTimeout(() => setSpinning(false), 800)
    }
  }, [])

  useEffect(() => {
    load(false)
  }, [load])

  const handleClick = () => {
    if (!loading) load(true)
  }

  const typeLabel = quote?.type ? (TYPE_MAP[quote.type] || quote.type) : ''
  const fromText = [quote?.from, quote?.from_who].filter(Boolean).join(' · ')

  return (
    <SpotlightCard
      className={styles.card}
      spotlightColor="rgba(255, 255, 255, 0.1)"
    >
      <div className={styles.wrap} onClick={handleClick}>
        <div className={styles.titleRow}>
          <span className={styles.bar} />
          <h3 className={styles.title}>每日一言</h3>
          <RefreshCw
            size={15}
            className={`${styles.refreshIcon} ${spinning ? styles.spinning : ''}`}
          />
        </div>
        <div className={styles.quoteArea}>
          {error ? (
            <span className={styles.quoteError}>{error}（点击重试）</span>
          ) : loading && !quote ? (
            <span className={styles.quoteLoading}>加载中…</span>
          ) : quote ? (
            <p className={styles.quoteText}>
              <span className={styles.quoteMark}>"</span>
              {quote.hitokoto}
              <span className={styles.quoteMark}>"</span>
            </p>
          ) : (
            <span className={styles.quoteLoading}>点击加载</span>
          )}
        </div>
        <div className={styles.meta}>
          {typeLabel && <span>{typeLabel}</span>}
          {typeLabel && fromText && <span className={styles.metaSep}>·</span>}
          {fromText && <span>{fromText}</span>}
          {!typeLabel && !fromText && <span>——</span>}
        </div>
      </div>
    </SpotlightCard>
  )
}

export default DailyQuoteCard
