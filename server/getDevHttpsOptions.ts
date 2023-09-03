import fs from "fs";

export const getDevHttpsOptions = () => {
  return {
    key: fs.readFileSync("./certificates/secure.dev.guidetoiceland.is+3-key.pem", {
      encoding: "utf8",
    }),
    cert: fs.readFileSync("./certificates/secure.dev.guidetoiceland.is+3.pem", {
      encoding: "utf8",
    }),
  };
};
