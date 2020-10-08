import { PromptData, PromptQuery, PromptRepository } from "./structures";

class InMemoryPromptRepository implements PromptRepository {
  constructor() {
    // TODO
  }
  upsert(prompt: PromptData): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findOne(prompt: PromptQuery): Promise<PromptData | undefined> {
    throw new Error("Method not implemented.");
  }
  find(prompt: PromptQuery): Promise<PromptData[] | []> {
    throw new Error("Method not implemented.");
  }
  remove(prompt: PromptQuery): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export { InMemoryPromptRepository };