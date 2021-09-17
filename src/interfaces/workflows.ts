export type RuEventsWorkflow = () => {
  execute(): Promise<void>;
}

export type PublishTourWorkflow = (keywords: string[]) =>  {
  execute(): Promise<void>;
}
