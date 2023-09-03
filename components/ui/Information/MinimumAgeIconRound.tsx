import React from "react";
import { css as emotionCss, SerializedStyles } from "@emotion/core";
import { withTheme } from "emotion-theming";

type Props = {
  value: string;
  theme: Theme;
  css: SerializedStyles;
};

const iconStyles = emotionCss`
  width: 20px;
  min-width: 20px;
`;

const MinimumAgeIconRound = ({ value, theme, css }: Props) => {
  const singleChar = value.length === 1;
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 328.9 328.9"
      xmlSpace="preserve"
      enableBackground="new 0 0 328.9 328.9"
      css={[iconStyles, css]}
    >
      <g id="_x34_4-18Plus_movie">
        <g>
          <path
            fill={`${theme.colors.primary}`}
            d="M292.9,120.9c4.7,14,7.1,28.6,7.1,43.5c0,74.8-60.8,135.6-135.6,135.6S28.9,239.2,28.9,164.4
          S89.7,28.8,164.5,28.8c14.9,0,29.5,2.4,43.5,7.1V5.8C193.8,2,179.2,0,164.4,0C73.8,0,0,73.8,0,164.4s73.8,164.4,164.4,164.4
          S328.8,255,328.8,164.4c0-14.8-2-29.4-5.8-43.5C323,120.9,292.9,120.9,292.9,120.9z"
          />
        </g>
        <g>
          <polygon
            fill={`${theme.colors.primary}`}
            points="284.7,44.1 284.7,12.6 262,12.6 262,44.1 230.6,44.1 230.6,66.8 262,66.8 262,98.3 284.7,98.3 
          284.7,66.8 316.2,66.8 316.2,44.1 		"
          />
        </g>
      </g>
      <text
        id="text"
        transform={
          singleChar ? "matrix(1 0 0 1 100.3332 252.4602)" : "matrix(1 0 0 1 70.3332 225.4602)"
        }
        fontSize={singleChar ? "220px" : "160px"}
        fill={`${theme.colors.primary}`}
        fontWeight="700"
      >
        {value}
      </text>
    </svg>
  );
};

export default withTheme(MinimumAgeIconRound);
