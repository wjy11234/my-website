import { useEffect, useRef } from 'react'

function Live2DWidget() {
  const canvasRef = useRef(null)
  const initDone = useRef(false)

  useEffect(() => {
    if (initDone.current) return
    initDone.current = true

    // 配置
    window.LAppDefine = {
      DEBUG_LOG: false,
      CANVAS_ID: 'live2d-canvas',
      IS_SCROLL_SCALE: true,
      VIEW_MAX_SCALE: 2,
      VIEW_MIN_SCALE: 0.8,
      VIEW_LOGICAL_LEFT: -1,
      VIEW_LOGICAL_RIGHT: 1,
      VIEW_LOGICAL_MAX_LEFT: -2,
      VIEW_LOGICAL_MAX_RIGHT: 2,
      VIEW_LOGICAL_MAX_BOTTOM: -2,
      VIEW_LOGICAL_MAX_TOP: 2,
      PRIORITY_NONE: 0,
      PRIORITY_IDLE: 1,
      PRIORITY_NORMAL: 2,
      PRIORITY_FORCE: 3,
      IS_BIND_BUTTON: false,
      BUTTON_ID: 'Change',
      IS_BAN_BUTTON: true,
      BAN_BUTTON_CLASS: 'inactive',
      NORMAL_BUTTON_CLASS: 'active',
      TEXURE_CHANGE_MODE: 'random',
      IS_START_TEXURE_CHANGE: false,
      TEXURE_BUTTON_ID: '',
      MODELS: [['live2d/model/xiaomai/xiaomai.model.json']],
      MOTION_GROUP_IDLE: 'idle',
      MOTION_GROUP_TAP_BODY: 'tap_body',
      MOTION_GROUP_FLICK_HEAD: 'flick_head',
      MOTION_GROUP_PINCH_IN: 'pinch_in',
      MOTION_GROUP_PINCH_OUT: 'pinch_out',
      MOTION_GROUP_SHAKE: 'shake',
      HIT_AREA_HEAD: 'head',
      HIT_AREA_BODY: 'body',
      SCALE: 1,
      IS_PLAY_AUDIO: false,
      AUDIO_ID: 'my_audio',
    }

    // 加载 live2d.min.js
    const script = document.createElement('script')
    script.src = '/live2d/js/live2d.min.js'
    script.onload = () => {
      if (typeof window.InitLive2D === 'function') {
        window.InitLive2D()
      }
      // 全页面鼠标追踪
      document.addEventListener('mousemove', onDocMouse)
      document.addEventListener('mouseup', onDocMouseUp)
    }
    document.body.appendChild(script)

    const onDocMouse = (e) => {
      const canvas = document.getElementById('live2d-canvas')
      if (!canvas) return
      try {
        const evt = new MouseEvent('mousemove', {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: false,
        })
        canvas.dispatchEvent(evt)
      } catch {
        // Live2D 模型未就绪，忽略
      }
    }

    const onDocMouseUp = () => {
      const canvas = document.getElementById('live2d-canvas')
      if (!canvas) return
      try {
        canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: false }))
      } catch {
        // Live2D 模型未就绪，忽略
      }
    }

    return () => {
      document.removeEventListener('mousemove', onDocMouse)
      document.removeEventListener('mouseup', onDocMouseUp)
    }
  }, [])

  return (
    <canvas
      id="live2d-canvas"
      ref={canvasRef}
      width={300}
      height={500}
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 50,
        border: 'none',
        width: 220,
        height: 370,
      }}
    />
  )
}

export default Live2DWidget
