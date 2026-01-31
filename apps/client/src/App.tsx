import About from '@/pages/about/About'
import Home from '@/pages/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Layout from './Layout'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
