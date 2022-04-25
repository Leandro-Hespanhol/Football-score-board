interface IMatches {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: number,
}

interface IMatchesCreate {
  homeTeam: number,
  awayTeam: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
  inProgress?: boolean,
}

interface IMatchesPatchGoals {
  id: string,
  homeTeamGoals: string,
  awayTeamGoals: string,
}

export {
  IMatches,
  IMatchesCreate,
  IMatchesPatchGoals,
};
