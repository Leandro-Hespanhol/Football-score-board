import { Router } from 'express';
import { TeamsController } from '../controllers';

const router = Router();

const teamsController = new TeamsController();

router.get(
  '/',
  async (req, res) =>
    teamsController.getAll(req, res),
);

export default router;
