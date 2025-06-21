import React from 'react';

const styles = {
  container: {
    padding: 40,
    color: 'white',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backdropFilter: 'blur(5px)',
  },
};

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenido al Panel Docentes Duoc</h1>
      <p style={styles.subtitle}>
        Aquí puedes gestionar tus alumnos, crear pruebas y pasar lista fácilmente.
      </p>

      <div style={styles.infoBox}>
        <h3>📋 Pruebas Programadas</h3>
        <p>No hay pruebas programadas por el momento.</p>
      </div>

      <div style={styles.infoBox}>
        <h3>👨‍🏫 Últimos Alumnos Registrados</h3>
        <p>Este módulo mostrará a los últimos alumnos añadidos.</p>
      </div>

      <div style={styles.infoBox}>
        <h3>📅 Próximas Asistencias</h3>
        <p>Aquí aparecerán las clases donde se debe pasar lista.</p>
      </div>
    </div>
  );
}
