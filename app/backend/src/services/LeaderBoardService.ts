import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import ILeaderBoard from '../interfaces/ILeaderBoard';
// import { IMatches } from '../interfaces/IMatches';

export default class LeaderBoard {
  private matchesModel = Matches;

  private teamsModel = Teams;

  protected _leaderBoard: Promise<ILeaderBoard[]>;

  // protected _endedMatches: Promise<IMatches[]>;

  constructor() {
    // this._endedMatches = this.endedMatches;
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

  // private async endedMatches() {
  //   return this.matchesModel
  //     .findAll({ where: { inProgress: false } });
  // }

  private async drawMatch() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const drawHomeTeam = (await (this._leaderBoard))
          .find((homeTeam) => match.homeTeam === homeTeam.id);
        if (!drawHomeTeam) return null;
        drawHomeTeam.totalDraws += 1;
        drawHomeTeam.totalGames += 1;
        drawHomeTeam.totalPoints += 1;

        const drawAwayTeam = (await (this._leaderBoard))
          .find((awayTeam) => match.awayTeam === awayTeam.id);
        if (!drawAwayTeam) return null;
        drawAwayTeam.totalDraws += 1;
        drawAwayTeam.totalGames += 1;
        drawAwayTeam.totalPoints += 1;
      }
    });
  }

  private async homeWinner() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
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
      loserPenalty.totalGames += 1;
    });
  }

  private async awayWinner() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
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
        loserPenalty.totalGames += 1;
      }
    });
  }

  public async getScore() {
    this._leaderBoard = this.mountTeamsTable();
    await this.homeWinner();
    await this.awayWinner();
    await this.drawMatch();

    return this._leaderBoard;
  }
}
