import { Outlet, NavLink } from 'react-router-dom'
import styles from './MainLayout.module.css'

// 统一导航栏布局，包裹所有页面
function MainLayout() {
  return (
    <div>
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <NavLink to="/" className={styles.logo}>Wuの小站</NavLink>
          <nav className={styles.navLinks}>
            <NavLink to="/" end>首页</NavLink>
            <NavLink to="/shuoshuo">说说</NavLink>
            <NavLink to="/photos">照片墙</NavLink>
            <NavLink to="/us">我们</NavLink>
            <NavLink to="/tools">工具</NavLink>
            <NavLink to="/about">关于</NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}

export default MainLayout
