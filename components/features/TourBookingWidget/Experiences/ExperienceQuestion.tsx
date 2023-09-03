import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Input from "@travelshift/ui/components/Inputs/Input";

import ExperienceDropdownQuestion from "./ExperienceDropdownQuestion";

import InputWrapper, { InputError } from "components/ui/InputWrapper";
import { gutters } from "styles/variables";

type Props = {
  id: string;
  answers: ExperiencesTypes.TourOptionQuestionAnswer[];
  selectedOption: string;
  onChange: (value: string) => void;
  formSubmitted: boolean;
  placeholder: string;
  required: boolean;
};

const Container = styled.div`
  width: 100%;
  & + & {
    margin-top: ${gutters.large / 2}px;
  }
  ${InputError} {
    position: relative;
  }
`;

const ExperienceQuestion = ({
  id,
  answers,
  onChange,
  selectedOption,
  placeholder,
  formSubmitted,
  required,
}: Props) => {
  const [blurred, setBlurred] = useState(false);
  const onBlur = () => setBlurred(true);
  useEffect(() => {
    if (formSubmitted) {
      onBlur();
    }
  }, [formSubmitted]);
  const hasError = blurred && selectedOption === "" && required;
  return (
    <Container>
      <InputWrapper id={id} label={placeholder} hasError={hasError} required={required}>
        {answers.length > 0 ? (
          <ExperienceDropdownQuestion
            id={id}
            answers={answers}
            selectedValue={selectedOption}
            onChange={onChange}
            onBlur={onBlur}
            error={hasError}
            required={required}
          />
        ) : (
          <Input
            name={id}
            value={selectedOption}
            placeholder={placeholder}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange(event.target.value);
            }}
            onBlur={onBlur}
            error={hasError}
            solid
          />
        )}
      </InputWrapper>
    </Container>
  );
};

export default ExperienceQuestion;
