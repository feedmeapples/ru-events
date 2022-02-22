export const months: Month[] = [
  { name: "January", abbr: "Jan", variants: ["january", "jan"] },
  { name: "February", abbr: "Feb", variants: ["february", "feb"] },
  { name: "March", abbr: "Mar", variants: ["march", "mar"] },
  { name: "April", abbr: "Apr", variants: ["april", "apr"] },
  { name: "May", abbr: "May", variants: ["may"] },
  { name: "June", abbr: "June", variants: ["june", "jun"] },
  { name: "July", abbr: "July", variants: ["july", "jul"] },
  { name: "August", abbr: "Aug", variants: ["august", "aug"] },
  { name: "September", abbr: "Sept", variants: ["september", "sept", "sep"] },
  { name: "October", abbr: "Oct", variants: ["october", "oct"] },
  { name: "November", abbr: "Nov", variants: ["november", "nov"] },
  { name: "December", abbr: "Dec", variants: ["december", "dec"] },
];

export interface Month {
  name: string;
  abbr: string;
  variants: string[];
}
