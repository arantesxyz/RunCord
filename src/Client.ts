import { Command } from "./commands/Command";
import { Client as ErisClient, ClientOptions } from "eris";

interface RunCordOptions {
  prefix?: string;
}
class Client extends ErisClient {
  botOptions: RunCordOptions;

  commands: Map<string, Command>
  aliases: Map<string, string>;

  constructor(
    token: string,
    botOptions: RunCordOptions,
    clientOptions: ClientOptions
  ) {
    super(token, clientOptions);
    
    this.botOptions = botOptions;

    this.commands = new Map();
    this.aliases = new Map();
  }

  addCommand(command: Command): void {
    const commandName = command.name.toLowerCase();

    this.commands.set(commandName, command);
    command.options.aliases.forEach(alias =>
      this.aliases.set(alias, commandName)
    );
  }

  removeCommand(name: string): void {
    name = name.toLowerCase();

    const command = this.commands.get(name);
    if (!command) return;
    
    this.commands.delete(name);
    command.options.aliases.forEach(alias => this.aliases.delete(alias));
  }

  getCommand(name: string, { ignoreCase = true } = {}): Command | null {
    if (ignoreCase) name = name.toLowerCase();

    if (this.commands.has(name)) return this.commands.get(name) || null;

    const aliase = this.aliases.get(name);
    if (aliase) return this.commands.get(aliase) || null;

    return null;
  }
}

export { Client };