import React from "react";

import { constructTopCarProductSpecs, carsListImgixParams } from "./utils/carSearchUtils";

import { useOnCarCalendarOpen } from "components/ui/FrontSearchWidget/frontHooks";
import { useTranslation } from "i18n";
import { GridItemWrapper } from "components/ui/Search/SearchList";
import TileProductCard from "components/ui/Search/TileProductCard";
import { constructImage } from "utils/globalUtils";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { Namespaces } from "shared/namespaces";
import SectionRow from "components/ui/Section/SectionRow";

const TopCars = ({
  metadata,
  cars,
}: {
  metadata: SharedTypes.QuerySearchMetadata;
  cars: CarSearchTypes.QueryTopCar[];
}) => {
  const { t: commonCarT } = useTranslation(Namespaces.commonCarNs);
  const isMobile = useIsMobile();
  const onCalendarOpen = useOnCarCalendarOpen(isMobile, true);
  return (
    <SectionRow title={metadata.title} subtitle={metadata.subtitle} isFirstSection>
      {cars.map(car => (
        <GridItemWrapper key={`TileProductCard-${car.id}`}>
          <TileProductCard
            image={constructImage({
              ...car.image,
              name: car.name,
            })}
            imgixParams={carsListImgixParams}
            headline={car.name}
            averageRating={Number(car.establishment.reviewTotalScore)}
            reviewsCount={car.establishment.reviewTotalCount}
            productSpecs={constructTopCarProductSpecs(commonCarT, car)}
            productProps={[]}
            currency=""
            hidePrice
            isMobile={isMobile}
            onAvailabilityButtonClick={onCalendarOpen}
            defaultImageWidth={500}
          />
        </GridItemWrapper>
      ))}
    </SectionRow>
  );
};

export default TopCars;
