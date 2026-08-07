export interface AuthorizedUser {

  email: string;

  active: boolean;

  role: 'admin' | 'user';

}