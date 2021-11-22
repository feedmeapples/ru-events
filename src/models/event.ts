import { City } from "./city";

export interface Event {
  title: string;
  publisher: string;
  url: string;
  city: City | null;
  date: string;
}
