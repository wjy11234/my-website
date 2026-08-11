import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// 默认设置（与 content/constants.js 保持一致）
const DEFAULT_SETTINGS = {
  enabled: true,
  entranceMode: 'oncePerSession',
  calmMode: false,
  size: 'standard',
  position: 'right',
  sitReminder: false,
  customMessages: [],
}

const HOST_ID = 'spider-companion-extension-host'

function SpiderPet() {
  const scriptRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // 如果宿主已存在，直接显示
    const existing = document.getElementById(HOST_ID)
    if (existing) {
      existing.hidden = false
      return
    }

    // 模拟 chrome.* API
    const spiderBase = '/spider'
    window.chrome = {
      ...window.chrome,
      runtime: {
        getURL: (path) => `${spiderBase}/${path}`,
        sendMessage: (_message, callback) => {
          if (_message?.type === 'spider:claimEntrance') {
            callback({ show: true, settings: { ...DEFAULT_SETTINGS } })
          } else {
            callback({ ok: true })
          }
        },
        onMessage: { addListener() {}, removeListener() {} },
        lastError: null,
      },
      storage: {
        local: {
          get: async (keys) => {
            const saved = {}
            try {
              const raw = localStorage.getItem('spider_settings')
              if (raw) Object.assign(saved, JSON.parse(raw))
            } catch { /* ignore */ }
            const result = { ...DEFAULT_SETTINGS, ...saved }
            if (typeof keys === 'string') return { [keys]: result[keys] }
            if (Array.isArray(keys)) {
              return Object.fromEntries(keys.map((k) => [k, result[k]]))
            }
            return { ...result }
          },
          set: async (values) => {
            try {
              const raw = localStorage.getItem('spider_settings')
              const saved = raw ? JSON.parse(raw) : {}
              Object.assign(saved, values)
              localStorage.setItem('spider_settings', JSON.stringify(saved))
            } catch { /* ignore */ }
          },
        },
        onChanged: { addListener() {}, removeListener() {} },
      },
    }

    // 动态加载蜘蛛脚本
    const script = document.createElement('script')
    script.type = 'module'
    script.src = `${spiderBase}/content.js`
    scriptRef.current = script
    document.head.appendChild(script)

    return () => {
      // 仅隐藏，不删除宿主，以便路由切回时恢复
      const host = document.getElementById(HOST_ID)
      if (host) host.hidden = true
      if (scriptRef.current) {
        scriptRef.current.remove()
        scriptRef.current = null
      }
    }
  }, [])

  // 路由变化时：检查宿主是否存在，存在则恢复显示
  useEffect(() => {
    const host = document.getElementById(HOST_ID)
    if (host) host.hidden = false
  }, [location.pathname])

  return null
}

export default SpiderPet
