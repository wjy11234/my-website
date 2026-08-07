import styles from './PageWrapper.module.css'
import NavHeader from '../components/NavHeader'

function About() {
  return (
    <>
      <NavHeader />
      <div className={styles.pageWrap}>
      <h1>关于</h1>
      <p>关于厨王诞生...额。未开发...</p>
    </div>
    </>
  )
}

export default About
