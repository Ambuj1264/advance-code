import "lib/initSentry-web";
import {
  StaticErrorPage,
  getErrorPageStaticProps,
} from "components/features/ErrorPage/getErrorPageStaticProps";
import { GTEHost } from "layer0RoutesConstants";

export const getStaticProps = getErrorPageStaticProps(GTEHost);

export default StaticErrorPage;
