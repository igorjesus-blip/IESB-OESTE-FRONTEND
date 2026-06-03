import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'react-toastify/dist/ReactToastify.css'

import './styles/theme.css'
import './styles/global.css'

import { App } from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)