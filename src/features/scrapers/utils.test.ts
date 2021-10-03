import { extractDateValues } from "./utils";

describe("extracting date", () => {
  beforeAll(() => {
    jest.setSystemTime(new Date("2020-05-20"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should work for 05/30/2022 format", () => {
    const { year, month, day } = extractDateValues(
      " xxxx,..xx`123 ,05/30/2022+ xx12334  06/23/2026"
    );
    expect(year).toBe(2022);
    expect(month).toBe(4);
    expect(day).toBe(30);
  });

  test("should pick next year if Month-Day is next year", () => {
    const { year, month, day } = extractDateValues(
      " xxxx,..xx`123 ,May 19+ xx12334  Dec 11"
    );

    expect(year).toBe(2021);
    expect(month).toBe(4);
    expect(day).toBe(19);
  });

  test("should pick current year if Month-Day is later this year", () => {
    const { year, month, day } = extractDateValues(
      " xxxx,..xx`123 , May 21+ xx12334  Dec 11"
    );

    expect(year).toBe(2020);
    expect(month).toBe(4);
    expect(day).toBe(21);
  });

  test("should pick current year if Month-Day is today", () => {
    const { year, month, day } = extractDateValues(
      " xxxx,..xx`123 , May 20+ xx12334  Dec 11"
    );

    expect(year).toBe(2020);
    expect(month).toBe(4);
    expect(day).toBe(20);
  });

  test("should work for format Nov 22 2020", () => {
    const { year, month, day } = extractDateValues(
      " xxxx,..xx`123 , Nov 22+ 2024 xx12334  Dec 11"
    );

    expect(year).toBe(2024);
    expect(month).toBe(10);
    expect(day).toBe(22);
  });

  test("should throw for format 05 30 2022", () => {
    const { year, month, day } = extractDateValues(
      " xxxx,..xx`123 ,05 30 2022+ xx12334"
    );
    expect(year).toBe(2022);
    expect(month).toBeFalsy();
    expect(day).toBeFalsy();
  });

  test("should work for format Nov 2022 and not day", () => {
    const { year, month, day } = extractDateValues(
      " xxxx,..xx`123 ,Nov 2024+ xx12334"
    );
    expect(year).toBe(2024);
    expect(month).toBe(10);
    expect(day).toBeFalsy();
  });
});
