import { Request, Response } from 'express';
import { LeaderBoardService } from '../services';

export default class LeaderBoardController {
  private LB: LeaderBoardService;

  constructor() {
    this.LB = new LeaderBoardService();
  }

  public async getAll(_req: Request, res: Response) {
    const leaderBoard = (await this.LB.getScore());

    res.status(200).json(leaderBoard);
  }

  public async getHomeLeaderBoard(_req: Request, res: Response) {
    const homeLeaderBoard = (await this.LB.getHomeScore());

    res.status(200).json(homeLeaderBoard);
  }

  public async getAwayLeaderBoard(_req: Request, res: Response) {
    const awayLeaderBoard = (await this.LB.getAwayScore());

    res.status(200).json(awayLeaderBoard);
  }
}
