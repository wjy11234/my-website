import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Upload } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import { supabase } from '../lib/supabase'
import styles from './PhotoWall.module.css'

function AlbumCard({ album, index, showUpload }) {
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
        <div className={styles.albumNameRow}>
          <h3 className={styles.albumName}>{album.name}</h3>
          {showUpload && <UploadButton albumId={album.id} />}
        </div>
        <span className={styles.albumDate}>{album.date}</span>
        <p className={styles.albumDesc}>{album.desc}</p>
      </div>
    </div>
  )
}

function UploadButton({ albumId, onUploaded }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('仅支持 JPG / PNG 图片')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('图片不能超过 10MB')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('publicphotos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: publicUrl } = supabase.storage.from('publicphotos').getPublicUrl(fileName)
      const url = publicUrl.publicUrl

      // 计算下一个排序号
      const { data: photos } = await supabase
        .from('album_photos')
        .select('sort_order')
        .eq('album_id', albumId)
        .order('sort_order', { ascending: false })
        .limit(1)
      const nextOrder = (photos?.[0]?.sort_order ?? 0) + 1

      const { error: insertError } = await supabase
        .from('album_photos')
        .insert({ album_id: albumId, url, sort_order: nextOrder })

      if (insertError) throw insertError

      onUploaded?.()
    } catch (err) {
      console.error('上传失败:', err)
      alert('上传失败，请查看控制台')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <button
        className={styles.uploadBtn}
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        title="上传图片"
      >
        <Upload size={16} />
      </button>
    </>
  )
}

function PhotoWall() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!hasSupabase) {
        setAlbums([])
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('加载相册失败:', error)
        setAlbums([])
      } else {
        setAlbums((data || []).map((a) => ({
          id: a.id,
          name: a.name,
          date: a.date,
          desc: a.description,
          cover: a.cover,
        })))
      }
      setLoading(false)
    }

    fetchAlbums()
  }, [hasSupabase])

  return (
    <div className={styles.wrapper}>
      <div className={styles.bg} />
      <NavHeader />
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
        {loading ? (
          <p className={styles.subtitle}>加载中...</p>
        ) : (
          albums.map((album, i) => (
            <AlbumCard
              key={album.id}
              album={album}
              index={i}
              showUpload={album.name === '公共图片'}
            />
          ))
        )}
      </div>
    </div>
    </div>
  )
}

export default PhotoWall
