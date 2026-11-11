import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from '../layouts/MainLayout.module.css'

const LINKS = [
  { to: '/', label: '首页', end: true },
  { to: '/shuoshuo', label: '说说' },
  { to: '/photos', label: '照片墙' },
  { to: '/us', label: '我们' },
  { to: '/message-wall', label: '留言板' },
  { to: '/tools', label: '工具' },
  { to: '/friends', label: '友链' },
  { to: '/about', label: '关于' },
]

function NavHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <NavLink to="/" className={styles.logo} onClick={() => setOpen(false)}>Wuの小站</NavLink>

        {/* 桌面端水平导航 */}
        <nav className={styles.navLinks}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>

        {/* 移动端汉堡按钮 */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* 移动端遮罩 */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* 移动端抽屉 */}
      <nav className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}>{l.label}</NavLink>
        ))}
      </nav>
    </header>
  )
}

export default NavHeader
