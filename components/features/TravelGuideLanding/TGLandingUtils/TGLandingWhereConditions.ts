import { GraphCMSPageType } from "types/enums";

const destinationLandingWhereConditions = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  return [
    {
      where: {
        domain: GraphCMSPageType.TravelGuides,
      },
      sectionWhere: {
        isDeleted: false,
        NOT: { metadataUri: queryCondition.metadataUri },
        AND: { NOT: { uniqueId: "EU" } },
      },
      sectionType: "allDestinationsLanding",
      itemsPerPage: 12,
    },
  ];
};

export default destinationLandingWhereConditions;
