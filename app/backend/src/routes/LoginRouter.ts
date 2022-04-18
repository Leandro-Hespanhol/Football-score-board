import { Router } from 'express';
import loginValidation from '../middlewares/LoginValidations';
import { UsersController } from '../controllers';

const router = Router();

const userController = new UsersController();

router.post(
  '/',
  loginValidation,
  async (req, res) =>
    userController.login(req, res),
);

export default router;
