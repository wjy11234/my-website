import { NavLink } from 'react-router-dom'
import styles from '../layouts/MainLayout.module.css'

function NavHeader() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <NavLink to="/" className={styles.logo}>Wuの小站</NavLink>
        <nav className={styles.navLinks}>
          <NavLink to="/" end>首页</NavLink>
          <NavLink to="/shuoshuo">说说</NavLink>
          <NavLink to="/photos">照片墙</NavLink>
          <NavLink to="/us">我们</NavLink>
          <NavLink to="/message-wall">留言板</NavLink>
          <NavLink to="/tools">工具</NavLink>
          <NavLink to="/about">关于</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default NavHeader
