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
  awayteam: {
    type: INTEGER,
    allowNull: false,
  },
  awayteamGoals: {
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
  // modelName: 'Matches',
  timestamps: false,
});

TeamsModel.belongsTo(Matches, { foreignKey: 'homeTeam', as: 'id' });
TeamsModel.belongsTo(Matches, { foreignKey: 'awayTeam', as: 'id' });

export default Matches;
