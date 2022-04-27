export default interface ILeaderBoard {
  id?: number;
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goasOwn: number;
  goalsBalance: number;
  efficiency: number;
}
