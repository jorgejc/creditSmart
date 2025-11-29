import React from 'react'
import { Link, useLocation } from 'react-router-dom';  // <a>


export const Navbar = () => {

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    }

  return (
    <nav className='navbar'>
        <div className="container">
        
        <Link to="/" className="nav-brand">
          💳 CreditSmart
        </Link>
        
        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/')}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/simulador" className={isActive('/simulador')}>
              Simulador
            </Link>
          </li>
          <li>
            <Link to="/solicitar" className={isActive('/solicitar')}>
              Solicitar Crédito
            </Link>
          </li>
        </ul>
      </div>
      
    </nav>
  )
}

