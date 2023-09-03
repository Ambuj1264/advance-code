import SearchCarCommand from "./command/searchCarCommand";

export default class CarsPage {
  public static searchCar(): SearchCarCommand {
    return new SearchCarCommand();
  }
}
