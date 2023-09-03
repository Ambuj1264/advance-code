import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import LazyImage from "components/ui/Lazy/LazyImage";
import { typographyCaption } from "styles/typography";
import { greyColor, gutters } from "styles/variables";
import { singleLineTruncation } from "styles/base";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const EstablishmentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
  white-space: nowrap;
  overflow: hidden;
`;

export const Label = styled.div([
  typographyCaption,
  css`
    display: inline-flex;
    margin-left: ${gutters.small / 2}px;
    color: ${greyColor};
  `,
]);

export const EstablishmentName = styled.span([
  singleLineTruncation,
  ({ theme }) => css`
    margin: 0 ${gutters.small / 4}px;
    color: ${theme.colors.primary};
  `,
]);

const EstablishmentImageWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 24px;
  max-width: 48px;
  height: 24px;
`;

const EstablishmentInfo = ({
  name,
  image,
  className,
}: {
  name: string;
  image: Image;
  className?: string;
}) => (
  <EstablishmentWrapper className={className}>
    <EstablishmentImageWrapper>
      <LazyImage src={image.url} alt={name} width={24} height={24} backgroundColor="transparent" />
    </EstablishmentImageWrapper>
    <Label>
      <Trans
        ns={Namespaces.commonCarNs}
        defaults="Supplied by <0>{establishment}</0>"
        components={[<EstablishmentName title={name}>name</EstablishmentName>]}
        values={{ establishment: name }}
      />
    </Label>
  </EstablishmentWrapper>
);

export default EstablishmentInfo;
