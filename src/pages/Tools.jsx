import styles from './Tools.module.css'
import NavHeader from '../components/NavHeader'
import TargetCursor from '../components/TargetCursor'

// ===== 数据：按板块组织，后续直接在 items 数组里添加新条目即可 =====
const sections = [
  {
    id: 'opensource',
    title: '开源社区',
    count: 2,
    items: [
      { name: 'Github', desc: '', domain: 'github.com', url: 'https://github.com' },
      { name: 'Hugging Face', desc: '', domain: 'huggingface.co', url: 'https://huggingface.co' },
    ],
  },
  {
    id: 'aitools',
    title: 'AI Tools',
    count: 7,
    items: [
      { name: 'Coding/Token Plan 简览（付费）', desc: '', domain: '文档', url: '#', isDoc: true },
      { name: 'ChatGPT', desc: '综合最强（我没用过）', domain: 'chatgpt.com', url: 'https://chatgpt.com' },
      { name: 'Claude', desc: '一哥', domain: 'claude.ai', url: 'https://claude.ai' },
      { name: 'Gemini', desc: '美国大豆包', domain: 'gemini.google.com', url: 'https://gemini.google.com' },
      { name: 'DeepSeek', desc: '想用一辈子', domain: 'chat.deepseek.com', url: 'https://chat.deepseek.com' },
      { name: 'Grok', desc: '干啥啥不行', domain: 'grok.com', url: 'https://grok.com' },
      { name: 'Qwen', desc: '听说挺厉害的', domain: 'chat.qwen.ai', url: 'https://chat.qwen.ai' },
      { name: 'MiniMax', desc: '多模态，不太聪明', domain: 'agent.minimaxi.com', url: 'https://agent.minimaxi.com' },
    ],
  },
  {
    id: 'aicoding',
    title: 'AI Coding Agent',
    count: 5,
    items: [
      { name: 'Claude Code', domain: 'claude.ai', url: 'https://claude.ai' },
      { name: 'Codex', domain: 'chatgpt.com', url: 'https://chatgpt.com' },
      { name: 'Hermes Agent', domain: 'hermes-agent.nousresearch.com', url: 'https://hermes-agent.nousresearch.com' },
      { name: 'OpenClaw', domain: 'OpenClaw.ai', url: 'https://OpenClaw.ai' },
      { name: 'Cursor', domain: 'cursor.com', url: 'https://cursor.com' },
    ],
  },
  {
    id: 'ailearning',
    title: 'AI Learning',
    count: 2,
    items: [
      { name: '生图提示词', domain: 'opennana.com', url: 'https://opennana.com/' },
      { name: 'Ollama', domain: 'ollama.com', url: 'https://https://ollama.com/' },
    ],
  },
  {
    id: 'tools',
    title: '小工具',
    count: 10,
    items: [
      { name: 'iLovePDF', domain: 'ilovepdf.com', url: 'https://www.ilovepdf.com/' },
      { name: 'iLoveIMG', domain: 'iloveimg.com', url: 'https://www.iloveimg.com/' },
      { name: 'ncm转mp3', domain: 'coolutils.com', url: 'https://www.coolutils.com/zh/online/NCM-to-MP3' },
      { name: '代码工具（图片压缩）', domain: 'sojson.com', url: 'https://www.sojson.com/' },
      { name: '蜘蛛追踪器', domain: 'spideytracker.net', url: 'https://spideytracker.net/' },
      { name: '小酷盘', domain: 'xiaokupan.com', url: 'https://xiaokupan.com/' },
      { name: '软件下载', domain: 'xu5.cc', url: 'https://www.xu5.cc/' },
      { name: 'wallhaven', domain: 'wallhaven.cc', url: 'https://wallhaven.cc/' },
      { name: 'ChromeAuto', domain: 'googlechromelabs.github.io', url: 'https://googlechromelabs.github.io/chrome-for-testing/' },
      { name: 'Piano', domain: 'autopiano.cn', url: 'https://www.autopiano.cn/' },
    ],
  },
  {
    id: 'transfer',
    title: '中转站',
    count: 0,
    items: [
      { name: '不敢犯法'},
    ],
  },
  {
    id: 'techforum',
    title: '网页设计',
    count: 1,
    items: [
      { name: 'Ract Bits', domain: 'eactbits.dev', url: 'https://www.reactbits.dev/' },
    ],
  },
  {
    id: 'count',
    title: '计算',
    count: 1,
    items: [
      { name: 'Rate', domain: 'rate.005917.xyz', url: 'https://rate.005917.xyz/' },
    ],
  },
  {
    id: 'Blogger',
    title: '最爱的博主',
    count: 1,
    items: [
      { name: '影视飓风', domain: 'ysjf.com', url: 'https://www.ysjf.com/' },
    ],
  },
  {
    id: 'nettools',
    title: '网络工具',
    count: 1,
    items: [
      { name: 'Speedtest', domain: 'speedtest.net', url: 'https://www.speedtest.net/' },
    ],
  },
 
]

function Tools() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <NavHeader />
      <div className={styles.page}>
      {/* TargetCursor 自定义光标 */}
      <TargetCursor
        targetSelector=".cursor-target"
        spinDuration={3}
        hideDefaultCursor={true}
        parallaxOn={true}
        cursorColor="#a78bfa"
      />

      {/* ===== 左侧主体 ===== */}
      <div className={styles.main}>
        {/* 页头 */}
        <header className={`${styles.header} ${styles.animHeader}`}>
          <h1 className={styles.title}>Lab</h1>
          <p className={styles.subtitle}>
            一些值得收藏的网站(有的需要🪜) ·{' '}
            <a href="#" className={styles.subtitleLink}></a>
          </p>
        </header>

        {/* 板块列表 */}
        {sections.map((sec, secIdx) => (
          <section
            key={sec.id}
            id={sec.id}
            className={`${styles.section} ${styles.animSection}`}
            style={{ animationDelay: `${0.1 + secIdx * 0.08}s` }}
          >
            <h2 className={styles.sectionTitle}>{sec.title}</h2>
            <hr className={styles.divider} />
            {sec.items.map((item, i) => (
              <div
                key={i}
                className={`${styles.itemRow} cursor-target`}
                onClick={() => { if (!item.isDoc && item.url && item.url !== '#') window.open(item.url, '_blank') }}
                title={item.isDoc ? '' : item.url}
              >
                <span className={styles.itemEmoji}>{item.emoji}</span>
                <span className={styles.itemName}>{item.name}</span>
                {item.desc && <span className={styles.itemDesc}>{item.desc}</span>}
                <span className={styles.itemSpacer} />
                {item.isDoc ? (
                  <span className={`${styles.itemDomain} ${styles.doc}`}>{item.domain}</span>
                ) : (
                  <span className={styles.itemDomain}>{item.domain}</span>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* ===== 右侧固定目录 ===== */}
      <aside className={styles.toc}>
        <div className={styles.tocTitle}>目录</div>
        <ul className={styles.tocList}>
          {sections.map((sec) => (
            <li key={sec.id}>
              <span className={styles.tocItem} onClick={() => scrollTo(sec.id)}>
                <span>{sec.title}</span>
                <span className={styles.tocCount}>{sec.count}</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
    </>
  )
}

export default Tools
