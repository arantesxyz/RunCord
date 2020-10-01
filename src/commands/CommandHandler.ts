import { Message } from "eris";
import { Client } from "../Client";

function handleCommand(client: Client, message: Message): void {
  const [ commandName, ...args ] = message.content.split(" ");

  const command = client.getCommand(commandName);
  if (command) command.execute(client, message, args);
}

export { handleCommand };