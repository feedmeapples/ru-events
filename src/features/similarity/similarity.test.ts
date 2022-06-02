import { cleanText, isSameTour } from "./similarity";

describe(cleanText, () => {
  test("should convert cyrillic to latin", () => {
    const res = cleanText(
      "комбинированные материалы в которых применена щадящая оптимизация"
    );
    expect(res).toBe(
      "kombinirovannie materiali v kotorikh primenena shchadyashchaya optimizatsiya"
    );
  });

  test("should lowercase", () => {
    const res = cleanText("Create LICENSE");
    expect(res).toBe("create license");
  });

  test("should remove special symbols", () => {
    const res = cleanText("create ¶   license > ... ! 2   ");
    expect(res).toBe("create license 2");
  });
});

describe(isSameTour, () => {
  test("should return true", () => {
    const text1 = 'тимур шаов usa tour 2021'
    const text2 = "ТИМУР бб .   2 11 ШАОВ"

    const res = isSameTour(text1, text2);
    expect(res).toBe(true);
  });

  test("should return false", () => {
    const text1 = 'тимур шаов usa tour 2021'
    const text2 = 'шоу "две большие разницы!"'

    const res = isSameTour(text1, text2);
    expect(res).toBe(false);
  });
});
