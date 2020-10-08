import { Emoji, Message } from "eris";
import { Client } from "../Client";
import {
  MessagePromptExecutor,
  PromptData,
  PromptExecutor,
  PromptQuery,
  PromptRepository,
  ReactionPromptExecutor
} from "./structures";

class PromptManager {
  repository: PromptRepository;

  executors = new Map<string, PromptExecutor>();

  constructor(repository: PromptRepository) {
    this.repository = repository;
  }

  addExecutor(executor: PromptExecutor): void {
    this.executors.set(executor.name, executor);
  }

  removeExecutor(name: string): void {
    this.executors.delete(name);
  }

  createPrompt(data: PromptData): void {
    this.repository.upsert(data);
  }

  removePrompt(query: PromptQuery): void {
    this.repository.remove(query);
  }

  async handleReaction(
    client: Client,
    message: Message,
    emoji: Emoji,
    userId: string
  ): Promise<void> {
    const prompt = await this.repository.findOne({
      type: "reaction",
      channelId: message.channel.id,
      messageId: message.id
    });
    if (!prompt) return;
    
    const executor = this.executors.get(prompt.name) as ReactionPromptExecutor;
    if (!executor) return;

    executor.execute(client, prompt, message, emoji, userId);
  }

  async handleMessage(client: Client, message: Message): Promise<void> {
    const prompts = await this.repository.find({
      type: "message",
      channelId: message.channel.id
    });

    if (!prompts || !prompts.length) return;
    
    for (const prompt of prompts) {
      const executor = this.executors.get(
        prompt.name
      ) as MessagePromptExecutor;

      if (!executor) return;

      executor.execute(client, prompt, message);
    }
  }
}

export { PromptManager };