import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { EditableStatus } from "./types/VoucherEnums";
import { getEditableTitle } from "./utils/voucherUtils";
import ResendVoucherModal from "./ResendVoucherModal";

import EditIcon from "components/icons/pencil.svg";
import EmailIcon from "components/icons/email.svg";
import PrintIcon from "components/icons/print.svg";
import DownloadIcon from "components/icons/download-thick.svg";
import { whiteColor, gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { hideDuringPrint } from "styles/base";
import useToggle from "hooks/useToggle";
import Tooltip, { TooltipWrapper } from "components/ui/Tooltip/Tooltip";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import { ModalHistoryProvider } from "contexts/ModalHistoryContext";

const iconStyles = css`
  width: 22px;
  height: 22px;
  fill: ${whiteColor};
`;

const IconWrapper = styled.button`
  display: flex;
  align-items: center;
  padding: 6px ${gutters.large / 2}px;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ActionWrapper = styled.div([
  hideDuringPrint,
  css`
    display: flex;
    margin-right: -${gutters.small}px;
  `,
]);

const StyledTooltip = styled(Tooltip)`
  position: unset;
  ${TooltipWrapper} {
    max-width: 250px;
  }
`;

const VoucherHeaderActions = ({
  onEditClick,
  editableStatus,
  advanceNoticeSec,
  voucherId,
  defaultEmail,
  pdfUrl,
  showEmailIcon = true,
  resendVoucherModalCustomZIndex,
}: {
  onEditClick?: () => void;
  editableStatus: EditableStatus;
  advanceNoticeSec?: number;
  voucherId: string;
  defaultEmail: string;
  pdfUrl?: string;
  showEmailIcon?: boolean;
  resendVoucherModalCustomZIndex?: number;
}) => {
  const { t } = useTranslation(Namespaces.voucherNs);
  const onPrint = useCallback(() => {
    try {
      document.execCommand("print", false);
    } catch (e) {
      window.print();
    }
  }, []);
  const [showEmailModal, toggleShowEmailModal] = useToggle();
  const title = getEditableTitle({ editableStatus, t, advanceNoticeSec });
  return (
    <>
      <ActionWrapper>
        <StyledTooltip title={title} tooltipWidth={title.length * 8} direction="left">
          <IconWrapper onClick={onEditClick} disabled={editableStatus !== EditableStatus.AVAILABLE}>
            <EditIcon css={iconStyles} />
          </IconWrapper>
        </StyledTooltip>
        <MediaQuery fromDisplay={DisplayType.Large}>
          <IconWrapper onClick={onPrint} title={t("Print voucher")}>
            <PrintIcon css={iconStyles} />
          </IconWrapper>
        </MediaQuery>
        {pdfUrl && (
          <a href={pdfUrl} download>
            <IconWrapper title={t("Download voucher")}>
              <DownloadIcon css={iconStyles} />
            </IconWrapper>
          </a>
        )}
        {showEmailIcon && (
          <IconWrapper onClick={toggleShowEmailModal} title={t("Send this voucher to an email")}>
            <EmailIcon css={iconStyles} />
          </IconWrapper>
        )}
      </ActionWrapper>
      {showEmailModal && (
        <ModalHistoryProvider>
          <ResendVoucherModal
            toggleModal={toggleShowEmailModal}
            voucherId={voucherId}
            defaultEmail={defaultEmail}
            customZIndex={resendVoucherModalCustomZIndex}
          />
        </ModalHistoryProvider>
      )}
    </>
  );
};

export default VoucherHeaderActions;
