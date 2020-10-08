import { Client as ErisClient, ClientOptions } from "eris";

import { InMemoryPromptRepository } from "./prompts/InMemoryPromptRepository";
import { CommandManager } from "./commands/CommandHandler";
import { PromptRepository } from "./prompts/structures";
import { PromptManager } from "./prompts/PromptManager";

interface RunCordOptions {
  prefix?: string;
  promptRepository: PromptRepository;
}
class Client extends ErisClient {
  botOptions: RunCordOptions;

  promptManager: PromptManager;
  commandManager: CommandManager;

  constructor(
    token: string,
    botOptions: RunCordOptions = {
      promptRepository: new InMemoryPromptRepository()
    },
    clientOptions: ClientOptions = {}
  ) {
    super(token, clientOptions);

    this.botOptions = botOptions;

    this.promptManager = new PromptManager(botOptions.promptRepository);
    this.commandManager = new CommandManager();
  }
}

export { Client };