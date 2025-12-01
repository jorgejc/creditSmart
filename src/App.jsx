import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import './App.css'
import { Home } from './pages/Home';
import { Apply } from './pages/Apply';
import { Simulator } from './pages/Simulator';


function App() {

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/simulador' element={<Simulator />} />
        <Route path='/solicitar' element={<Apply />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App
