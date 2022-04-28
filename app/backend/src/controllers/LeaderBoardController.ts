import { Request, Response } from 'express';
import { LeaderBoardService } from '../services';

export default class LeaderBoardController {
  private leaderBoard: LeaderBoardService;

  constructor() {
    this.leaderBoard = new LeaderBoardService();
  }

  public async getAll(_req: Request, res: Response) {
    const leaderBoard = await this.leaderBoard.getScore();
    const sorted = leaderBoard.sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => {
        if (a.goalsBalance === b.goalsBalance) {
          return b.goalsBalance - a.goalsBalance;
        } return 1;
      })
      .sort((a, b) => {
        if (a.goalsFavor === b.goalsFavor) {
          return b.goalsFavor - a.goalsFavor;
        } return 1;
      })
      .sort((a, b) => {
        if (a.goalsOwn === b.goalsOwn) {
          return b.goalsOwn - a.goalsOwn;
        } return 1;
      });

    res.status(200).json(sorted);
  }
}
