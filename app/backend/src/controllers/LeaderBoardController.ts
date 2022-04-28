import { Request, Response } from 'express';
import { LeaderBoardService } from '../services';

export default class LeaderBoardController {
  private LB: LeaderBoardService;

  constructor() {
    this.LB = new LeaderBoardService();
  }

  public async getAll(_req: Request, res: Response) {
    // const leaderBoard = await this.leaderBoard.leaderBoard;
    const sorted = (await this.LB.leaderBoard).sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => {
        if (a.totalVictories === b.totalVictories) {
          return b.goalsBalance - a.goalsBalance;
        } return 1;
      })
      .sort((a, b) => {
        if ((a.goalsBalance === b.goalsBalance) && (a.totalVictories === b.totalVictories)) {
          return b.goalsFavor - a.goalsFavor;
        } return 1;
      })
      .sort((a, b) => {
        if ((a.goalsBalance === b.goalsBalance) && (a.goalsFavor === b.goalsFavor)
        && (a.totalVictories === b.totalVictories)) {
          return b.goalsOwn - a.goalsOwn;
        } return 1;
      });

    res.status(200).json(sorted);
  }
}
