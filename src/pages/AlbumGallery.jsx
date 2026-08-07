import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import { albums } from '../data/siteData'
import styles from './AlbumGallery.module.css'

function AlbumGallery() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const album = albums.find((a) => a.id === Number(albumId))

  if (!album) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <p>相册不存在</p>
          <button className={styles.backBtn} onClick={() => navigate('/photos')}>
            返回画廊
          </button>
        </div>
      </div>
    )
  }

  const photos = album.photos || [album.cover]
  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const goNext = (e) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev + 1) % photos.length)
  }
  const goPrev = (e) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className={styles.page}>
      <NavHeader />
      {/* 顶部导航 */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/photos')}>
          <ArrowLeft size={20} />
          <span>返回画廊</span>
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{album.name}</h1>
          <span className={styles.date}>{album.date}</span>
        </div>
        <p className={styles.desc}>{album.desc}</p>
      </div>

      {/* 照片网格 */}
      <div className={styles.grid}>
        {photos.map((photo, i) => (
          <div
            key={i}
            className={styles.photoItem}
            onClick={() => openLightbox(i)}
            style={{ '--stagger': `${i * 0.08}s` }}
          >
            <img src={photo} alt={`${album.name} - ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      {/* 灯箱弹窗 */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            <X size={24} />
          </button>

          <button className={styles.lightboxPrev} onClick={goPrev}>
            <ChevronLeft size={32} />
          </button>

          <img
            src={currentPhoto}
            alt={`${album.name} - ${lightboxIndex + 1}`}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />

          <button className={styles.lightboxNext} onClick={goNext}>
            <ChevronRight size={32} />
          </button>

          <div className={styles.lightboxCounter}>
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  )
}

export default AlbumGallery
