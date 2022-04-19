import { ILogin, ILoginSucess } from '../interfaces/ILogin';
import Users from '../database/models/UsersModel';
import JwtAuth from '../middlewares/auth';

export default class UsersService {
  private model = Users;

  public async validadeLogin(payload: ILogin): Promise<ILoginSucess | null> {
    const userLogin = await this.model.findOne({ where: { email: payload.email } });
    if (!userLogin) return null;

    const { id, username, role, email } = userLogin;
    const token = await JwtAuth.jwtLogin({ id, username, role, email });

    return {
      user: { id, username, role, email },
      token,
    };
  }

  // public async getRole(email: string): Promise<string | null> {
  //   const userLogin = await this.model.findOne({ where: { email } });
  //   console.log('USERSERVICE 23', userLogin?.role);

  //   if (!userLogin?.role) return null;

  //   return userLogin?.role;
  // }
}
