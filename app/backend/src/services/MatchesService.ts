import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';

export default class MatchesService {
  private matchesModel = Matches;

  private teamsModel = Teams;

  public async getAll() {
    const matches = await this.matchesModel
      .findAll({
        include:
          [{ model: this.teamsModel, as: 'teamHome', attributes: [['team_name', 'teamName']] },
            { model: this.teamsModel, as: 'teamAway', attributes: [['team_name', 'teamName']] }],
      });
    console.log('MATCHES SERVICES', matches);
    return matches;
  }
}
