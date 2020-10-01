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

  // _execute(client: Client, message: Message, args: Array<string>): void {
  // this.onExecute(client, message, args);
  // }

  execute(client: Client, message: Message, args: Array<string>): void {
    // TODO: Check perms


    if (args.length < this.options.requiredArgs) {
      const usage =
        client.botOptions.prefix +
        this.getFullName() +
        this.options.usage;

      throw {
        name: "InvalidArguments",
        message: `Invalid arguments. Please use ${usage}`,
        usage
      };
    }

    // Check for subcommand
    const [ firstArg, ...rest ] = args;
    const subCommandName = firstArg.toLowerCase();

    const subCommand = this.subcommands.get(subCommandName);
    if (subCommand) {
      subCommand.execute(client, message, rest);
      return;
    }

    this.onExecute(client, message, args);
  }

  getFullName(): string {
    const parentName = this.parent ? this.parent.getFullName() : "";
    return parentName + this.name;
  }
}

export { Command };