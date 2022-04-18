import * as jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import { ILogin } from '../interfaces/ILogin';

export default class JwtAuth {
  static TRYBE_SECRET = async () => fs.readFile('jwt.evaluation.key', 'utf-8');

  static async jwtLogin(payload: ILogin) {
    const secret = await JwtAuth.TRYBE_SECRET();
    // const jwtConfig = {
    //   expiresIn: '30d',
    //   algorithm: 'HS256',
    // };
    const token = jwt.sign(payload, secret, {
      expiresIn: '30d',
      algorithm: 'HS256',
    });

    return token;
  }
}
