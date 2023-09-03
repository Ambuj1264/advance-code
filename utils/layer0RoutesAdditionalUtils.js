const getHostsByOrigin = HostToOriginMap => {
  const origins = new Set(Object.values(HostToOriginMap));

  return [...origins].map(origin => origin.split(".")[1]);
};

const getBackendName = host => {
  return host.replace(/\./g, "_");
};

module.exports = {
  getHostsByOrigin,
  getBackendName,
};
