import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, X, Trash2, MessageCircle, Send } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import { supabase } from '../lib/supabase'
import styles from './MessageWall.module.css'

const COLORS = [
  '#FFF9C4', '#FFE082', '#FFCC80', '#FFAB91',
  '#F48FB1', '#CE93D8', '#B39DDB', '#90CAF9',
  '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C',
  '#FFE0B2', '#D7CCC8', '#B2DFDB', '#F0F4C3',
  '#F8BBD0', '#DCEDC8', '#B3E5FC', '#FFECB3',
]

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
  const [dragging, setDragging] = useState(null)
  const wallRef = useRef(null)
  const notesRef = useRef(notes)
  notesRef.current = notes

  // 评论相关
  const [clickedNote, setClickedNote] = useState(null)
  const [comments, setComments] = useState({})
  const [commentDraft, setCommentDraft] = useState('')
  const dragFlag = useRef(false)
  const mouseStart = useRef({ x: 0, y: 0 })

  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

  // 加载数据
  const fetchNotes = useCallback(async () => {
    if (!hasSupabase) {
      setLoading(false)
      return
    }
    const [notesRes, commentsRes] = await Promise.all([
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('message_comments').select('*').order('created_at', { ascending: true }),
    ])

    if (notesRes.data) {
      setNotes(notesRes.data.map((n) => ({
        ...n,
        x: n.x ?? 24 + Math.random() * 200,
        y: n.y ?? 24 + Math.random() * 200,
      })))
    }

    if (commentsRes.data) {
      const map = {}
      commentsRes.data.forEach((c) => {
        if (!map[c.message_id]) map[c.message_id] = []
        map[c.message_id].push(c)
      })
      setComments(map)
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
      await supabase.from('message_comments').delete().eq('message_id', id)
    }
    setNotes(prev => prev.filter(n => n.id !== id))
    setComments(prev => { const next = { ...prev }; delete next[id]; return next })
    if (clickedNote?.id === id) setClickedNote(null)
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

  // ---- 拖拽 + 点击区分 ----
  const onMouseDown = (e, id) => {
    const note = notes.find(n => n.id === id)
    if (!note) return
    mouseStart.current = { x: e.clientX, y: e.clientY }
    dragFlag.current = false
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
      const dx = Math.abs(e.clientX - mouseStart.current.x)
      const dy = Math.abs(e.clientY - mouseStart.current.y)
      if (dx > 3 || dy > 3) dragFlag.current = true

      setNotes(prev => prev.map(n =>
        n.id === dragging.id
          ? { ...n, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY }
          : n
      ))
    }
    const onUp = () => {
      // 如果不是拖拽，视为点击
      if (!dragFlag.current && dragging) {
        const note = notesRef.current.find(n => n.id === dragging.id)
        if (note) setClickedNote(note)
      }
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
  }, [dragging, hasSupabase])

  // 添加评论
  const addComment = async () => {
    const text = commentDraft.trim()
    if (!text || !clickedNote) return

    const comment = {
      id: Date.now(),
      message_id: clickedNote.id,
      content: text,
      created_at: new Date().toISOString(),
    }

    // 先更新本地状态，确保界面立即响应
    setComments(prev => ({
      ...prev,
      [clickedNote.id]: [...(prev[clickedNote.id] || []), comment],
    }))
    setCommentDraft('')

    // 后台同步到 Supabase
    if (hasSupabase) {
      const { data, error } = await supabase.from('message_comments').insert({
        message_id: clickedNote.id,
        content: text,
      }).select()
      if (!error && data) {
        setComments(prev => {
          const list = prev[clickedNote.id] || []
          return {
            ...prev,
            [clickedNote.id]: list.map(c => c.id === comment.id ? { ...c, id: data[0].id } : c),
          }
        })
      }
    }
  }

  // 删除评论
  const deleteComment = async (commentId) => {
    if (hasSupabase) {
      await supabase.from('message_comments').delete().eq('id', commentId)
    }
    setComments(prev => ({
      ...prev,
      [clickedNote.id]: (prev[clickedNote.id] || []).filter(c => c.id !== commentId),
    }))
  }

  const onCommentKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addComment()
    }
  }

  const noteComments = clickedNote ? (comments[clickedNote.id] || []) : []
  const isEmpty = notes.length === 0 && !loading

  return (
    <>
      <NavHeader />
      <div className={styles.wall} ref={wallRef}>
      <div className={styles.bgGrid} />

      <div className={styles.pageTitle}>
        <h1 className={styles.title}>匿名</h1>
        <p className={styles.subtitle}>（把开心的和不开心的都说出来）</p>
      </div>

      {isEmpty && !showInput && (
        <div className={styles.empty}>
          <p>还没有留言，点击右下角+贴上第一张便签吧 ✍️</p>
        </div>
      )}

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
            <div
              className={styles.tape}
              style={{ background: note.tape || 'rgba(255,255,255,0.4)' }}
            />
            <p className={styles.noteText}>{note.content}</p>
            <div className={styles.noteActions}>
              <button
                className={styles.commentHintBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setClickedNote(note)
                }}
              >
                <MessageCircle size={13} />
                <span>{(comments[note.id] || []).length || ''}</span>
              </button>
              <button
                className={styles.deleteBtn}
                onClick={(e) => deleteNote(e, note.id)}
                title="删除"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

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

      {/* 评论详情浮层 */}
      {clickedNote && (
        <div className={styles.overlay} onClick={() => setClickedNote(null)}>
          <div
            className={styles.commentCard}
            onClick={e => e.stopPropagation()}
            style={{ ...(clickedNote.color ? { '--note-color': clickedNote.color } : {}) }}
          >
            {/* 头部 */}
            <div className={styles.commentHeader}>
              <span className={styles.commentHeaderLabel}>留言详情</span>
              <button className={styles.closeBtn} onClick={() => setClickedNote(null)}>
                <X size={18} />
              </button>
            </div>

            {/* 便签内容 */}
            <div className={styles.commentNotePreview}>
              <p>{clickedNote.content}</p>
            </div>

            {/* 评论列表 */}
            <div className={styles.commentList}>
              <h4 className={styles.commentListTitle}>评论 ({noteComments.length})</h4>
              {noteComments.length === 0 && (
                <p className={styles.noComment}>暂无评论，来写第一条吧</p>
              )}
              {noteComments.map((c) => (
                <div key={c.id} className={styles.commentItem}>
                  <div className={styles.commentContent}>
                    <p>{c.content}</p>
                    <span className={styles.commentTime}>
                      {new Date(c.created_at).toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <button
                    className={styles.commentDeleteBtn}
                    onClick={() => deleteComment(c.id)}
                    title="删除评论"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* 评论输入 */}
            <div className={styles.commentInputArea}>
              <input
                className={styles.commentInput}
                placeholder="写下你的评论..."
                value={commentDraft}
                onChange={e => setCommentDraft(e.target.value)}
                onKeyDown={onCommentKeyDown}
                maxLength={300}
                autoFocus
              />
              <button
                className={styles.commentSendBtn}
                onClick={addComment}
                disabled={!commentDraft.trim()}
              >
                <Send size={14} />
                发送
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
