import { Router, Request, Response } from 'express';
import { getSelectedAccount, updateSelectedAccount } from '../services/userConfigService';
import { hasAtLeastTwoAccounts } from '../services/accountService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autorizado' });
      }
    try {
        console.log(req.user);
        
        const account = await getSelectedAccount(req.user.id);
        const hasMultipleAccounts = await hasAtLeastTwoAccounts(req.user.id);
    
        res.json({
            account,
            hasMultipleAccounts,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la configuración',
        });
    }
});

// PUT permite actualizar el id de la cuenta seleccionada
router.put('/selected-account', async (req: Request, res: Response) => {
    const { accountId } = req.body;
    try {
        const userId = parseInt(req.user.id);
        // llama a servicio que actualiza el id de la cuenta seleccionada
        await updateSelectedAccount(userId, accountId);
        res.json({ success: true, message: 'Cuenta seleccionada actualizada correctamente' });
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la cuenta seleccionada',
        });
    }
});

export default router; 