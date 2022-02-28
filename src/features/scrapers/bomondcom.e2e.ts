import {
  scrapeEventPage,
  getEvents,
  scrapeTourPage,
  scrapeEventUrls,
} from "./bomondcom";

describe("bomond.com", () => {
  test("extracts URLs for events pages", async () => {
    const urls = await scrapeEventUrls();

    expect(urls.length).toBeTruthy();
  });

  test("events not empty", async () => {
    const events = await getEvents();

    expect(events.length).toBeTruthy();
    for (const event of events) {
      expect(event.title).toBeTruthy();
      expect(event.date).toBeTruthy();
      expect(new Date(event.date).getFullYear() > 2000).toBeTruthy();
      expect(event.publisher).toBeTruthy();
      expect(event.city).toBeTruthy();
      expect(event.url).toBeTruthy();
    }
  });

  test("tour page not empty", async () => {
    const events = await scrapeTourPage(
      "https://bomond.com/tours/red-hot-chili-peppers-2022-tour/"
    );

    expect(events.length).toBeTruthy();
    for (const event of events) {
      expect(event.title).toBeTruthy();
      expect(event.date).toBeTruthy();
      expect(new Date(event.date).getFullYear() > 2000).toBeTruthy();
      expect(event.publisher).toBeTruthy();
      expect(event.city).toBeTruthy();
      expect(event.url).toBeTruthy();
    }
  });

  test.skip("event page not empty", async () => {
    const event = await scrapeEventPage(
      "https://eventcartel.com/events/the-gamblers-by-nikolai-gogol-tickets-6130"
    );

    expect(event?.title).toBeTruthy();
    expect(event.date).toBeTruthy();
    expect(new Date(event.date).getFullYear() > 2000).toBeTruthy();
    expect(event?.publisher).toBeTruthy();
    expect(event?.city).toBeTruthy();
    expect(event?.url).toBeTruthy();
  });
});
