import { useEffect, useMemo, useRef, useState } from 'react'
import NavHeader from '../components/NavHeader'
import { AlbumCoverTunnel } from '../components/leibox/album-cover-tunnel/AlbumCoverTunnel'
import { supabase } from '../lib/supabase'
import styles from './Us.module.css'

const BUCKET = 'uswall'
const LEN = 6 // 6 位验证码

// 存储桶返回的文件可能缺少 mimetype，这里用扩展名兜底
function isImageFile(file) {
  const mime = file?.metadata?.mimetype || ''
  if (mime) return mime.startsWith('image/')
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(file?.name || '')
}

// 先把图片下到浏览器缓存：隧道的渲染要等全部图片就绪，提前加载可以避免长时间黑屏
function preloadImage(item) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = item.src
  })
}

// ===== 验证码风格密码门 =====
function PasscodeGate({ onPass }) {
  const [code, setCode] = useState(Array(LEN).fill(''))
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputs = useRef([])

  const verify = async (arr) => {
    const input = arr.join('')
    setError(false)
    const { data, error } = await supabase.rpc('verify_us_password', { input })
    if (error) {
      setError(true)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setCode(Array(LEN).fill(''))
        setError(false)
        inputs.current[0]?.focus()
      }, 600)
      return
    }
    if (data) {
      onPass()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setCode(Array(LEN).fill(''))
        setError(false)
        inputs.current[0]?.focus()
      }, 600)
    }
  }

  const handleChange = (i, v) => {
    const char = v.slice(-1)
    const next = [...code]
    next[i] = char
    setCode(next)
    setError(false)
    if (char && i < LEN - 1) inputs.current[i + 1]?.focus()
    if (next.every((c) => c)) verify(next)
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').slice(0, LEN)
    const next = Array(LEN).fill('')
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setCode(next)
    setError(false)
    if (next.every((c) => c)) verify(next)
    else inputs.current[Math.min(text.length, LEN - 1)]?.focus()
  }

  return (
    <div className={styles.gateWrap}>
      <div className={`${styles.gate} ${shake ? styles.gateShake : ''}`}>
        <p className={styles.gateEyebrow}>US · PRIVATE</p>
        <h2 className={styles.gateTitle}>输入访问密码</h2>
        <p className={styles.gateSub}>这里是属于我们的回忆，请输入密码</p>

        <div className={styles.cells}>
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={c}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className={`${styles.cell} ${error ? styles.cellError : ''}`}
              autoFocus={i === 0}
              autoComplete="off"
            />
          ))}
        </div>

        {error && <p className={styles.gateError}>密码错误，请重试</p>}

        <p className={styles.gateHint}>提示：密码是 4 位数字</p>
      </div>
    </div>
  )
}

// ===== 验证通过后才渲染的内容（照片在这里才加载） =====
function UsContent() {
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  useEffect(() => {
    let cancelled = false

    async function loadPhotos() {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
      })
      if (cancelled) return

      if (error) {
        setStatus('error')
        setErrorMessage(error.message)
        return
      }

      const items = (data || []).filter(isImageFile).map((file) => ({
        src: supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl,
        alt: file.name,
      }))

      if (!items.length) {
        setStatus('empty')
        return
      }

      let done = 0
      setProgress({ done: 0, total: items.length })

      const results = await Promise.all(
        items.map(async (item) => {
          const ok = await preloadImage(item)
          done += 1
          if (!cancelled) setProgress({ done, total: items.length })
          return ok ? item : null
        })
      )
      if (cancelled) return

      const ready = results.filter(Boolean)
      if (!ready.length) {
        setStatus('error')
        setErrorMessage('图片全部加载失败，请检查网络')
        return
      }

      setPhotos(ready)
      setStatus('ready')
    }

    loadPhotos()
    return () => {
      cancelled = true
    }
  }, [])

  const tunnelOptions = useMemo(
    () => ({ images: photos, theme: 'dark', height: 640, autoTravel: true }),
    [photos]
  )

  const loadingText = progress.total
    ? `正在冲洗照片 ${progress.done} / ${progress.total}`
    : '正在从相册里取回照片…'

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>US · ALBUM TUNNEL</p>
        <h1 className={styles.title}>我们</h1>
        <p className={styles.subtitle}>把一起走过的日子，收进一条没有尽头的隧道。</p>
      </header>

      <section className={styles.stage}>
        {status === 'ready' && (
          <AlbumCoverTunnel className={styles.tunnel} options={tunnelOptions} />
        )}
        {status === 'loading' && (
          <div className={styles.notice}>
            <span className={styles.spinner} aria-hidden="true" />
            <p>{loadingText}</p>
            {progress.total > 0 && (
              <div className={styles.progressTrack} aria-hidden="true">
                <div
                  className={styles.progressBar}
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}
        {status === 'empty' && <p className={styles.noticeText}>相册里还没有照片。</p>}
        {status === 'error' && (
          <p className={styles.noticeText}>照片加载失败：{errorMessage || '请稍后再试'}</p>
        )}
      </section>

      <p className={styles.tips}>
        滚轮 / 上下拖动穿行 · 悬停吸起 · 点击飞入中央 · 方向键切换 · 空格暂停
      </p>
    </main>
  )
}

// 「我们」页面：先验证密码，通过后显示照片隧道
function Us() {
  const [passed, setPassed] = useState(
    () => sessionStorage.getItem('us_passed') === '1'
  )

  const handlePass = () => {
    sessionStorage.setItem('us_passed', '1')
    setPassed(true)
  }

  return (
    <div className={styles.wrapper}>
      <NavHeader />
      {passed ? <UsContent /> : <PasscodeGate onPass={handlePass} />}
    </div>
  )
}

export default Us
