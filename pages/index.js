import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import fs from 'fs';
import path from 'path';
import styles from '../styles/Home.module.css';

export default function Home({ data }) {
  const [parsedData, setParsedData] = useState([]);

  useEffect(() => {
    const parsed = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
    });
    setParsedData(parsed.data);
  }, [data]);

  return (
    <div className={styles.container}>
      <h1>Gastos en Campañas</h1>
      <div className={styles.chart}>
        <BarChart
          width={600}
          height={300}
          data={parsedData}
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
