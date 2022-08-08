import {Router} from 'express';
import tag from './tag';
import category from './category';

const router = Router();

router.use('/tag', tag);
router.use('/category', category);

export default router;