export const cities: Record<string, City> = {
  Atlanta: { icon: "🍑", name: "Atlanta", aliases: ["Atlanta", "Атланта"] },
  Boston: { icon: "🎓", name: "Boston", aliases: ["Boston", "Бостон"] },
  Chicago: { icon: "🍕", name: "Chicago", aliases: ["Chicago", "Чикаго"] },
  Cleveland: {
    icon: "🎸",
    name: "Cleveland",
    aliases: ["Cleveland", "Кливленд"],
  },
  Denver: { icon: "🌄", name: "Denver", aliases: ["Denver", "Денвер"] },
  Houston: { icon: "🏜", name: "Houston", aliases: ["Houston", "Хьюстон"] },
  "Las Vegas": {
    icon: "🎰",
    name: "Las Vegas",
    aliases: ["Las Vegas", "Лас Вегас"],
  },
  "Los Angeles": {
    icon: "🎬",
    name: "Los Angeles",
    aliases: ["Los Angeles", "Лос Анджелес"],
  },
  Miami: { icon: "🏝", name: "Miami", aliases: ["Miami", "Майами"] },
  Minneapolis: {
    icon: "🚣",
    name: "Minneapolis",
    aliases: ["Minneapolis", "Миннеаполис"],
  },
  "New Jersey": {
    icon: "🗽",
    name: "New Jersey",
    aliases: ["New Jersey", "NJ", "Нью-Джерси"],
  },
  "New York": {
    icon: "🗽",
    name: "New York",
    aliases: ["New York", "Brooklyn", "NY", "Нью Йорк"],
  },
  Philadelphia: {
    icon: "☀",
    name: "Philadelphia",
    aliases: ["Philadelphia", "Филадельфия"],
  },
  "San Francisco": {
    icon: "🌉",
    name: "San Francisco",
    aliases: ["San Francisco", "Сан-Франциско"],
  },
  Seattle: { icon: "🌲", name: "Seattle", aliases: ["Seattle", "Сиэтл"] },
  Toronto: { icon: "🇨🇦", name: "Toronto", aliases: ["Toronto", "Торонто"] },
  Vancouver: {
    icon: "🇨🇦",
    name: "Vancouver",
    aliases: ["Vancouver", "Ванкувер"],
  },
  "Washington DC": {
    icon: "🏰",
    name: "Washington DC",
    aliases: ["Washington DC", "Washington, DC", "Вашингтон"],
  },
};

export interface City {
  name: string;
  icon: string;
  aliases: string[];
}
