import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import styles from './ThemeToggle.module.css'

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <motion.button
      className={styles.toggle}
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      <span>{darkMode ? '日间' : '夜间'}</span>
    </motion.button>
  )
}

export default ThemeToggle
