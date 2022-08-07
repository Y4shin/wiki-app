import {Router} from 'express';
import tags from './tag';
import user from './user';
import wiki from './wiki';
import category from './category';

const router = Router();

router.use('/tag', tags);
router.use('/user', user);
router.use('/wiki', wiki);
router.use('/category', category);

export default router;