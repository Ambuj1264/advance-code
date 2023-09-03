import SearchToursCommand from "./command/searchToursCommand";
import SelectToursCommand from "./command/selectToursCommand";

export default class ToursPage {
  public static selectTours(): SelectToursCommand {
    return new SelectToursCommand();
  }

  public static searchTours(): SearchToursCommand {
    return new SearchToursCommand();
  }
}
