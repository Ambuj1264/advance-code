import React, { useState } from "react";

import HealthDeclarationModal from "./HealthDeclarationModal";
import HealthDeclarationCheckbox from "./HealthDeclarationCheckbox";

const HealthDeclaration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <HealthDeclarationCheckbox openModal={() => setIsModalOpen(true)} />
      {isModalOpen && <HealthDeclarationModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default HealthDeclaration;
