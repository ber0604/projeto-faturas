import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState({
    totalEnergia: 0,
    totalCompensado: 0,
    totalValor: 0,
    totalEconomia: 0,
  });

  useEffect(() => {
    fetch('http://localhost:3000/faturas')
      .then(response => response.json())
      .then(result => {
        let faturas = result;
        let totalEnergia = 0;
        let totalCompensado = 0;
        let totalValor = 0;
        let totalEconomia = 0;
        for (let i = 0; i < faturas.length; i++) {
          totalEnergia += faturas[i].energiaQuantidadeKwh;
          totalCompensado += faturas[i].energiaCompensadaGD;
          totalValor += faturas[i].energiaValor;
          totalEconomia += (faturas[i].energiaCompensadaGDValor * -1);
        }
        setData({
          totalEnergia,
          totalCompensado,
          totalValor,
          totalEconomia,
        });
      })
      .catch(error => console.error('Erro ao buscar dados:', error));
  }, []);

  const energyData = {
    labels: ['Consumo', 'Compensação'],
    datasets: [
      {
        label: 'Resultados de Energia (kWh)',
        data: [data.totalEnergia, data.totalCompensado],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  const financialData = {
    labels: ['Valor Total', 'Economia'],
    datasets: [
      {
        label: 'Resultados Financeiros (R$)',
        data: [data.totalValor, data.totalEconomia],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Energia (kWh)</h5>
              <p className="card-text">{data.totalEnergia}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Compensado (kWh)</h5>
              <p className="card-text">{data.totalCompensado}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Valor Total (R$)</h5>
              <p className="card-text">{data.totalValor}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Economia (R$)</h5>
              <p className="card-text">{data.totalEconomia}</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-4">Resultados de Energia (kWh)</h3>
      <Bar data={energyData} options={{ responsive: true }} />

      <h3 className="mt-5 mb-4">Resultados Financeiros (R$)</h3>
      <Bar data={financialData} options={{ responsive: true }} />
    </div>
  );
};

export default Dashboard;