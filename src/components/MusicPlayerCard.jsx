import { useState, useRef, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import SpotlightCard from './SpotlightCard'
import { resumeAudioCtx } from './Spectrum'
import styles from './MusicPlayerCard.module.css'
import { PLACEHOLDER } from '../data/siteData'

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function MusicPlayerCard() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressRef = useRef(null)
  const dragging = useRef(false)
  const audioRef = useRef(null)

  const updateProgress = () => {
    const audio = audioRef.current
    if (audio && audio.duration) {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    }
  }

  const handleLoaded = () => {
    const audio = audioRef.current
    if (audio) setDuration(audio.duration)
  }

  const handleEnded = () => setPlaying(false)

  const handleProgress = useCallback((e) => {
    const rect = progressRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const pct = Math.round((x / rect.width) * 100)
    setProgress(pct)
    const audio = audioRef.current
    if (audio && audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration
    }
  }, [])

  const onMouseDown = (e) => {
    dragging.current = true
    handleProgress(e)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
  const onMouseMove = (e) => dragging.current && handleProgress(e)
  const onMouseUp = () => {
    dragging.current = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      resumeAudioCtx()
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  return (
    <SpotlightCard
      className={styles.card}
      spotlightColor="rgba(99, 102, 241, 0.15)"
    >
      <audio
        ref={audioRef}
        src="/陶喆 - 勿忘我.mp3"
        onTimeUpdate={updateProgress}
        onLoadedMetadata={handleLoaded}
        onEnded={handleEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className={styles.coverRow}>
        <div className={`${styles.cover} ${playing ? styles.spinning : ''}`}>
          <img src={PLACEHOLDER.albumCover} alt="cover" />
        </div>
        <div className={styles.songInfo}>
          <h3 className={styles.songTitle}>勿忘我</h3>
          <p className={styles.artist}>陶喆</p>
        </div>
      </div>

      <div className={styles.progressRow}>
        <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
        <div ref={progressRef} className={styles.progressBar} onMouseDown={onMouseDown}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          <div className={styles.progressThumb} style={{ left: `${progress}%` }} />
        </div>
        <span className={styles.timeLabel}>{formatTime(duration)}</span>
      </div>

      <div className={styles.controls}>
        <button className={styles.ctrlBtn}><SkipBack size={18} /></button>
        <button className={styles.playBtn} onClick={togglePlay}>
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className={styles.ctrlBtn}><SkipForward size={18} /></button>
      </div>
    </SpotlightCard>
  )
}

export default MusicPlayerCard
