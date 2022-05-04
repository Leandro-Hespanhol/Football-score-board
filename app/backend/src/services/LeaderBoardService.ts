import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import ILeaderBoard from '../interfaces/ILeaderBoard';

export default class LeaderBoard {
  private matchesModel = Matches;

  private teamsModel = Teams;

  protected _leaderBoard: ILeaderBoard[];

  protected _homeLeaderBoard: ILeaderBoard[];

  protected _awayLeaderBoard: ILeaderBoard[];

  constructor() {
    this.getScore();
    this.getHomeScore();
    this.getAwayScore();
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

  private async goalsBalance(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      const teams = ((leaderBoard))
        .find((team) => match.homeTeam === team.id);
      if (!teams) return null;
      teams.goalsBalance = (teams.goalsFavor - teams.goalsOwn);
    });
  }

  private async drawHomeMatch(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const drawHomeTeam = ((leaderBoard))
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

  private async drawAwayMatch(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const drawAwayTeam = ((leaderBoard))
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

  private async homeWinner(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const victoryResults = ((leaderBoard))
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

  private async homeLoser(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const lossResults = ((leaderBoard))
          .find((loser) => match.homeTeam === loser.id);
        if (!lossResults) return null;
        lossResults.totalLosses += 1;
        lossResults.totalGames += 1;
        lossResults.goalsFavor += match.homeTeamGoals;
        lossResults.goalsOwn += match.awayTeamGoals;
      }
    });
  }

  private async awayWinner(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const victoryReward = ((leaderBoard))
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

  private async awayLoser(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const lossResults = ((leaderBoard))
          .find((loser) => match.awayTeam === loser.id);
        if (!lossResults) return null;
        lossResults.totalLosses += 1;
        lossResults.totalGames += 1;
        lossResults.goalsFavor += match.awayTeamGoals;
        lossResults.goalsOwn += match.homeTeamGoals;
      }
    });
  }

  private async efficiency(leaderBoard: ILeaderBoard[]) {
    (await this.endedMatches()).forEach(async (match) => {
      const teamStatistics = ((leaderBoard))
        .find((elem) => elem.id === match.homeTeam);

      if (!teamStatistics) return null;

      const operation = (
        (teamStatistics.totalPoints / (teamStatistics.totalGames * 3)) * 100);
      teamStatistics.efficiency = Number(operation.toFixed(2));
    });
  }

  static sortLeaderBoard(leaderBoard: ILeaderBoard[]) {
    (leaderBoard).sort((a, b) => b.totalPoints - a.totalPoints)
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

  static sortLeaderBoardTwo(leaderBoard: ILeaderBoard[]) {
    (leaderBoard).sort((a, b) => {
      if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance) && (a.goalsFavor === b.goalsFavor)) {
        return b.goalsOwn - a.goalsOwn;
      } return 1;
    });
  }

  public async getScore() {
    // await this.resetTables();
    this._leaderBoard = await this.mountTeamsTable();
    await Promise.all([
      this.homeWinner(this._leaderBoard),
      this.homeLoser(this._leaderBoard),
      this.drawHomeMatch(this._leaderBoard),
      this.awayWinner(this._leaderBoard),
      this.awayLoser(this._leaderBoard),
      this.drawAwayMatch(this._leaderBoard),
    ]);
    await this.goalsBalance(this._leaderBoard);
    await this.efficiency(this._leaderBoard);
    LeaderBoard.sortLeaderBoard(this._leaderBoard);
    LeaderBoard.sortLeaderBoardTwo(this._leaderBoard);
    (this._leaderBoard).forEach((elem) => {
      const toDelete = elem;
      delete toDelete.id;
    });
    return this._leaderBoard;
  }

  public async getHomeScore() {
    this._homeLeaderBoard = await this.mountTeamsTable();
    await Promise.all([
      this.homeWinner(this._homeLeaderBoard),
      this.homeLoser(this._homeLeaderBoard),
      this.drawHomeMatch(this._homeLeaderBoard),
    ]);
    await this.goalsBalance(this._homeLeaderBoard);
    await this.efficiency(this._homeLeaderBoard);
    LeaderBoard.sortLeaderBoard(this._homeLeaderBoard);
    LeaderBoard.sortLeaderBoardTwo(this._homeLeaderBoard);
    (this._homeLeaderBoard).forEach((elem) => {
      const toDelete = elem;
      delete toDelete.id;
    });
    return this._homeLeaderBoard;
  }

  public async getAwayScore() {
    this._awayLeaderBoard = await this.mountTeamsTable();
    await Promise.all([
      this.awayWinner(this._awayLeaderBoard), this.awayLoser(this._awayLeaderBoard),
      this.drawAwayMatch(this._awayLeaderBoard),
    ]);
    await this.goalsBalance(this._awayLeaderBoard);
    await this.efficiency(this._awayLeaderBoard);
    LeaderBoard.sortLeaderBoard(this._awayLeaderBoard);
    LeaderBoard.sortLeaderBoardTwo(this._awayLeaderBoard);
    (this._awayLeaderBoard).forEach((elem) => {
      const toDelete = elem;
      delete toDelete.id;
    });
    return this._awayLeaderBoard;
  }
}
