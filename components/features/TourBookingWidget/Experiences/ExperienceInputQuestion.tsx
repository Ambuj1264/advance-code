import React, { useState, useEffect } from "react";
import Input from "@travelshift/ui/components/Inputs/Input";

import useDebounce from "hooks/useDebounce";

type Props = {
  id: string;
  placeholder?: string;
  onChange: (value: string) => void;
  value: string;
  onBlur?: () => void;
};

const ExperienceInputQuestion = ({ id, placeholder, onChange, value, onBlur }: Props) => {
  const [answer, setAnswer] = useState(value);
  const debouncedAnswer = useDebounce(answer, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange(debouncedAnswer), [debouncedAnswer]);

  return (
    <Input
      name={`answer-${id}`}
      value={answer}
      placeholder={placeholder}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(event.target.value);
      }}
      onBlur={onBlur}
      solid
    />
  );
};

export default ExperienceInputQuestion;
