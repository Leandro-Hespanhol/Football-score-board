import { Model, INTEGER, TINYINT } from 'sequelize';
import db from '.';
import TeamsModel from './TeamsModel';

class Matches extends Model {
  // public <campo>!: <tipo>;
  id!: number;

  homeTeam!: number;

  homeTeamGoals!: number;

  awayTeam!: number;

  awayTeamGoals!: number;

  inProgress!: number;
}

Matches.init({
  // ... Campos
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
  // ... Outras configs
  underscored: true,
  sequelize: db,
  // modelName: 'example',
  timestamps: false,
});
/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

TeamsModel.belongsTo(Matches, { foreignKey: 'homeTeam', as: 'id' });
TeamsModel.belongsTo(Matches, { foreignKey: 'awayTeam', as: 'id' });

Matches.hasMany(TeamsModel, { foreignKey: 'id', as: 'homeTeam' });
Matches.hasMany(TeamsModel, { foreignKey: 'id', as: 'awayTeam' });

export default Matches;
