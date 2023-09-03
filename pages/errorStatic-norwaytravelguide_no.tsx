import "lib/initSentry-web";
import {
  StaticErrorPage,
  getErrorPageStaticProps,
} from "components/features/ErrorPage/getErrorPageStaticProps";
import { NTGHost } from "layer0RoutesConstants";

export const getStaticProps = getErrorPageStaticProps(NTGHost);

export default StaticErrorPage;
