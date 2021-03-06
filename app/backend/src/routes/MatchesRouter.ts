import { Router } from 'express';
import { MatchesController } from '../controllers';
import TokenValidation from '../middlewares/TokenValidation';
// import MatchesValidations from '../middlewares/MatchesValidations';

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
  // MatchesValidations,
  async (req, res) =>
    matchesController.createMatch(req, res),
);

router.patch(
  '/:id',
  async (req, res) =>
    matchesController.editMatch(req, res),
);

router.patch(
  '/:id/finish',
  async (req, res) =>
    matchesController.finishMatch(req, res),
);

export default router;
