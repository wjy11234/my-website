import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { albums } from '../data/siteData'
import styles from './PhotoWall.module.css'

function AlbumCard({ album, index }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    el.style.opacity = '0'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.setProperty('--stagger', `${index * 0.15}s`)
          el.classList.add(styles.visible)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div ref={cardRef} className={styles.albumCard}>
      {/* 拍立得堆叠 */}
      <div className={styles.polaroidStack} onClick={() => navigate(`/photos/${album.id}`)}>
        {/* 底层 - 偏移+旋转 */}
        <div className={`${styles.polaroid} ${styles.polaroidBack} ${styles.polaroidBack1}`}>
          <img src={album.cover} alt="" loading="lazy" />
        </div>
        {/* 中层 - 不同方向偏移 */}
        <div className={`${styles.polaroid} ${styles.polaroidBack} ${styles.polaroidBack2}`}>
          <img src={album.cover} alt="" loading="lazy" />
        </div>
        {/* 顶层 - 主照片 */}
        <div className={`${styles.polaroid} ${styles.polaroidFront}`}>
          <img src={album.cover} alt={album.name} loading="lazy" />
        </div>
      </div>

      {/* 相册信息 */}
      <div className={styles.albumInfo}>
        <h3 className={styles.albumName}>{album.name}</h3>
        <span className={styles.albumDate}>{album.date}</span>
        <p className={styles.albumDesc}>{album.desc}</p>
      </div>
    </div>
  )
}

function PhotoWall() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bg} />
      <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>画廊</h1>
          <p className={styles.subtitle}>审美，没有。</p>
        </div>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索相册名或照片描述..."
          />
        </div>
      </div>

      <div className={styles.grid}>
        {albums.map((album, i) => (
          <AlbumCard key={album.id} album={album} index={i} />
        ))}
      </div>
    </div>
    </div>
  )
}

export default PhotoWall
