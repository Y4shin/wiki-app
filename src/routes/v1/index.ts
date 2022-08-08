import {Router} from 'express';
import user from './user';
import wiki from './wiki';

const router = Router();

router.use('/user', user);
router.use('/wiki', wiki);

export default router;