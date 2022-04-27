import { Request, Response } from 'express';
import { LeaderBoardService } from '../services';

export default class LeaderBoardController {
  private leaderBoard: LeaderBoardService;

  constructor() {
    this.leaderBoard = new LeaderBoardService();
  }

  public async getAll(_req: Request, res: Response) {
    const leaderBoard = await this.leaderBoard.getScore();

    res.status(200).json(leaderBoard);
  }
}
