import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Faturas: React.FC = () => {
  const [faturas, setFaturas] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/faturas')
      .then(response => response.json())
      .then(data => setFaturas(data))
      .catch(error => console.error('Erro ao buscar faturas:', error));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await axios.post('http://localhost:3000/faturas/leitura', formData);
  
        if (response.status === 200) {
          fetch('http://localhost:3000/faturas')
            .then(response => response.json())
            .then(data => setFaturas(data));
        } else {
          alert('Erro ao fazer upload do arquivo');
        }
      } catch (error) {
        alert('Erro na requisição');
      }
    } else {
      alert('Por favor, selecione um arquivo PDF primeiro.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Lista de Faturas de Energia</h1>

      <div className="mb-3">
        <input
          type="file"
          name="file"
          accept="application/pdf"
          onChange={handleFileChange}
          id="file"
          style={{ display: 'none' }}
        />
        
        <label htmlFor="file" className="btn btn-primary mb-3">
          Ler fatura
        </label>
        
        <button onClick={handleFileUpload} style={{ marginLeft: 10 }} className="btn btn-success mb-3">
          Baixar fatura
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Mês de Referência</th>
            <th>Quantidade (kWh)</th>
            <th>Valor (R$)</th>
            <th>Contribuição Ilum. Pública (R$)</th>
          </tr>
        </thead>
        <tbody>
          {faturas.map((fatura, index) => (
            <tr key={index}>
              <td>{fatura.numeroCliente}</td>
              <td>{fatura.mesReferencia}</td>
              <td>{fatura.energiaQuantidadeKwh}</td>
              <td>{fatura.energiaValor}</td>
              <td>{fatura.contribuicaoIlumPublica}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Faturas;