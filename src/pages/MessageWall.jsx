import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import { supabase } from '../lib/supabase'
import styles from './MessageWall.module.css'

// 便签背景色池 — 丰富柔色
const COLORS = [
  '#FFF9C4', '#FFE082', '#FFCC80', '#FFAB91',
  '#F48FB1', '#CE93D8', '#B39DDB', '#90CAF9',
  '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C',
  '#FFE0B2', '#D7CCC8', '#B2DFDB', '#F0F4C3',
  '#F8BBD0', '#DCEDC8', '#B3E5FC', '#FFECB3',
]

// 胶带颜色
const TAPE_COLORS = [
  'rgba(255,255,255,0.45)', 'rgba(255,235,150,0.55)',
  'rgba(255,200,200,0.45)', 'rgba(200,230,255,0.45)',
  'rgba(200,255,200,0.45)', 'rgba(230,200,255,0.45)',
  'rgba(255,220,180,0.40)', 'rgba(200,240,220,0.40)',
]

function MessageWall() {
  const [notes, setNotes] = useState([])
  const [showInput, setShowInput] = useState(false)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)

  // 拖拽状态
  const [dragging, setDragging] = useState(null) // { id, offsetX, offsetY }
  const wallRef = useRef(null)
  const notesRef = useRef(notes)
  notesRef.current = notes

  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

  // 从 Supabase 加载数据
  const fetchNotes = useCallback(async () => {
    if (!hasSupabase) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setNotes(data.map((n) => ({
        ...n,
        x: n.x ?? 24 + Math.random() * 200,
        y: n.y ?? 24 + Math.random() * 200,
      })))
    }
    setLoading(false)
  }, [hasSupabase])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  // 添加便签
  const addNote = async () => {
    const text = draft.trim()
    if (!text) return

    const tape = TAPE_COLORS[Math.floor(Math.random() * TAPE_COLORS.length)]
    const localFields = {
      tape,
      x: 24 + Math.random() * 200,
      y: 24 + Math.random() * 200,
    }

    if (hasSupabase) {
      const { data, error } = await supabase.from('messages').insert({
        content: text,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: (Math.random() - 0.5) * 6,
        x: localFields.x,
        y: localFields.y,
      }).select()
      if (error) {
        console.error('插入失败:', error)
        return
      }
      if (data) setNotes(prev => [{ ...data[0], ...localFields }, ...prev])
    } else {
      setNotes(prev => [{
        content: text,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: (Math.random() - 0.5) * 6,
        ...localFields,
        id: Date.now(),
        created_at: new Date().toISOString(),
      }, ...prev])
    }

    setDraft('')
    setShowInput(false)
  }

  // 删除便签
  const deleteNote = async (e, id) => {
    e.stopPropagation()
    if (hasSupabase) {
      await supabase.from('messages').delete().eq('id', id)
    }
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  // 键盘提交
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addNote()
    }
    if (e.key === 'Escape') {
      setShowInput(false)
      setDraft('')
    }
  }

  // ---- 拖拽逻辑 ----
  const onMouseDown = (e, id) => {
    const note = notes.find(n => n.id === id)
    if (!note) return
    e.preventDefault()
    setDragging({
      id,
      offsetX: e.clientX - (note.x || 0),
      offsetY: e.clientY - (note.y || 0),
    })
  }

  useEffect(() => {
    if (!dragging) return

    const onMove = (e) => {
      setNotes(prev => prev.map(n =>
        n.id === dragging.id
          ? { ...n, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY }
          : n
      ))
    }
    const onUp = () => {
      // 保存拖拽结束的位置到后端
      if (hasSupabase && dragging) {
        const note = notesRef.current.find(n => n.id === dragging.id)
        if (note) {
          supabase.from('messages').update({ x: note.x, y: note.y }).eq('id', dragging.id).then()
        }
      }
      setDragging(null)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  const isEmpty = notes.length === 0 && !loading

  return (
    <>
      <NavHeader />
      <div className={styles.wall} ref={wallRef}>
      {/* 网格背景 */}
      <div className={styles.bgGrid} />

      {/* 左上角标题 */}
      <div className={styles.pageTitle}>
        <h1 className={styles.title}>匿名</h1>
        <p className={styles.subtitle}>（可把开心的或不开心的都说出来）</p>
      </div>

      {/* 空状态 */}
      {isEmpty && !showInput && (
        <div className={styles.empty}>
          <p>还没有留言，点击右下角+贴上第一张便签吧 ✍️</p>
        </div>
      )}

      {/* 便签墙 */}
      <div className={styles.noteArea}>
        {notes.map((note) => (
          <div
            key={note.id}
            className={`${styles.note} ${dragging?.id === note.id ? styles.dragging : ''}`}
            style={{
              backgroundColor: note.color,
              transform: `rotate(${note.rotation}deg)`,
              left: `${note.x || 0}px`,
              top: `${note.y || 0}px`,
            }}
            onMouseDown={(e) => onMouseDown(e, note.id)}
          >
            {/* 透明胶带 */}
            <div
              className={styles.tape}
              style={{ background: note.tape || 'rgba(255,255,255,0.4)' }}
            />
            <p className={styles.noteText}>{note.content}</p>
            <button
              className={styles.deleteBtn}
              onClick={(e) => deleteNote(e, note.id)}
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* 浮动按钮 */}
      {!showInput && (
        <button className={styles.addBtn} onClick={() => setShowInput(true)}>
          <Plus size={24} />
        </button>
      )}

      {/* 输入浮层 */}
      {showInput && (
        <div className={styles.overlay} onClick={() => { setShowInput(false); setDraft('') }}>
          <div className={styles.inputCard} onClick={e => e.stopPropagation()}>
            <div className={styles.inputHeader}>
              <span>写留言</span>
              <button className={styles.closeBtn} onClick={() => { setShowInput(false); setDraft('') }}>
                <X size={18} />
              </button>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="想说点什么..."
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              maxLength={200}
            />
            <div className={styles.inputFooter}>
              <span className={styles.charCount}>{draft.length}/200</span>
              <button className={styles.submitBtn} onClick={addNote} disabled={!draft.trim()}>
                贴上
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default MessageWall
