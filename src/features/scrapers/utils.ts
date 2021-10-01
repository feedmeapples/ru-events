import { cities, months } from "../../models";

export function extractCity(address: string) {
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
}

export function extractDate(dateRaw: string) {
  // try format 05/30/2022
  let regex = /\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/;
  let match = regex.exec(dateRaw);
  if (match?.length == 4) {
    const resMonth = parseInt(match[1]) - 1;
    const resDay = parseInt(match[2]);
    const resYear = parseInt(match[3]);

    return new Date(resYear, resMonth, resDay, 18);
  }

  // try formats Nov 12, November 12 2024
  for (const month of months) {
    for (const alias of month.aliases) {
      regex = new RegExp(`\\b(${alias})\\s(\\d{1,2})\\b`);
      match = regex.exec(dateRaw);
      if (match?.length == 3) {
        const resMonth = months.indexOf(month);
        const resDay = parseInt(match[2]);

        let resYear: number;
        match = /\b(20\d{2})\b/.exec(dateRaw);
        if (match?.length == 2) {
          resYear = parseInt(match[1]);
        } else {
          // year is not provided. Assume the year is current or next
          const now = new Date();
          const thisYear = now.getFullYear();
          const isCurrentYear =
            new Date(thisYear, resMonth, resDay).getTime() -
              new Date(thisYear, now.getMonth(), now.getDate()).getTime() >=
            0;
          resYear = isCurrentYear ? thisYear : thisYear + 1;
        }

        return new Date(resYear, resMonth, resDay, 18);
      }
    }
  }

  return null;
}
