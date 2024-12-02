import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import creacionUsuarios from './routes/creacionUsuarios.js';

config();
const products =  [
    [
        "test jhighjuyy jhjhjkjk uva",
        "Raqueta de alta gama para jugadores profesionales. Test test",
        250.00,
        "babolat",
    ],
    [
        "Raqueta de Tenis Head",
        "Ideal para jugadores avanzados que buscan control y potencia.",
        230.00,
        "head",
    ],
    [
        "Raqueta de Tenis Wilson",
        "Equilibrio perfecto entre potencia y control para todo tipo de jugadores.",
        210.00,
        "wilson",
    ],
    [
        "Raqueta de Tenis Yonex",
        "Raqueta ligera y maniobrable, perfecta para jugadores técnicos.",
        240.00,
        "yonex",
    ]
]
const app = express();

// Configuración de CORS
app.use(cors());
app.use(cookieParser())

export const pool = createPool({
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD,
    port: 3306,
    database: process.env.DBNAME
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
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                descripcion TEXT NOT NULL,
                price INT NOT NULL,
                imagen VARCHAR(255) NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cart LONGTEXT NOT NULL,
                user_id INT NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS calificaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                calificacion INT NOT NULL,
                username VARCHAR(255) NOT NULL
            )
        `);
        console.log("Tabla 'users' y 'cart' creadas o ya existen.");
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }

    try {
        const [rows, fields] = await pool.query('SELECT * FROM products');

        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO products (nombre, descripcion, price, imagen) VALUES (?, ?, ?, ?)';

            for (const producto of products) {
                await pool.query(insertQuery, producto);
            }
        }

        console.log("Productos cargados correctamente");
    } catch (error) {
        console.log("Error al cargar los productos: ", error);
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
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al mostrar los productos');
    }
});

app.post('/app/productos', async (req, res) => {
    const { nombre, descripcion, price, imagen } = req.body;
    try {
        const [existingProduct] = await pool.query('SELECT * FROM products WHERE nombre = ?', [nombre]);
        if (existingProduct.length > 0) {
            return res.status(409).send('Producto existente');
        }
        await pool.query('INSERT INTO products (nombre, descripcion, price, imagen) VALUES (?, ?, ?, ?)', [nombre, descripcion, price, imagen]);
        res.status(201).send('Producto registrado con éxito');
    }
    catch (error){
        console.error('Error al registrar producto:', error);
        res.status(500).send('Error al registrar producto');
    }
});

app.post('/app/cart', async (req, res) => {
    const cookie = req.cookies['bauti712-cookie'];

    if (!cookie) {
        return res.status(403).send('Unauthorized');
    }

    const data = jwt.verify(cookie, process.env.JWT_SECRET);
    const user_id = data.id;

    const { jsonifiedCart } = req.body;

    try {
        const [results] = await pool.query('INSERT INTO cart (cart, user_id) VALUES (?, ?)', [jsonifiedCart, user_id]);
        
        const usersIds = [results.map(e => e.user_id)];
        console.log({usersIds})

        const users = []

        for(const id of usersIds){
            const result = await pool.query(`SELECT * FROM users where users.id = ${id}`)
            users.push(result)
        }  

        console.log({users})

        res.status(201).send('Carrito registrado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar carrito');
    }
});

app.get('/app/calificaciones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT TRUNCATE(AVG(calificacion), 1) AS calificacion FROM calificaciones');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send('Error al mostrar las calificaciones');
    }
})

app.post('/app/calificaciones', async (req, res) => {
    const cookie = req.cookies['bauti712-cookie'];

    if (!cookie) {
        return res.status(403).send('Unauthorized');
    }

    const data = jwt.verify(cookie, process.env.JWT_SECRET);
    const username = data.username;

    const { calificacion } = req.body;

    try {
        const [results] = await pool.query('INSERT INTO calificaciones (calificacion, username) VALUES (?, ?)', [calificacion, username]);

        res.status(201).send('Calificación registrada con éxito');
    } catch (error) {
        res.status(500).send('Error al calificar la página');
    }
});

app.get('/app/user_calificaciones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM calificaciones');

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al mostrar las calificaciones');
    }
});

app.get('/app/user_carts', async (req, res) => {
    const cookie = req.cookies['bauti712-cookie'];

    if (!cookie) {
        return res.status(403).send('Unauthorized');
    }

    const data = jwt.verify(cookie, process.env.JWT_SECRET);
    const user_id = data.id;

    try {
        const [rows] = await pool.query('SELECT cart FROM cart WHERE user_id = ?', [user_id]);

        const parsedRows = rows.map(row => {
            return {
                ...row,
                cart: JSON.parse(row.cart)
            };
        });

        res.status(200).json({ 'cart': parsedRows });
    } catch (error) {
        res.status(500).send('Error al mostrar las calificaciones');
    }
})

app.use('/app/creacionUsuarios', creacionUsuarios);


app.listen(3001, async () => {
    await initializeDatabase();
    console.log('Servidor corriendo en el puerto', 3001);
});


// To parse this data:
//
//   import { Convert } from "./file";
//
//   const cart = Convert.toCart(json);

// export interface Cart {
//     id:       number;
//     nombre:   string;
//     price:    number;
//     quantity: number;
// }

// Converts JSON strings to/from your types
// export class Convert {
//     static toCart(json) {
//         return JSON.parse(json);
//     }

//     static cartToJson(value) {
//         return JSON.stringify(value);
//     }
// }
