import { useState } from 'react'
import SpotlightCard from './SpotlightCard'
import styles from './ArticleCard.module.css'

function ArticleCard({ article }) {
  const [preview, setPreview] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const openPreview = () => {
    setZoomed(false)
    setPreview(true)
  }

  const closePreview = () => {
    setPreview(false)
    setZoomed(false)
  }

  return (
    <>
      <SpotlightCard
        className={styles.card}
        spotlightColor="rgba(255, 255, 255, 0.1)"
        onClick={openPreview}
      >
        <div className={styles.imageWrap}>
          <img src={article.image} alt={article.title} className={styles.image} />
        </div>
        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.tag}>{article.tag}</span>
            <span className={styles.date}>{article.date}</span>
          </div>
          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.desc}>{article.desc}</p>
        </div>
      </SpotlightCard>

      {preview && (
        <div className={styles.overlay} onClick={closePreview}>
          <img
            src={article.image}
            alt={article.title}
            className={`${styles.lightbox} ${zoomed ? styles.zoomed : ''}`}
            onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed) }}
          />
        </div>
      )}
    </>
  )
}

export default ArticleCard
