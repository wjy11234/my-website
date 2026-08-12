import { useEffect, useState, useRef } from 'react'
import { Music } from 'lucide-react'
import Spectrum from './Spectrum'
import styles from './BannerBar.module.css'
import { lyrics, lyricsBeggingYou } from '../data/lyrics'

function BannerBar() {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [currentLyrics, setCurrentLyrics] = useState(lyrics)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = document.querySelector('audio')
    if (!audio) return
    audioRef.current = audio

    const updateLyrics = () => {
      const idx = parseInt(audio.dataset.lyricsIndex || '0', 10)
      const allLyrics = [lyrics, lyricsBeggingYou]
      setCurrentLyrics(allLyrics[idx] || lyrics)
    }

    updateLyrics()

    const update = () => {
      const t = audio.currentTime
      const lyr = currentLyrics
      for (let i = lyr.length - 1; i >= 0; i--) {
        if (t >= lyr[i].time) {
          setCurrentIndex(i)
          return
        }
      }
      setCurrentIndex(-1)
    }

    const onLoaded = () => {
      updateLyrics()
      update()
    }

    // 监听歌曲切换
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('seeked', update)

    update()

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('seeked', update)
    }
  }, [])

  // 当 currentLyrics 变化时需要重新绑定 update
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const update = () => {
      const t = audio.currentTime
      for (let i = currentLyrics.length - 1; i >= 0; i--) {
        if (t >= currentLyrics[i].time) {
          setCurrentIndex(i)
          return
        }
      }
      setCurrentIndex(-1)
    }

    audio.addEventListener('timeupdate', update)
    audio.addEventListener('seeked', update)
    update()

    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('seeked', update)
    }
  }, [currentLyrics])

  const currentText = currentIndex >= 0 ? currentLyrics[currentIndex].text : '♪'

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
