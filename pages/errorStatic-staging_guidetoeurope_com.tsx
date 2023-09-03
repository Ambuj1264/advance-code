import "lib/initSentry-web";
import {
  StaticErrorPage,
  getErrorPageStaticProps,
} from "components/features/ErrorPage/getErrorPageStaticProps";

export const getStaticProps = getErrorPageStaticProps("staging.guidetoeurope.com");

export default StaticErrorPage;
