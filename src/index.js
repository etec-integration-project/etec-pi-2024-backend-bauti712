import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import creacionUsuarios from './routes/creacionUsuarios.js';

config();

const app = express();


export const pool = createPool({
    host: process.env.HOST,
    user: 'root',
    password:process.env.PASSWORD,

    
    database: process.env.DBNAME,
    port:3306
    
    
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

app.get('/', (req, res) => {
    res.send('Hola');
});

app.get('/ping', async (req, res) => {
    const resultado = await pool.query('SELECT NOW()');
    res.json(resultado[0]);
});

app.use('/creacionUsuarios', creacionUsuarios);

app.listen(3000, async () => {
    await initializeDatabase();
    console.log('Servidor corriendo en el puerto', 3000);
});
