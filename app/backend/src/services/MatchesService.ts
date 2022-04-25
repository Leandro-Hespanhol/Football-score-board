import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import { IMatches, IMatchesCreate, IMatchesFinish,
  IMatchesPatchGoals } from '../interfaces/IMatches';

export default class MatchesService {
  private matchesModel = Matches;

  private teamsModel = Teams;

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

  public async createMatch({ homeTeam, awayTeam, homeTeamGoals,
    awayTeamGoals, inProgress = '1' }: IMatchesCreate) {
    const homeTeamExistance = await this.teamsModel.findOne({ where: { id: Number(homeTeam) } });
    const awayTeamExistance = await this.teamsModel.findOne({ where: { id: Number(awayTeam) } });

    if (!homeTeamExistance || !awayTeamExistance) {
      return null;
    }
    const newMatch = await this.matchesModel
      .create({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress });

    return newMatch;
  }

  public async editMatch({ id, homeTeamGoals, awayTeamGoals }:IMatchesPatchGoals) {
    await this.matchesModel.update(
      { homeTeamGoals: Number(homeTeamGoals), awayTeamGoals: Number(awayTeamGoals) },
      { where: { id: Number(id) } },
    );
    const updated = await this.matchesModel.findOne({ where: { id, inProgress: '1' } });
    console.log('MATCHES SERVICE', updated);
    if (!updated) return null;

    return updated;
  }

  public async finishMatch({ id }: IMatchesFinish) {
    await this.matchesModel.update(
      { inProgress: '0' },
      { where: { id } },
    );
    const updated = await this.matchesModel.findOne({ where: { id } });
    if (!updated) return null;

    return updated;
  }
}
