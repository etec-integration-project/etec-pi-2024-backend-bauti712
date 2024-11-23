import express from 'express';
import { registrar, iniciarSesion, listarUsuarios } from '../controlers/controladorDeUsuarios.js';
import { pool } from '../database.js'; // Asegúrate de importar correctamente tu conexión a la base de datos.

const creacionUsuarios = express.Router();

// Endpoints relacionados con usuarios
creacionUsuarios.post('/registrar', registrar);
creacionUsuarios.post('/iniciar-sesion', iniciarSesion);
creacionUsuarios.get('/usuarios', listarUsuarios);

// Ruta para obtener los productos desde la base de datos
creacionUsuarios.get('/productos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json({ products: rows });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// Ruta para crear un nuevo producto en la base de datos
creacionUsuarios.post('/productos', async (req, res) => {
    const { productName, price, productUrl } = req.body;

    // Validación simple de los datos recibidos
    if (!productName || !price || !productUrl) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO products (nombre, precio, imagen, descripcion) VALUES (?, ?, ?, ?)',
            [productName, price, productUrl, 'Descripción generada automáticamente.']
        );

        const newProduct = {
            id: result.insertId,
            nombre: productName,
            precio: parseFloat(price),
            imagen: productUrl,
            descripcion: 'Descripción generada automáticamente.',
        };

        res.status(201).json({
            message: 'Producto creado exitosamente.',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error al insertar producto:', error);
        res.status(500).json({ message: 'Error al insertar producto' });
    }
});

export default creacionUsuarios;
