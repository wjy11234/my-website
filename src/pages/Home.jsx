import CursorGrid from '../components/CursorGrid'
import NavHeader from '../components/NavHeader'
import ProfileCard from '../components/ProfileCard'
import MusicPlayerCard from '../components/MusicPlayerCard'
import BannerBar from '../components/BannerBar'
import SiteStatsCard from '../components/SiteStatsCard'
import VisitStatsCard from '../components/VisitStatsCard'
import DailyQuoteCard from '../components/DailyQuoteCard'
import AnnouncementCard from '../components/AnnouncementCard'
import WeatherCard from '../components/WeatherCard'
import ThemeToggle from '../components/ThemeToggle'
import FloatingButtons from '../components/FloatingButtons'
import SiteFooter from '../components/SiteFooter'
import SpiderPet from '../components/SpiderPet'
import Live2DWidget from '../components/Live2DWidget'
import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.home}>
      <NavHeader />
      <SpiderPet />
      <Live2DWidget />
      <CursorGrid
        color="#a78bfa"
        radius={160}
        cellSize={70}
        holdTime={300}
        fadeDuration={600}
        lineWidth={0.8}
        maxOpacity={0.5}
        clickPulse={true}
        pulseSpeed={500}
      />

      <div className={styles.content}>
        {/* 顶部双卡片：个人信息(3) + 音乐播放器(2) */}
        <div className={styles.topCards}>
          <ProfileCard />
          <MusicPlayerCard />
        </div>

        {/* 中间横幅 */}
        <div className={styles.bannerWrap}>
          <BannerBar />
        </div>

        {/* 文章卡片网格 */}
        <div className={styles.articleGrid}>
          <SiteStatsCard />
          <VisitStatsCard />
          <DailyQuoteCard />
        </div>

        {/* 公告 + 天气卡片 */}
        <div className={styles.bottomCards}>
          <AnnouncementCard />
          <WeatherCard />
        </div>

        {/* 主题切换 */}
        <div className={styles.themeRow}>
          <ThemeToggle />
        </div>
      </div>

      <FloatingButtons />

      {/* 页面底部通栏 */}
      <SiteFooter />
    </div>
  )
}

export default Home
