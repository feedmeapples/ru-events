import { fetchEvents, fetchEventsFromTourPage } from "./eventcartelcom";

test("eventcartel.com events not empty", async () => {
  const events = await fetchEvents();

  expect(events.length).toBeTruthy();
});

test("tour page not empty", async () => {
  const events = await fetchEventsFromTourPage(
    "https://eventcartel.com/events/prizhok-v-svobodu-istoria-rudolfa-nureeva-ballet-buy-tickets-124/"
  );

  expect(events.length).toBeTruthy();
});
