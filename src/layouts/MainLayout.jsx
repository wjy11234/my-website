import { Outlet } from 'react-router-dom'

// 统一布局，导航栏由各页面自行渲染（放在背景图容器内）
function MainLayout() {
  return <Outlet />
}

export default MainLayout
