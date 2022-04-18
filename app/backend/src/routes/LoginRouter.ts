import { Router } from 'express';
import { UsersController } from '../controllers';

const router = Router();

const userController = new UsersController();

router.post(
  '/',
  async (req, res) =>
    userController.login(req, res),
);

export default router;
