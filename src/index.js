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

app.use('/app/creacionUsuarios', creacionUsuarios);

app.listen(3001, async () => {
    await initializeDatabase();
    console.log('Servidor corriendo en el puerto', 3001);
});
