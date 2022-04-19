import { Router } from 'express';
import loginValidation from '../middlewares/LoginValidations';
import { UsersController } from '../controllers';
import TokenValidation from '../middlewares/TokenValidation';

const router = Router();

const userController = new UsersController();

router.post(
  '/',
  loginValidation,
  async (req, res) =>
    userController.login(req, res),
);

router.get(
  '/validate',
  TokenValidation,
  async (req, res) =>
    UsersController.getRole(req, res),
);

export default router;
