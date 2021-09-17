export type RuEventsWorkflow = () => {
  execute(): Promise<string[]>;
}
