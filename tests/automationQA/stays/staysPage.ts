import SelectStaysCommand from "./command/selectStaysCommand";

export default class StaysPage {
  public static selectStays(): SelectStaysCommand {
    return new SelectStaysCommand();
  }
}
