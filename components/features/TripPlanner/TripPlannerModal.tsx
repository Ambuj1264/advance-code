import React, { useState, useContext } from "react";

import TripPlannerModalContent from "./TripPlannerModalContent";
import { TripPlannerFeedbackType } from "./types/tripPlannerTypes";
import { sendFeedbackToEndpoint } from "./utils/tripPlannerUtils";
import TripPlannerStateContext from "./contexts/TripPlannerStateContext";

import Modal, { ModalHeader, CloseButton } from "components/ui/Modal/Modal";

const TripPlannerModal = ({
  id,
  onClose,
  title,
  buttonText,
  disableTextArea,
  textToDisplay,
  checkboxGroup,
  feedbackType,
  isDataSent = false,
  responseError = "",
}: {
  id: string;
  onClose: () => void;
  title: string;
  buttonText?: {
    closeText?: string;
    submitText?: string;
  };
  disableTextArea?: boolean;
  textToDisplay?: string;
  checkboxGroup?: { id: string; label: string }[];
  feedbackType?: TripPlannerFeedbackType;
  isDataSent?: boolean;
  responseError?: string;
}) => {
  const { selectedCountry, selectedTrip, maxDrivingHours, duration } =
    useContext(TripPlannerStateContext);

  const tripParameters = { maxDrivingHours, duration };
  const [error, setError] = useState(responseError);
  const [isSent, setIsSent] = useState(isDataSent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (text: string) => {
    setIsLoading(true);
    sendFeedbackToEndpoint(
      feedbackType!,
      tripParameters,
      selectedTrip!.tripJSON,
      selectedCountry!.id,
      text
    )
      .catch((err: Error) => {
        setError(err.toString());
      })
      .finally(() => {
        setIsSent(true);
        setIsLoading(false);
      });
  };

  return (
    <Modal id={id} onClose={onClose}>
      <ModalHeader
        title={title}
        rightButton={<CloseButton on={`tap:${id}.close`} onClick={onClose} />}
      />
      <TripPlannerModalContent
        id={id}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={handleSubmit}
        isSent={isSent}
        error={error}
        buttonText={buttonText}
        disableTextArea={disableTextArea}
        textToDisplay={textToDisplay}
        checkboxGroup={checkboxGroup}
      />
    </Modal>
  );
};

export default TripPlannerModal;
