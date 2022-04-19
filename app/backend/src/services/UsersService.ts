import { ILogin, ILoginSucess } from '../interfaces/ILogin';
import Users from '../database/models/UsersModel';
import JwtAuth from '../middlewares/auth';

export default class UsersService {
  private model = Users;

  public async validadeLogin(payload: ILogin): Promise<ILoginSucess | null> {
    const userLogin = await this.model.findOne({ where: { email: payload.email } });
    if (!userLogin) return null;

    const { id, username, role, email, password } = userLogin;
    const token = await JwtAuth.jwtLogin({ email, password });

    return {
      user: { id, username, role, email },
      token,
    };
  }
}
