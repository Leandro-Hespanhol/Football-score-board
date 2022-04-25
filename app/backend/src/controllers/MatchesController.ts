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

      const matches = await this.matches.findByProgress(inProgress);

      return res.status(200).json(matches);
    }

    const allMatches = await this.matches.getAll();
    return res.status(200).json(allMatches);
  }

  public async createMatch(req: Request, res: Response) {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
    console.log('REQ BODY CONTROLLER', req.body);
    const newMatch = await this.matches
      .createMatch({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress });

    if (!newMatch) return res.status(401).json({ message: 'Team not found' });

    res.status(200).json(newMatch);
  }
}
