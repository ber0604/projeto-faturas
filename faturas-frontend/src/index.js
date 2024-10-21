import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  console.error("Elemento root não encontrado no DOM");
}