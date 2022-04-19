import { Router } from 'express';
import loginRouter from './LoginRouter';
import teamsRouter from './TeamsRouter';

const router = Router();

router.use('/login', loginRouter);
router.use('/teams', teamsRouter);

export default router;
