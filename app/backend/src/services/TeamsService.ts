import Teams from '../database/models/TeamsModel';

export default class TeamsService {
  private model = Teams;

  public async getAll() {
    const allTeams = await this.model.findAll();

    return allTeams;
  }
}
