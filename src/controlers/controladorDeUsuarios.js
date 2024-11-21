import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const registrar = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(409).send('Usuario existente');
        }

        const passwordHashed = await bcrypt.hash(password, 8);
        const [results] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwordHashed]);

        // Crear el token JWT
        const cookie_jwt = jwt.sign({ id: results.insertId, username }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Expira en 1 hora
        });

        // Configurar y enviar la cookie
        res.cookie('bauti712-cookie', cookie_jwt, {
            httpOnly: true, // No accesible desde JavaScript
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'strict', // Evita envío desde sitios externos
            maxAge: 3600000, // 1 hora en milisegundos
        });

        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};

export const iniciarSesion = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const usuario = rows[0];
        const esContrasenaValida = await bcrypt.compare(password, usuario.password);

        if (!esContrasenaValida) {
            return res.status(401).send('Contraseña inválida');
        }

        // Crear el token JWT
        const token = jwt.sign({ id: usuario.id, username }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Expira en 1 hora
        });

        // Configurar y enviar la cookie
        res.cookie('bauti712-cookie', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });

        res.status(200).send('Inicio de sesión exitoso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al iniciar sesión');
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username FROM users');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al listar usuarios');
    }
};
