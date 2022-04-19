import { Request, Response } from 'express';
import { TeamsService } from '../services';

export default class TeamsController {
  private service: TeamsService;

  constructor() {
    this.service = new TeamsService();
  }

  public async getAll(_req: Request, res: Response) {
    const allTeams = await this.service.getAll();

    return res.status(200).json(allTeams);
  }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;

    const team = await this.service.getByPk(Number(id));

    res.status(200).json(team);
  }
}
