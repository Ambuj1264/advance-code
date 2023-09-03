import "lib/initSentry-web";
import {
  StaticErrorPage,
  getErrorPageStaticProps,
} from "components/features/ErrorPage/getErrorPageStaticProps";
import { GTIHost } from "layer0RoutesConstants";

export const getStaticProps = getErrorPageStaticProps(GTIHost);

export default StaticErrorPage;
