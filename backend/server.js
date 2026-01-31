// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Archivos a cargar
const provincias = require('./data/provincias.json');
const municipios = require('./data/municipios.json');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json()); // Parsear JSON en el body de las peticiones

// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API Backend',
    endpoints: {
      '/api/ejemplo': 'Obtiene datos de ejemplo de una API externa',
      '/api/usuarios': 'Obtiene lista de usuarios de ejemplo',
      '/api/usuario/:id': 'Obtiene un usuario específico por ID'
    }
  });
});

app.get('/api/provincias', async(req, res) => {
  res.json(provincias);
});

app.get('/api/municipios/:provincia', async (req, res) => {
  try{
    const { provincia } = req.params;
    let municipios_filtrados = municipios.filter(mun => mun.cod_provincia == provincia )
    res.json(municipios_filtrados[0].municipios);
  } catch (error) {
    console.error('Error: ', error);
  }
});

app.get('/api/meteorologia/provincia/:provincia', async (req, res) => {
  try {
    const { provincia } = req.params;
    const API_KEY = process.env.AEMET_API_KEY;

    const response = await fetch(
      `https://opendata.aemet.es/opendata/api/prediccion/provincia/hoy/${provincia}?api_key=${API_KEY}`
    );

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    if (data.datos) {
      const datosResponse = await fetch(data.datos);

      const arrayBuffer = await datosResponse.arrayBuffer();
      const decoder = new TextDecoder('iso-8859-15');
      const text = decoder.decode(arrayBuffer);

      let resultado;

      try {
        resultado = JSON.parse(text);
      } catch (e) {
        console.log('AEMET devolvió texto plano, no JSON');
        resultado = {
          formato: 'texto_plano',
          contenido: text
        };
      }

      res.json({
        success: true,
        data: resultado
      });

    } else {
      res.json(data);
    }

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos meteorológicos'
    });
  }
});

// Envío de datos por api para el municipio seleccionado
app.get('/api/meteorologia/municipio/:municipio', async (req, res) => {
  try {
    const { municipio } = req.params;
    const API_KEY = process.env.AEMET_API_KEY;

    const response = await fetch(
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${municipio}?api_key=${API_KEY}`
    );

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    if (data.datos) {
      const datosResponse = await fetch(data.datos);

      const arrayBuffer = await datosResponse.arrayBuffer();
      const decoder = new TextDecoder('iso-8859-15');
      const text = decoder.decode(arrayBuffer);

      let resultado;
      try {
        resultado = JSON.parse(text);
      } catch (e) {
        console.log('AEMET devolvió texto plano, no JSON');
        resultado = {
          formato: 'texto_plano',
          contenido: text
        };
      }
      res.json({
        success: true,
        data: resultado
      });

    } else {
      res.json(data);
    }

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos meteorológicos'
    });
  }
});

// Ruta para manejar endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación disponible en http://localhost:${PORT}`);
});
