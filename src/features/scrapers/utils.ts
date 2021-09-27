import { cities } from "../../models/city";

export const extractCity = (address: string) => {
  for (const cityName in cities) {
    const city = cities[cityName];

    for (const alias of city.aliases) {
      const regex = new RegExp(`\\b${alias}\\b`);

      if (regex.test(address)) {
        return cityName;
      }
    }
  }

  return null;
};
