import { Request, Response } from 'express';
import { MatchesService } from '../services';

export default class MatchesController {
  private matches: MatchesService;

  constructor() {
    this.matches = new MatchesService();
  }

  public async getAll(_req: Request, res: Response) {
    const allMatches = await this.matches.getAll();

    return res.status(200).json(allMatches);
  }

  public async findByProgress(req: Request, res: Response) {
    let progress = req.query.inProgress;
    if (progress === undefined) progress = '0';
    progress = progress.toString();

    const matches = await this.matches.findByProgress(progress);

    return res.status(200).json(matches);
  }
}
