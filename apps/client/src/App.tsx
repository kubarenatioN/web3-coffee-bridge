import About from '@/pages/about/About';
import Home from '@/pages/home/Home';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Slide, ToastContainer } from 'react-toastify';
import Layout from './Layout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='about' element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position='bottom-center'
        style={{
          padding: '0 5px 5px',
        }}
        toastStyle={{ maxWidth: '320px', borderRadius: 12 }}
        theme='colored'
        transition={Slide}
      />
    </>
  );
}

export default App;
