import { Message } from "eris";

import { Client } from "../Client";
import { CommandOptions } from "./CommandOptions";

class Command {
  name: string;
  options: CommandOptions;
  
  parent?: Command;
  subcommands: Map<string, Command>;

  constructor(name: string, options: CommandOptions) {
    this.name = name;
    this.options = options || {
      aliases: [],
      description: "No description",
      shortDescription: "No description",
      usage: ""
    };

    this.subcommands = new Map(); 
  }

  onExecute(client: Client, message: Message, args: Array<string>): void {
    client.createMessage(
      message.channel.id,
      "This command does not have an executor."
    );
  }

  addSubcommand(subcommand: Command): void {
    subcommand.parent = this;
    this.subcommands.set(subcommand.name, subcommand);
  }

  removeSubcommand(name: string): void {
    this.subcommands.delete(name);
  }

  execute(client: Client, message: Message, args: Array<string>): void {
    const [ firstArg, ...rest ] = args;
    const subCommandName = firstArg.toLowerCase();

    if (this.subcommands.has(subCommandName)) {
      this.subcommands.get(subCommandName)?.execute(client, message, rest);
      return;
    }

    this.onExecute(client, message, args);
  }
}

export { Command };