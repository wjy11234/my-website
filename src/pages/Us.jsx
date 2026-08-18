import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Calendar, Eye, Heart, LogOut } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import DriftWall from '../components/DriftWall'
import { supabase } from '../lib/supabase'
import styles from './Us.module.css'

const timelinePosts = [
  {
    date: '2026.8.18 00:00',
    cover: 'https://hdcrcbglrytgnfutytag.supabase.co/storage/v1/object/public/uswall/IMG_5973.JPG',
    title: '张悦琪，我喜欢你',
    excerpt: '',
    category: '爱你',
    views: 1,
    likes: 1
  },
  {
    date: '2026.8.18 00:01',
    cover: 'https://hdcrcbglrytgnfutytag.supabase.co/storage/v1/object/public/uswall/aa7a4ef7caf7e64ffd2a0d967c800546.jpg',
    title: '这个页面没咋做好，太着急送给你嘻嘻',
    excerpt: '',
    category: '爱你',
    views: 1,
    likes: 1
  },
]

const COL_WIDTH = 240
const TRACK_HEIGHT = 800
const RIVER_CENTER_FROM_BOTTOM = 395
const DASH_HEIGHT = 60
const DASH_GAP = 12
const CardHeight = 250

function TimelineRiver() {
  const sorted = useMemo(
    () => [...timelinePosts].sort((a, b) => new Date(a.date) - new Date(b.date)),
    []
  )

  const [lightbox, setLightbox] = useState(null)

  const scrollRef = useRef(null)
  const dragRef = useRef({ dragging: false, startX: 0, startLeft: 0 })
  const movedRef = useRef(false)

  const onMouseDown = (e) => {
    const el = scrollRef.current
    if (!el) return
    e.preventDefault()
    movedRef.current = false
    dragRef.current = { dragging: true, startX: e.clientX, startLeft: el.scrollLeft }
    el.classList.add(styles.dragging)
  }

  const onMouseMove = (e) => {
    if (!dragRef.current.dragging) return
    const el = scrollRef.current
    if (!el) return
    const dx = e.clientX - dragRef.current.startX
    if (Math.abs(dx) > 4) movedRef.current = true
    el.scrollLeft = dragRef.current.startLeft - dx
  }

  const endDrag = () => {
    if (!dragRef.current.dragging) return
    dragRef.current.dragging = false
    scrollRef.current?.classList.remove(styles.dragging)
  }

  const openLightbox = (post) => {
    if (movedRef.current) return
    setLightbox(post)
  }

  const N = sorted.length
  const totalWidth = N * COL_WIDTH + 80

  const dotBottom = (i) => {
    return RIVER_CENTER_FROM_BOTTOM + Math.sin((i / Math.max(1, N - 1)) * Math.PI * 3) * 70
  }

  const dotBottoms = useMemo(() => sorted.map((_, i) => dotBottom(i)), [N])

  const svgPath = useMemo(() => {
    if (N === 0) return ''
    if (N === 1) return `M ${COL_WIDTH / 2} ${TRACK_HEIGHT - dotBottoms[0]}`
    let d = ''
    for (let i = 0; i < N; i++) {
      const cx = i * COL_WIDTH + COL_WIDTH / 2
      const cy = TRACK_HEIGHT - dotBottoms[i]
      if (i === 0) {
        d += `M ${cx} ${cy} `
      } else {
        const px = (i - 1) * COL_WIDTH + COL_WIDTH / 2
        const py = TRACK_HEIGHT - dotBottoms[i - 1]
        const mx = (px + cx) / 2
        d += `C ${mx} ${py} ${mx} ${cy} ${cx} ${cy} `
      }
    }
    return d
  }, [N, dotBottoms])

  return (
    <div className={styles.blankPage}>
      <div className={styles.timelineHeader}>
        <div className={styles.timelineIcon}>◷</div>
        <div className={styles.timelineHeaderText}>
          <h2 className={styles.timelineTitle}>归档</h2>
          <p className={styles.timelineSubtitle}>时光河流 · 共 {sorted.length} 篇文章</p>
        </div>
      </div>

      <div
        className={styles.timelineScroll}
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div
          className={styles.timelineTrack}
          style={{ width: totalWidth, height: TRACK_HEIGHT }}
        >
          <svg
            className={styles.timelineRiverSvg}
            width={totalWidth}
            height={TRACK_HEIGHT}
            viewBox={`0 0 ${totalWidth} ${TRACK_HEIGHT}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="river-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#87C4FF" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#7AA7FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#A4D6FF" stopOpacity="0.6" />
              </linearGradient>
              <filter id="river-glow" x="-5%" y="-50%" width="110%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d={svgPath}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d={svgPath}
              fill="none"
              stroke="url(#river-line)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#river-glow)"
            />
          </svg>

          {sorted.map((post, i) => {
            const db = dotBottoms[i]
            const side = i % 2 === 0 ? 'top' : 'bottom'
            return (
              <div
                key={i}
                className={styles.timelineCol}
                style={{
                  width: COL_WIDTH,
                  left: i * COL_WIDTH,
                  height: TRACK_HEIGHT
                }}
              >
                {side === 'top' && (
                  <div
                    className={styles.timelineCard}
                    style={{ bottom: db + DASH_HEIGHT + DASH_GAP }}
                    onClick={() => openLightbox(post)}
                  >
                    <CardContent post={post} />
                  </div>
                )}

                {side === 'top' && (
                  <span
                    className={styles.timelineDash}
                    style={{ bottom: db }}
                  />
                )}

                <div
                  className={styles.timelineDot}
                  style={{ bottom: db }}
                >
                  <span className={styles.timelineDotCore} />
                </div>

                <span
                  className={styles.timelineDateLabel}
                  style={{ bottom: db + 28 }}
                >
                  {post.date}
                </span>

                {side === 'bottom' && (
                  <span
                    className={styles.timelineDash}
                    style={{ bottom: db - DASH_HEIGHT }}
                  />
                )}

                {side === 'bottom' && (
                  <div
                    className={styles.timelineCard}
                    style={{ bottom: db - DASH_HEIGHT - DASH_GAP - CardHeight }}
                    onClick={() => openLightbox(post)}
                  >
                    <CardContent post={post} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {lightbox && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightbox(null)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className={styles.lightboxImg}
              src={lightbox.cover.replace(/\/\d+\/\d+$/, '/1600/1000')}
              alt={lightbox.title}
            />
            <div className={styles.lightboxCaption}>
              <h3>{lightbox.title}</h3>
              <span>{lightbox.date}</span>
            </div>
            <button
              className={styles.lightboxClose}
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="关闭"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CardContent({ post }) {
  return (
    <>
      <div className={styles.timelineCardCoverWrap}>
        <img
          className={styles.timelineCardCover}
          src={post.cover}
          alt={post.title}
          draggable={false}
        />
        <div className={styles.timelineCardDate}>
          <Calendar size={11} />
          {post.date}
        </div>
      </div>
      <div className={styles.timelineCardBody}>
        <h3 className={styles.timelineCardTitle}>{post.title}</h3>
        <div className={styles.timelineCardMeta}>
          <span className={styles.timelineCardTag}>{post.category}</span>
          <div className={styles.timelineCardStats}>
            <span>
              <Eye size={11} />
              {post.views}
            </span>
            <span>
              <Heart size={11} />
              {post.likes}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

const SAKURA_COLORS = ['#ffb7c5', '#ffc4d6', '#ffd0dc', '#ffcbd8', '#ffd9e3']

function Sakura() {
  const petals = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const count = isMobile ? 12 : 20
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: -Math.random() * 20,
      duration: 15 + Math.random() * 12,
      size: 8 + Math.random() * 10,
      color: SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)],
    }))
  }, [])

  return (
    <div className={styles.sakuraContainer} aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={styles.sakuraPetal}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function Us() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showWall, setShowWall] = useState(true)

  const [wallItems, setWallItems] = useState([])
  const [wallLoading, setWallLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchWallPhotos = useCallback(async () => {
    if (!hasSupabase) {
      setWallItems([])
      setWallLoading(false)
      return
    }
    try {
      const { data, error } = await supabase.storage
        .from('uswall')
        .list('', { sortBy: { column: 'created_at', order: 'desc' } })

      if (error) throw error

      const files = (data || []).filter(
        (f) => f.name && (f.metadata?.mimetype === 'image/jpeg' || f.metadata?.mimetype === 'image/png')
      )
      const items = files.map((f) => {
        const { data: urlData } = supabase.storage.from('uswall').getPublicUrl(encodeURIComponent(f.name))
        return { image: urlData.publicUrl, title: '' }
      })
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[items[i], items[j]] = [items[j], items[i]]
      }
      setWallItems(items)
    } catch (err) {
      console.error('加载照片失败:', err)
      setWallItems([])
    } finally {
      setWallLoading(false)
    }
  }, [hasSupabase])

  useEffect(() => {
    if (session) fetchWallPhotos()
  }, [fetchWallPhotos, session])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('邮箱或密码错误')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (authLoading) {
    return (
      <div className={styles.page}>
        <NavHeader />
      </div>
    )
  }

  if (!session) {
    return (
      <div className={styles.page}>
        <NavHeader />
        <Sakura />
        <div className={styles.loginOverlay}>
          <form className={styles.loginCard} onSubmit={handleLogin}>
            <h2 className={styles.loginTitle}>欢迎回来</h2>
            <p className={styles.loginSubtitle}>输入邮箱密码访问「我们」</p>
            <input
              className={styles.loginInput}
              type="email"
              placeholder="邮箱"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.loginInput}
              type="password"
              placeholder="密码"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className={styles.loginError}>{error}</p>}
            <button className={styles.loginBtn} type="submit">进入</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <NavHeader />
      <Sakura />

      <button
        className={styles.logoutBtn}
        type="button"
        onClick={handleLogout}
      >
        <LogOut size={14} />
        <span>退出</span>
      </button>

      <button
        className={styles.sideSwitch}
        type="button"
        aria-label="切换内容"
        onClick={() => setShowWall(v => !v)}
      >
        <span className={styles.sideSwitchTrack}>
          <span className={`${styles.sideSwitchThumb} ${showWall ? styles.on : styles.off}`} />
        </span>
      </button>

      {showWall ? (
        <div className={styles.wallWrap}>
          {wallLoading ? (
            <div className={styles.wallEmpty}>加载中...</div>
          ) : wallItems.length === 0 ? (
            <div className={styles.wallEmpty}>暂无照片</div>
          ) : (
            <DriftWall
              items={wallItems}
              columns={7}
              speed={38}
              direction="up"
              dim={0.45}
              fade={0.55}
              overlayColor="#1a1a2e"
              onItemClick={(item) => setLightbox(item.image)}
            />
          )}
        </div>
      ) : (
        <TimelineRiver />
      )}

      {lightbox && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightbox(null)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className={styles.lightboxImg}
              src={lightbox}
              alt=""
            />
            <button
              className={styles.lightboxClose}
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="关闭"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Us
