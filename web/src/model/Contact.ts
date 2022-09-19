import {IOrganisation} from "./Organisation";
import {ILocation} from "./Location";

export interface IContact {
  id: number;
  firstName: string;
  lastName: string;
  organisation?: IOrganisation;
  location?: ILocation;
  phoneCountryCode?: string;
  phoneNumber?: string;
}
