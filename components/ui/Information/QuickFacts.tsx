import React, { useRef, useEffect, useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { withTheme } from "emotion-theming";

import { getTruncatedValues } from "../utils/uiUtils";

import Box from "./Box";

import useToggle from "hooks/useToggle";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalHeading,
  ModalContentWrapper,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { typographyCaption, typographyCaptionSemibold } from "styles/typography";
import { gutters, blackColor, borderRadiusSmall } from "styles/variables";
import { Trans } from "i18n";
import { mqMin, mqIE, singleLineTruncation } from "styles/base";
import InformationCircle from "components/icons/information-circle.svg";
import Tooltip from "components/ui/Tooltip/Tooltip";
import { getResizeObserver } from "utils/helperUtils";
import { Namespaces } from "shared/namespaces";

const iconStyles = (theme: Theme) => css`
  width: 18px;
  min-width: 18px;
  height: auto;
  fill: ${theme.colors.primary};

  ${mqIE} {
    height: 18px;
  }
`;

const Value = styled.div<{
  ref: React.Ref<HTMLDivElement>;
  isClickable: boolean;
}>(({ theme, isClickable }) => [
  typographyCaption,
  singleLineTruncation,
  css`
    cursor: ${isClickable ? "pointer" : "default"};
    color: ${theme.colors.primary};
    text-decoration: ${isClickable ? "underline" : "none"};
  `,
]);

const Label = styled.div([
  typographyCaptionSemibold,
  singleLineTruncation,
  css`
    margin-top: 2px;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

export const QuickFact = styled.div<{ fullWidth: boolean }>(
  ({ fullWidth }) =>
    css`
      position: relative;
      display: flex;
      flex-basis: 50%;
      align-items: flex-start;
      margin-top: ${gutters.small}px;
      max-width: 50%;
      ${mqMin.large} {
        flex-basis: ${fullWidth ? 25 : 50}%;
        max-width: ${fullWidth ? 25 : 50}%;
      }
    `
);

const TextContentWrapper = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 70%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: -${gutters.small}px;
`;

const InformationCircleStyled = styled(InformationCircle)(
  ({ theme }) => css`
    position: absolute;
    right: -${gutters.large / 2}px;
    bottom: 2px;
    width: 12px;
    height: 12px;
    opacity: 0.7;
    fill: ${theme.colors.primary};
  `
);

const IconWrapper = styled.div(
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
      margin-right: ${gutters.small / 2}px;
      border-radius: ${borderRadiusSmall};
      width: 40px;
      height: 32px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
    `
);

const QuickFacts = ({
  quickFacts,
  theme,
  namespace,
  fullWidth,
  className,
}: {
  className?: string;
  quickFacts: SharedTypes.QuickFact[];
  theme: Theme;
  namespace: Namespaces;
  fullWidth: boolean;
}) => {
  const [isModalOpen, toggleIsModalOpen] = useToggle(false);
  const [selectedId, changeSelectedId] = useState<string>("");
  const wrapperRef = useRef(null);
  const valueRefs = useRef(quickFacts.map(() => React.createRef<HTMLDivElement>()));

  const [truncatedValues, setTruncatedValues] = useState<Array<string | boolean>>([]);

  const updateState = () => setTruncatedValues(getTruncatedValues(valueRefs.current));

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    updateState();

    if (typeof ResizeObserver !== "undefined" && wrapperRef.current) {
      const [resizeObserver, rafReference] = getResizeObserver(() => {
        updateState();
      });
      const currentRef = wrapperRef.current!;
      resizeObserver.observe(currentRef);

      return () => {
        window.cancelAnimationFrame(rafReference.rafId!);
        resizeObserver.unobserve(currentRef);
      };
    }
  }, [quickFacts]);
  const openModal = (id: string) => {
    toggleIsModalOpen();
    changeSelectedId(id);
  };
  const modalData = quickFacts.find(quickFact => quickFact.id === selectedId);
  const shouldShowModal =
    isModalOpen && modalData !== undefined && modalData.description !== undefined;
  return (
    <>
      {shouldShowModal && (
        <Modal id="QuickfactModal" onClose={() => toggleIsModalOpen()} noMinHeight variant="info">
          <ModalHeader rightButton={<CloseButton onClick={() => toggleIsModalOpen()} />} />
          <ModalContentWrapper>
            <ModalHeading>{modalData?.label}</ModalHeading>
            <ModalBodyContainer>{modalData?.description}</ModalBodyContainer>
          </ModalContentWrapper>
        </Modal>
      )}
      <Box fullWidth={fullWidth} className={className} theme={theme}>
        <Wrapper ref={wrapperRef}>
          {quickFacts.map((quickFact: SharedTypes.QuickFact, i) => {
            const { id, label, value, description, Icon, translateValue, showEmptyValue } =
              quickFact;
            const shouldDisplayQuickfact = value !== "" || showEmptyValue;
            const hasTruncatedValue = !!truncatedValues[i];

            if (!shouldDisplayQuickfact) return null;

            const translateValueAndValueString = translateValue && typeof value === "string";
            const translateValueAndValueObj = translateValue && typeof value !== "string";

            return (
              <QuickFact key={id} fullWidth={fullWidth}>
                <IconWrapper>
                  <Icon css={iconStyles(theme)} />
                </IconWrapper>
                <TextContentWrapper fullWidth={fullWidth}>
                  <Label>
                    <Trans ns={namespace}>{label}</Trans>
                  </Label>
                  <Value
                    ref={valueRefs.current[i]}
                    isClickable={description !== undefined}
                    onClick={description !== undefined ? () => openModal(id) : undefined}
                  >
                    {translateValueAndValueString && <Trans ns={namespace}>{value}</Trans>}
                    {translateValueAndValueObj && (
                      <Trans
                        ns={namespace}
                        i18nKey={value.key}
                        defaults={value.key}
                        values={{ ...value.options }}
                      />
                    )}
                    {!translateValue && value}
                  </Value>
                  {hasTruncatedValue && (
                    <Tooltip title={truncatedValues[i]}>
                      <InformationCircleStyled />
                    </Tooltip>
                  )}
                </TextContentWrapper>
              </QuickFact>
            );
          })}
        </Wrapper>
      </Box>
    </>
  );
};

export default withTheme(QuickFacts);
