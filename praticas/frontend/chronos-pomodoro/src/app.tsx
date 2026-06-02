import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider'

import { Home } from './pages/Home'

import './styles/theme.css'
import './styles/global.css'

export function App() {
  return (
    <TaskContextProvider>
      <Home />
    </TaskContextProvider>
  )
}