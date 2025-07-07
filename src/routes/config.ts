import { Router, Request, Response } from 'express';
import { getSelectedAccount } from '../services/InitialDataService';
import { hasAtLeastTwoAccounts } from '../services/accountService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
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

export default router; 