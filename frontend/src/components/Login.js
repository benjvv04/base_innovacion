import React, { useState } from 'react';
import axios from 'axios';
import duocLogo from '../assets/duoc-logo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/login', {
        usuario: username,
        contraseña: password,
      });
      onLogin(res.data.token);
    } catch {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #f8d823, #000000)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      padding: 20,
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 40,
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        width: 360,
        textAlign: 'center',
      }}>
        <img src={duocLogo} alt="Duoc UC Logo" style={{ width: 120, margin: '0 auto 24px', display: 'block' }} />
        <h2 style={{ marginBottom: 24, color: '#333', fontWeight: '700', fontSize: '1.8rem' }}>Ingreso Docente</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 20,
              borderRadius: 8,
              border: '1.5px solid #ddd',
              fontSize: '1rem',
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 20,
              borderRadius: 8,
              border: '1.5px solid #ddd',
              fontSize: '1rem',
            }}
          />
          {error && <p style={{ color: 'crimson', marginBottom: 16 }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              backgroundColor: '#FFD700',
              border: 'none',
              color: 'black',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
