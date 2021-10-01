export const months: Month[] = [
  { name: "January", abbr: "Jan", aliases: ["January", "Jan"] },
  { name: "February", abbr: "Feb", aliases: ["February", "Feb"] },
  { name: "March", abbr: "Mar", aliases: ["March", "Mar"] },
  { name: "April", abbr: "Apr", aliases: ["April", "Apr"] },
  { name: "May", abbr: "May", aliases: ["May", "May"] },
  { name: "June", abbr: "June", aliases: ["June", "June"] },
  { name: "July", abbr: "July", aliases: ["July", "July"] },
  { name: "August", abbr: "Aug", aliases: ["August", "Aug"] },
  { name: "September", abbr: "Sept", aliases: ["September", "Sept"] },
  { name: "October", abbr: "Oct", aliases: ["October", "Oct"] },
  { name: "November", abbr: "Nov", aliases: ["November", "Nov"] },
  { name: "December", abbr: "Dec", aliases: ["December", "Dec"] },
];

interface Month {
  name: string;
  abbr: string;
  aliases: string[];
}
