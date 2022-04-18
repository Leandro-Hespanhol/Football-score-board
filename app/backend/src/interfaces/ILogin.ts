interface IUserTable {
  id?: number;
  username: string;
  role: string;
  email: string;
  password: string;
}

interface ILogin {
  email: string;
  password: string;
}

interface ILoginSucess {
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
  },
  token: string;
}

export {
  IUserTable,
  ILogin,
  ILoginSucess,
};
