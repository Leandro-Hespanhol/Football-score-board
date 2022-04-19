import { Request, Response } from 'express';
import { MatchesService } from '../services';

export default class MatchesController {
  private matches: MatchesService;

  constructor() {
    this.matches = new MatchesService();
  }

  public async getAll(_req: Request, res: Response) {
    const allMatches = this.matches.getAll();

    return res.status(200).json(allMatches);
  }
}
