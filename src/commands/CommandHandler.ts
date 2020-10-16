import { Message } from "eris";

import { Command } from "./Command";
import { Client } from "../Client";

class CommandManager {
  client: Client;
  commands: Map<string, Command>
  aliases: Map<string, string>;

  constructor(client: Client) {
    this.client = client;
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

  handle(message: Message): void {
    const [ commandCall, ...args ] = message.content.split(" ");
    if (!commandCall.startsWith(this.client.botOptions.prefix || "")) return;

    const cmdName = commandCall.slice(this.client.botOptions.prefix?.length);
  
    const command = this.getCommand(cmdName);
    if (command) command.execute(this.client, message, args);
  }
}

export { CommandManager };