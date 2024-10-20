import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from '/components/Dashboard';
import Faturas from './components/Faturas';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/faturas" element={<Faturas />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
