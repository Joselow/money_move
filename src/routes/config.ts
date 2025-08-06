import { Router, Request, Response } from 'express';
import { getSelectedAccount, updateSelectedAccount } from '../services/userConfigService.js';
import { hasAtLeastTwoAccounts } from '../services/accountService.js';
import { success } from '../utils/responses.js';
import { catchErrors } from '../utils/catchErrors.js';
import { InvalidCredentialsError401 } from '../errors/InvalidCredentialsError401.js';

const router = Router();

router.get('/', catchErrors (async (req: Request, res: Response) => {
    if (!req.user) {
        throw new InvalidCredentialsError401()
    }
    
    const account = await getSelectedAccount(req.user.id);
    const hasMultipleAccounts = await hasAtLeastTwoAccounts(req.user.id);
    
    success(res, 200, {
        account,
        hasMultipleAccounts,
    })
}));

// PUT permite actualizar el id de la cuenta seleccionada
router.put('/selected-account', catchErrors(async (req: Request, res: Response) => {
    const { accountId } = req.body;
   
    const userId = parseInt(req.user.id);
    // llama a servicio que actualiza el id de la cuenta seleccionada
    await updateSelectedAccount(userId, accountId);
    success(res, 200, { message: 'Cuenta seleccionada actualizada correctamente' })
}));

export default router; 