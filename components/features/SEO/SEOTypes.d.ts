declare namespace SEOTypes {
  export type Product = {
    url: string;
    image: string;
    price: number;
    name: string;
    reviewTotalScore?: number;
    reviewTotalCount?: number;
    establishmentName: string;
  };
}
