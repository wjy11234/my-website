import { useEffect, useMemo, useState } from 'react'
import { Eye, Users, UserCheck, CalendarClock, Database, RefreshCw } from 'lucide-react'
import SpotlightCard from './SpotlightCard'
import styles from './VisitStatsCard.module.css'

// 统计周期：0 = 全部时间；改成 N 则统计最近 N 天（如 7 / 30 / 90）
const RANGE_DAYS = 0
// 本地缓存时间（ms）：避免每次刷新都打 Umami
const CACHE_TTL = 5 * 60 * 1000

function formatRangeLabel() {
  if (!RANGE_DAYS) return '全部时间'
  return `最近 ${RANGE_DAYS} 天`
}

function range() {
  const endAt = Date.now()
  const startAt = RANGE_DAYS ? endAt - RANGE_DAYS * 86400000 : 0
  return { startAt, endAt }
}

function todayShort() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 解析分享链接 → { origin, apiBase, id }
// 支持三种形式：
// 1) Cloud 完整地区链接：https://cloud.umami.is/analytics/eu/share/<id>
// 2) 自托管链接：https://你的域名/share/<id>
// 3) Cloud 短链接：https://cloud.umami.is/share/<id>（默认按 eu 处理）
function parseShareUrl(url) {
  try {
    const u = new URL(url)
    const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/')
    const id = parts[parts.length - 1]
    if (!id) return null
    const shareIdx = parts.indexOf('share')
    if (shareIdx === -1) return null
    const prefix = parts.slice(0, shareIdx)
    let apiBase = prefix.length ? '/' + prefix.join('/') : ''
    const isCloud = u.hostname === 'cloud.umami.is'
    if (isCloud && !apiBase) apiBase = '/analytics/eu'
    return { origin: u.origin, apiBase, id }
  } catch {
    return null
  }
}

async function fetchUmamiStats(shareUrl) {
  const parsed = parseShareUrl(shareUrl)
  if (!parsed) throw new Error('分享链接格式不正确')
  const { origin, apiBase, id } = parsed

  // 1. 拿 websiteId + shareToken
  const shareRes = await fetch(`${origin}${apiBase}/api/share/${id}`)
  if (!shareRes.ok) throw new Error(`share 请求失败 ${shareRes.status}`)
  const shareData = await shareRes.json()
  const websiteId = shareData.websiteId
  const token = shareData.token ?? shareData.shareToken
  if (!websiteId || !token) throw new Error('share 解析失败，缺少 websiteId/token')

  // 2. 拉统计（v3 需要同时带 share-token 和 share-context 两个头）
  const { startAt, endAt } = range()
  const qs = `startAt=${startAt}&endAt=${endAt}`
  const statsRes = await fetch(`${origin}${apiBase}/api/websites/${websiteId}/stats?${qs}`, {
    headers: {
      'x-umami-share-token': token,
      'x-umami-share-context': '1',
    },
  })
  if (!statsRes.ok) throw new Error(`stats 请求失败 ${statsRes.status}`)
  const stats = await statsRes.json()
  return {
    pageviews: Number(stats.pageviews ?? stats.result?.pageviews ?? 0),
    visits: Number(stats.visits ?? stats.result?.visits ?? 0),
    visitors: Number(stats.visitors ?? stats.result?.visitors ?? 0),
  }
}

const CACHE_KEY = 'umami_stats_cache_v1'

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() - data.t > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function writeCache(stats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), ...stats }))
  } catch {}
}

function VisitStatsCard() {
  const shareUrl = import.meta.env.VITE_UMAMI_SHARE_URL || ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(() => {
    const c = readCache()
    return c ? { pageviews: c.pageviews, visits: c.visits, visitors: c.visitors } : null
  })
  const [updatedAt, setUpdatedAt] = useState(() => {
    const c = readCache()
    return c ? new Date(c.t) : null
  })

  useEffect(() => {
    if (!shareUrl) return
    let alive = true
    async function run() {
      const cached = readCache()
      if (cached) {
        setStats({ pageviews: cached.pageviews, visits: cached.visits, visitors: cached.visitors })
        setUpdatedAt(new Date(cached.t))
        return
      }
      setLoading(true)
      setError('')
      try {
        const s = await fetchUmamiStats(shareUrl)
        if (!alive) return
        setStats(s)
        const now = new Date()
        setUpdatedAt(now)
        writeCache(s)
      } catch (e) {
        if (!alive) return
        setError(e?.message || '加载失败')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => { alive = false }
  }, [shareUrl])

  const configured = Boolean(shareUrl)

  const items = useMemo(() => [
    {
      icon: <Eye size={16} />,
      label: '浏览量',
      value: !configured
        ? '未配置'
        : loading && !stats
          ? '--'
          : stats
            ? stats.pageviews.toLocaleString()
            : '--',
    },
    {
      icon: <UserCheck size={16} />,
      label: '访问数',
      value: !configured
        ? '未配置'
        : loading && !stats
          ? '--'
          : stats
            ? stats.visits.toLocaleString()
            : '--',
    },
    {
      icon: <Users size={16} />,
      label: '访客数',
      value: !configured
        ? '未配置'
        : loading && !stats
          ? '--'
          : stats
            ? stats.visitors.toLocaleString()
            : '--',
    },
    {
      icon: <CalendarClock size={16} />,
      label: '统计周期',
      value: formatRangeLabel(),
      muted: true,
    },
    {
      icon: <Database size={16} />,
      label: '数据来源',
      value: configured ? 'Umami' : '待配置',
      muted: true,
    },
    {
      icon: <RefreshCw size={16} />,
      label: '最近更新',
      value: error
        ? error
        : !configured
          ? '配置 .env'
          : updatedAt
            ? `${String(updatedAt.getHours()).padStart(2, '0')}:${String(updatedAt.getMinutes()).padStart(2, '0')}`
            : loading
              ? '加载中…'
              : todayShort(),
      errorState: Boolean(error),
      muted: !error,
    },
  ], [configured, loading, stats, updatedAt, error])

  return (
    <SpotlightCard className={styles.card} spotlightColor="rgba(255, 255, 255, 0.1)">
      <div className={styles.wrap}>
        <div className={styles.titleRow}>
          <span className={styles.bar} />
          <h3 className={styles.title}>访问次数</h3>
          {loading && <span className={styles.subtitle}>刷新中</span>}
        </div>
        <div className={styles.list}>
          {items.map((it, i) => (
            <div className={styles.item} key={i}>
              <div className={`${styles.icon} ${it.muted ? styles.iconMuted : ''}`}>{it.icon}</div>
              <span className={styles.label}>{it.label}</span>
              <span
                className={[
                  styles.value,
                  loading && !stats ? styles.valueLoading : '',
                  it.muted ? styles.valueMuted : '',
                  it.errorState ? styles.valueError : '',
                ].join(' ').trim()}
              >
                {it.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  )
}

export default VisitStatsCard
