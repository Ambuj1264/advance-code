const layer0StatusCodes = {
  "412": "Precondition Failed",
  "530": "Internal Layer0 Error",
  "531": "Project Upstream Timeout",
  "532": "Project Response Too Large",
  "533": "Reserved",
  "534": "Project Unexpected Error",
  "535": "Unknown Project",
  "536": "Reserved",
  "537": "Reserved",
  "538": "Project Request Loop",
  "539": "Project Timeout",
  "540": "Out of Memory",
  "541": "Layer0 Out of Workers",
  "542": "Project Header Overflow",
};

export type Layer0StatusCodesType = keyof typeof layer0StatusCodes;

export default layer0StatusCodes;
