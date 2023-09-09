import express from 'express';
import {
    addController,
    updateController,
    findController,
    listController,
    deleteController,
    listByCodesController,
} from '../controllers/product'

const router = express.Router();

router.post('/', addController);
router.get('/', listController);
router.get('/:codes', listByCodesController);
router.get('/:code', findController);
router.put('/:code', updateController);
router.delete('/:code', deleteController);

export default router;
