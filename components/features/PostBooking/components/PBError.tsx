import { ApolloError } from "apollo-client";
import React, { useEffect } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { mqMin } from "styles/base";
import WarningIcon from "components/icons/alert-triangle.svg";
import lazyCaptureException from "lib/lazyCaptureException";
import { typographyBody1, typographyH3, typographyH4, typographyH5 } from "styles/typography";
import { fontWeightRegular, greyColor, gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import useOnDidUpdate from "hooks/useOnDidUpdate";

const IconStyle = (theme: Theme) => css`
  width: 56px;
  fill: ${rgba(theme.colors.primary, 0.4)};
  ${mqMin.large} {
    width: 104px;
  }
`;

export const StyledError = styled.div`
  margin: auto;
  text-align: center;
`;

const headerAndFooterHeight = 330;

export const StyledErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: calc(100vh - ${headerAndFooterHeight}px);
`;

const StyledErrorText = styled.div(
  ({ theme }) => css`
    margin-top: ${gutters.large / 2}px;
    ${typographyH4};
    color: ${theme.colors.primary};

    ${mqMin.large} {
      margin-top: ${gutters.small}px;
      ${typographyH3};
    }
  `
);

const StyledErrorDescription = styled.div`
  margin-top: ${gutters.large / 4}px;
  ${typographyBody1};
  color: ${greyColor};
  font-weight: ${fontWeightRegular};

  ${mqMin.large} {
    margin-top: ${gutters.small / 2}px;
    ${typographyH5};
    font-weight: ${fontWeightRegular};
  }
`;

export const PBErrorComponent = ({
  text,
  description,
  Icon,
  className,
  dismissError,
}: {
  text?: string;
  description?: string;
  Icon?: React.ElementType;
  className?: string;
  dismissError?: () => void;
}) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const { asPath } = useRouter();

  useOnDidUpdate(() => {
    dismissError?.();
    // callback should be invoked after component is mounted AND asPath is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissError, asPath]);

  return (
    <StyledErrorWrapper className={className}>
      <StyledError>
        {Icon ? <Icon css={IconStyle} /> : <WarningIcon css={IconStyle} />}
        <StyledErrorText>{text ?? postbookingT("Loading failed")}</StyledErrorText>
        <StyledErrorDescription>
          {description ?? postbookingT("Try again later")}
        </StyledErrorDescription>
      </StyledError>
    </StyledErrorWrapper>
  );
};

export const PBError = ({
  error,
  errorInfo,
  text,
  description,
  className,
}: {
  error?: Error | ApolloError;
  errorInfo?: { [key: string]: unknown };
  text?: string;
  description?: string;
  className?: string;
}) => {
  useEffect(() => {
    if (error) {
      lazyCaptureException(error, {
        componentName: "gtePostBooking",
        errorInfo,
      });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error, errorInfo]);

  return <PBErrorComponent text={text} description={description} className={className} />;
};
