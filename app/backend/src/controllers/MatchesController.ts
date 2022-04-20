import { Request, Response } from 'express';
import { MatchesService } from '../services';

export default class MatchesController {
  private matches: MatchesService;

  constructor() {
    this.matches = new MatchesService();
  }

  public async getAll(req: Request, res: Response) {
    const progress = req.query.inProgress;

    if (progress !== undefined) {
      const inProgress = progress.toString();
      // console.log('CONTROLLER', inProgress);
      const matches = await this.matches.findByProgress(inProgress);

      return res.status(200).json(matches);
    }

    const allMatches = await this.matches.getAll();
    return res.status(200).json(allMatches);
  }
}
