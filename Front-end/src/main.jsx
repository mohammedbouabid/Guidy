import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.jsx'
import { Toaster } from './Components/ui/sonner'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

createRoot(document.getElementById('root')).render(
  <Provider  store={store}>
  <StrictMode>
    <App />
    <Toaster/>
  </StrictMode>,

  </Provider>
)
