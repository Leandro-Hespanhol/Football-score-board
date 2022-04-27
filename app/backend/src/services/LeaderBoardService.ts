import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import ILeaderBoard from '../interfaces/ILeaderBoard';

export default class LeaderBoard {
  private matchesModel = Matches;

  private teamsModel = Teams;

  protected _leaderBoard: Promise<ILeaderBoard[]>;

  private _victories: number;

  constructor() {
    this._leaderBoard = this.mountTeamsTable();
  }

  public async mountTeamsTable() {
    const teams = await this.teamsModel.findAll();
    const teamsTable = teams.map((team) => ({
      id: team.id,
      name: team.teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goasOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    }
    ));
    return teamsTable;
  }

  // public async generalBoardUpdate(team1, team2) {

  // }

  public async getScore() {
    // attempt 3
    // const teams = await this.teamsModel.findAll();
    // const playing = teams.map(async (team) => (
    //   (await (this.matchesModel))
    //     .findAll({ where: { inProgress: false, homeTeam: team.id } })
    // ));

    const endedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    endedMatches.forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        // attempt 2
        // (await (this._leaderBoard))
        //   .find((winner) => match.homeTeam === winner.id)
        //   .totalVictories += 1;
        // // attempt 1
        // console.log(match.homeTeam);
        const victories = (await (this._leaderBoard))
          .find((winner) => match.homeTeam === winner.id);
          // .reduce((acc, curr) => curr.totalVictories + 1, 0);
        if (!victories) return null;
        victories.totalVictories += 1;
        // console.log('team', victories);
        return [this._leaderBoard, victories];
      }
      return this._leaderBoard;
    });
    // console.log(this._leaderBoard);
    return this._leaderBoard;
  }
}
