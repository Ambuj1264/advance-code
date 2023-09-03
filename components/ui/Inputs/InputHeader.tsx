import React, { memo, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { blackColor, greyColor, gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import InformationTooltip from "components/ui/Tooltip/InformationTooltip";
import Price, { Wrapper, PriceWrapper } from "components/ui/BookingWidget/Price/Price";
import { getInfoTextWidth } from "components/ui/Tooltip/utils/tooltipUtils";
import useEffectOnce from "hooks/useEffectOnce";

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: auto;
  max-width: 70%;
  color: ${rgba(blackColor, 0.7)};

  :first-letter {
    text-transform: uppercase;
  }
`;

const Title = styled.div`
  margin-left: -24px;
  text-indent: 24px;
`;

const HeaderWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;
    justify-content: flex-start;
    color: ${greyColor};

    ${PriceWrapper} {
      text-align: left;
    }

    ${Wrapper} {
      justify-content: flex-start;
    }
  `,
]);

const InformationTooltipWrapper = styled.div`
  padding-right: ${gutters.small / 2}px;

  .infoButton {
    margin-left: 0;
    height: 100%;
  }
`;

const InputHeader = ({
  title,
  price,
  description,
  extraPriceInfo,
  extraInfo,
  shouldFormatPrice,
  extraPriceInfoDescription,
}: {
  title: string;
  price: number;
  description?: string;
  extraPriceInfo?: string;
  extraInfo?: string | React.ReactNode;
  shouldFormatPrice?: boolean;
  extraPriceInfoDescription?: string;
}) => {
  const [tooltipWidth, setTooltipWidth] = useState<number>(300);

  useEffectOnce(() => {
    if (description) {
      const newWidth = getInfoTextWidth(description);
      if (newWidth < tooltipWidth) {
        setTooltipWidth(200);
      }
    }
  });

  return (
    <HeaderWrapper>
      <Header>
        {description && (
          <InformationTooltipWrapper>
            <InformationTooltip
              information={description}
              direction="right"
              tooltipWidth={tooltipWidth}
            />
          </InformationTooltipWrapper>
        )}
        <Title>{title}</Title>
        {extraInfo}
      </Header>
      <Price
        price={price}
        extraInfo={extraPriceInfo}
        shouldFormatPrice={shouldFormatPrice}
        extraInfoDescription={extraPriceInfoDescription}
      />
    </HeaderWrapper>
  );
};

export default memo(InputHeader);
