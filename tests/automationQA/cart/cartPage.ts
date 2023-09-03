import ReserveCommand from "./command/reserveCommand";
import RemoveCommand from "./command/removeCommand";
import OpenCommand from "./command/openCommand";
import ReadCartCommand from "./command/readCartCommand";
import ChangeCurrencyCommand from "./command/changeCurrencyCommand";
import OpenInfoDialogCommand from "./command/openInfoDialogCommand";
import EditBookedItemCommand from "./command/editBookedItemCommand";
import ValidationCommand from "./command/validationCommand";

export default class CartPage {
  public static reserve(): ReserveCommand {
    return new ReserveCommand();
  }

  public static remove(): RemoveCommand {
    return new RemoveCommand();
  }

  public static openPage(): OpenCommand {
    return new OpenCommand();
  }

  public static readCartPage(): ReadCartCommand {
    return new ReadCartCommand();
  }

  public static changeCurrencyCommand(): ChangeCurrencyCommand {
    return new ChangeCurrencyCommand();
  }

  public static openInfoDialog(): OpenInfoDialogCommand {
    return new OpenInfoDialogCommand();
  }

  public static editBookedItem(): EditBookedItemCommand {
    return new EditBookedItemCommand();
  }

  public static validation(): ValidationCommand {
    return new ValidationCommand();
  }
}
