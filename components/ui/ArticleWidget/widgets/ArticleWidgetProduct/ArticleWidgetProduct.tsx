import React from "react";
import styled from "@emotion/styled";

import ContentProductWidget from "components/ui/ArticleWidget/widgets/ContentProductWidget";
import { gutters } from "styles/variables";
import { ProductCardType } from "types/enums";
import { Header } from "components/ui/TeaserList/TeaserListComponents";
import Teaser from "components/ui/Teaser/Teaser";
import LazyComponent from "components/ui/Lazy/LazyComponent";

const Wrapper = styled.div`
  margin-bottom: ${gutters.large * 1.5}px;
`;

const ProductsWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const WidgetItem = styled.div`
  margin-top: ${gutters.large}px;
  &:first-of-type {
    margin-top: 0;
  }
`;

const ProductItem = ({
  productType,
  item,
}: {
  productType: ProductCardType;
  item: TeaserTypes.Tour | TeaserTypes.Teaser;
}) => {
  switch (productType) {
    case ProductCardType.TOUR:
      return <ContentProductWidget product={item as TeaserTypes.Tour} />;
    case ProductCardType.ARTICLE:
      return <Teaser {...(item as TeaserTypes.Teaser)} />;
    default:
      return null;
  }
};

const ArticleWidgetProduct = ({
  list,
  title = "",
  titleLink,
  icon = "",
  productType,
}: {
  list: (TeaserTypes.Tour | TeaserTypes.Teaser)[];
  title?: string;
  titleLink?: string;
  icon?: string;
  productType: ProductCardType;
}) => {
  if (!list.length) {
    return null;
  }
  return (
    <Wrapper>
      <Header title={title} icon={icon} url={titleLink} />
      <ProductsWrapper>
        {list.map((el: TeaserTypes.Tour | TeaserTypes.Teaser, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <LazyComponent key={index}>
            <WidgetItem>
              <ProductItem productType={productType} item={el} />
            </WidgetItem>
          </LazyComponent>
        ))}
      </ProductsWrapper>
    </Wrapper>
  );
};

export default ArticleWidgetProduct;
