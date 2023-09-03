/* eslint-disable  no-useless-escape */
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { mqMin } from "styles/base";
import { typographyBody2, typographyCaptionSmall } from "styles/typography";
import { greyColor, gutters, lightRedColor, borderRadiusSmall } from "styles/variables";

export const PaymentMethodContainer = styled.div`
  display: none;
`;

export const payPalStyles = css`
  .adyen-checkout__paypal__button--paypal {
    height: 50px;
  }
  .adyen-checkout__paypal {
    position: fixed;
    top: unset;
    right: 11px;
    bottom: 7px;
    left: unset;
    height: 50px;
    opacity: 0;
    pointer-events: none;
    &:hover {
      cursor: pointer;
    }

    ${mqMin.large} {
      position: absolute;
      right: unset;
      bottom: 65px;
      left: unset;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .adyen-checkout__paypal__buttons {
      width: 181px;
      ${mqMin.large} {
        width: 288px;
      }
    }
  }
`;

export const QRCodeStyles = (theme: Theme) => css`
  .adyen-checkout__qr-loader {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 145px;

    img {
      border: 1px solid ${greyColor};
      border-radius: ${borderRadiusSmall};

      &.adyen-checkout__qr-loader__brand-logo {
        display: none;
        width: 0px;
      }
    }

    .adyen-checkout__qr-loader__subtitle {
      margin-bottom: ${gutters.small / 2}px;
    }
    .adyen-checkout__qr-loader__countdown {
      margin-top: ${gutters.small / 2}px;
    }
  }

  /* payment method's logo */
  .adyen-checkout__qr-loader__brand-logo {
    display: none;
  }

  /* scan qr subtitle */
  .adyen-checkout__qr-loader__subtitle {
    ${typographyBody2}
    color: ${theme.colors.primary};
  }

  /* countdown */
  .adyen-checkout__qr-loader__countdown {
    position: relative;
    ${typographyCaptionSmall}
    color: ${lightRedColor};

    &:after {
      content: url("data:image/svg+xml,%3Csvg viewBox='0 0 347 476' preserveAspectRatio='xMinYMin'%0Aheight='10px' width='10px'%0Afill='%23E04747'%0Axmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m320 41h13c8 0 14-6 14-14v-13c0-8-6-14-14-14h-319c-8 0-14 6-14 14v13c0 8 6 14 14 14h13c0 121 97 126 102 197-5 71-102 76-102 197h-13c-8 0-14 6-14 14v13c0 8 6 14 14 14h319c8 0 14-6 14-14v-13c0-8-6-14-14-14h-13c0-121-97-126-102-197 5-71 102-76 102-197zm-42 383c3 4 0 11-5 11h-200c-5 0-9-6-6-11 27-44 59-77 102-109 2-2 6-2 9 0 43 40 74 71 100 109zm-105-219-73-72s37 14 67 14 55-21 77-21-71 79-71 79z'/%3E%3C/svg%3E");
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -14px;
      width: 10px;
      margin-left: ${gutters.small / 4}px;
      height: 12px;
    }
  }

  /* transaction results container */
  .adyen-checkout__qr-loader--result {
    display: none;
  }
`;
