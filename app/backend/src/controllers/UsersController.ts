import { Request, Response } from 'express';
import { ILoginSucess } from '../interfaces/ILogin';
import { UsersService } from '../services';

export default class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await this.service.validadeLogin({ email, password });
    if (!user) return res.status(401).json({ error: 'Incorrect email or password' });

    return res.status(200).json(user);
  }
}
