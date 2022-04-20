import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import IMatches from '../interfaces/IMatches';

export default class MatchesService {
  private matchesModel = Matches;

  public async getAll(): Promise<IMatches[]> {
    const matches = await this.matchesModel
      .findAll({
        include:
          [{ model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
            { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] }],
      });

    return matches;
  }

  public async findByProgress(param: string): Promise<IMatches[]> {
    const inProgress = await this.matchesModel
      .findAll({ where: { inProgress: param === '0' ? '0' : '1' },
        include:
          [{ model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
            { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] }],
      });

    return inProgress;
  }
}
