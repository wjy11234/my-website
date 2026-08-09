import { useState, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import styles from './Us.module.css'

const AUTH_ACCOUNT = 'wujj'
const AUTH_PASSWORD = '09876'

// 花瓣数据
const PETALS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 15,
  duration: 8 + Math.random() * 10,
  size: 12 + Math.random() * 14,
  opacity: 0.3 + Math.random() * 0.4,
  rotate: Math.random() * 360,
}))

// 信封数据 — 后续在此新增即可
const ENVELOPES = [
  {
    id: 1,
    coverImage: '/letter.png',
    letterImage: '/track-26128096.jpg',
    title: '致 最特别的你',
    content: [
      '该怎么形容你呢？',
      '像清晨六点半的咖啡香气，\n像键盘敲击间隙的温柔思绪，\n像代码编译通过时的那一声叮。',
      '每次 git commit 的时候，\n都想把心情也一起提交。\n每行 Console.log 里，\n藏的都是想对你说的话。',
    ],
    signature: '你好，我的 main 分支。',
    author: '— Your Dev',
  },
  {
    id: 2,
    coverImage: '/wallheaven-6.png',
    letterImage: '/wallheaven-6.png',
    title: '致 第二封信',
    content: [
      '这是第二封信的内容。',
      '你可以在这里写任何你想说的话。',
    ],
    signature: '期待你的回信。',
    author: '— Yours',
  },
  {
    id: 3,
    coverImage: '/wallheaven-6.png',
    letterImage: '/wallheaven-6.png',
    title: '致 第三封信',
    content: [
      '这是第三封信的内容。',
      '回忆总是温暖的。',
    ],
    signature: '时光不老。',
    author: '— Forever',
  },
  {
    id: 4,
    coverImage: '/wallheaven-6.png',
    letterImage: '/wallheaven-6.png',
    title: '致 第四封信',
    content: [
      '这是第四封信的内容。',
      '每一个瞬间都值得记录。',
    ],
    signature: '岁月静好。',
    author: '— Peace',
  },
  {
    id: 5,
    coverImage: '/wallheaven-6.png',
    letterImage: '/wallheaven-6.png',
    title: '致 第五封信',
    content: [
      '这是第五封信的内容。',
      '未来还有很多故事要一起写。',
    ],
    signature: '未完待续。',
    author: '— To be continued',
  },
  {
    id: 6,
    coverImage: '/wallheaven-6.png',
    letterImage: '/wallheaven-6.png',
    title: '致 第六封信',
    content: [
      '这是第六封信的内容。',
      '谢谢你一直在我身边。',
    ],
    signature: '感恩遇见。',
    author: '— Grateful',
  },
]

// 点击涟漪
function LoveRipple({ x, y, id }) {
  return (
    <span
      className={styles.loveRipple}
      style={{ left: x, top: y }}
      key={id}
    >
      我喜欢你
    </span>
  )
}

function Us() {
  const [authenticated, setAuthenticated] = useState(false)
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [ripples, setRipples] = useState([])

  const selectedEnvelope = ENVELOPES.find((e) => e.id === selectedId)

  const handleOpen = (id) => {
    setSelectedId(id)
  }

  const handleBack = () => {
    setSelectedId(null)
  }

  const handleClick = useCallback((e) => {
    const id = Date.now() + Math.random()
    setRipples((prev) => [...prev, { x: e.clientX, y: e.clientY, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 2000)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (account === AUTH_ACCOUNT && password === AUTH_PASSWORD) {
      setAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('账号或密码错误')
    }
  }

  const handleLoginKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin(e)
  }

  // 未登录，显示登录页面
  if (!authenticated) {
    return (
      <div className={styles.page}>
        <NavHeader />
        <div className={styles.loginOverlay}>
          <form className={styles.loginCard} onSubmit={handleLogin}>
            <h2 className={styles.loginTitle}>请输入密码</h2>
            <p className={styles.loginSubtitle}>此页面需要密码才能访问</p>
            <input
              className={styles.loginInput}
              type="text"
              placeholder="账号"
              value={account}
              onChange={e => setAccount(e.target.value)}
              onKeyDown={handleLoginKeyDown}
              autoFocus
            />
            <input
              className={styles.loginInput}
              type="password"
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleLoginKeyDown}
            />
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button className={styles.loginBtn} type="submit">进入</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page} onClick={handleClick}>
      <NavHeader />

      {/* 花瓣粒子 */}
      <div className={styles.petals}>
        {PETALS.map((p) => (
          <div
            key={p.id}
            className={styles.petal}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* 点击涟漪 */}
      {ripples.map((r) => (
        <LoveRipple key={r.id} x={r.x} y={r.y} id={r.id} />
      ))}

      {/* 信封列表 */}
      {!selectedEnvelope && (
        <div className={styles.envelopeGridWrap}>
          <p className={styles.gridHint}>
            💌 戳一下信封，解锁一只野生的开发者
          </p>
          <div className={styles.envelopeGrid}>
            {ENVELOPES.map((env) => (
              <div
                key={env.id}
                className={styles.envelopeCard}
                onClick={() => handleOpen(env.id)}
              >
                <img
                  src={env.coverImage}
                  alt={`信封 ${env.id}`}
                  className={styles.envelopeCover}
                />
                <div className={styles.envelopeOverlay}>
                  <span className={styles.envelopeStampIcon}>💌</span>
                  <span className={styles.envelopeLabel}>拆开看看</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 信件内容 */}
      {selectedEnvelope && (
        <div className={styles.letterWrap}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ArrowLeft size={18} />
            返回信封
          </button>
          <div className={styles.letterCard}>
            <div className={styles.letterImage}>
              <img src={selectedEnvelope.letterImage} alt="照片" />
            </div>
            <div className={styles.letterText}>
              <h2 className={styles.letterTitle}>{selectedEnvelope.title}</h2>
              {selectedEnvelope.content.map((p, i) => (
                <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>
              ))}
              <p className={styles.signature}>
                {selectedEnvelope.signature}<br />
                <span>{selectedEnvelope.author}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Us
