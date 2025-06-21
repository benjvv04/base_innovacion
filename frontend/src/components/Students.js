import React, { useEffect, useState } from 'react';
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
    marginBottom: 30,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  input: {
    flex: '1 1 250px',
    padding: '10px 15px',
    fontSize: 16,
    borderRadius: 8,
    border: '1.5px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: 8,
    fontWeight: '700',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '12px 15px',
    borderBottom: '1px solid #ccc',
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

export default function Students({ token }) {
  const [students, setStudents] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3001/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      setError('Error al cargar alumnos');
    }
    setLoading(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3001/students',
        { nombre, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNombre('');
      setEmail('');
      setSuccessMsg('Alumno agregado correctamente');
      fetchStudents();
    } catch (err) {
      setError('Error al agregar alumno');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestión de Alumnos</h2>

      <form style={styles.form} onSubmit={handleAddStudent}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nombre del alumno *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button style={styles.button} type="submit">
          Agregar Alumno
        </button>
      </form>

      {loading && <p>Cargando alumnos...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {successMsg && <p style={styles.success}>{successMsg}</p>}

      <ul style={styles.list}>
        {students.map((s) => (
          <li key={s._id} style={styles.listItem}>
            {s.nombre} {s.email && `- ${s.email}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
