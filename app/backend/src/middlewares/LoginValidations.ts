import { NextFunction, Request, Response } from 'express';

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields must be filledrequired' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const emailRegex = /\S+@\S+.\S\.+com/;
  if (!emailRegex.test(email)) {
    return res.status(401)
      .json({ message: 'Incorrect email or password' });
  }

  if (password.length <= 6) {
    return res.status(401).json({ message: 'Password must have at least 6 characters' });
  }
  next();
};

export default loginValidation;
