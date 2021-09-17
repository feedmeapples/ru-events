import { Event } from "../models"

export type RuEventsWorkflow = () => {
  execute(): Promise<void>;
}

export type PublishTourWorkflow = (event: Event) =>  {
  execute(): Promise<void>;
  signals: {
    publishEvent(event: Event): void;
  };
}
