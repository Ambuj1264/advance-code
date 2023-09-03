/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
const path = require("path");
const fs = require("fs");

const { default: PWAManifestGenerator } = require("@pwa-manifest/core");

async function generateFromOpts(opts, marketplaceId) {
  const generator = new PWAManifestGenerator(opts, {
    baseURL: `/_next/static/icons/`,
  });
  generator.hashMethod = "none";
  const getFilename = originalFilename => `${marketplaceId}-${originalFilename}`;
  generator.on("msTileGen", ev => {
    ev.filename = ev.filename.then(getFilename);
  });
  generator.on("faviconGen", ev => {
    ev.filename = ev.filename.then(getFilename);
  });
  generator.on("appleTouchIconGen", ev => {
    ev.filename = ev.filename.then(getFilename);
  });
  generator.on("safariPinnedTabGen", ev => {
    ev.filename = ev.filename.then(getFilename);
  });

  const generation = await generator.generate();
  fs.writeFileSync(
    path.resolve(__dirname, `../../static/manifest-${marketplaceId}.json`),
    JSON.stringify(generation.manifest)
  );
  fs.writeFileSync(
    path.resolve(__dirname, `../../static/browserconfig-${marketplaceId}.xml`),
    generation.browserConfig
  );
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const filename in generation.generatedFiles) {
    fs.writeFileSync(
      path.resolve(__dirname, `../../static/icons/${filename}`),
      generation.generatedFiles[filename]
    );
  }
}

const marketplaces = [
  {
    id: "guidetoiceland_is",
    name: "Iceland",
  },
  {
    id: "ipt-travelmarketplaces-com",
    name: "Photo Tours",
    theme: "#273B72",
    backgroundColor: "#ffffff",
  },
  {
    id: "gte-travelmarketplaces-com",
    name: "Europe",
    theme: "#2f7ddd",
    backgroundColor: "#2f7ddd",
  },
  {
    id: "norwaytravelguide_no",
    name: "Norway",
  },
  {
    id: "gttp-travelmarketplaces-com",
    name: "Philippines",
    theme: "#31A4AD",
    backgroundColor: "#31A4AD",
  },
];

marketplaces.map(marketplace =>
  generateFromOpts(
    {
      name: marketplace.name,
      short_name: marketplace.name.replace(/ /g, ""),
      theme: marketplace.theme || "#336699",
      backgroundColor: marketplace.backgroundColor || "#336699",
      start_url: "/?utm_source=pwa",
      scope: "/",
      fingerprint: "none",
      genSafariPinnedTab: true,
      iconGenerationOptions: {
        baseIcon: path.resolve(`static/baseIcons/${marketplace.id}-base.png`),
        sizes: [192, 512],
        genFavicons: true,
        genSafariPinnedTab: true,
        purpose: ["any", "maskable"],
      },
    },
    marketplace.id
  )
);
