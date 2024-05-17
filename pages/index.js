import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import fs from 'fs';
import path from 'path';
import { Container, Typography, Box } from '@mui/material';
import styles from '../styles/Home.module.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Home({ data }) {
  const [parsedData, setParsedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const parsed = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
      transform: (value, header) => {
        if (header === 'Page name') {
          return value.trim();
        }
        return value;
      }
    });
    setParsedData(parsed.data);
    setFilteredData(parsed.data);
    console.log(parsed.data); // Verificar los datos
  }, [data]);

  const getCandidateName = (index) => {
    if (index >= 0 && index < parsedData.length) {
      return parsedData[index]["Page name"].split(' ')[0];
    }
    return '';
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom className={styles.projectName}>
        B.E.N.I.T.O
      </Typography>
      <Typography variant="h6" component="p" gutterBottom className={styles.projectDescription} style={{ fontSize: '14px' }}> {/* Hacer el texto más pequeño */}
        Búsqueda En Networks Inteligentes para Transparencia Oficial
      </Typography>
      <Typography variant="h3" component="h2" gutterBottom className={styles.heading}>
        Gastos en Campañas México 2024
      </Typography>
      <Box className={styles.chartsContainer}>
        <Box className={styles.chart}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredData}
              margin={{
                top: 80, right: 30, left: 40, bottom: 60, // Ajustar el margen izquierdo para más espacio
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Page name" angle={-25} textAnchor="end" interval={0} />
              <YAxis yAxisId="left" tickFormatter={formatNumber} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={formatNumber} />
              <Tooltip formatter={formatNumber} />
              <Legend verticalAlign="top" wrapperStyle={{ top: 0 }} /> {/* Mover la leyenda hacia arriba */}
              <Bar yAxisId="left" dataKey="Amount spent (MXN)" fill="#8884d8" barSize={20} />
              <Bar yAxisId="right" dataKey="Number of ads in Library" fill="#82ca9d" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box className={styles.chart}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ index, percent }) => `${getCandidateName(index)}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="Amount spent (MXN)"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatNumber} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      <footer className={styles.footer}>
        Datos obtenidos de <a href="https://www.facebook.com/ads/library/report/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e90ff' }}>Facebook Network (META)</a>.
        <br />
        Made with ❤️ by <a href="https://www.linkedin.com/in/jonathanftw/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e90ff' }}>Jonathan Paz</a>
      </footer>
    </Container>
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
