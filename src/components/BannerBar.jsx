import { useEffect, useState } from 'react'
import { Music } from 'lucide-react'
import Spectrum from './Spectrum'
import styles from './BannerBar.module.css'
import { lyrics } from '../data/siteData'

function BannerBar() {
  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    const audio = document.querySelector('audio')
    if (!audio || !lyrics.length) return

    const update = () => {
      const t = audio.currentTime
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (t >= lyrics[i].time) {
          setCurrentIndex(i)
          return
        }
      }
      setCurrentIndex(-1)
    }

    update() // 初始化
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('seeked', update)
    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('seeked', update)
    }
  }, [])

  const currentText = currentIndex >= 0 ? lyrics[currentIndex].text : '♪'

  return (
    <div className={styles.banner}>
      <Music size={18} className={styles.icon} />
      <div className={styles.lyricWrap}>
        <span key={currentIndex} className={styles.lyricLine}>{currentText}</span>
      </div>
      <Spectrum />
    </div>
  )
}

export default BannerBar
