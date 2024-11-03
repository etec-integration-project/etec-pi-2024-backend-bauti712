import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import cors from 'cors';
import creacionUsuarios from './routes/creacionUsuarios.js';

config();

const app = express();

// Configuración de CORS
app.use(cors());

export const pool = createPool({
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    port: 3306
});

app.use(express.json());

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        console.log("Tabla 'users' creada o ya existe.");
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
};

app.get('/app/', (req, res) => {
    res.send('Hola');
});

app.get('/app/ping', async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT NOW()');
        res.json(resultado[0]);
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).send('Error al consultar la base de datos');
    }
});

app.get('/app/productos', async (req, res) => {
    return res.json({
        productos: [
            {
              id: 1,
              imagen: "babolat",
              nombre: "test jhighjuyy jhjhjkjk uva",
              descripcion: "Raqueta de alta gama para jugadores profesionales. Test test",
              precio: 250.00,
            },
            {
              id: 2,
              imagen: "head",
              nombre: "Raqueta de Tenis Head",
              descripcion: "Ideal para jugadores avanzados que buscan control y potencia.",
              precio: 230.00,
            },
            {
              id: 3,
              imagen: "wilson",
              nombre: "Raqueta de Tenis Wilson",
              descripcion: "Equilibrio perfecto entre potencia y control para todo tipo de jugadores.",
              precio: 210.00,
            },
            {
              id: 4,
              imagen: "yonex",
              nombre: "Raqueta de Tenis Yonex",
              descripcion: "Raqueta ligera y maniobrable, perfecta para jugadores técnicos.",
              precio: 240.00,
            }
          ]
    })
})

app.use('/app/creacionUsuarios', creacionUsuarios);


app.listen(3001, async () => {
    await initializeDatabase();
    console.log('Servidor corriendo en el puerto', 3001);
});