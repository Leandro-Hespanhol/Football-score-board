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

  private async homeWinner() {
    const endedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    endedMatches.forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const victoryReward = (await (this._leaderBoard))
          .find((winner) => match.homeTeam === winner.id);
        if (!victoryReward) return null;
        victoryReward.totalVictories += 1;
        victoryReward.totalGames += 1;
        victoryReward.totalPoints += 3;
      }
      const loserPenalty = (await (this._leaderBoard))
        .find((loser) => match.awayTeam === loser.id);
      if (!loserPenalty) return null;
      loserPenalty.totalLosses += 1;
    });
  }

  private async awayWinner() {
    const endedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    endedMatches.forEach(async (match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const victoryReward = (await (this._leaderBoard))
          .find((winner) => match.awayTeam === winner.id);
        if (!victoryReward) return null;
        victoryReward.totalVictories += 1;
        victoryReward.totalGames += 1;
        victoryReward.totalPoints += 3;

        const loserPenalty = (await (this._leaderBoard))
          .find((loser) => match.homeTeam === loser.id);
        if (!loserPenalty) return null;
        loserPenalty.totalLosses += 1;
      }
    });
  }

  public async getScore() {
    this._leaderBoard = this.mountTeamsTable();
    await this.homeWinner();
    await this.awayWinner();

    return this._leaderBoard;
  }
}
