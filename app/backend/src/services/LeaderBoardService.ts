import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import ILeaderBoard from '../interfaces/ILeaderBoard';

export default class LeaderBoard {
  private matchesModel = Matches;

  private teamsModel = Teams;

  protected _leaderBoard: Promise<ILeaderBoard[]>;

  protected _homeLeaderBoard: Promise<ILeaderBoard[]>;

  protected _awayLeaderBoard: Promise<ILeaderBoard[]>;

  constructor() {
    this._leaderBoard = this.mountTeamsTable();
    this._homeLeaderBoard = this.mountTeamsTable();
    this._awayLeaderBoard = this.mountTeamsTable();
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
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    }
    ));
    return teamsTable;
  }

  private async endedMatches() {
    return this.matchesModel.findAll({ where: { inProgress: false } });
  }

  private async goalsBalance(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      const teams = (await (leaderBoard))
        .find((team) => match.homeTeam === team.id);
      if (!teams) return null;
      teams.goalsBalance = (teams.goalsFavor - teams.goalsOwn);
      console.log(teams.name, teams.goalsBalance);
    });
  }

  private async drawHomeMatch(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const drawHomeTeam = (await (leaderBoard))
          .find((homeTeam) => match.homeTeam === homeTeam.id);
        if (!drawHomeTeam) return null;
        drawHomeTeam.goalsFavor += match.homeTeamGoals;
        drawHomeTeam.goalsOwn += match.awayTeamGoals;
        drawHomeTeam.totalDraws += 1;
        drawHomeTeam.totalGames += 1;
        drawHomeTeam.totalPoints += 1;
      }
    });
  }

  private async drawAwayMatch(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const drawAwayTeam = (await (leaderBoard))
          .find((awayTeam) => match.awayTeam === awayTeam.id);
        if (!drawAwayTeam) return null;
        drawAwayTeam.goalsFavor += match.awayTeamGoals;
        drawAwayTeam.goalsOwn += match.homeTeamGoals;
        drawAwayTeam.totalDraws += 1;
        drawAwayTeam.totalGames += 1;
        drawAwayTeam.totalPoints += 1;
      }
    });
  }

  private async homeWinner(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const victoryResults = (await (leaderBoard))
          .find((winner) => match.homeTeam === winner.id);
        if (!victoryResults) return null;
        victoryResults.goalsFavor += match.homeTeamGoals;
        victoryResults.goalsOwn += match.awayTeamGoals;
        victoryResults.totalVictories += 1;
        victoryResults.totalGames += 1;
        victoryResults.totalPoints += 3;
      }
    });
  }

  private async homeLoser(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const lossResults = (await (leaderBoard))
          .find((loser) => match.homeTeam === loser.id);
        if (!lossResults) return null;
        lossResults.totalLosses += 1;
        lossResults.totalGames += 1;
        lossResults.goalsFavor += match.homeTeamGoals;
        lossResults.goalsOwn += match.awayTeamGoals;
      }
    });
  }

  private async awayWinner(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const victoryReward = (await (leaderBoard))
          .find((winner) => match.awayTeam === winner.id);
        if (!victoryReward) return null;
        victoryReward.goalsFavor += match.awayTeamGoals;
        victoryReward.goalsOwn += match.homeTeamGoals;
        victoryReward.totalVictories += 1;
        victoryReward.totalGames += 1;
        victoryReward.totalPoints += 3;
      }
    });
  }

  private async awayLoser(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const lossResults = (await (leaderBoard))
          .find((loser) => match.awayTeam === loser.id);
        if (!lossResults) return null;
        lossResults.totalLosses += 1;
        lossResults.totalGames += 1;
        lossResults.goalsFavor += match.awayTeamGoals;
        lossResults.goalsOwn += match.homeTeamGoals;
      }
    });
  }

  private async efficiency(leaderBoard: Promise<ILeaderBoard[]>) {
    (await this.endedMatches()).forEach(async (match) => {
      const teamStatistics = (await (leaderBoard))
        .find((elem) => elem.id === match.homeTeam);

      if (!teamStatistics) return null;

      const operation = (
        (teamStatistics.totalPoints / (teamStatistics.totalGames * 3)) * 100);
      teamStatistics.efficiency = Number(operation.toFixed(2));
    });
  }

  static async sortLeaderBoard(leaderBoard: Promise<ILeaderBoard[]>) {
    (await leaderBoard).sort((a, b) => b.totalPoints - a.totalPoints)
      .sort((a, b) => {
        if (a.totalPoints === b.totalPoints) {
          return b.totalVictories - a.totalVictories;
        } return 1;
      }).sort((a, b) => {
        if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)) {
          return b.goalsBalance - a.goalsBalance;
        } return 1;
      }).sort((a, b) => {
        if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance)) {
          return b.goalsFavor - a.goalsFavor;
        } return 1;
      });
  }

  static async sortLeaderBoardTwo(leaderBoard: Promise<ILeaderBoard[]>) {
    (await leaderBoard).sort((a, b) => {
      if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance) && (a.goalsFavor === b.goalsFavor)) {
        return b.goalsOwn - a.goalsOwn;
      } return 1;
    });
  }

  private async resetTables() {
    this._awayLeaderBoard = this.mountTeamsTable();
    this._homeLeaderBoard = this.mountTeamsTable();
    this._leaderBoard = this.mountTeamsTable();
  }

  public async getScore() {
    await this.resetTables();
    await Promise.all([
      await this.homeWinner(this._leaderBoard),
      await this.homeLoser(this._leaderBoard),
      await this.awayWinner(this._leaderBoard),
      await this.awayLoser(this._leaderBoard),
      await this.drawHomeMatch(this._leaderBoard),
      await this.drawAwayMatch(this._leaderBoard),
      await this.goalsBalance(this._leaderBoard),
      await this.efficiency(this._leaderBoard),
    ]);
    await LeaderBoard.sortLeaderBoard(this._leaderBoard);
    await LeaderBoard.sortLeaderBoardTwo(this._leaderBoard);
    (await this._leaderBoard).forEach((elem) => {
      const toDelete = elem;
      delete toDelete.id;
    });
    return this._leaderBoard;
  }

  public async getHomeScore() {
    await this.resetTables();
    await Promise.all([
      await this.homeWinner(this._homeLeaderBoard),
      await this.homeLoser(this._homeLeaderBoard),
      await this.drawHomeMatch(this._homeLeaderBoard),
      await this.goalsBalance(this._homeLeaderBoard),
      await this.efficiency(this._homeLeaderBoard),
    ]);
    await LeaderBoard.sortLeaderBoard(this._homeLeaderBoard);
    await LeaderBoard.sortLeaderBoardTwo(this._homeLeaderBoard);
    (await this._homeLeaderBoard).forEach((elem) => {
      const toDelete = elem;
      delete toDelete.id;
    });
    return this._homeLeaderBoard;
  }

  public async getAwayScore() {
    await this.resetTables();
    await Promise.all([
      await this.awayWinner(this._awayLeaderBoard),
      await this.awayLoser(this._awayLeaderBoard),
      await this.drawAwayMatch(this._awayLeaderBoard),
      await this.goalsBalance(this._awayLeaderBoard),
      await this.efficiency(this._awayLeaderBoard),
    ]);
    await LeaderBoard.sortLeaderBoard(this._awayLeaderBoard);
    await LeaderBoard.sortLeaderBoardTwo(this._awayLeaderBoard);
    (await this._awayLeaderBoard).forEach((elem) => {
      const toDelete = elem;
      delete toDelete.id;
    });
    return this._awayLeaderBoard;
  }
}
