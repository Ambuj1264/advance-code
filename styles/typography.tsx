import { css } from "@emotion/core";

import {
  fontSizeH2,
  fontSizeH3,
  fontSizeH4,
  fontSizeH5,
  fontSizeBody1,
  fontSizeBody2,
  fontSizeCaption,
  fontSizeCaptionSmall,
  fontWeightRegular,
  fontWeightSemibold,
  fontWeightBold,
} from "styles/variables";

export const typographyH2 = css`
  font-size: ${fontSizeH2};
  font-weight: ${fontWeightBold};
  line-height: 44px;
`;

export const typographyH3 = css`
  font-size: ${fontSizeH3};
  font-weight: ${fontWeightBold};
  line-height: 44px;
`;

export const typographyH4 = css`
  font-size: ${fontSizeH4};
  font-weight: ${fontWeightBold};
  line-height: 32px;
`;

export const typographyH5 = css`
  font-size: ${fontSizeH5};
  font-weight: ${fontWeightBold};
  line-height: 28px;
`;

export const typographySubtitle1 = css`
  font-size: ${fontSizeBody1};
  font-weight: ${fontWeightSemibold};
  line-height: 24px;
`;

export const typographySubtitle2 = css`
  font-size: ${fontSizeBody2};
  font-weight: ${fontWeightSemibold};
  line-height: 20px;
`;

export const typographySubtitle2Regular = css`
  font-size: ${fontSizeBody2};
  font-weight: ${fontWeightRegular};
  line-height: 20px;
`;

export const typographySubtitle3 = css`
  font-size: ${fontSizeCaption};
  font-weight: ${fontWeightSemibold};
  line-height: 18px;
`;

export const typographyBody1 = css`
  font-size: ${fontSizeBody1};
  font-weight: ${fontWeightRegular};
  line-height: 28px;
`;

export const typographyBody2 = css`
  font-size: ${fontSizeBody2};
  font-weight: ${fontWeightRegular};
  line-height: 24px;
`;

export const typographyBody2Semibold = css`
  font-size: ${fontSizeBody2};
  font-weight: ${fontWeightSemibold};
  line-height: 24px;
`;

export const typographyCaption = css`
  font-size: ${fontSizeCaption};
  font-weight: ${fontWeightRegular};
  line-height: 16px;
`;

export const typographyCaptionSemibold = css`
  font-size: ${fontSizeCaption};
  font-weight: ${fontWeightSemibold};
  line-height: 16px;
`;

export const typographyCaptionSmall = css`
  font-size: ${fontSizeCaptionSmall};
  font-weight: ${fontWeightRegular};
  line-height: 16px;
`;

export const typographyOverline = css`
  font-size: ${fontSizeCaptionSmall};
  font-weight: ${fontWeightBold};
  letter-spacing: 1.5px;
  line-height: 16px;
  text-transform: uppercase;
`;
