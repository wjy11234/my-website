import { motion } from 'framer-motion'
import { ArrowUp, MessageSquare } from 'lucide-react'
import styles from './FloatingButtons.module.css'

// 右下角悬浮按钮
function FloatingButtons() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className={styles.container}>
      <motion.button
        className={styles.btn}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare size={18} />
      </motion.button>
      <motion.button
        className={styles.btn}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={18} />
      </motion.button>
    </div>
  )
}

export default FloatingButtons
