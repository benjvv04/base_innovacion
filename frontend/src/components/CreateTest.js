import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  container: {
    padding: 30,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  form: {
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  input: {
    padding: '10px 15px',
    fontSize: 16,
    borderRadius: 8,
    border: '1.5px solid #ddd',
  },
  button: {
    padding: '12px',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: 8,
    fontWeight: '700',
    cursor: 'pointer',
  },
  error: {
    color: 'crimson',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
};

export default function CreateTest({ token }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!nombre.trim()) {
      setError('El nombre de la prueba es obligatorio');
      return;
    }
    if (!fecha) {
      setError('La fecha es obligatoria');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3001/tests',
        { nombre, descripcion, fecha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNombre('');
      setDescripcion('');
      setFecha('');
      setSuccessMsg('Prueba creada correctamente');
    } catch (err) {
      setError('Error al crear la prueba');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Crear Nueva Prueba</h2>
      {error && <p style={styles.error}>{error}</p>}
      {successMsg && <p style={styles.success}>{successMsg}</p>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nombre de la prueba *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          style={{ ...styles.input, height: 100 }}
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          style={styles.input}
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          Crear Prueba
        </button>
      </form>
    </div>
  );
}
