import { useRef, useEffect, useState } from 'react'

// Web Audio 单例（挂 window 上防止 HMR 重置）
if (!window.__spectrum) {
  window.__spectrum = { audioCtx: null, analyserNode: null, connectedAudios: new WeakSet() }
}
const state = window.__spectrum

function initAudio(audioEl) {
  if (!audioEl) return
  if (state.connectedAudios.has(audioEl)) return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!state.audioCtx) state.audioCtx = new AudioCtx()
    if (!state.analyserNode) {
      state.analyserNode = state.audioCtx.createAnalyser()
      state.analyserNode.fftSize = 64
    }
    const source = state.audioCtx.createMediaElementSource(audioEl)
    source.connect(state.analyserNode)
    state.analyserNode.connect(state.audioCtx.destination)
    state.connectedAudios.add(audioEl)
  } catch {}
}

export function resumeAudioCtx() {
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume()
  }
}

function Spectrum() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = document.querySelector('audio')
    if (!audio) return

    initAudio(audio)

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    // 初始状态
    setPlaying(!audio.paused)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!playing || !state.analyserNode) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const ctx = canvas.getContext('2d')
    const bufferLength = state.analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      state.analyserNode.getByteFrequencyData(dataArray)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barCount = 10
      const step = Math.floor(bufferLength / barCount)
      const barWidth = canvas.width / barCount

      for (let i = 0; i < barCount; i++) {
        const val = dataArray.slice(i * step, (i + 1) * step).reduce((a, b) => a + b, 0) / step
        const barHeight = (val / 255) * canvas.height
        const x = i * barWidth
        const y = canvas.height - barHeight

        const gradient = ctx.createLinearGradient(x, y, x, canvas.height)
        gradient.addColorStop(0, '#a78bfa')
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.15)')

        ctx.fillStyle = gradient
        ctx.fillRect(x + 7, y, barWidth - 0.5, barHeight)
      }
    }

    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [playing])

  return <canvas ref={canvasRef} width={56} height={36} style={{ borderRadius: 4, flexShrink: 0 }} />
}

export default Spectrum
