interface CommandOptions {
  aliases: Array<string>;
  description: string;
  shortDescription: string;
  requiredArgs: number;
  usage: string;
}

export { CommandOptions };