import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import Dashboard from './componentes/Dashboard';
import Faturas from './componentes/Faturas';

const App = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faturas" element={<Faturas />} />
        </Routes>
      </div>
    </>
  );
};

export default App;