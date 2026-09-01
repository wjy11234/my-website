import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import ShuoShuo from './pages/ShuoShuo'
import PhotoWall from './pages/PhotoWall'
import AlbumGallery from './pages/AlbumGallery'
import Us from './pages/Us'
import Tools from './pages/Tools'
import FriendLinks from './pages/FriendLinks'
import About from './pages/About'
import MessageWall from './pages/MessageWall'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
