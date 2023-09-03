export default abstract class CommandBase {
  public async execute(isApiCommand = false) {
    if (isApiCommand) {
      await this.executeUsingApi();
    } else {
      await this.executeUsingUI();
    }
  }

  // eslint-disable-next-line
  protected async executeUsingUI() {
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line
  protected async executeUsingApi() {
    throw new Error("Method not implemented.");
  }

  public executeAs<TCommand extends CommandBase>(isApiCommand = false): TCommand {
    const command = this as unknown as TCommand;
    command.execute(isApiCommand);
    return command;
  }
}
