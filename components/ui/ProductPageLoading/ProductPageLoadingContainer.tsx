import React from "react";

import LandingPageLoadingBreadcrumbs from "../LandingPages/LandingPageLoadingBreadcrumbs";

import ProductContentLoading from "./ProductContentLoading";
import ProductPageHeaderLoading from "./ProductPageHeaderLoading";

import { DesktopContainer, MobileContainer } from "components/ui/Grid/Container";
import ProductHeader from "components/ui/ProductHeader";
import PageContentContainer, { Content } from "components/ui/PageContentContainer";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";

const ProductPageLoadingContainer = ({ title }: { title?: string }) => (
  <>
    <DesktopContainer>
      <MobileContainer>
        <LandingPageLoadingBreadcrumbs />
        {title ? <ProductHeader title={title} /> : <ProductPageHeaderLoading />}
      </MobileContainer>
    </DesktopContainer>
    <PageContentContainer>
      <Content>
        <ProductContentLoading />
      </Content>
      <BookingWidgetLoadingContainer />
    </PageContentContainer>
  </>
);

export default ProductPageLoadingContainer;
