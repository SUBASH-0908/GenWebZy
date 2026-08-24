import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './admin/Admin.jsx'

const root = document.getElementById('root')
const path = window.location.pathname.toLowerCase()
const isAdminRoute = path.startsWith('/genwebzy-portal') || path.startsWith('/genwebzy-cms')

createRoot(root).render(
  <StrictMode>
    {isAdminRoute ? <Admin /> : <App />}
  </StrictMode>
)

