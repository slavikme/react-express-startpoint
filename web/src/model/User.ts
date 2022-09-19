import {IContact} from "./Contact";

export interface IUser {
  id: number;
  username: string;
  email?: string;
  lastLoginTime?: Date;
  creationTime: Date;
  contact?: IContact;
}
