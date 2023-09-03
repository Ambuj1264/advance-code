export type ActiveUserModeltype = {
  activeUser?: any;
  cartItemCount: number;
};

export const getActiveUserModel = (): ActiveUserModeltype => ({
  activeUser: null,
  cartItemCount: 2,
});

export type ActiveUserDataModelType = {
  data: ActiveUserModeltype;
};

export const getActiveUserDataModel = (): ActiveUserDataModelType => ({
  data: getActiveUserModel(),
});
