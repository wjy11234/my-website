import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import MainLayout from './layouts/MainLayout'

// 路由级懒加载：每个页面单独打包，按需加载
const Home = lazy(() => import('./pages/Home'))
const ShuoShuo = lazy(() => import('./pages/ShuoShuo'))
const PhotoWall = lazy(() => import('./pages/PhotoWall'))
const AlbumGallery = lazy(() => import('./pages/AlbumGallery'))
const Us = lazy(() => import('./pages/Us'))
const Tools = lazy(() => import('./pages/Tools'))
const FriendLinks = lazy(() => import('./pages/FriendLinks'))
const About = lazy(() => import('./pages/About'))
const MessageWall = lazy(() => import('./pages/MessageWall'))

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center' }}>加载中...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shuoshuo" element={<ShuoShuo />} />
              <Route path="/photos" element={<PhotoWall />} />
              <Route path="/photos/:albumId" element={<AlbumGallery />} />
              <Route path="/us" element={<Us />} />
              <Route path="/message-wall" element={<MessageWall />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/friends" element={<FriendLinks />} />
              <Route path="/about" element={<About />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
