import {Country} from "./Countries";

export interface ILocation {
  id: number;
  country: Country;
  city: string;
  address1: string;
  address2?: string;
  address3?: string;
  latlong?: [number, number];
}
