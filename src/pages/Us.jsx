import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import InfiniteMenu from '../components/InfiniteMenu'
import styles from './Us.module.css'

const AUTH_ACCOUNT = import.meta.env.VITE_AUTH_ACCOUNT || ''
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || ''

const items = [
  {
    image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=600&fit=crop&sat=-100&auto=format',
    link: 'https://google.com/',
    title: 'Item 1',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=600&h=600&fit=crop&sat=-100&auto=format',
    link: 'https://google.com/',
    title: 'Item 2',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=600&h=600&fit=crop&sat=-100&auto=format',
    link: 'https://google.com/',
    title: 'Item 3',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=600&h=600&fit=crop&sat=-100&auto=format',
    link: 'https://google.com/',
    title: 'Item 4',
    description: 'This is pretty cool, right?'
  }
]

function Us() {
  const [authenticated, setAuthenticated] = useState(false)
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

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
    <div className={styles.page}>
      <NavHeader />
      <div style={{ height: '600px', position: 'relative', marginTop: 20 }}>
        <InfiniteMenu items={items} />
      </div>
    </div>
  )
}

export default Us
