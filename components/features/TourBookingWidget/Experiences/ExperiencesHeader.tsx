import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { greyColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import MobileSectionHeading, { Wrapper } from "components/ui/BookingWidget/MobileSectionHeading";

type Props = {
  title: string;
  perPerson: boolean;
};

const PerPerson = styled.span([
  typographySubtitle2,
  css`
    color: ${greyColor};
    line-height: 24px;
    text-align: right;
  `,
]);

const StyledMobileSectionHeading = styled(MobileSectionHeading)(
  () => `
  ${Wrapper} {
    justify-content: space-between;
  }
`
);

const ExperiencesHeader = ({ title, perPerson }: Props) => (
  <StyledMobileSectionHeading>
    {title}
    {perPerson && (
      <PerPerson>
        <Trans ns={Namespaces.tourNs}>Price per person</Trans>
      </PerPerson>
    )}
  </StyledMobileSectionHeading>
);

export default ExperiencesHeader;
