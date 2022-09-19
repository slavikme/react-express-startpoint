import {ILocation} from "./Location";

export interface IOrganisation {
  id: number;
  name: string;
  type: 'company' | 'institution' | 'association' | 'government';
  location: ILocation;
}
