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
    this.getScore();
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

  // private async endedMatches() {
  //   return this.matchesModel
  //     .findAll({ where: { inProgress: false } });
  // }
  private async goalsBalance() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      const teams = (await (this._leaderBoard))
        .find((team) => match.homeTeam === team.id);
      if (!teams) return null;
      teams.goalsBalance = (teams.goalsFavor - teams.goalsOwn);
    });
  }

  private async drawHomeMatch() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const drawHomeTeam = (await (this._leaderBoard))
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

  private async drawAwayMatch() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        const drawAwayTeam = (await (this._leaderBoard))
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

  private async homeWinner() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const victoryResults = (await (this._leaderBoard))
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

  private async homeLoser() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        const loserResults = (await (this._leaderBoard))
          .find((loser) => match.homeTeam === loser.id);
        if (!loserResults) return null;
        loserResults.totalLosses += 1;
        loserResults.totalGames += 1;
        loserResults.goalsFavor += match.homeTeamGoals;
        loserResults.goalsOwn += match.awayTeamGoals;
      }
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
        victoryReward.goalsFavor += match.awayTeamGoals;
        victoryReward.goalsOwn += match.homeTeamGoals;
        victoryReward.totalVictories += 1;
        victoryReward.totalGames += 1;
        victoryReward.totalPoints += 3;
      }
    });
  }

  private async awayLoser() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        const loserResults = (await (this._leaderBoard))
          .find((loser) => match.awayTeam === loser.id);
        if (!loserResults) return null;
        loserResults.totalLosses += 1;
        loserResults.totalGames += 1;
        loserResults.goalsFavor += match.awayTeamGoals;
        loserResults.goalsOwn += match.homeTeamGoals;
      }
    });
  }

  private async efficiency() {
    const finishedMatches = await this.matchesModel
      .findAll({ where: { inProgress: false } });

    finishedMatches.forEach(async (match) => {
      const teamStatistics = (await (this._leaderBoard))
        .find((elem) => elem.id === match.homeTeam);

      if (!teamStatistics) return null;
      // if (teamStatistics.totalVictories === 0) {
      //   teamStatistics.efficiency = 0;
      //   return null;
      // }
      const operation = (
        (teamStatistics.totalPoints / (teamStatistics.totalGames * 3)) * 100);
      teamStatistics.efficiency = Number(operation.toFixed(2));
    });
  }

  public async sortLeaderBoard() {
    (await this._leaderBoard).sort((a, b) => b.totalPoints - a.totalPoints)
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

  public async sortLeaderBoardTwo() {
    (await this._leaderBoard).sort((a, b) => {
      if ((a.totalPoints === b.totalPoints) && (a.totalVictories === b.totalVictories)
        && (a.goalsBalance === b.goalsBalance) && (a.goalsFavor === b.goalsFavor)) {
        return b.goalsOwn - a.goalsOwn;
      } return 1;
    });
  }

  public async getScore() {
    this._leaderBoard = this.mountTeamsTable();
    await this.homeWinner();
    await this.homeLoser();
    await this.awayWinner();
    await this.awayLoser();
    await this.drawHomeMatch();
    await this.drawAwayMatch();
    await this.goalsBalance();
    await this.efficiency();
    await this.sortLeaderBoard();
    await this.sortLeaderBoardTwo();

    (await this._leaderBoard).forEach((elem) => {
      const toDelete = elem;
      delete toDelete.id;
    });
    (await this._leaderBoard);
  }

  get leaderBoard() {
    return this._leaderBoard;
  }
}
