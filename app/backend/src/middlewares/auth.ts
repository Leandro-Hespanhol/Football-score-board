import * as jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import { ILogin } from '../interfaces/ILogin';
import Users from '../database/models/UsersModel';

export default class JwtAuth {
  private model = Users;

  static TRYBE_SECRET = async () => fs.readFile('jwt.evaluation.key', 'utf-8');

  static async jwtLogin(payload: ILogin) {
    const secret = await JwtAuth.TRYBE_SECRET();

    const token = jwt.sign(payload, secret, {
      expiresIn: '30d',
      algorithm: 'HS256',
    });

    return token;
  }
}
