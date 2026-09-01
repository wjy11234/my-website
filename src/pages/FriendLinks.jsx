import { useEffect, useMemo, useState } from 'react'
import { Globe, Search, RefreshCw, Heart, MessageCircle, Copy, AlertTriangle } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import { supabase } from '../lib/supabase'
import { friends } from '../data/friends'
import styles from './FriendLinks.module.css'

// ===== 可配置变量 =====
// 站点信息（左侧卡片 + 申请区）
const SITE_NAME = 'Wuの小站'
const SITE_SLOGAN = 'WU AND YOU'
const SITE_AVATAR = '/zhu.jpg' // 左侧卡片头像图片链接，留空显示首字
const SITE_DESC = 'Wuのpersonal blog'
const SITE_URL = 'https://www.jywu.asia'
const SITE_AVATAR_URL = `${SITE_URL}/IMG_6566.webp`
const SITE_INTRO = 'Wuの个人小站，记录生活与技术'

// 交换要求（注意事项）
const REQUIREMENTS = [
  '全站 HTTPS 加密访问',
  '内容健康、经常更新、拥有独立域名',

]

function getDomain(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function timeAgo(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return '刚刚'
  if (s < 3600) return `${Math.floor(s / 60)} 分钟前`
  if (s < 86400) return `${Math.floor(s / 3600)} 小时前`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} 天前`
  return new Date(iso).toLocaleDateString('zh-CN')
}

const APPLY_TEMPLATE = `=== 友链申请 ===
名称：
链接：
头像：
介绍：`

// 小新语录（底部左侧卡片）
const SHIN_QUOTES = [
  '「大象～大象～你的鼻子怎么那么长」',
  '「漂亮的大姐姐！要不要一起交换友链呀」',
  '「动感超人哇哈哈哈哈哈哈哈」',
  '「小白～棉花糖！」',
]
const QUOTE = SHIN_QUOTES[Math.floor(Math.random() * SHIN_QUOTES.length)]

// 装饰贴纸图（蜡笔小新插画 · 透明背景风）
const STICKER_PEEK = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Crayon%20Shin-chan%20peeking%20from%20behind%20a%20wall%2C%20holding%20the%20edge%2C%20cute%20smirk%2C%20chibi%20anime%20style%2C%20yellow%20shirt%20and%20red%20pants%2C%20transparent%20background%2C%20clean%20lineart%2C%20no%20shadow%2C%20sticker%20style&image_size=square'
const STICKER_SHIRO = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shiro%20the%20white%20fluffy%20dog%20from%20Crayon%20Shin-chan%2C%20lying%20down%20happily%20with%20tongue%20out%2C%20cute%20chibi%20anime%20style%2C%20transparent%20background%2C%20clean%20lineart%2C%20sticker%20style&image_size=square'
const STICKER_BURIKKO = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Burikko%20the%20pink%20cat%20from%20Crayon%20Shin-chan%2C%20sticker%20style%2C%20chibi%2C%20transparent%20background%2C%20clean%20lineart&image_size=square'

// 评论提交按钮 + 快速申请 文案
const BTN_SUBMIT = '动感超人发射！'
const BTN_QUICK_APPLY = '🚀 小新，我要申请友链！'

function Avatar({ name, src, className }) {
  if (src) {
    return <img className={className} src={src} alt={name} draggable={false} />
  }
  return <span className={`${className} ${styles.avatarFallback}`}>{name.slice(0, 1)}</span>
}

// 打字机效果：逐字输出 text，返回已输入部分和是否完成
function useTypewriter(text, speed = 150, startDelay = 400) {
  const [len, setLen] = useState(0)
  useEffect(() => {
    let i = 0
    let timer
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1
        setLen(i)
        if (i >= text.length) clearInterval(timer)
      }, speed)
    }, startDelay)
    return () => { clearTimeout(start); clearInterval(timer) }
  }, [text, speed, startDelay])
  return { typed: text.slice(0, len), done: len >= text.length && text.length > 0 }
}

// ================== 评论组件 ==================
function Comments({ content, setContent }) {
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(hasSupabase)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sort, setSort] = useState('asc') // asc | desc | hot
  const [replyTo, setReplyTo] = useState(null)
  const [likedIds, setLikedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('friend_comment_likes') || '[]') } catch { return [] }
  })
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('friend_comment_profile') || '{}') } catch { return {} }
  })
  const [nickname, setNickname] = useState(profile.nickname || '')
  const [email, setEmail] = useState(profile.email || '')
  const [website, setWebsite] = useState(profile.website || '')

  useEffect(() => {
    if (!hasSupabase) return
    supabase
      .from('friend_comments')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error: e }) => {
        if (e) setError('评论加载失败，请确认已建 friend_comments 表')
        if (data) setComments(data)
        setLoading(false)
      })
  }, [hasSupabase])

  const saveProfile = (patch) => {
    const next = { nickname, email, website, ...patch }
    setProfile(next)
    try { localStorage.setItem('friend_comment_profile', JSON.stringify(next)) } catch {}
  }

  const byId = useMemo(() => {
    const m = {}
    comments.forEach((c) => { m[c.id] = c })
    return m
  }, [comments])

  const tops = useMemo(() => {
    const list = comments.filter((c) => !c.parent_id)
    if (sort === 'asc') return [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    if (sort === 'desc') return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0))
  }, [comments, sort])

  const repliesOf = useMemo(() => {
    const m = {}
    comments.filter((c) => c.parent_id).forEach((c) => {
      if (!m[c.parent_id]) m[c.parent_id] = []
      m[c.parent_id].push(c)
    })
    Object.values(m).forEach((arr) => arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)))
    return m
  }, [comments])

  const submit = async () => {
    setError('')
    const text = content.trim()
    const name = nickname.trim()
    if (!name) return setError('请填写昵称')
    if (!text) return setError('请填写评论内容')
    if (!hasSupabase) return setError('未配置 Supabase，无法提交评论')
    setSubmitting(true)
    const { data, error: e } = await supabase
      .from('friend_comments')
      .insert({
        nickname: name,
        email: email.trim() || null,
        website: website.trim() || null,
        content: text,
        parent_id: replyTo ? replyTo.parent_id || replyTo.id : null,
      })
      .select()
    setSubmitting(false)
    if (e) return setError('提交失败：' + e.message)
    if (data) setComments((prev) => [...prev, ...data])
    setContent('')
    setReplyTo(null)
    saveProfile({ nickname: name, email, website })
  }

  const like = async (c) => {
    if (likedIds.includes(c.id)) return
    const nextLiked = [...likedIds, c.id]
    setLikedIds(nextLiked)
    try { localStorage.setItem('friend_comment_likes', JSON.stringify(nextLiked)) } catch {}
    setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, likes: (x.likes || 0) + 1 } : x)))
    const { error: e } = await supabase.from('friend_comments').update({ likes: (c.likes || 0) + 1 }).eq('id', c.id)
    if (e) {
      setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, likes: c.likes || 0 } : x)))
    }
  }

  const sortBtn = (key, label) => (
    <button
      key={key}
      type="button"
      className={`${styles.sortBtn} ${sort === key ? styles.sortActive : ''}`}
      onClick={() => setSort(key)}
    >
      {label}
    </button>
  )

  const renderComment = (c, isReply) => {
    const parent = c.parent_id ? byId[c.parent_id] : null
    const liked = likedIds.includes(c.id)
    return (
      <div key={c.id} className={`${styles.cmtItem} ${isReply ? styles.cmtReply : ''}`}>
        <Avatar name={c.nickname} src="" className={styles.cmtAvatar} />
        <div className={styles.cmtBody}>
          <div className={styles.cmtHead}>
            <span className={styles.cmtName}>{c.nickname}</span>
            <span className={styles.cmtTime}>{timeAgo(c.created_at)}</span>
            <span className={styles.cmtActions}>
              <button
                type="button"
                className={`${styles.cmtLikeBtn} ${liked ? styles.liked : ''}`}
                onClick={() => like(c)}
                title={liked ? '已赞' : '点赞'}
              >
                <Heart size={13} />
                <span>{c.likes || 0}</span>
              </button>
              <button type="button" className={styles.cmtReplyBtn} onClick={() => setReplyTo(c)} title="回复">
                <MessageCircle size={13} />
              </button>
            </span>
          </div>
          <p className={styles.cmtContent}>
            {parent && <span className={styles.cmtAt}>@{parent.nickname}：</span>}
            {c.content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className={styles.commentsCard}>
      <h2 className={styles.commentsTitle}>COMMENTS</h2>

      {/* 输入表单 */}
      <div className={styles.cmtForm} id="friend-comment-box">
        <div className={styles.cmtInputs}>
          <input
            className={styles.cmtInput}
            placeholder="昵称 *"
            value={nickname}
            maxLength={30}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => saveProfile({ nickname })}
          />
          <input
            className={styles.cmtInput}
            placeholder="邮箱（不公开）"
            type="email"
            value={email}
            maxLength={50}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => saveProfile({ email })}
          />
          <input
            className={styles.cmtInput}
            placeholder="网址"
            value={website}
            maxLength={100}
            onChange={(e) => setWebsite(e.target.value)}
            onBlur={() => saveProfile({ website })}
          />
        </div>
        {replyTo && (
          <div className={styles.replyBar}>
            回复 @{replyTo.nickname}
            <button type="button" className={styles.replyCancel} onClick={() => setReplyTo(null)}>取消</button>
          </div>
        )}
        <textarea
          className={styles.cmtTextarea}
          placeholder="欢迎评论"
          value={content}
          maxLength={500}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={styles.cmtFooter}>
          <span className={styles.charCount}>{content.length} 字</span>
          <button
            className={styles.cmtSubmit}
            type="button"
            onClick={submit}
            disabled={submitting || !content.trim() || !nickname.trim()}
          >
            {BTN_SUBMIT}
          </button>
        </div>
        {error && <p className={styles.cmtError}>{error}</p>}
      </div>

      {/* 评论列表 */}
      <div className={styles.cmtListHead}>
        <span className={styles.cmtCount}>{comments.length} 评论</span>
        <span className={styles.sortGroup}>
          {sortBtn('asc', '按正序')}
          {sortBtn('desc', '按倒序')}
          {sortBtn('hot', '按热度')}
        </span>
      </div>

      {loading ? (
        <div className={styles.empty}>加载中...</div>
      ) : tops.length === 0 ? (
        <div className={styles.empty}>还没有评论，来抢沙发吧</div>
      ) : (
        <div className={styles.cmtList}>
          {tops.map((c) => (
            <div key={c.id} className={styles.cmtThread}>
              {renderComment(c, false)}
              {(repliesOf[c.id] || []).map((r) => renderComment(r, true))}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ================== 页面 ==================
function FriendLinks() {
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState(friends)
  const [spin, setSpin] = useState(false)
  // 评论内容提升到页面级：供「快速申请」预填模板
  const [content, setContent] = useState('')
  // Banner 标题打字机效果
  const { typed, done } = useTypewriter(SITE_NAME, 150)

  const quickApply = () => {
    setContent(APPLY_TEMPLATE)
    document.getElementById('friend-comment-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const copyAll = async () => {
    const text = `名称：${SITE_NAME}\n链接：${SITE_URL}\n头像：${SITE_AVATAR_URL}\n简介：${SITE_INTRO}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  }

  const shown = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return list
    return list.filter((f) =>
      [f.name, f.desc, f.domain || getDomain(f.url)].some((t) => (t || '').toLowerCase().includes(kw))
    )
  }, [keyword, list])

  const randomSort = () => {
    setSpin(true)
    setList(shuffleArr(list))
    setTimeout(() => setSpin(false), 500)
  }

  return (
    <div className={styles.wrap}>
      <NavHeader />
      <div className={styles.page}>
        {/* ===== 顶部 Banner ===== */}
        <header className={styles.banner}>
          <img className={`${styles.sticker} ${styles.stickerPeek}`} src={STICKER_PEEK} alt="小新偷看" draggable={false} />
          <img className={`${styles.sticker} ${styles.stickerBurikko}`} src={STICKER_BURIKKO} alt="猫咪贴纸" draggable={false} />
          <h1 className={styles.bannerTitle}>
            {typed}
            <span className={`${styles.caret} ${done ? styles.caretOff : ''}`} />
          </h1>
          <span className={`${styles.bannerBadge} ${done ? styles.badgeIn : styles.badgeHidden}`}>
            {SITE_SLOGAN}
          </span>
        </header>

        <div className={styles.body}>
          {/* ===== 左侧个人信息卡 ===== */}
          <aside className={styles.profileCard}>
            <Avatar name={SITE_NAME} src={SITE_AVATAR} className={styles.profileAvatar} />
            <span className={styles.profileName}>{SITE_NAME}</span>
            <span className={styles.profileDivider} />
            <span className={styles.profileDesc}>{SITE_DESC}</span>
            <span className={styles.profileQuote}>{QUOTE}</span>
          </aside>

          {/* ===== 右侧友链区 ===== */}
          <main className={styles.mainCol}>
            <section className={styles.mainCard}>
              <div className={styles.titleRow}>
                <h2 className={styles.title}>
                  FRIENDS <span className={styles.titleCn}>友情链接</span>
                </h2>
                <div className={styles.searchBox}>
                  <Search size={15} className={styles.searchIcon} />
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="搜索好友、博主名称..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaSub}>那些人，那些事</span>
                <span className={styles.metaCount}>共计 {friends.length} 位友</span>
                <button className={styles.metaRandom} type="button" onClick={randomSort}>
                  随机排序
                  <RefreshCw size={13} className={`${styles.randomIcon} ${spin ? styles.spin : ''}`} />
                </button>
              </div>

              <hr className={styles.divider} />

              {shown.length === 0 ? (
                <div className={styles.empty}>没有找到匹配的友链</div>
              ) : (
                <div className={styles.grid}>
                  {shown.map((f, i) => (
                    <a
                      key={`${f.url}-${i}`}
                      className={styles.card}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={f.url}
                    >
                      <div className={styles.cardHead}>
                        <Avatar name={f.name} src={f.avatar} className={styles.cardAvatar} />
                        <span className={styles.cardName}>{f.name}</span>
                        {f.badge && <span className={styles.cardBadge}>{f.badge}</span>}
                      </div>
                      <div className={styles.cardDomain}>
                        <Globe size={12} />
                        <span>{f.domain || getDomain(f.url)}</span>
                      </div>
                      {f.desc && <p className={styles.cardDesc}>{f.desc}</p>}
                    </a>
                  ))}
                </div>
              )}
            </section>

            {/* ===== 申请友链 ===== */}
            <section className={styles.mainCard}>
              <img className={`${styles.sticker} ${styles.stickerShiro}`} src={STICKER_SHIRO} alt="小白" draggable={false} />
              <div className={styles.applyTitleRow}>
                <span className={styles.applyBadge}>APPLICATION</span>
                <h2 className={styles.applyTitle}>交换友情链接</h2>
              </div>
              <p className={styles.applyDesc}>欢迎同人、技术、设计、AICG、自媒体等各类博客相互串链。</p>

              <div className={styles.applyBody}>
                <div className={styles.applyLeft}>
                  <div className={styles.applyWarn}>
                    <p className={styles.applyWarnTitle}>
                      <AlertTriangle size={14} />
                      交换要求
                    </p>
                    <ul className={styles.applyWarnList}>
                      {REQUIREMENTS.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <p className={styles.applyHint}>
                    添加完毕后，可以在下方评论区发送申请
                  </p>
                  <button className={styles.applyBtn} type="button" onClick={quickApply}>
                    {BTN_QUICK_APPLY}
                  </button>
                </div>

                <div className={styles.applyInfoBox}>
                  <span className={styles.applyInfoTag}>本站信息 INFO</span>
                  <div className={styles.applyInfoRows}>
                    <p><span>站点名称：</span>{SITE_NAME}</p>
                    <p><span>站点域名：</span>{SITE_URL}</p>
                    <p><span>站点头像：</span>{SITE_AVATAR_URL}</p>
                    <p><span>站点简介：</span>{SITE_INTRO}</p>
                  </div>
                  <button className={styles.copyBtn} type="button" onClick={copyAll}>
                    <Copy size={14} />
                    复制全部
                  </button>
                </div>
              </div>
            </section>

            {/* ===== 评论 ===== */}
            <Comments content={content} setContent={setContent} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default FriendLinks
