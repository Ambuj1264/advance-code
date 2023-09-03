const fs = require("fs");
const path = require("path");

const { gql, GraphQLClient } = require("graphql-request");

const appRouter = require("../../shared/routes.ts").default;

const urlToRelative = url => `/${url.replace(/^(?:\/\/|[^/]+)*\//, "")}`;

async function fetchAndConstructFooterLinks(marketplaceUrl, filename, localeNot = "zh_CN") {
  const endpoint = process.env.INTERNAL_CLIENTAPI_URI
    ? process.env.INTERNAL_CLIENTAPI_URI
    : "https://external-clientapi.proxy.traveldev.org";
  const footerQuery = gql`
    query newFooterQuery($marketplaceUrl: String!) {
      footers(where: { marketplaceUrl: $marketplaceUrl, footerLocale_not: ${localeNot} }, stage: DRAFT) {
        id
        columns: footerColumns {
          id
          sections: footerSections {
            id
            title
            items: footerItems(where: { type: link }) {
              id
              text
              type
              url
            }
          }
        }
      }
    }
  `;

  const graphQLClient = new GraphQLClient(endpoint);
  const data = await graphQLClient.request(footerQuery, {
    marketplaceUrl,
  });

  const result = data.footers.reduce((acc, footersItem) => {
    footersItem.columns.forEach(footerColumn => {
      footerColumn.sections.forEach(footerSection => {
        footerSection.items.forEach(footerItem => {
          const { url } = footerItem;
          if (url.includes("mailto") || url.includes("tel:")) return;

          const relativeUrl = urlToRelative(url);
          // if url matches as app route, it's not a legacy proxy page
          if (appRouter.match(relativeUrl, marketplaceUrl).route) return;

          acc.push(relativeUrl);
        });
      });
    });
    return acc;
  }, []);

  const dedupe = [...new Set(result)];

  fs.writeFileSync(path.resolve(__dirname, `../${filename}`), JSON.stringify(dedupe), {
    encoding: "utf8",
  });

  return result;
}

(async function main() {
  try {
    await fetchAndConstructFooterLinks("https://guidetoeurope.com", "gteProxyPages.json");
    await fetchAndConstructFooterLinks(
      "https://iceland-photo-tours.com",
      "iptProxyPages.json",
      "fi"
    );
    await fetchAndConstructFooterLinks("https://guidetothephilippines.ph", "gttpProxyPages.json");
  } catch (e) {
    console.log("fetchAndConstructFooterLinks error", e);
    process.exit(1);
  }
})();
