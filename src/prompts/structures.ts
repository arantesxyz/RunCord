import { Emoji, Message } from "eris";
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
  messageId?: string;
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
  execute(client: Client, data: PromptData, message: Message): Promise<void>;
}

interface ReactionPromptExecutor extends PromptExecutor {
  execute(
    client: Client,
    data: PromptData,
    message: Message,
    emoji: Emoji,
    userId: string
  ): Promise<void>;
}

interface PromptRepository {
  upsert(prompt: PromptData): Promise<void>;
  findOne(prompt: PromptQuery): Promise<PromptData | undefined>;
  find(prompt: PromptQuery): Promise<PromptData[] | []>;
  remove(prompt: PromptQuery): Promise<void>;
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