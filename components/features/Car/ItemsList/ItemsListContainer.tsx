import React, { useState } from "react";
import { Option, some, none } from "fp-ts/lib/Option";

import ItemsModal from "./ItemsModal";
import { constructModal } from "./utils/itemsListUtils";

import SectionContent from "components/ui/Section/SectionContent";
import IconList from "components/ui/IconList/IconList";

const ItemsListContainer = ({
  sectionId,
  initialTitle,
  itemsList,
}: {
  sectionId: string;
  initialTitle: string;
  itemsList: SharedTypes.Icon[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, changeSelectedId] = useState<Option<string>>(none);

  const openModal = (id: Option<string>) => {
    setIsModalOpen(true);
    changeSelectedId(id);
  };

  const modalData = constructModal(itemsList, selectedId, initialTitle);
  return (
    <>
      {isModalOpen && (
        <ItemsModal
          onClose={() => setIsModalOpen(false)}
          title={modalData.title}
          items={modalData.items}
        />
      )}
      <SectionContent>
        <IconList
          sectionId={sectionId}
          iconList={itemsList}
          iconLimit={10}
          inGrid
          onClick={(icon: SharedTypes.Icon) => openModal(some(icon.id))}
        />
      </SectionContent>
    </>
  );
};

export default ItemsListContainer;
