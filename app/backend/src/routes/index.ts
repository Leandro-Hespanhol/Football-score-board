import { Router } from 'express';
import loginRouter from './LoginRouter';
import teamsRouter from './TeamsRouter';
import matchesRouter from './MatchesRouter';
import LeaderBoardRouter from './LeaderBoardRouter';

const router = Router();

router.use('/login', loginRouter);
router.use('/teams', teamsRouter);
router.use('/matches', matchesRouter);
router.use('/leaderboard', LeaderBoardRouter);

export default router;
