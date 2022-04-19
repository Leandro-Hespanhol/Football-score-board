import { Router } from 'express';
import loginRouter from './LoginRouter';
import teamsRouter from './TeamsRouter';
import matchesRouter from './MatchesRouter';

const router = Router();

router.use('/login', loginRouter);
router.use('/teams', teamsRouter);
router.use('/matches', matchesRouter);

export default router;
