import { Router } from 'express';
import loginValidation from '../middlewares/LoginValidations';
import { UsersController } from '../controllers';
import TokenValidation from '../middlewares/TokenValidation';

const router = Router();

const userController = new UsersController();

router.post(
  '/',
  loginValidation,
  TokenValidation,
  async (req, res) =>
    userController.login(req, res),
);

export default router;
