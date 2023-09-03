import React from "react";
import styled from "@emotion/styled";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { getExpandableTextInformation } from "components/ui/utils/uiUtils";
import { Trans } from "i18n";
import useToggle from "hooks/useToggle";
import { DisplayType } from "types/enums";
import MediaQuery from "components/ui/MediaQuery";
import { whiteColor } from "styles/variables";

const ReadMoreTextModal = CustomNextDynamic(() => import("./ReadMoreTextModal"), {
  ssr: false,
  loading: () => null,
});

const ReadMoreButton = styled("button", {
  shouldForwardProp: () => true,
})(`
  color: ${whiteColor};
  font-weight: 700;

  :before {
    content: "... ";
  }
`);

const Text = ({
  showShowReadMore,
  displayedText,
  toggleModal,
}: {
  showShowReadMore: boolean;
  displayedText: string;
  toggleModal: () => void;
}) => (
  <>
    <span
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: displayedText }}
    />
    {showShowReadMore && (
      <ReadMoreButton onClick={toggleModal}>
        <Trans>Read more</Trans>
      </ReadMoreButton>
    )}
  </>
);

const ReadMoreTextModalContainer = ({
  id,
  mobileCharLimit,
  desktopCharLimit,
  text,
  title,
}: {
  id: string;
  mobileCharLimit: number;
  desktopCharLimit: number;
  text: string;
  title: string;
}) => {
  const [isModalOpen, toggleModal] = useToggle(false);
  const uniqueId = `read-more-text-modal-${id}`;
  const { restText: restMobileText, displayedText: displayedMobileText } =
    getExpandableTextInformation({
      charLimit: mobileCharLimit,
      text,
    });
  const { restText: restDestktopText, displayedText: displayedDesktopText } =
    getExpandableTextInformation({
      charLimit: desktopCharLimit,
      text,
    });
  return (
    <>
      <MediaQuery fromDisplay={DisplayType.Large}>
        <Text
          displayedText={displayedDesktopText}
          showShowReadMore={restDestktopText.length > 0}
          toggleModal={toggleModal}
        />
      </MediaQuery>
      <MediaQuery toDisplay={DisplayType.Large}>
        <Text
          displayedText={displayedMobileText}
          showShowReadMore={restMobileText.length > 0}
          toggleModal={toggleModal}
        />
      </MediaQuery>
      {isModalOpen && (
        <ReadMoreTextModal id={uniqueId} text={text} title={title} toggleModal={toggleModal} />
      )}
    </>
  );
};

export default ReadMoreTextModalContainer;
