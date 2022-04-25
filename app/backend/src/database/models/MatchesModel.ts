import { Model, INTEGER, TINYINT } from 'sequelize';
import db from '.';
import TeamsModel from './TeamsModel';

class Matches extends Model {
  id!: number;

  homeTeam!: number;

  homeTeamGoals!: number;

  awayTeam!: number;

  awayTeamGoals!: number;

  inProgress!: number;
}

Matches.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

TeamsModel.hasMany(Matches, { foreignKey: 'homeTeam', as: 'teamHome' });
TeamsModel.hasMany(Matches, { foreignKey: 'awayTeam', as: 'teamAway' });

Matches.belongsTo(TeamsModel, { foreignKey: 'homeTeam', as: 'teamHome' });
Matches.belongsTo(TeamsModel, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Matches;
