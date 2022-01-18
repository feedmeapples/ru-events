import { City } from "./city";

export interface Event {
  title: string;
  image: string;
  publisher: string;
  url: string;
  city: City | null;
  date: string;
}
