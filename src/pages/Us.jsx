import { useState } from 'react'
import { Lock, User, KeyRound, Eye, EyeOff, ArrowRight } from 'lucide-react'
import styles from './Us.module.css'

// 可配置的帐号密码
const CREDENTIALS = {
  username: 'wujj',
  password: '09876',
}

function Us() {
  const [unlocked, setUnlocked] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  const handleUnlock = (e) => {
    e.preventDefault()
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setUnlocked(true)
      setError('')
    } else {
      setError('帐号或密码错误')
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  if (unlocked) {
    return (
      <div className={styles.content}>
        <h1>我们</h1>
        <p>我们的故事...</p>
      </div>
    )
  }

  return (
    <div className={styles.lockPage}>
      <div className={`${styles.lockCard} ${shaking ? styles.shake : ''}`}>
        <div className={styles.lockIcon}>
          <Lock size={28} />
        </div>
        <h2 className={styles.lockTitle}>需要密码</h2>
        <p className={styles.lockHint}>输入帐号和密码以解锁此页面</p>

        <form className={styles.form} onSubmit={handleUnlock}>
          <div className={styles.inputGroup}>
            <User size={18} className={styles.inputIcon} />
            <input
              type="text"
              className={styles.input}
              placeholder="帐号"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <KeyRound size={18} className={styles.inputIcon} />
            <input
              type={showPwd ? 'text' : 'password'}
              className={styles.input}
              placeholder="密码"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPwd(!showPwd)}
              tabIndex={-1}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            解锁
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Us
