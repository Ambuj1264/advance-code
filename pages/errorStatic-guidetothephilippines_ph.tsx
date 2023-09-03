import "lib/initSentry-web";
import {
  StaticErrorPage,
  getErrorPageStaticProps,
} from "components/features/ErrorPage/getErrorPageStaticProps";
import { GTTPHost } from "layer0RoutesConstants";

export const getStaticProps = getErrorPageStaticProps(GTTPHost);

export default StaticErrorPage;
