/* eslint-disable import/no-extraneous-dependencies, import/order  */
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { text } from "@storybook/addon-knobs";
import { css } from "@emotion/core";
import Arrow from "@travelshift/ui/icons/arrow.svg";
import Cart from "@travelshift/ui/icons/cart.svg";
import CheckMark from "@travelshift/ui/icons/checkmark.svg";
import Close from "@travelshift/ui/icons/close.svg";
import GTILogoDesktop from "@travelshift/ui/icons/gti-logo-desktop.svg";
import Hamburger from "@travelshift/ui/icons/hamburger.svg";
import SearchShared from "@travelshift/ui/icons/search.svg";
import User from "@travelshift/ui/icons/user.svg";
import ChinaFlag from "@travelshift/ui/icons/Flags/china-flag.svg";
import FranceFlag from "@travelshift/ui/icons/Flags/france-flag.svg";
import GermanyFlag from "@travelshift/ui/icons/Flags/germany-flag.svg";
import ItalyFlag from "@travelshift/ui/icons/Flags/italy-flag.svg";
import JapanFlag from "@travelshift/ui/icons/Flags/japan-flag.svg";
import KoreaFlag from "@travelshift/ui/icons/Flags/korea-flag.svg";
import PolandFlag from "@travelshift/ui/icons/Flags/poland-flag.svg";
import RussiaFlag from "@travelshift/ui/icons/Flags/russia-flag.svg";
import SpainFlag from "@travelshift/ui/icons/Flags/spain-flag.svg";
import ThailandFlag from "@travelshift/ui/icons/Flags/thailand-flag.svg";
import UnitedKingdomFlag from "@travelshift/ui/icons/Flags/united-kingdom-flag.svg";
import UnitedStatesFlag from "@travelshift/ui/icons/Flags/united-states-flag.svg";
import NorwayFlag from "@travelshift/ui/icons/Flags/norway-flag.svg";
import SwedenFlag from "@travelshift/ui/icons/Flags/sweden-flag.svg";
import NetherlandsFlag from "@travelshift/ui/icons/Flags/netherlands-flag.svg";
import DenmarkFlag from "@travelshift/ui/icons/Flags/denmark-flag.svg";
import IcelandFlag from "@travelshift/ui/icons/Flags/iceland-flag.svg";
import LatviaIcon from "@travelshift/ui/icons/Flags/latvia-flag.svg";
import CzechIcon from "@travelshift/ui/icons/Flags/czech-republic-flag.svg";
import IndonesiaIcon from "@travelshift/ui/icons/Flags/indonesia-flag.svg";
import PortugalIcon from "@travelshift/ui/icons/Flags/portugal-flag.svg";
import UkraineIcon from "@travelshift/ui/icons/Flags/ukraine-flag.svg";
import VietnamIcon from "@travelshift/ui/icons/Flags/vietnam-flag.svg";
import PhillippinesIcon from "@travelshift/ui/icons/Flags/phillippines-flag.svg";
import MalasyaIcon from "@travelshift/ui/icons/Flags/malasya-flag.svg";
import AlandIslandsFlag from "@travelshift/ui/icons/Flags/aland-islands-flag.svg";
import AlbaniaFlag from "@travelshift/ui/icons/Flags/albania-flag.svg";
import AndorraFlag from "@travelshift/ui/icons/Flags/andorra-flag.svg";
import AustriaFlag from "@travelshift/ui/icons/Flags/austria-flag.svg";
import BelarusFlag from "@travelshift/ui/icons/Flags/belarus-flag.svg";
import BelgiumFlag from "@travelshift/ui/icons/Flags/belgium-flag.svg";
import BosniaFlag from "@travelshift/ui/icons/Flags/bosnia-flag.svg";
import BulgariaFlag from "@travelshift/ui/icons/Flags/bulgaria-flag.svg";
import CroatiaFlag from "@travelshift/ui/icons/Flags/croatia-flag.svg";
import CyprusFlag from "@travelshift/ui/icons/Flags/cyprus-flag.svg";
import EstoniaFlag from "@travelshift/ui/icons/Flags/estonia-flag.svg";
import FaroeIslandsFlag from "@travelshift/ui/icons/Flags/faroe-islands-flag.svg";
import FinlandFlag from "@travelshift/ui/icons/Flags/finland-flag.svg";
import GibraltarFlag from "@travelshift/ui/icons/Flags/gibraltar-flag.svg";
import GreeceFlag from "@travelshift/ui/icons/Flags/greece-flag.svg";
import GuernseyFlag from "@travelshift/ui/icons/Flags/guernsey-flag.svg";
import HungaryFlag from "@travelshift/ui/icons/Flags/hungary-flag.svg";
import IrelandFlag from "@travelshift/ui/icons/Flags/ireland-flag.svg";
import IsleOfManFlag from "@travelshift/ui/icons/Flags/isle-of-man-flag.svg";
import JerseyFlag from "@travelshift/ui/icons/Flags/jersey-flag.svg";
import KosovoFlag from "@travelshift/ui/icons/Flags/kosovo-flag.svg";
import LithuaniaFlag from "@travelshift/ui/icons/Flags/lithuania-flag.svg";
import LuxemburgFlag from "@travelshift/ui/icons/Flags/luxemburg-flag.svg";
import MaltaFlag from "@travelshift/ui/icons/Flags/malta-flag.svg";
import MoldovaFlag from "@travelshift/ui/icons/Flags/moldova-flag.svg";
import MonacoFlag from "@travelshift/ui/icons/Flags/monaco-flag.svg";
import MontenegroFlag from "@travelshift/ui/icons/Flags/montenegro-flag.svg";
import MacedoniaFlag from "@travelshift/ui/icons/Flags/macedonia-flag.svg";
import RomaniaFlag from "@travelshift/ui/icons/Flags/romania-flag.svg";
import SerbiaFlag from "@travelshift/ui/icons/Flags/serbia-flag.svg";
import SlovakiaFlag from "@travelshift/ui/icons/Flags/slovakia-flag.svg";
import SloveniaFlag from "@travelshift/ui/icons/Flags/slovenia-flag.svg";
import SwitzerlandFlag from "@travelshift/ui/icons/Flags/switzerland-flag.svg";
import TurkeyFlag from "@travelshift/ui/icons/Flags/turkey-flag.svg";
import ArrowRight from "components/icons/arrow-right.svg";
import { storiesOf } from "@storybook/react";
import { SerializedStyles } from "@emotion/css";
import { typographyCaptionSmall } from "styles/typography";
import { gutters } from "styles/variables";

import WithContainer from "@stories/decorators/WithContainer";

const requireAll = (r: any, replaceText = "") =>
  r.keys().map((key: any) => key.replace("./", replaceText));

const iconStyles = css`
  width: 40px;
  height: 40px;
  fill: #009;
`;

const IconName = styled.span(typographyCaptionSmall);

const SvgWrapper = styled.div`
  margin-bottom: ${gutters.small / 4}px;
  width: 40px;
  height: 40px;
`;

const IconContainer = styled.div`
  display: flex;
  flex: 1 1 5rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: ${gutters.small}px;
  margin-right: ${gutters.small}px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${gutters.small}px;
`;

const ArrowLeft = styled(ArrowRight)`
  transform: rotate(-180deg);
`;

const StyledIcon = ({
  Svg,
  name,
  styles = iconStyles,
}: {
  Svg: React.ElementType;
  name: string;
  styles?: SerializedStyles;
}) => (
  <IconContainer>
    <SvgWrapper>
      <Svg css={styles} />
    </SvgWrapper>
    <IconName>{name}</IconName>
  </IconContainer>
);

const Icon = ({ path }: { path: string }): JSX.Element | null => {
  const ImportedIconRef = React.useRef<
    React.FC<React.SVGProps<SVGSVGElement>>
  >();
  const [loading, setLoading] = React.useState(false);

  useEffect((): void => {
    setLoading(true);
    const importIcon = async (): Promise<void> => {
      try {
        // eslint-disable-next-line functional/immutable-data
        ImportedIconRef.current = (await import(`../${path}`)).default;
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [path]);

  if (!loading && ImportedIconRef.current) {
    const { current: ImportedIcon } = ImportedIconRef;
    return <StyledIcon Svg={ImportedIcon} name={path} />;
  }

  return null;
};

const heading = "Icons";

const svgs = requireAll(require.context("../../icons", true, /\.svg$/));

storiesOf(`${heading}/Icons`, module)
  .addDecorator(WithContainer)
  .add(
    "Default",
    () => {
      const searchValue = text("Icon name", "");
      const realSvgs = svgs.filter((svg: any) => svg.includes(searchValue));
      return (
        <Container>
          {realSvgs.map((path: any) => (
            <Icon key={path} path={path} />
          ))}
        </Container>
      );
    },
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  );

storiesOf(`${heading}/Icons`, module)
  .addDecorator(WithContainer)
  .add(
    "Flags",
    () => {
      return (
        <Container>
          <StyledIcon Svg={ChinaFlag} name="china-flag.svg" />
          <StyledIcon Svg={DenmarkFlag} name="denmark-flag.svg" />
          <StyledIcon Svg={FranceFlag} name="france-flag.svg" />
          <StyledIcon Svg={GermanyFlag} name="germany-flag.svg" />
          <StyledIcon Svg={ItalyFlag} name="italy-flag.svg" />
          <StyledIcon Svg={JapanFlag} name="japan-flag.svg" />
          <StyledIcon Svg={KoreaFlag} name="korea-flag.svg" />
          <StyledIcon Svg={PolandFlag} name="poland-flag.svg" />
          <StyledIcon Svg={RussiaFlag} name="russia-flag.svg" />
          <StyledIcon Svg={SpainFlag} name="spain-flag.svg" />
          <StyledIcon Svg={ThailandFlag} name="thailand-flag.svg" />
          <StyledIcon Svg={UnitedKingdomFlag} name="united-kingdom-flag" />
          <StyledIcon Svg={UnitedStatesFlag} name="united-states-flag" />
          <StyledIcon Svg={NorwayFlag} name="norway-flag" />
          <StyledIcon Svg={SwedenFlag} name="sweden-flag" />
          <StyledIcon Svg={NetherlandsFlag} name="netherlands-flag" />
          <StyledIcon Svg={IcelandFlag} name="iceland-flag.svg" />
          <StyledIcon Svg={CzechIcon} name="czech-republic-flag.svg" />
          <StyledIcon Svg={IndonesiaIcon} name="czech-republic-flag.svg" />
          <StyledIcon Svg={LatviaIcon} name="latvia-flag.svg" />
          <StyledIcon Svg={PortugalIcon} name="portugal-flag.svg" />
          <StyledIcon Svg={UkraineIcon} name="ukraine-flag.svg" />
          <StyledIcon Svg={VietnamIcon} name="vietnam-flag.svg" />
          <StyledIcon Svg={PhillippinesIcon} name="phillippines-flag.svg" />
          <StyledIcon Svg={MalasyaIcon} name="malasya-flag.svg" />
          <StyledIcon Svg={AlandIslandsFlag} name="aland-islands-flag.svg" />
          <StyledIcon Svg={AlbaniaFlag} name="albania-flag.svg" />
          <StyledIcon Svg={AndorraFlag} name="andorra-flag.svg" />
          <StyledIcon Svg={AustriaFlag} name="austria-flag.svg" />
          <StyledIcon Svg={BelarusFlag} name="belarus-flag.svg" />
          <StyledIcon Svg={BelgiumFlag} name="belgium-flag.svg" />
          <StyledIcon Svg={BosniaFlag} name="bosnia-flag.svg" />
          <StyledIcon Svg={BulgariaFlag} name="bulgaria-flag.svg" />
          <StyledIcon Svg={CroatiaFlag} name="croatia-flag.svg" />
          <StyledIcon Svg={CyprusFlag} name="cyprus-flag.svg" />
          <StyledIcon Svg={EstoniaFlag} name="estonia-flag.svg" />
          <StyledIcon Svg={FaroeIslandsFlag} name="faroe-islands-flag.svg" />
          <StyledIcon Svg={FinlandFlag} name="finland-flag.svg" />
          <StyledIcon Svg={GibraltarFlag} name="gibraltar-flag.svg" />
          <StyledIcon Svg={GreeceFlag} name="greece-flag.svg" />
          <StyledIcon Svg={GuernseyFlag} name="guernsey-flag.svg" />
          <StyledIcon Svg={HungaryFlag} name="hungary-flag.svg" />
          <StyledIcon Svg={IrelandFlag} name="ireland-flag.svg" />
          <StyledIcon Svg={IsleOfManFlag} name="isle-of-man-flag.svg" />
          <StyledIcon Svg={JerseyFlag} name="jersey-flag.svg" />
          <StyledIcon Svg={KosovoFlag} name="kosovo-flag.svg" />
          <StyledIcon Svg={LithuaniaFlag} name="lithuania-flag.svg" />
          <StyledIcon Svg={LuxemburgFlag} name="luxemburg-flag.svg" />
          <StyledIcon Svg={MaltaFlag} name="malta-flag.svg" />
          <StyledIcon Svg={MoldovaFlag} name="moldova-flag.svg" />
          <StyledIcon Svg={MonacoFlag} name="monaco-flag.svg" />
          <StyledIcon Svg={MontenegroFlag} name="montenegro-flag.svg" />
          <StyledIcon Svg={MacedoniaFlag} name="macedonia-flag.svg" />
          <StyledIcon Svg={RomaniaFlag} name="romania-flag.svg" />
          <StyledIcon Svg={SerbiaFlag} name="serbia-flag.svg" />
          <StyledIcon Svg={SlovakiaFlag} name="slovakia-flag.svg" />
          <StyledIcon Svg={SloveniaFlag} name="slovenia-flag.svg" />
          <StyledIcon Svg={SwitzerlandFlag} name="switzerland-flag.svg" />
          <StyledIcon Svg={TurkeyFlag} name="turkey-flag.svg" />
        </Container>
      );
    },
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  );

storiesOf(`${heading}/Icons`, module)
  .addDecorator(WithContainer)
  .add(
    "Shared",
    () => (
      <Container>
        <StyledIcon Svg={Arrow} name="arrow.svg" />
        <StyledIcon Svg={ArrowLeft} name="arrow.svg" />
        <StyledIcon Svg={Cart} name="cart.svg" />
        <StyledIcon Svg={CheckMark} name="checkmark.svg" />
        <StyledIcon Svg={Close} name="close.svg" />
        <StyledIcon Svg={GTILogoDesktop} name="gti-logo-desktop.svg" />
        <StyledIcon Svg={Hamburger} name="hamburger.svg" />
        <StyledIcon Svg={SearchShared} name="search.svg" />
        <StyledIcon Svg={User} name="user.svg" />
      </Container>
    ),
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  );
