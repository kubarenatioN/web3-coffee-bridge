import About from '@/pages/about/About';
import Home from '@/pages/home/Home';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Slide, ToastContainer } from 'react-toastify';
import styles from './App.module.css';
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
        className={styles['toast-container']}
        toastClassName={styles['toast']}
        theme='colored'
        pauseOnFocusLoss={false}
        transition={Slide}
      />
    </>
  );
}

export default App;
