import WithContainer from "@stories/decorators/WithContainer";
import { storiesOf } from "@storybook/react";
import { Namespaces } from "shared/namespaces";
import { getUUID } from "utils/helperUtils";
import ProductCardActionHeader from "./ProductCardActionHeader";
import { ProductCardContainer } from "./ProductCardContainer";
import { ProductCardFooterContainer } from "./ProductcardFooterContainer";
import ProductCardOverview, { ProductCardOverviewList, ProductCardOverviewTile } from "./ProductCardOverview";

import CarIcon from "components/icons/car.svg";
import { ProductCardActionButton, ProductCardActionButtonsWrapper } from "./ProductCardActionButton";

const Icon = CarIcon;

const generateQuickFact = (label:string, value:string, description: string):SharedTypes.QuickFact => ({
    id: String(getUUID()),
    Icon, 
    label,
    value,
    description,
});

const quickFacts:SharedTypes.QuickFact[] = [
    generateQuickFact("Type", "Art museum", ""),
    generateQuickFact("Open", "11:00 - 17:00", "extra description"),
    generateQuickFact("Spend", "≈ 1.5 hours", ""),
    generateQuickFact("Inception", "November 19, 1819", ""),
    generateQuickFact("Entrance", "Ticket required", ""),
    generateQuickFact("Address", "C. de Ruiz de Alarcón, 23, And some other long string...", "")
]

storiesOf("ProductCard/ProductCard", module)
    .addDecorator(WithContainer)
    .add("default", () => {
        return (
            <ProductCardContainer>
                <ProductCardActionHeader title={"product title"} Icon={Icon} isExpiredOffer={false} onRemoveClick={() => {alert('removeClink')}} onInformationClick={() => {alert('infoClick')}} onEditClick={() => {alert('editClick')}} />
                <ProductCardOverview isSellOut imageUrl={"https://gte-gcms.imgix.net/UJ7jS7RCQyiUzEwm3vkJ?auto=format%2Ccompress&fit=crop&crop=focalpoint&fp-z=1.14&w=218&h=144&dpr=2&q=50"} quickFacts={quickFacts} title={"Barcelona hotels"} iconColor={""} namespace={Namespaces.commonNs} />
                <ProductCardFooterContainer>
                    <ProductCardActionButtonsWrapper isTileCard={false}>
                    <ProductCardActionButton Icon={Icon} displayType="primary" title="drive" />
                    <ProductCardActionButton Icon={Icon} displayType="secondary" title="walk" />
                    <ProductCardActionButton Icon={Icon} title="run" onClick={() => alert('action button click!')}/>
                    </ProductCardActionButtonsWrapper>
                </ProductCardFooterContainer>
            </ProductCardContainer>
        );
    })


storiesOf("ProductCard/ProductCard", module)
.addDecorator(WithContainer)
.addParameters({
    viewport: {
        defaultViewport: "ipad",
      },
})
    .add("list", () => (
        <ProductCardContainer>
            <ProductCardActionHeader title={"product title"} Icon={Icon} isExpiredOffer={false} onRemoveClick={() => { alert('removeClink'); } } onInformationClick={() => { alert('infoClick'); } } onEditClick={() => { alert('editClick'); } } />
            <ProductCardOverviewList isSellOut imageUrl={"https://gte-gcms.imgix.net/UJ7jS7RCQyiUzEwm3vkJ?auto=format%2Ccompress&fit=crop&crop=focalpoint&fp-z=1.14&w=218&h=144&dpr=2&q=50"} quickFacts={quickFacts} title={"Barcelona hotels"} iconColor={""} namespace={Namespaces.commonNs} />
            <ProductCardFooterContainer>
                <ProductCardActionButtonsWrapper isTileCard={false}>
                    <ProductCardActionButton Icon={Icon} displayType="primary" title="drive" />
                    <ProductCardActionButton Icon={Icon} displayType="secondary" title="walk" />
                    <ProductCardActionButton Icon={Icon} title="run" onClick={() => alert('action button click!')} />
                </ProductCardActionButtonsWrapper>
            </ProductCardFooterContainer>
        </ProductCardContainer>
    ))


storiesOf("ProductCard/ProductCard", module)
.addDecorator(WithContainer)
.addParameters({
    viewport: {
        defaultViewport: "ipad",
      },
})
    .add("tile", () => (
        <ProductCardContainer>
            <ProductCardActionHeader title={"product title"} Icon={Icon} isExpiredOffer={false} onRemoveClick={() => { alert('removeClink'); } } onInformationClick={() => { alert('infoClick'); } } onEditClick={() => { alert('editClick'); } } />
            <ProductCardOverviewTile isSellOut imageUrl={"https://gte-gcms.imgix.net/UJ7jS7RCQyiUzEwm3vkJ?auto=format%2Ccompress&fit=crop&crop=focalpoint&fp-z=1.14&w=218&h=144&dpr=2&q=50"} quickFacts={quickFacts} title={"Barcelona hotels"} iconColor={""} namespace={Namespaces.commonNs} />
            <ProductCardFooterContainer>
                <ProductCardActionButtonsWrapper isTileCard>
                    <ProductCardActionButton Icon={Icon} displayType="primary" title="drive" />
                    <ProductCardActionButton Icon={Icon} displayType="secondary" title="walk" />
                    <ProductCardActionButton Icon={Icon} title="run" onClick={() => alert('action button click!')} />
                </ProductCardActionButtonsWrapper>
            </ProductCardFooterContainer>
        </ProductCardContainer>
    ))