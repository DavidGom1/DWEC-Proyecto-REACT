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

// EJEMPLO 1: Endpoint que consulta a una API externa y devuelve los datos
app.get('/api/ejemplo', async (req, res) => {
  try {
    // Hacer petición a API externa (JSONPlaceholder como ejemplo)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }

    // Convertir respuesta a JSON
    const data = await response.json();

    // Devolver los datos al cliente
    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error al consultar la API:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los datos de la API externa',
      detalles: error.message
    });
  }
});

// EJEMPLO 2: Endpoint que obtiene una lista de recursos
app.get('/api/usuarios', async (req, res) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const usuarios = await response.json();

    res.json({
      success: true,
      total: usuarios.length,
      data: usuarios
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios'
    });
  }
});

// EJEMPLO 3: Endpoint con parámetros dinámicos
app.get('/api/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const usuario = await response.json();

    res.json({
      success: true,
      data: usuario
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el usuario'
    });
  }
});

// EJEMPLO 4: Endpoint con query parameters (para filtros, búsquedas, etc.)
app.get('/api/posts', async (req, res) => {
  try {
    // Obtener parámetros de consulta (ej: /api/posts?userId=1)
    const { userId } = req.query;

    let url = 'https://jsonplaceholder.typicode.com/posts';

    // Si se proporciona userId, filtrar por ese usuario
    if (userId) {
      url += `?userId=${userId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const posts = await response.json();

    res.json({
      success: true,
      total: posts.length,
      filtros: { userId: userId || 'ninguno' },
      data: posts
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener posts'
    });
  }
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

    // 1. Primera petición para obtener la URL de los datos
    const response = await fetch(
      `https://opendata.aemet.es/opendata/api/prediccion/provincia/hoy/${provincia}?api_key=${API_KEY}`
    );

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    // 2. Segunda petición a la URL que nos da AEMET
    if (data.datos) {
      const datosResponse = await fetch(data.datos);

      const arrayBuffer = await datosResponse.arrayBuffer();
      const decoder = new TextDecoder('iso-8859-15');
      const text = decoder.decode(arrayBuffer);

      let resultado;

      try {
        // Intentamos convertir a JSON
        resultado = JSON.parse(text);
      } catch (e) {
        // Si falla, es que AEMET nos ha dado el informe en texto plano
        console.log('AEMET devolvió texto plano, no JSON');
        resultado = {
          formato: 'texto_plano',
          contenido: text // Aquí irá el texto de "AGENCIA ESTATAL..."
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

app.get('/api/meteorologia/municipio/:municipio', async (req, res) => {
  try {
    const { municipio } = req.params;
    const API_KEY = process.env.AEMET_API_KEY;

    // 1. Primera petición para obtener la URL de los datos
    const response = await fetch(
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${municipio}?api_key=${API_KEY}`
    );

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    // 2. Segunda petición a la URL que nos da AEMET
    if (data.datos) {
      const datosResponse = await fetch(data.datos);

      const arrayBuffer = await datosResponse.arrayBuffer();
      const decoder = new TextDecoder('iso-8859-15');
      const text = decoder.decode(arrayBuffer);

      let resultado;

      try {
        // Intentamos convertir a JSON
        resultado = JSON.parse(text);
      } catch (e) {
        // Si falla, es que AEMET nos ha dado el informe en texto plano
        console.log('AEMET devolvió texto plano, no JSON');
        resultado = {
          formato: 'texto_plano',
          contenido: text // Aquí irá el texto de "AGENCIA ESTATAL..."
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
