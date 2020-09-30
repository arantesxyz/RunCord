import { Command } from "./commands/Command";
import { Client as ErisClient, ClientOptions } from "eris";

class Client extends ErisClient {
  commands: Map<string, Command>

  constructor(token: string, clientOptions: ClientOptions) {
    super(token, clientOptions);

    this.commands = new Map();
  }
}

export { Client };