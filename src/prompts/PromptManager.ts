import { Emoji, Message, PossiblyUncachedMessage, TextableChannel } from "eris";
import { Client } from "../Client";
import {
  MessagePromptExecutor,
  PromptData,
  PromptExecutor,
  PromptQuery,
  PromptRepository,
  ReactionPromptExecutor
} from "./structures";

import { InMemoryPromptRepository } from "./InMemoryPromptRepository";

class PromptManager {
  client: Client;
  repository: PromptRepository;

  executors = new Map<string, PromptExecutor>();

  constructor(client: Client) {
    this.client = client;
    this.repository = client.botOptions.promptRepository ||
      new InMemoryPromptRepository();
  }

  addExecutor(executor: PromptExecutor): void {
    this.executors.set(executor.name, executor);
  }

  removeExecutor(name: string): void {
    this.executors.delete(name);
  }

  createPrompt(data: PromptData): void {
    this.repository.set(data);
  }

  removePrompt(messageId: string): void {
    this.repository.remove(messageId);
  }

  removePrompts(query: PromptQuery): void {
    this.repository.removeAll(query);
  }

  async handleReaction(
    message: PossiblyUncachedMessage,
    emoji: Emoji,
    userId: string
  ): Promise<void> {
    const prompt = await this.repository.get(message.id);
    if (!prompt) return;
    
    const executor = this.executors.get(prompt.name) as ReactionPromptExecutor;
    if (!executor) return;

    executor.execute(this.client, prompt, message, emoji, userId);
  }

  async handleMessage(message: Message<TextableChannel>): Promise<void> {
    const prompts = await this.repository.getAll({
      type: "message",
      channelId: message.channel.id
    });
    
    if (!prompts || !prompts.length) return;
    
    for (const prompt of prompts) {
      const executor = this.executors.get(
        prompt.name
      ) as MessagePromptExecutor;

      if (!executor) return;

      executor.execute(this.client, prompt, message);
    }
  }
}

export { PromptManager };