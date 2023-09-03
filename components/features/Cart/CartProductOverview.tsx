import styled from "@emotion/styled";
import React, { ReactNode, useCallback, useRef, useState } from "react";

import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import formatCurrency from "utils/currencyFormatUtils";
import useEffectOnce from "hooks/useEffectOnce";
import { gutters } from "styles/variables";
import ProductLabelOverlay, { ProductLabelValue } from "components/ui/Search/ProductLabelOverlay";
import useOnResize from "hooks/useOnResize";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import ProductCardOverview from "components/ui/ProductCard/ProductCardOverview";

const ProductLabelOverlayStyled = styled(ProductLabelOverlay)`
  top: -${gutters.small / 4}px;
`;

const CartProductOverview = ({
  className,
  title,
  imageUrl,
  clientRoute,
  quickFacts,
  iconColor,
  namespace,
  imgixParams,
  discountAmount,
  priceDiscountAmountCurrency,
  priceDiscountAmountValue,
  discountPercentage,
  isSellOut,
  expiryTimer,
  imageBackgroundColor,
}: {
  className?: string;
  title?: string;
  imageUrl?: string;
  clientRoute?: SharedTypes.ClientRoute;
  quickFacts: SharedTypes.QuickFact[];
  iconColor: string;
  namespace: Namespaces;
  imgixParams?: SharedTypes.ImgixParams;
  discountAmount?: number;
  priceDiscountAmountValue?: string;
  priceDiscountAmountCurrency?: string;
  discountPercentage?: number;
  isSellOut?: boolean;
  expiryTimer?: ReactNode;
  imageBackgroundColor?: string;
}) => {
  const { t: cartT } = useTranslation(Namespaces.cartNs);
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const [lazyImageWidth, setImageWidth] = useState(212);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  const adjustImageSize = useCallback(() => {
    const width = imgWrapperRef?.current?.offsetWidth;
    if (width && width !== lazyImageWidth) setImageWidth(width);
  }, [lazyImageWidth]);

  useEffectOnce(adjustImageSize);
  useOnResize(imgWrapperRef, adjustImageSize);

  return (
    <ProductCardOverview
      isSellOut={isSellOut}
      quickFacts={quickFacts}
      iconColor={iconColor}
      namespace={namespace}
      className={className}
      title={title}
      imageUrl={imageUrl}
      clientRoute={clientRoute}
      imgixParams={imgixParams}
      imageBackgroundColor={imageBackgroundColor}
      extraLeftColumnContent={
        <>
          {Boolean(discountPercentage) && (
            <ProductLabelOverlayStyled>
              {cartT("{discountPercentage}% discount", {
                discountPercentage,
              })}
            </ProductLabelOverlayStyled>
          )}
          {Boolean(discountAmount) && (
            <ProductLabelValue>
              <Trans
                values={{
                  amountToSave:
                    priceDiscountAmountValue || formatCurrency(convertCurrency(discountAmount!)),
                  currency: priceDiscountAmountCurrency || currencyCode,
                }}
                i18nKey="Save {amountToSave}"
                defaults="Save <0>{amountToSave}</0> {currency}"
                components={[<>amountToSave</>]}
              />
            </ProductLabelValue>
          )}
        </>
      }
      extraRightColumnContent={expiryTimer || null}
    />
  );
};

export default CartProductOverview;
