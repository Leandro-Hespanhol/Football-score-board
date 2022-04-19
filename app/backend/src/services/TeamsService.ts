import Teams from '../database/models/TeamsModel';

export default class TeamsService {
  private model = Teams;

  public async getAll() {
    const allTeams = await this.model.findAll();

    return allTeams;
  }

  public async getByPk(id: number) {
    const team = await this.model.findByPk(id);

    return team;
  }
}
