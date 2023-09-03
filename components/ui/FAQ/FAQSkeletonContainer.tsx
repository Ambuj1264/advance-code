import React from "react";

import { FAQItems } from "./FAQContainer";

const FAQSkeletonContainer = ({ items }: { items: SharedTypes.Question[] }) => {
  return <FAQItems questions={items} fullWidthContainer={false} />;
};

export default FAQSkeletonContainer;
