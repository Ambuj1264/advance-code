import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";
import isPropValid from "@emotion/is-prop-valid";

import { gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { typographySubtitle2 } from "styles/typography";

export const HiddenCheckbox = styled.input`
  display: none;
`;

const RestContainer = styled.div`
  display: none;
  /* stylelint-disable-next-line selector-max-type */
  ${HiddenCheckbox}:checked ~ div & {
    display: inline;
  }
`;

const triggerStyles = (theme: Theme) => css`
  ${typographySubtitle2};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  color: ${theme.colors.primary};
  text-align: right;
`;

const ShowMoreTrigger = styled.label(({ theme }) => [
  triggerStyles(theme),
  css`
    /* stylelint-disable-next-line selector-max-type */
    ${HiddenCheckbox}:checked ~ div & {
      display: none;
    }
  `,
]);

const ShowLessTrigger = styled.label(
  ({ theme }) => css`
    display: none;

    /* stylelint-disable-next-line selector-max-type */
    ${HiddenCheckbox}:checked ~ div & {
      ${triggerStyles(theme)}
    }
  `
);

const Text = styled.span`
  margin-right: ${gutters.small / 2}px;
`;

const StyledArrowIcon = styled(ArrowIcon, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "isShowLess",
})<{ isShowLess?: boolean }>(
  ({ theme, isShowLess }) => css`
    width: 14px;
    height: 14px;
    transform: ${isShowLess ? "rotate(-90deg)" : "rotate(90deg)"};
    fill: ${theme.colors.primary};
  `
);

const ExpandableFilters = ({
  id,
  first,
  rest,
  isAutomaticallyExpanded,
  onShowLessClick,
  sectionId,
}: {
  id: string;
  first: React.ReactNode;
  rest?: React.ReactNode;
  isAutomaticallyExpanded?: boolean;
  onShowLessClick?: () => void;
  sectionId?: string;
}) => {
  const { t } = useTranslation();
  const uniqueId = `${constructUniqueIdentifier(id)}ShowMore`;

  return (
    <>
      {rest && (
        <HiddenCheckbox type="checkbox" id={uniqueId} defaultChecked={isAutomaticallyExpanded} />
      )}
      <div data-testid={sectionId ? `${sectionId}-options` : ""}>
        {first}
        {rest && (
          <>
            <ShowMoreTrigger htmlFor={uniqueId}>
              <Text>{t("Show more")}</Text>
              <StyledArrowIcon />
            </ShowMoreTrigger>
            <RestContainer>{rest}</RestContainer>
            <ShowLessTrigger htmlFor={uniqueId} onClick={onShowLessClick}>
              <Text>{t("Show less")}</Text>
              <StyledArrowIcon isShowLess />
            </ShowLessTrigger>
          </>
        )}
      </div>
    </>
  );
};

export default ExpandableFilters;
