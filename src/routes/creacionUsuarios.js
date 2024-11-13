import express from 'express';
import { registrar, iniciarSesion, listarUsuarios } from '../controlers/controladorDeUsuarios.js';

const creacionUsuarios = express.Router();

creacionUsuarios.post('/registrar', registrar);
creacionUsuarios.post('/iniciar-sesion', iniciarSesion);
creacionUsuarios.get('/usuarios', listarUsuarios);  
creacionUsuarios.get('/productos', res.json({
    products: [
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
}))

export default creacionUsuarios;
