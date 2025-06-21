import React from 'react';
import { NavLink } from 'react-router-dom';

const styles = {
  sidebar: {
    width: 240,
    height: '100vh',
    background: 'linear-gradient(to bottom, #2f2f2f, #000000)', // gris oscuro arriba a negro abajo
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    color: 'white',
  },
  logoContainer: {
    backgroundColor: '#000000', // fondo negro puro para que contraste
    padding: '20px',
    textAlign: 'center',
  },
  logoText: {
    color: '#ffffff', // amarillo brillante
    fontWeight: '700',
    fontSize: 25,
    margin: 0,
  },
  navLink: {
    padding: '12px 20px',
    textDecoration: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  activeLink: {
    fontWeight: '700',
    backgroundColor: '#444', // fondo gris oscuro para activo
  },
  logoutBtn: {
    marginTop: 'auto',
    padding: '12px 20px',
    backgroundColor: '#f8d823', // amarillo para botón
    color: '#000',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  },
};

export default function Sidebar({ onLogout }) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <h1 style={styles.logoText}>Panel Docentes Duoc</h1>
      </div>
      <NavLink
        to="/dashboard"
        style={({ isActive }) =>
          isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
        }
      >
        Inicio
      </NavLink>
      <NavLink
        to="/students"
        style={({ isActive }) =>
          isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
        }
      >
        Alumnos
      </NavLink>
      <NavLink
        to="/createtest"
        style={({ isActive }) =>
          isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
        }
      >
        Crear Prueba
      </NavLink>
      <NavLink
        to="/attendance"
        style={({ isActive }) =>
          isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
        }
      >
        Pasar Lista
      </NavLink>
      <button style={styles.logoutBtn} onClick={onLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}
