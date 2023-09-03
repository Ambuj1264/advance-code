import SearchStaysCommand from "./command/searchStaysCommand";
import SearchToursMainCommand from "./command/searchToursCommand";
import GoToCartCommand from "./command/goToCartCommand";
import GoToMainPageCommand from "./command/goToMainPageCommand";
import MainMenuCommand from "./command/mainMenuCommand";

export default class MainPage {
  public static searchStays(): SearchStaysCommand {
    return new SearchStaysCommand();
  }

  public static searchTours(): SearchToursMainCommand {
    return new SearchToursMainCommand();
  }

  public static goToCart(): GoToCartCommand {
    return new GoToCartCommand();
  }

  public static goToMainPage(): GoToMainPageCommand {
    return new GoToMainPageCommand();
  }

  public static mainMenu(): MainMenuCommand {
    return new MainMenuCommand();
  }
}
