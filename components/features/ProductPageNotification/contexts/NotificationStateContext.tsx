import contextFactory from "contexts/contextFactory";
import { ColorScheme, Product } from "types/enums";

// TODO: add more properties like color etc.
export type ProductNotificationType = {
  ribbonText: string;
  productType: Product;
  customIcon?: React.ElementType;
  notificationColor?: ColorScheme.primary | ColorScheme.action;
};

export interface NotificationStateContext {
  notifications: ProductNotificationType[];
  currentNotification?: ProductNotificationType;
  displayNotification?: boolean;
  timeOutRunning?: boolean;

  setContextState: (state: Partial<this>) => void;
}

export const defaultState: NotificationStateContext = {
  notifications: [],
  currentNotification: undefined,
  displayNotification: false,
  timeOutRunning: false,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContextState: () => {},
};

const { context, Provider, useContext } = contextFactory<NotificationStateContext>(defaultState);

export default context;
export const NotificationContextProvider = Provider;
export const useNotificationStateContext = useContext;
