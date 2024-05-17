```markdown
# B.E.N.I.T.O

**B.E.N.I.T.O** (Búsqueda En Networks Inteligentes para Transparencia Oficial) es una aplicación web para visualizar los gastos en Facebook de los candidatos presidenciales de México 2024. La aplicación muestra los datos de gasto en campañas y el número de anuncios en la biblioteca de Facebook utilizando gráficos interactivos.

## Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Descripción de los Archivos y Directorios](#descripción-de-los-archivos-y-directorios)
- [Explicación del Código](#explicación-del-código)
- [Gráficos](#gráficos)
- [Estilos](#estilos)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Tecnologías Utilizadas

- **Next.js**: Framework de React para aplicaciones del lado del servidor y del cliente.
- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Recharts**: Biblioteca de gráficos para React.
- **Material-UI**: Biblioteca de componentes de interfaz de usuario para React.
- **PapaParse**: Biblioteca para parsear archivos CSV.
- **CSS Modules**: Módulos CSS para estilos locales.

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/benito.git
   cd benito
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
benito/
├── data/
│   └── gastos.csv
├── pages/
│   └── index.js
├── styles/
│   └── Home.module.css
├── public/
│   └── favicon.ico
├── README.md
├── package.json
└── next.config.js
```

## Descripción de los Archivos y Directorios

### `data/gastos.csv`

Contiene los datos de los gastos en campañas y el número de anuncios en la biblioteca de los candidatos presidenciales.

### `pages/index.js`

Componente principal de la aplicación. Contiene la lógica para parsear los datos CSV, renderizar los gráficos y aplicar los estilos.

### `styles/Home.module.css`

Archivo de estilos para el componente principal. Utiliza módulos CSS para aplicar estilos locales.

### `public/favicon.ico`

Ícono de la aplicación.

### `README.md`

Este archivo, que proporciona una descripción detallada del proyecto.

### `package.json`

Archivo de configuración de npm que contiene las dependencias y scripts del proyecto.

### `next.config.js`

Archivo de configuración de Next.js.

## Explicación del Código

### `pages/index.js`

Este archivo contiene el componente principal de la aplicación. Aquí se parsean los datos CSV, se configuran los gráficos y se aplican los estilos.

```javascript
import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import fs from "fs";
import path from "path";
import { Container, Typography, Box } from "@mui/material";
import styles from "../styles/Home.module.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className={styles.intro} style={{ color: entry.color }}>
            {`${entry.name}: ${formatNumber(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default function Home({ data }) {
  const [parsedData, setParsedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const parsed = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, header) => {
        if (header === "Page name") {
          return value.trim();
        }
        return value;
      },
    });
    setParsedData(parsed.data);
    setFilteredData(parsed.data);
    console.log(parsed.data); // Verificar los datos
  }, [data]);

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom className={styles.projectName}>
        B.E.N.I.T.O
      </Typography>
      <Typography
        variant="h6"
        component="p"
        gutterBottom
        className={styles.projectDescription}
        style={{ fontSize: "14px" }}
      >
        {" "}
        {/* Hacer el texto más pequeño */}
        Búsqueda En Networks Inteligentes para Transparencia Oficial
      </Typography>
      <Typography variant="h3" component="h2" gutterBottom className={styles.heading}>
        Gastos en Facebook de candidatos presidenciales México 2024
      </Typography>
      <Box className={styles.chartsContainer}>
        <Box className={styles.chart}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredData}
              margin={{
                top: 80,
                right: 30,
                left: 40,
                bottom: 60, // Ajustar el margen izquierdo para más espacio
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Page name" angle={-25} textAnchor="end" interval={0} />
              <YAxis yAxisId="left" tickFormatter={formatNumber} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={{ top: 0, marginBottom: 5 }} />{" "}
              {/* Mover la leyenda hacia arriba y agregar margen */}
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
                label={({ index, percent }) =>
                  `${filteredData[index]["Page name"].split(" ")[0]}: ${(percent * 100).toFixed(0)}%`
                }
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
        Datos obtenidos de{" "}
        <a
          href="https://www.facebook.com/ads/library/report/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1e90ff" }}
        >
          Facebook Network (META)
        </a>
        .
        <br />
        Made with ❤️ by{" "}
        <a
          href="https://www.linkedin.com/in/jonathanftw/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1e90ff" }}
        >
          Jonathan Paz
        </a>
      </footer>
    </Container>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "gastos.csv");
  const fileContents = fs.readFileSync(filePath, "utf8");

  return {
    props: {
      data: fileContents,
    },
  };
}
```

### Estilos

#### `styles/Home.module.css`

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.projectName {
  color: #fff;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.projectDescription {
  color: #aaa;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.heading {
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
}

.chartsContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem; /* Espaciado entre las gráficas */
}

.chart {
  flex: 1;
  min-width: 300px; /* Ancho mínimo para cada gráfica */
  max-width: 600px; /* Ancho máximo para cada gráfica */
}

.footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: #aaa;
}

.tooltip {
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}

.label {
  font-weight: bold;
}

.intro {
  margin: 0;
}

@media (max-width: 768px) {
  .chartsContainer {
    flex-direction: column; /* Cambiar a columna en pantallas pequeñas */
  }

  .chart {
    width: 100%;
    max-width: 90%;
  }

  .heading {
    font-size: 1.5rem;
  }

  .projectName {
    font-size: 1.5rem;
  }

  .projectDescription {
    font-size: 0.9rem;
  }
}
```

### Despliegue

Para desplegar la aplicación, puedes utilizar servicios como Vercel. Sigue estos pasos:

1. **Conectar tu repositorio a Vercel**.
2. **Configurar el proyecto**.
3. **Desplegar la aplicación**.

### Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. **Haz un fork del proyecto**.
2. **Crea una nueva rama** (`git checkout -b feature/nueva-caracteristica`).
3. **Haz commit de tus cambios** (`git commit -am 'Añadir nueva característica'`).
4. **Haz push a la rama** (`git push origin feature/nueva-caracteristica`).
5. **Abre un Pull Request**.

### Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más información.
