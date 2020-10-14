import { Emoji, Message, PossiblyUncachedMessage, TextableChannel } from "eris";
import { Client } from "../Client";

interface Prompt {
  name: string;
  type: "reaction" | "message";
}

interface PromptData extends Prompt {
  channelId: string;
  messageId: string; // Prompt message id
  data: {
    author?: string;
    [key: string]: any;
  }
}

interface PromptQuery {
  name?: string;
  type?: "reaction" | "message";
  channelId?: string;
}

interface PromptExecutor extends Prompt{
  execute(
    client: Client,
    data: PromptData,
    message: Message,
    emoji?: Emoji,
    userId?: string
  ): Promise<void>;
}

interface MessagePromptExecutor extends PromptExecutor {
  execute(
    client: Client,
    data: PromptData,
    message: Message<TextableChannel>
  ): Promise<void>;
}

interface ReactionPromptExecutor extends PromptExecutor {
  execute(
    client: Client,
    data: PromptData,
    message: PossiblyUncachedMessage,
    emoji: Emoji,
    userId: string
  ): Promise<void>;
}

interface PromptRepository {
  set(prompt: PromptData): Promise<void>;

  remove(messageId: string): Promise<void>;
  removeAll(query: PromptQuery): Promise<void>;

  get(messageId: string): Promise<PromptData | undefined>;
  getAll(query: PromptQuery): Promise<PromptData[]>;
}

export {
  Prompt,
  PromptData,
  PromptQuery,
  PromptExecutor,
  MessagePromptExecutor,
  ReactionPromptExecutor,
  PromptRepository
};