import { Router } from 'express';
import { getCategories } from '../services/categoryService.js';
import { TRANSACTION_TYPE } from '../constants/transaction.js';

const router = Router();

//Obtener todas las categorias
router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const { type } = req.query

    if (type != null && (type !== TRANSACTION_TYPE.INFLOW && type !== TRANSACTION_TYPE.OUTFLOW)) {
        return res.status(400).json({ error: 'El tipo de categoria no es valido' });
    }


    const categories = await getCategories(type);
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



export default router; 