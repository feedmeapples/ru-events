import {
  scrapeEventPage,
  getEvents,
  scrapeTourPage,
  validateEvent,
} from "./eventcartelcom";

describe("eventcartel.com", () => {
  test("eventcartel.com events not empty", async () => {
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
      "https://eventcartel.com/events/prizhok-v-svobodu-istoria-rudolfa-nureeva-ballet-buy-tickets-124/"
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


  test("event page not empty", async () => {
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
