import { Router } from 'express';
import { LeaderBoardController } from '../controllers';

const router = Router();

const leaderBoard = new LeaderBoardController();

router.get(
  '/',
  async (req, res) =>
    leaderBoard.getAll(req, res),
);

export default router;
