import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import DriftWall from '../components/DriftWall'
import styles from './Us.module.css'

const AUTH_ACCOUNT = import.meta.env.VITE_AUTH_ACCOUNT || ''
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || ''

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
    </div>
  )
}

export default Us
