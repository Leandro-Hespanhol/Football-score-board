import { Router } from 'express';
import { LeaderBoardController } from '../controllers';

const router = Router();

const leaderBoard = new LeaderBoardController();

router.get(
  '/',
  async (req, res) =>
    leaderBoard.getAll(req, res),
);

router.get(
  '/home',
  async (req, res) =>
    leaderBoard.getHomeLeaderBoard(req, res),
);

router.get(
  '/away',
  async (req, res) =>
    leaderBoard.getAwayLeaderBoard(req, res),
);

export default router;
