import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../services/userService.js';
import { authenticateToken } from '../middleware/auth.js';
import { catchErrors } from '../utils/catchErrors';
import { success } from '../utils/responses';
import { InvalidCredentialsError401 } from '../errors/InvalidCredentialsError401';
import { BadRequestError400 } from '../errors/BadRequestError';
import { NotFoundError404 } from '../errors/NotFoundError404';

const router = Router();

// GET /users - Obtener todos los usuarios (protegido)
router.get('/', authenticateToken, catchErrors(async (req, res) => {
  const users = await getAllUsers();
  success(res, 200, users);
}));

// GET /users/:id - Obtener un usuario por ID (protegido)
router.get('/:id', authenticateToken, catchErrors(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError400('ID inválido');
  }
  const user = await getUserById(id);
  if (!user) {
    throw new NotFoundError404('Usuario no encontrado');
  }
  success(res, 200, user);
}));

// POST /users - Crear un nuevo usuario
router.post('/', catchErrors(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError400('Faltan campos requeridos');
  }
  const newUser = await createUser({
    name,
    email,
    password, // Nota: En producción deberías hashear la contraseña
  });
  success(res, 201, newUser);
}));

// PUT /users/:id - Actualizar un usuario (protegido)
router.put('/:id', authenticateToken, catchErrors(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError400('ID inválido');
  }
  const { name, email, password } = req.body;
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password;
  const updatedUser = await updateUser(id, updateData);
  if (!updatedUser) {
    throw new NotFoundError404('Usuario no encontrado');
  }
  success(res, 200, updatedUser);
}));

// DELETE /users/:id - Eliminar un usuario (protegido)
router.delete('/:id', authenticateToken, catchErrors(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError400('ID inválido');
  }
  const deleted = await deleteUser(id);
  if (!deleted) {
    throw new NotFoundError404('Usuario no encontrado');
  }
  success(res, 204, { success: true });
}));

export default router; 