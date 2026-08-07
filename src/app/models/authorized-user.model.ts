export interface AuthorizedUser {

  uid: string;

  email: string;

  active: boolean;

  role: 'admin' | 'viewer';

}