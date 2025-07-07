import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../services/userService.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import { getSelectedAccount } from '../services/InitialDataService.js';
import { hasAtLeastTwoAccounts } from '../services/accountService.js';

const router = Router();

// POST /auth/register - Registrar un nuevo usuario
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Generar token JWT
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    });

    // Enviar respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /auth/login - Iniciar sesión
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario por email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    // Enviar respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// GET /auth/me - Obtener información del usuario actual
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    // El middleware de autenticación ya verificó el token
    // y agregó la información del usuario a req.user
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const response = {
      user: req.user,
      success: true,
    }

    res.json(response);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router; 