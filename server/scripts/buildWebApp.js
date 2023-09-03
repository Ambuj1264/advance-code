/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
const { execSync } = require("child_process");
const { join, resolve } = require("path");

const { copySync, writeFileSync, mkdirpSync, rmSync, rmdirSync } = require("fs-extra");
const webpack = require("webpack");
const globby = require("globby");
const nodeExternals = require("webpack-node-externals");

const webDir = join(__dirname, "../../../");
const nextDistDir = join(webDir, ".next");
const standaloneDistDir = join(nextDistDir, "standalone");
// eslint-disable-next-line import/no-dynamic-require
const webpackConf = require(join(webDir, "next.config.js"));

process.on("unhandledRejection", e => {
  log(`unhandledRejection\n${e.toString()}`, "err");
  process.exit(1);
});

const argv = process.argv.slice(2);
const onlyFastifyBuild = argv.includes("fastify");
const shouldClearDistDir = argv.includes("clearDistDir");

// eslint-disable-next-line consistent-return
(async function main() {
  if (shouldClearDistDir) {
    rmdirSync(join(nextDistDir), { recursive: true });
    log("dist dir removed", "rm");
  }

  if (onlyFastifyBuild) {
    log("building custom fastify server");
    await buildCustomServer();
    return log("custom server has been rebuilt", "ok");
  }

  log(`building next standalone`);
  execSyncWrap("npx next build", {
    cwd: webDir,
  });
  // remove default next server
  rmSync(join(nextDistDir, "standalone/server.js"));

  log("generating next server config file");
  const serverConfig = webpackConf("phase-production-build");
  const serverConfigSrc = `module.exports=${JSON.stringify(serverConfig)}`;
  writeFileSync(join(nextDistDir, "standalone/next.config.js"), serverConfigSrc);

  log("copying files");
  // copy newrelic config file which is not referenced anywhere in the code
  copySync(join(webDir, "newrelic.js"), join(nextDistDir, "standalone/newrelic.js"));
  // copy static
  copySync(join(nextDistDir, "static"), join(nextDistDir, "standalone/static"));
  copySync(join(webDir, "fonts"), join(nextDistDir, "standalone/static/fonts"));

  log("building custom fastify server");
  await buildCustomServer();

  // region install 3rd party packages
  log("installing 3rd party packages");
  // create temp dir and install external libs, then move them to next modules
  const externalPackages = [
    "i18next-express-middleware@^1.9.1",
    "i18next-node-fs-backend@^2.1.3",
    "newrelic@9.8.0",
  ];
  const npmInstallArgs = "--no-save --no-package-lock --production --prefix ./";
  mkdirpSync(join(standaloneDistDir, "temp"));
  execSyncWrap(`npm install ${npmInstallArgs} ${externalPackages.join(" ")}`, {
    cwd: join(standaloneDistDir, "temp"),
  });
  copySync(join(standaloneDistDir, "temp/node_modules"), join(standaloneDistDir, "node_modules"));
  rmdirSync(join(standaloneDistDir, "temp"), { recursive: true });
  // endregion install 3rd party packages

  log("fetching and saving GTE, IPT, GTTP proxy routes");
  execSyncWrap("npx ts-node -T -P ./tsconfig.build.json ./src/server/scripts/fetchFooterItems.js", {
    cwd: webDir,
  });
  copySync(
    join(__dirname, "../gteProxyPages.json"),
    join(nextDistDir, "standalone/gteProxyPages.json")
  );
  copySync(
    join(__dirname, "../iptProxyPages.json"),
    join(nextDistDir, "standalone/iptProxyPages.json")
  );
  copySync(
    join(__dirname, "../gttpProxyPages.json"),
    join(nextDistDir, "standalone/gttpProxyPages.json")
  );

  // region clean up
  // clean up build output to reduce payload size
  // find and remove redundant nextjs files and static error pages js
  log("cleaning up");
  const serverDir = join(nextDistDir, "standalone");
  globby
    .sync(["**/*.nft.json", "**/errorStatic*.js"], {
      onlyFiles: true,
      cwd: serverDir,
    })
    .forEach(file => {
      rmSync(join(serverDir, file));
    });
  // remove typings and sourcemap files
  const modulesDir = join(standaloneDistDir, "node_modules");
  globby
    .sync(["**/*.d.ts", "**/*.js.map"], {
      onlyFiles: true,
      cwd: modulesDir,
    })
    .forEach(file => {
      rmSync(join(modulesDir, file));
    });
  // remove redundant 15mb binary file
  try {
    rmSync(
      join(
        standaloneDistDir,
        "node_modules/sharp/vendor/8.12.2/darwin-arm64v8/lib/libvips-cpp.42.dylib"
      )
    );
    rmSync(
      join(standaloneDistDir, "node_modules/sharp/vendor/8.12.2/linux-x64/lib/libvips-cpp.so.42")
    );
    // eslint-disable-next-line no-empty
  } catch {}
  // endregion clean up

  log("all done! web app can be started at .next/standalone/server.js", "ok");
})();

async function buildCustomServer() {
  const promisify = new Promise((ok, reject) => {
    webpack(
      {
        entry: resolve(__dirname, "../server-prod.ts"),
        target: "node16",
        externalsPresets: { node: true },
        devtool: false,
        mode: "production",
        output: {
          filename: "server.js",
          path: standaloneDistDir,
          libraryTarget: "var",
          library: "travelshiftCustomNextServerlessServer",
        },
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".json"],
          modules: [resolve(webDir, "src"), "node_modules"],
          roots: [resolve(webDir, "src")],
        },
        externals: [
          nodeExternals({ modulesDir: join(standaloneDistDir, "node_modules") }),
          {
            newrelic: "newrelic",
          },
        ],
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  target: "es2018",
                },
                transpileOnly: true,
              },
            },
          ],
        },
      },
      (err, stats) => {
        console.log(`${stats.toString()}\n`);
        if (err || stats.hasErrors()) {
          // eslint-disable-next-line no-console
          log(err, "err");
          reject(err);
          process.exit(1);
        } else {
          ok();
        }
      }
    );
  });

  return promisify;
}

function execSyncWrap(...args) {
  try {
    execSync(...args);
  } catch (e) {
    console.log(e.stdout.toString());
    console.log(e.stderr.toString());
    throw new Error("Whoops");
  }
}

function log(str, logType = "") {
  const colorReset = "\x1b[0m";
  const colorMagenta = "\x1b[35m";
  const red = "\x1b[31m";
  const green = "\x1b[32m";

  let color;
  let icon;

  switch (logType) {
    case "err":
      color = red;
      icon = "🛑";
      break;
    case "ok":
      color = green;
      icon = "✅";
      break;
    case "rm":
      color = "";
      icon = "🗑";
      break;
    default:
      color = colorMagenta;
      icon = "⏳";
  }
  const terminateLogString = color === colorMagenta ? "..." : ".";

  console.log(`\n${icon}  ${color}${str}${colorReset}${terminateLogString}`);
}
