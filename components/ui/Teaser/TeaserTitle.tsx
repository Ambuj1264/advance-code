import React, { ElementType, HTMLAttributes, FC } from "react";

interface ComponentProps extends HTMLAttributes<HTMLOrSVGElement> {
  as?: ElementType;
}

const TeaserTitle: FC<ComponentProps> = ({ as: Tag = "h3", children, className }) => {
  return <Tag className={className}>{children}</Tag>;
};

export default TeaserTitle;
