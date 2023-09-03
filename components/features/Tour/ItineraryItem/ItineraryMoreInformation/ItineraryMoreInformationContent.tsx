import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { pipe } from "fp-ts/lib/pipeable";
import { findFirst } from "fp-ts/lib/Array";
import { getOrElse } from "fp-ts/lib/Option";
import styled from "@emotion/styled";

import { constructItineraryContentTemplates } from "../../utils/tourUtils";
import ItineraryContentTemplatesQuery from "../queries/ItineraryContentTemplatesQuery.graphql";
import ItineraryHeading from "../ItineraryHeading";

import ItineraryMoreInformationLoading from "./ItineraryMoreInformationContentLoading";

import ContentTemplates from "components/ui/ContentTemplates/ContentTemplates";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

type Props = {
  itineraryItem: ItineraryItem;
  slug: string;
  title: string;
};

const StyledItineraryHeading = styled(ItineraryHeading)`
  margin-top: ${gutters.small}px;
  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

const ItineraryMoreInformation = ({ itineraryItem, slug, title }: Props) => {
  const { error, data, loading } = useQuery<QueryItineraryContentTemplateData>(
    ItineraryContentTemplatesQuery,
    {
      variables: { slug },
      fetchPolicy: "no-cache",
    }
  );
  if (loading) return <ItineraryMoreInformationLoading />;
  if (error || !data || data.tour?.itinerary?.length === 0) return null;

  const itineraryContentTemplates = constructItineraryContentTemplates(data.tour.itinerary);
  const { contentTemplates } = pipe(
    itineraryContentTemplates,
    findFirst(({ id }) => id.toString() === itineraryItem.id),
    getOrElse(() => ({ id: "", contentTemplates: [] } as ItineraryContentTemplates))
  );
  return (
    <>
      {contentTemplates.map((contentTemplate: ContentTemplate) => {
        const columns = () => {
          if (contentTemplate.items.length === 1) return 1;
          if (contentTemplate.items.length % 2 === 0) return 2;
          return 3;
        };
        return (
          <Fragment key={contentTemplate.id}>
            <StyledItineraryHeading title={title}>{contentTemplate.name}</StyledItineraryHeading>
            <ContentTemplates
              id="itinerary"
              items={contentTemplate.items}
              columns={{ medium: columns() }}
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default ItineraryMoreInformation;
