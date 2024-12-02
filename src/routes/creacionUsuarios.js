import express from 'express';
import { registrar, iniciarSesion, listarUsuarios, verificarSesion } from '../controlers/controladorDeUsuarios.js';

const creacionUsuarios = express.Router();

// Endpoints relacionados con usuarios
creacionUsuarios.post('/registrar', registrar);
creacionUsuarios.post('/iniciar-sesion', iniciarSesion);
creacionUsuarios.get('/usuarios', listarUsuarios);
creacionUsuarios.get('/verificar-sesion', verificarSesion);

// Simulando un array de productos en memoria
const products = [
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
];

// Ruta para obtener los productos
creacionUsuarios.get('/productos', (req, res) => {
    res.json({ products });
});

// Ruta para crear un nuevo producto
creacionUsuarios.post('/productos', (req, res) => {
    const { productName, price, productUrl } = req.body;

    // Validación simple de los datos recibidos
    if (!productName || !price || !productUrl) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Agregar un nuevo producto al array
    const newProduct = {
        id: products.length + 1,
        imagen: productUrl,
        nombre: productName,
        descripcion: "Descripción generada automáticamente.",
        precio: parseFloat(price),
    };

    products.push(newProduct);

    res.status(201).json({
        message: 'Producto creado exitosamente.',
        product: newProduct,
    });
});

export default creacionUsuarios;
