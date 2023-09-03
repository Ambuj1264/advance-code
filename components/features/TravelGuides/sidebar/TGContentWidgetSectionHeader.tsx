import React, { ElementType } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { typographySubtitle1 } from "styles/typography";
import { greyColor, guttersPx } from "styles/variables";
import { mqMax } from "styles/base";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${mqMax.large} {
    justify-content: center;
  }
`;

const TitleWrapper = styled.h2([
  typographySubtitle1,
  css`
    color: ${greyColor};
  `,
]);

const iconStyles = (theme: Theme) => css`
  margin-right: ${guttersPx.small};
  max-height: 24px;
  fill: ${theme.colors.primary};
`;

const TGContentWidgetSectionHeader = ({
  title,
  Icon,
  className,
  url,
}: {
  title: string;
  Icon?: ElementType;
  className?: string;
  url?: string;
}) => {
  return (
    <Wrapper className={className}>
      {Icon ? <Icon css={iconStyles} /> : null}
      <TitleWrapper>{url ? <a href={url}>{title}</a> : title}</TitleWrapper>
    </Wrapper>
  );
};

export default TGContentWidgetSectionHeader;
