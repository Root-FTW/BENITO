import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import fs from 'fs';
import path from 'path';
import styles from '../styles/Home.module.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function Home({ data }) {
  const [parsedData, setParsedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const parsed = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
    });
    setParsedData(parsed.data);
    setFilteredData(parsed.data);
  }, [data]);

  const filterByAmountSpent = () => {
    const filtered = [...parsedData].sort((a, b) => b["Amount spent (MXN)"] - a["Amount spent (MXN)"]);
    setFilteredData(filtered);
  };

  const filterByNumberOfAds = () => {
    const filtered = [...parsedData].sort((a, b) => b["Number of ads in Library"] - a["Number of ads in Library"]);
    setFilteredData(filtered);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Gastos en Campañas</h1>
      <div>
        <button onClick={filterByAmountSpent}>Ordenar por Cantidad Gastada</button>
        <button onClick={filterByNumberOfAds}>Ordenar por Número de Anuncios</button>
      </div>
      <div className={styles.chart}>
        <BarChart
          width={600}
          height={300}
          data={filteredData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Page name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Amount spent (MXN)" fill="#8884d8" />
          <Bar dataKey="Number of ads in Library" fill="#82ca9d" />
        </BarChart>
      </div>
      <div className={styles.chart}>
        <PieChart width={400} height={400}>
          <Pie
            data={filteredData}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="Amount spent (MXN)"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'gastos.csv');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      data: fileContents,
    },
  };
}
