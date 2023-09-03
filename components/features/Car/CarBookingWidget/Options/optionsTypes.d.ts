declare namespace OptionsTypes {
  export type Option = {
    id: string;
    name: string;
    price: number;
    included: boolean;
    multiple: boolean;
    code: string;
    pricePerDay: boolean;
    max: number;
    description: string;
    payOnLocation: boolean;
    insuranceInfo?: CarTypes.InsuranceInfo;
    questions: CarTypes.QueryExtraQuestion[];
  };
}
