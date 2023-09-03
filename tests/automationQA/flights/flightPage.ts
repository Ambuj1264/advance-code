import SearchFlightCommand from "./command/searchFlightCommand";
import FlightDetailsCommand from "./command/flightDetailsCommand";

export default class FlightPage {
  public static searchFlight(): SearchFlightCommand {
    return new SearchFlightCommand();
  }

  public static fillFlightDetails(): FlightDetailsCommand {
    return new FlightDetailsCommand();
  }
}
