import { PromptData, PromptQuery, PromptRepository } from "./structures";

class InMemoryPromptRepository implements PromptRepository {
  storage = new Map<string, PromptData>();

  async set(prompt: PromptData): Promise<void> {
    this.storage.set(prompt.messageId, prompt);
  }

  async remove(messageId: string): Promise<void> {
    this.storage.delete(messageId);
  }

  async removeAll(query: PromptQuery): Promise<void> {
    const keys = Object.keys(query) as ("channelId" | "name" | "type")[];

    for (const [key, value] of this.storage) {
      if (keys.every((key) => value[key] === query[key])) {
        this.storage.delete(key);
      }
    }
  }

  async get(messageId: string): Promise<PromptData | undefined> {
    return this.storage.get(messageId);
  }

  async getAll(query: PromptQuery): Promise<PromptData[]> {
    const result = [] as PromptData[];
    const keys = Object.keys(query) as ("channelId" | "name" | "type")[];

    for (const [ignored, value] of this.storage) {
      if (keys.every((key) => value[key] === query[key])) {
        result.push(value);
      }
    }

    return result;
  }
}

export { InMemoryPromptRepository };