import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';

export default class MatchesService {
  private matchesModel = Matches;

  public async getAll() {
    const matches = await this.matchesModel
      .findAll({
        include:
          [{ model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
            { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] }],
      });
    console.log('MATCHES SERVICES', matches);
    return matches;
  }
}
