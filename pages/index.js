import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Container, Typography, Button, Box } from '@mui/material';
import styles from '../styles/Home.module.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

// Función para parsear el archivo de texto
const parseTxt = (data) => {
  const lines = data.split('\n').filter(line => line.trim() !== '');
  const parsedData = [];
  for (let i = 0; i < lines.length; i += 4) {
    try {
      const nombre = lines[i]?.split(': ')[1]?.trim();
      const importeGastado = parseInt(lines[i + 1]?.split(': ')[1]?.replace(/,/g, ''));
      const numeroAnuncios = parseInt(lines[i + 2]?.split(': ')[1]);
      if (nombre && !isNaN(importeGastado) && !isNaN(numeroAnuncios)) {
        parsedData.push({
          "Page name": nombre,
          "Amount spent (MXN)": importeGastado,
          "Number of ads in Library": numeroAnuncios
        });
      } else {
        console.error('Error parsing line:', lines[i], lines[i + 1], lines[i + 2]);
      }
    } catch (error) {
      console.error('Error parsing line:', lines[i], error);
    }
  }
  return parsedData;
};

export default function Home({ data }) {
  const [parsedData, setParsedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const parsed = parseTxt(data);
    setParsedData(parsed);
    setFilteredData(parsed);
    console.log(parsed); // Verificar los datos
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
    <Container>
      <Typography variant="h2" component="h1" gutterBottom className={styles.projectName}>
        B.E.N.I.T.O
      </Typography>
      <Typography variant="h6" component="p" gutterBottom className={styles.projectDescription}>
        Búsqueda de Engastos en Networks Inteligentes para Transparencia Oficial
      </Typography>
      <Typography variant="h3" component="h2" gutterBottom className={styles.heading}>
        Gastos en Campañas México 2024
      </Typography>
      <Box my={2} className={styles.buttonGroup}>
        <Button variant="contained" color="primary" onClick={filterByAmountSpent} style={{ marginRight: '10px' }}>
          Ordenar por Cantidad Gastada
        </Button>
        <Button variant="contained" color="secondary" onClick={filterByNumberOfAds}>
          Ordenar por Número de Anuncios
        </Button>
      </Box>
      <Box my={4} className={styles.chart}>
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
      </Box>
      <Box my={4} className={styles.chart}>
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
      </Box>
      <footer className={styles.footer}>
        Datos obtenidos de <a href="https://www.facebook.com/ads/library/report/" target="_blank" rel="noopener noreferrer">Facebook Network (META)</a>.
      </footer>
    </Container>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'gastos.txt');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      data: fileContents,
    },
  };
}
