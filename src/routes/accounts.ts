import { Router } from 'express';
import { getAccountsByUserId, getAccountById, deleteAccount, createAccount } from '../services/accountService.js';

const router = Router();

// GET /accounts/user/:userId - Obtener todas las cuentas de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
    const accounts = await getAccountsByUserId(userId);
    res.json(accounts);
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /accounts/:id - Obtener una cuenta por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de cuenta inválido' });
    }
    const account = await getAccountById(id);
    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }
    res.json(account);
  } catch (error) {
    console.error('Error al obtener cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /accounts/:id - Eliminar una cuenta
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de cuenta inválido' });
    }
    const deleted = await deleteAccount(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /accounts - Crear una nueva cuenta
router.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const { name, currency, initialBalance, totalBalance, description } = req.body;
    if (!name || !currency) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const newAccount = await createAccount({
      name,
      currency,
      initialBalance: initialBalance ?? '0',
      totalBalance: totalBalance ?? '0',
      description,
      userId: req.user.id,
    });
    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router; 