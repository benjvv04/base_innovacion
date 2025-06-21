import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import CreateTest from './components/CreateTest';
import Attendance from './components/AttendancePanel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>  {/* <-- Aquí envuelves todo */}
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom,rgb(68, 67, 67) 0%,rgb(240, 177, 6) 100%)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          display: 'flex',
        }}
      >
        <Sidebar onLogout={handleLogout} />
        <div
          style={{
            flex: 1,
            padding: '20px',
            color: '#fff',
            overflowY: 'auto',
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students token={token} />} />
            <Route path="/createtest" element={<CreateTest token={token} />} />
            <Route path="/attendance" element={<Attendance token={token} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
