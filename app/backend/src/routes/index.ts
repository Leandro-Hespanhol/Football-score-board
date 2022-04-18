import { Router } from 'express';
import loginRouter from './LoginRouter';

const router = Router();

router.use('/login', loginRouter);

export default router;
