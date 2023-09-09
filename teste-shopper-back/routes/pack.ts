import express from 'express';
import {
    addController,
    updateController,
    findController,
    listController,
    deleteController,
} from '../controllers/pack'

const router = express.Router();

router.post('/', addController);
router.get('/', listController);
router.get('/:id', findController);
router.put('/:id', updateController);
router.delete('/:id', deleteController);

export default router;
