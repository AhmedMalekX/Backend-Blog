export interface RegisterInput {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export interface LoginInput {
  data: {
    userMethod: string;
    password: string;
  };
}

export interface IUser {
  email?: string;
  password: string;
  username?: string;
}
