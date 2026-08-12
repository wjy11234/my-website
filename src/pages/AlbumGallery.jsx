import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import { albums as fallbackAlbums } from '../data/albums'
import { supabase } from '../lib/supabase'
import styles from './AlbumGallery.module.css'

function AlbumGallery() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!hasSupabase) {
        const fallback = fallbackAlbums.find((a) => a.id === Number(albumId))
        setAlbum(fallback || null)
        setPhotos(fallback ? (fallback.photos || [fallback.cover]).map((url) => ({ id: null, url })) : [])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single()

      if (error || !data) {
        console.error('加载相册失败:', error)
        const fallback = fallbackAlbums.find((a) => a.id === Number(albumId))
        setAlbum(fallback || null)
        setPhotos(fallback ? (fallback.photos || [fallback.cover]).map((url) => ({ id: null, url })) : [])
        setLoading(false)
        return
      }

      setAlbum({
        id: data.id,
        name: data.name,
        date: data.date,
        desc: data.description,
        cover: data.cover,
      })

      const { data: photoRows, error: photoError } = await supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('sort_order', { ascending: true })

      if (photoError) {
        console.error('加载照片失败:', photoError)
        setPhotos([{ id: null, url: data.cover }])
      } else if (photoRows && photoRows.length > 0) {
        setPhotos(photoRows.map((p) => ({ id: p.id, url: p.url })))
      } else {
        setPhotos([{ id: null, url: data.cover }])
      }
      setLoading(false)
    }

    fetchAlbum()
  }, [albumId, hasSupabase])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

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

  const deletePhoto = async (e, photo) => {
    e.stopPropagation()
    if (!photo.id) return
    if (!window.confirm('确定删除这张图片吗？')) return

    const { error } = await supabase.from('album_photos').delete().eq('id', photo.id)
    if (error) {
      console.error('删除失败:', error)
      alert('删除失败，请查看控制台')
      return
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
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
            key={photo.id ?? i}
            className={styles.photoItem}
            onClick={() => openLightbox(i)}
            style={{ '--stagger': `${i * 0.08}s` }}
          >
            <img src={photo.url} alt={`${album.name} - ${i + 1}`} loading="lazy" />
            {photo.id && (
              <button
                className={styles.deleteBtn}
                onClick={(e) => deletePhoto(e, photo)}
                title="删除图片"
              >
                <Trash2 size={16} />
              </button>
            )}
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
            src={currentPhoto.url}
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
