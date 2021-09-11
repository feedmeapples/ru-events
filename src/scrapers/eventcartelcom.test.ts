import { fetchEvents } from "./eventcartelcom";

test("eventcartel.com events not empty", async () => {
  const events = await fetchEvents();

  expect(events.length).toBeTruthy();
});
