import express from 'express';
import { registrar, iniciarSesion, listarUsuarios } from '../controlers/controladorDeUsuarios.js';

const creacionUsuarios = express.Router();

creacionUsuarios.post('/registrar', registrar);
creacionUsuarios.post('/iniciar-sesion', iniciarSesion);
creacionUsuarios.get('/usuarios', listarUsuarios);  

export default creacionUsuarios;
