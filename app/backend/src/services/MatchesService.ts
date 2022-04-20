import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import { IMatches, IMatchesCreate } from '../interfaces/IMatches';

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
      .findAll({ where: { inProgress: param === 'false' ? '0' : '1' },
        include:
          [{ model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
            { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] }],
      });

    return inProgress;
  }

  public async createMatch({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }: IMatchesCreate) {
    const newMatch = await this.matchesModel
      .create({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress: true });
    console.log('MATCHES SERVICE', newMatch);

    return newMatch;
  }
}
