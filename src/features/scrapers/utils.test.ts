import { extractDate } from "./utils";

describe("extracting date", () => {
  beforeAll(() => {
    jest.setSystemTime(new Date("2020-05-20"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should work for 05/30/2022 format", () => {
    const date = extractDate(" xxxx,..xx`123 ,05/30/2022+ xx12334  06/23/2026");
    expect(date?.getFullYear()).toBe(2022);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(30);
  });

  test("should pick next year if Month-Day is next year", () => {
    const date = extractDate(" xxxx,..xx`123 ,May 19+ xx12334  Dec 11");

    expect(date?.getFullYear()).toBe(2021);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(19);
  });

  test("should pick current year if Month-Day is later this year", () => {
    const date = extractDate(" xxxx,..xx`123 , May 21+ xx12334  Dec 11");

    expect(date?.getFullYear()).toBe(2020);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(21);
  });

  test("should pick current year if Month-Day is today", () => {
    const date = extractDate(" xxxx,..xx`123 , May 20+ xx12334  Dec 11");

    expect(date?.getFullYear()).toBe(2020);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(20);
  });

  
  test("should work for format Nov 22 2020", () => {
    const date = extractDate(" xxxx,..xx`123 , Nov 22+ 2024 xx12334  Dec 11");

    expect(date?.getFullYear()).toBe(2024);
    expect(date?.getMonth()).toBe(10);
    expect(date?.getDate()).toBe(22);
  });
  

  test("should throw for unclear format 05 30 2022", () => {
    const date = extractDate(" xxxx,..xx`123 ,05 30 2022+ xx12334");
    expect(date).toBeFalsy()
  });
});
