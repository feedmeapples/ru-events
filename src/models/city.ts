export const cities: Record<string, City> = {
  Atlanta: { icon: "🍑", aliases: ["Atlanta", "Атланта"] },
  Boston: { icon: "🎓", aliases: ["Boston", "Бостон"] },
  Chicago: { icon: "🍕", aliases: ["Chicago", "Чикаго"] },
  Cleveland: { icon: "🎸", aliases: ["Cleveland", "Кливленд"] },
  Denver: { icon: "🌄", aliases: ["Denver", "Денвер"] },
  Houston: { icon: "🏜", aliases: ["Houston", "Хьюстон"] },
  "Las Vegas": { icon: "🎰", aliases: ["Las Vegas", "Лас Вегас"] },
  "Los Angeles": { icon: "🎬", aliases: ["Los Angeles", "Лос Анджелес"] },
  Miami: { icon: "🏝", aliases: ["Miami", "Майами"] },
  Minneapolis: { icon: "🚣", aliases: ["Minneapolis", "Миннеаполис"] },
  "New Jersey": { icon: "🗽", aliases: ["New Jersey", "NJ", "Нью-Джерси"] },
  "New York": {
    icon: "🗽",
    aliases: ["New York", "Brooklyn", "NY", "Нью Йорк"],
  },
  Philadelphia: { icon: "☀", aliases: ["Philadelphia", "Филадельфия"] },
  "San Francisco": { icon: "🌉", aliases: ["San Francisco", "Сан-Франциско"] },
  Seattle: { icon: "🌲", aliases: ["Seattle", "Сиэтл"] },
  Toronto: { icon: "🇨🇦", aliases: ["Toronto", "Торонто"] },
  Vancouver: { icon: "🇨🇦", aliases: ["Vancouver", "Ванкувер"] },
  "Washington DC": {
    icon: "🏰",
    aliases: ["Washington DC", "Washington, DC", "Вашингтон"],
  },
};

interface City {
  icon: string;
  aliases: string[];
}
