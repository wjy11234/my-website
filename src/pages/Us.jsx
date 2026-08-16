import { useState, useMemo, useRef } from 'react'
import { Calendar, Eye, Heart } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import DriftWall from '../components/DriftWall'
import styles from './Us.module.css'

const items = [
  {
    image: 'https://picsum.photos/id/1015/600/400',
    title: 'Mountain Lake',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1025/600/400',
    title: 'Autumn Trail',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1039/600/400',
    title: 'Desert Dunes',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1043/600/400',
    title: 'Forest Path',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1044/600/400',
    title: 'Misty Valley',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1050/600/400',
    title: 'City Lights',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1062/600/400',
    title: 'Ocean View',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1069/600/400',
    title: 'Canyon River',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1074/600/400',
    title: 'Snow Peak',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1080/600/400',
    title: 'Green Hills',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/1084/600/400',
    title: 'Waterfall',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/106/600/400',
    title: 'Flower Field',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/110/600/400',
    title: 'Lavender',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/133/600/400',
    title: 'Coastline',
    href: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/id/164/600/400',
    title: 'Sunset Bay',
    href: 'https://google.com/'
  }
]

const timelinePosts = [
  {
    date: '2026.6.6 21:13',
    cover: 'https://picsum.photos/id/1015/800/500',
    title: '记一次让人崩溃的部署踩坑：Nginx 缓存引发的血案',
    excerpt: '记一次让人崩溃的部署踩坑',
    category: '技术',
    views: 708,
    likes: 1
  },
  {
    date: '2026.6.2 17:22',
    cover: 'https://picsum.photos/id/1025/800/500',
    title: '博客重构笔记：用 Next.js + FastAPI 和 Vue 3 搭一个后分',
    excerpt: '用 Next.js + FastAPI 和 Vue 3 搭建一个后分...',
    category: '闲聊',
    views: 340,
    likes: 4
  },
  {
    date: '2026.5.4 19:35',
    cover: 'https://picsum.photos/id/1039/800/500',
    title: '大家好！',
    excerpt: '',
    category: '闲聊',
    views: 792,
    likes: 2
  },
  {
    date: '2026.5.3 21:27',
    cover: 'https://picsum.photos/id/1043/800/500',
    title: '能看到吗',
    excerpt: '',
    category: '闲聊',
    views: 232,
    likes: 1
  },
  {
    date: '2026.5.3 21:26',
    cover: 'https://picsum.photos/id/1044/800/500',
    title: '测试测试',
    excerpt: '',
    category: '闲聊',
    views: 164,
    likes: 1
  },
  {
    date: '2026.6.20 20:39',
    cover: 'https://picsum.photos/id/1050/800/500',
    title: '【Kova笔记】轻量，美观，AI辅助管理你的笔记',
    excerpt: '核心功能：极简轻量 — 安装包5MB左右，启动快、内存低，专注记录本身。',
    category: '技术',
    views: 837,
    likes: 3
  },
  {
    date: '2026.5.26 13:32',
    cover: 'https://picsum.photos/id/1062/800/500',
    title: '震惊，AI 直接把我整个项目画成了知识图谱',
    excerpt: '一个 Claude Code 插件，扫描你的代码库，自动生成交互式知识图谱仪表盘。',
    category: '技术',
    views: 840,
    likes: 0
  },
  {
    date: '2026.5.20 17:04',
    cover: 'https://picsum.photos/id/1069/800/500',
    title: 'Next.js App Router 组件边界：什么时候用服务端组件',
    excerpt: '一个真实的 Next.js 项目里哪些组件应该跑在服务端、哪些应该跑在浏览器端？',
    category: '技术',
    views: 673,
    likes: 3
  },
  {
    date: '2026.5.18 18:46',
    cover: 'https://picsum.photos/id/1074/800/500',
    title: 'Nginx 反代实战：一个博客为例的部署',
    excerpt: '配置、WebSocket 支持、静态资源缓存策略……',
    category: '技术',
    views: 412,
    likes: 2
  }
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

const AUTH_ACCOUNT = import.meta.env.VITE_AUTH_ACCOUNT || 'wujj'
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || '09876'

function Us() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('us_authed') === '1')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showWall, setShowWall] = useState(true)

  const handleLogin = (e) => {
    e.preventDefault()
    if (account === AUTH_ACCOUNT && password === AUTH_PASSWORD) {
      sessionStorage.setItem('us_authed', '1')
      setAuthed(true)
      setError('')
    } else {
      setError('账号或密码错误')
    }
  }

  if (!authed) {
    return (
      <div className={styles.page}>
        <NavHeader />
        <div className={styles.loginOverlay}>
          <form className={styles.loginCard} onSubmit={handleLogin}>
            <h2 className={styles.loginTitle}>欢迎回来</h2>
            <p className={styles.loginSubtitle}>输入账号密码访问「我们」</p>
            <input
              className={styles.loginInput}
              type="text"
              placeholder="账号"
              value={account}
              autoComplete="username"
              onChange={(e) => setAccount(e.target.value)}
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
        <div style={{ height: 'calc(100vh - 80px)', position: 'relative', marginTop: 20 }}>
          <DriftWall
            items={items}
            columns={7}
            speed={38}
            direction="up"
            dim={0.45}
            fade={0.55}
            overlayColor="#1a1a2e"
          />
        </div>
      ) : (
        <TimelineRiver />
      )}
    </div>
  )
}

export default Us
