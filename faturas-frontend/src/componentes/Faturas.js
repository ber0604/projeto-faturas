import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Faturas = () => {
  const [faturas, setFaturas] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchCliente, setSearchCliente] = useState('');
  const [searchMes, setSearchMes] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/faturas')
      .then(response => response.json())
      .then(data => setFaturas(data));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
          alert('Erro ao fazer upload do arquivo:', response);
        }
      } catch (error) {
        alert('Erro na requisição:', error);
      }
    } else {
      alert('Por favor, selecione um arquivo PDF primeiro.');
    }
  };
  
  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await axios.get('http://localhost:3000/faturas/download/' + invoiceId, {
        responseType: 'blob',
      });
      
      if (response.status !== 200) {
        throw new Error(`Erro: ${response.statusText}`);
      }
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceId}`;
      document.body.appendChild(a);
      a.click();
  
      a.remove();
      window.URL.revokeObjectURL(url);
  
      console.log(`Fatura ${invoiceId} baixada com sucesso.`);
    } catch (error) {
      console.error("Erro ao baixar a fatura:", error);
    }
  };
  
  const filteredFaturas = faturas.filter(fatura => {
    const matchCliente = fatura.numeroCliente.toString().includes(searchCliente);
    const matchMes = searchMes ? fatura.mesReferencia.includes(searchMes) : true; // Mostra todas se searchMes estiver vazio
    return matchCliente && matchMes;
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Faturas</h1>

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

      {/* Filtros */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Pesquisar por número do cliente"
          value={searchCliente}
          onChange={(e) => setSearchCliente(e.target.value)}
          className="form-control mb-2"
        />
        <div className="btn-group mb-2" role="group">
          <button
            type="button"
            className={`btn ${searchMes === '' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSearchMes('')}
          >
            Todos
          </button>
          {['JAN/2024', 'FEV/2024', 'MAR/2024', 'ABR/2024', 'MAI/2024', 'JUN/2024', 'JUL/2024', 'AGO/2024', 'SET/2024', 'OUT/2024', 'NOV/2024', 'DEZ/2024'].map(mes => (
            <button
              key={mes}
              type="button"
              className={`btn ${searchMes === mes ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSearchMes(mes)}
            >
              {mes}
            </button>
          ))}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Mês de Referência</th>
            <th>Consumo de energia elétrica (kWh)</th>
            <th>Energia Compensada (kWh)</th>
            <th>Valor Total sem GD (R$)</th>
            <th>Economia GD (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaturas.map((fatura, index) => (
            <tr key={index}>
              <td>{fatura.numeroCliente}</td>
              <td>{fatura.mesReferencia}</td>
              <td>{fatura.energiaQuantidadeKwh + fatura.energiaSceeSemIcms}</td>
              <td>{fatura.energiaCompensadaGD}</td>
              <td>{fatura.energiaValor + fatura.energiaSceeSemIcmsValor + fatura.contribuicaoIlumPublica}</td>
              <td>{fatura.energiaCompensadaGDValor * -1}</td>
              <td>
                <button onClick={() => downloadInvoice(fatura.fileName)}>Download Fatura</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Faturas;