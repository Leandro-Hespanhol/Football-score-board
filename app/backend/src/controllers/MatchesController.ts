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
    const match = req.body;

    const newMatch = await this.matches
      .createMatch(match);

    if (!newMatch) return res.status(404).json({ message: 'There is no team with such id!' });
    if (newMatch === 'Equal Teams') {
      return res.status(401)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    res.status(201).json(newMatch);
  }

  public async editMatch(req: Request, res: Response) {
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { id } = req.params;
    try {
      const updatedMatch = await this.matches.editMatch({ id, homeTeamGoals, awayTeamGoals });

      if (!updatedMatch) res.status(400).json({ message: 'Something wrong happened' });

      return res.status(200).json(updatedMatch);
    } catch (error) {
      console.error(error);
    }
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const finishMatch = await this.matches.finishMatch({ id });
      if (!finishMatch) res.status(400).json({ message: 'Something wrong happened' });
      return res.status(200).json(finishMatch);
    } catch (error) {
      console.error(error);
    }
  }
}
