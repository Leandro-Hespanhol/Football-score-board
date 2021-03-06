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

  public async createMatch(match: IMatchesCreate) {
    try {
      const { homeTeam, awayTeam } = match;
      if (homeTeam && awayTeam && (homeTeam === awayTeam)) {
        return 'Equal Teams';
      }
      const newMatch = await this.matchesModel
        .create(match);

      return newMatch;
    } catch (e) {
      return null;
    }
  }

  public async editMatch({ id, homeTeamGoals, awayTeamGoals }:IMatchesPatchGoals) {
    await this.matchesModel.update(
      { homeTeamGoals: Number(homeTeamGoals), awayTeamGoals: Number(awayTeamGoals) },
      { where: { id: Number(id) } },
    );
    const updated = await this.matchesModel.findOne({ where: { id, inProgress: 1 } });
    if (!updated) return null;

    return updated;
  }

  public async finishMatch({ id }: IMatchesFinish) {
    await this.matchesModel.update(
      { inProgress: 0 },
      { where: { id } },
    );
    const updated = await this.matchesModel.findOne({ where: { id } });
    if (!updated) return null;

    return updated;
  }
}
