import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";

import { adjustSectionsDisplayWithEmptyLines, constructVoucherSections } from "./utils/orderUtils";

import {
  gutters,
  greyColor,
  blackColor,
  fontWeightRegular,
  fontWeightBold,
  borderRadiusBig,
  fontSizeBody1,
} from "styles/variables";
import {
  column,
  container,
  mqMin,
  mqPrint,
  responsiveTypography,
  skeletonPulse,
} from "styles/base";
import {
  typographyH5,
  typographySubtitle2,
  typographySubtitle1,
  typographyBody1,
} from "styles/typography";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { decodeHtmlEntity } from "utils/helperUtils";

export const SectionHeader = styled.h2(({ color }: { color: string }) => [
  column({ small: 1 }),
  responsiveTypography({ small: typographySubtitle1, large: typographyH5 }),
  css`
    color: ${color};
    font-weight: ${fontWeightBold};
  `,
]);

export const SectionLabel = styled.div([
  typographySubtitle2,
  css`
    color: ${greyColor};
  `,
]);

export const SectionValue = styled.div([
  typographyBody1,
  responsiveTypography({ small: typographyBody1, large: typographyH5 }),
  css`
    margin: 4px 0;
    color: ${rgba(blackColor, 0.7)};
    ${mqMin.large} {
      font-weight: ${fontWeightRegular};
    }
  `,
]);

const SectionValueItem = styled.div``;

const SectionSubtitleValue = styled.div`
  font-size: ${fontSizeBody1};
  line-height: 20px;
`;

const SectionSubtitleSection = styled.div`
  display: flex;

  ${SectionLabel} {
    font-weight: 400;
  }
`;

export const ValueSkeleton = styled.div([
  skeletonPulse,
  css`
    margin-top: 7px;
    width: 115px;
    height: 20px;
  `,
]);

export const SubtitleValueSkeleton = styled(ValueSkeleton)`
  margin-top: 4px;
  height: 17px;
`;

const Values = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ValuesContainer = styled.div`
  ${mqPrint} {
    @page {
      margin-top: 10mm;
      margin-bottom: 10mm;
    }
    display: table;
    width: 100%;
    break-inside: auto;
  }
`;

const ValueWrapper = styled.div<{ isEmpty?: boolean; isFullWidth?: boolean }>(
  ({ isEmpty, isFullWidth }) => [
    column({
      small: 1,
      large: isFullWidth ? 1 : 1 / 2,
      print: isFullWidth ? 1 : 1 / 2,
    }),
    css`
      display: flex;
      flex-direction: column;
    `,
    !isEmpty &&
      css`
        margin-top: ${gutters.small}px;
      `,
  ]
);

export const SectionContainer = styled.div<{ backgroundColor?: string }>(
  ({ theme, backgroundColor }) => [
    container,
    css`
      margin: ${gutters.large}px 0;
      border-radius: ${borderRadiusBig};
      padding: ${gutters.large / 2}px 0;
      background-color: ${rgba(backgroundColor || theme.colors.primary, 0.05)};
    `,
  ]
);

export const SectionSeperator = styled.div(({ theme }) => [
  css`
    margin: ${gutters.small}px ${gutters.large / 2}px;
    height: 2px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
  `,
]);

export const VoucherSection = ({
  voucherSection: { title, sections },
  isVoucherReady = true,
  voucherColor,
}: {
  voucherSection: OrderTypes.VoucherProduct;
  isVoucherReady?: boolean;
  voucherColor?: string;
}) => {
  const { t } = useTranslation(Namespaces.orderNs);
  const theme: Theme = useTheme();
  const voucherColorScheme = voucherColor || theme.colors.primary;

  const { main, extra } = constructVoucherSections(sections);

  const mainSections = adjustSectionsDisplayWithEmptyLines(main);
  const extraSections = adjustSectionsDisplayWithEmptyLines(extra);
  return (
    <ValuesContainer data-testid={title}>
      <SectionHeader color={voucherColorScheme}>{title}</SectionHeader>
      <Values>
        {mainSections.map((section, sectionsIndex) => {
          const { label } = section;
          const sectionsIndexValue = sectionsIndex.toString();
          if (section.isEmptySection) {
            return (
              <ValueWrapper
                data-testid={label}
                // eslint-disable-next-line react/no-array-index-key
                key={`emptySection${title}${sectionsIndex}`}
                isEmpty
              />
            );
          }
          return (
            <ValueWrapper
              data-testid={`${sectionsIndexValue}-${label}-valueWrapper`}
              key={`${sectionsIndexValue}-${label}-wrapper`}
            >
              <SectionLabel>{label}</SectionLabel>
              <SectionValue data-testid={label}>
                {section.values.map((originalValue, index) => {
                  const value =
                    typeof originalValue === "string"
                      ? decodeHtmlEntity(originalValue)
                      : originalValue;
                  const itemKey = `${sectionsIndex}-${index}`;

                  if (!value && !isVoucherReady) {
                    return <ValueSkeleton key={itemKey} />;
                  }

                  return <SectionValueItem key={itemKey}>{value}</SectionValueItem>;
                })}
              </SectionValue>
              {section.subtitles?.map((subTitlesSection, index) => {
                const indexValue = index.toString();
                const subSectionKey = `${sectionsIndexValue}-subtitlesSection-${indexValue}`;

                if (!subTitlesSection && !isVoucherReady) {
                  return (
                    <SectionSubtitleSection key={subSectionKey}>
                      <SubtitleValueSkeleton
                        key={`${sectionsIndexValue}-subtitlesValueSkeleton-${indexValue}`}
                      />
                    </SectionSubtitleSection>
                  );
                }

                if (
                  isVoucherReady &&
                  subTitlesSection &&
                  subTitlesSection.label &&
                  subTitlesSection.values
                ) {
                  return (
                    <SectionSubtitleSection key={subSectionKey}>
                      <>
                        <SectionLabel>{subTitlesSection.label}</SectionLabel>
                        {subTitlesSection.values.map((value, subTitlesSectionValueIndex) => (
                          <SectionSubtitleValue
                            key={`subtitlesValue-${subTitlesSectionValueIndex.toString()}`}
                          >
                            &nbsp;{value}
                          </SectionSubtitleValue>
                        ))}
                      </>
                    </SectionSubtitleSection>
                  );
                }

                return null;
              })}
            </ValueWrapper>
          );
        })}
        {extraSections.length ? (
          <>
            {extraSections.map((value, index) => {
              const itemKey = `${value.label}-${index}`;
              return (
                <ValueWrapper
                  key={itemKey}
                  data-testid={
                    value.values[0] !== ""
                      ? `${value.values}-extraWrapper`
                      : `${index}-extraWrapper`
                  }
                >
                  <SectionLabel>{t("Extras")}</SectionLabel>
                  <SectionValue>
                    {value.values[0] ? `${value.label} - ${value.values[0]}` : value.label}
                  </SectionValue>
                </ValueWrapper>
              );
            })}
          </>
        ) : null}
      </Values>
    </ValuesContainer>
  );
};
