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
  list: {
    listStyle: 'none',
    padding: 0,
    maxWidth: 600,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid #ccc',
  },
  buttonGroup: {
    display: 'flex',
    gap: 10,
  },
  button: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1.5px solid #ddd',
    cursor: 'pointer',
  },
  selectedPresent: {
    backgroundColor: '#4caf50',
    color: 'white',
    borderColor: '#4caf50',
  },
  selectedAbsent: {
    backgroundColor: '#f44336',
    color: 'white',
    borderColor: '#f44336',
  },
  saveBtn: {
    marginTop: 20,
    padding: '12px 25px',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: 8,
    fontWeight: '700',
    cursor: 'pointer',
  },
  messageSuccess: {
    marginTop: 15,
    color: 'green',
  },
  messageError: {
    marginTop: 15,
    color: 'crimson',
  },
};

export default function AttendancePanel({ token }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      setMessage(null);
      try {
        const res = await axios.get('http://localhost:3001/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al cargar alumnos' });
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [token]);

  const markAttendance = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Construir arreglo de asistencias
    const attendanceArray = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id] || 'absent', // si no marcó, lo ponemos ausente
    }));

    try {
      await axios.post(
        'http://localhost:3001/attendance',
        { attendance: attendanceArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Asistencia guardada correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar asistencia' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Pasar Lista</h2>

      {loading && <p>Cargando alumnos...</p>}

      {!loading && students.length === 0 && <p>No hay alumnos para mostrar.</p>}

      {!loading && students.length > 0 && (
        <>
          <ul style={styles.list}>
            {students.map((student) => {
              const status = attendance[student._id];
              return (
                <li key={student._id} style={styles.listItem}>
                  <span>{student.nombre}</span>
                  <div style={styles.buttonGroup}>
                    <button
                      type="button"
                      style={{
                        ...styles.button,
                        ...(status === 'present' ? styles.selectedPresent : {}),
                      }}
                      onClick={() => markAttendance(student._id, 'present')}
                    >
                      Presente
                    </button>
                    <button
                      type="button"
                      style={{
                        ...styles.button,
                        ...(status === 'absent' ? styles.selectedAbsent : {}),
                      }}
                      onClick={() => markAttendance(student._id, 'absent')}
                    >
                      Ausente
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            style={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar asistencia'}
          </button>

          {message && (
            <p
              style={
                message.type === 'success'
                  ? styles.messageSuccess
                  : styles.messageError
              }
            >
              {message.text}
            </p>
          )}
        </>
      )}
    </div>
  );
}
