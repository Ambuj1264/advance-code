const getBase64ForImage = async (src: string) => {
  if (typeof window !== "undefined") return "";
  const res = await fetch(src);
  const contentType = res.headers.get("content-type");

  if (contentType === "image/gif") return "";

  // @ts-ignore
  const buffer = await res.buffer();

  // eslint-disable-next-line consistent-return
  return `data:${contentType};base64,${buffer.toString("base64")}`;
};

export default getBase64ForImage;
