export type CustomerInfoModelType = {
  name: string;
  email: string;
  nationality: string;
  phoneNumber: string;
  __typename: string;
};

export const getCustomerInfoModel = (): CustomerInfoModelType => ({
  name: "Test User",
  email: "maksym.vlasov@travelshift.com",
  nationality: "IS",
  phoneNumber: "+238282828",
  __typename: "OrderCartCustomerInfo",
});
