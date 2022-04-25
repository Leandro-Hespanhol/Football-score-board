import { Router } from 'express';
import TokenValidation from '../middlewares/TokenValidation';
import MatchesController from '../controllers/MatchesController';
import MatchesValidations from '../middlewares/MatchesValidations';

const router = Router();

const matchesController = new MatchesController();

router.get(
  '/',
  async (req, res) =>
    matchesController.getAll(req, res),
);

router.post(
  '/',
  TokenValidation,
  MatchesValidations,
  async (req, res) =>
    matchesController.createMatch(req, res),
);

router.patch(
  '/:id',
  async (req, res) =>
    matchesController.editMatch(req, res),
);

export default router;
